import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { isDatabaseConfigured, isDatabaseReachable } from "@/lib/db";
import { dataDir, readContent } from "@/lib/contentStore";
import {
  InboxPersistError,
  listInboxMessages as listDbInbox,
  persistInboxMessage as persistDbInbox,
  updateInboxMessage as updateDbInbox,
} from "@/lib/inboxDb";
import type { InboxSubmitBody } from "@/lib/inboxServer";
import { generateVoucherCode } from "@/lib/voucherCode";

/**
 * Inbox (bookings, vouchers, waitlist, contact).
 * PostgreSQL when it is configured and reachable, otherwise a JSON file in the data dir.
 */
export type InboxRecord = {
  id: string;
  type: string;
  payload: Record<string, string>;
  read: boolean;
  voucherCode: string | null;
  status: string;
  createdAt: string;
};

const MAX_RECORDS = 5000;
const inboxFile = () => path.join(dataDir(), "inbox.json");

async function useDatabase(): Promise<boolean> {
  return isDatabaseConfigured() && (await isDatabaseReachable());
}

/** One write at a time (single Node process) so two bookings never grab the same last seat. */
let queue: Promise<unknown> = Promise.resolve();
function exclusive<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => undefined);
  return run;
}

async function readFileInbox(): Promise<InboxRecord[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(inboxFile(), "utf8")) as InboxRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFileInbox(records: InboxRecord[]) {
  await fs.mkdir(dataDir(), { recursive: true });
  const tmp = `${inboxFile()}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(records), "utf8");
  await fs.rename(tmp, inboxFile());
}

type SlotInfo = { capacity: number; closed: boolean };

async function findSlot(slotId: string): Promise<SlotInfo | null> {
  const stored = await readContent();
  const workshops = stored?.data?.workshops;
  if (!Array.isArray(workshops)) return null;
  const slot = (workshops as Array<Record<string, unknown>>).find((w) => w.id === slotId);
  if (!slot) return null;
  const capacity =
    typeof slot.capacity === "number" ? slot.capacity : Number(slot.spots ?? 0) || 0;
  const closed = slot.closed === true || (slot.closed === undefined && slot.available === false);
  return { capacity, closed };
}

export async function persistInbox(
  message: InboxSubmitBody
): Promise<{ id: string; voucherCode: string | null }> {
  if (await useDatabase()) return persistDbInbox(message);

  if (JSON.stringify(message.payload).length > 8000) {
    throw new InboxPersistError("PAYLOAD_TOO_LARGE");
  }

  return exclusive(async () => {
    const records = await readFileInbox();

    if (message.type === "booking") {
      const slotId = message.payload.slotId?.trim();
      if (!slotId) throw new InboxPersistError("SLOT_REQUIRED");
      const slot = await findSlot(slotId);
      if (slot) {
        const booked = records.filter(
          (r) => r.type === "booking" && r.payload.slotId === slotId
        ).length;
        if (slot.closed || booked >= slot.capacity) {
          throw new InboxPersistError("SLOT_UNAVAILABLE");
        }
      }
    }

    let voucherCode: string | null = null;
    if (message.type === "certificate") {
      const taken = new Set(records.map((r) => r.voucherCode).filter(Boolean));
      for (let attempt = 0; attempt < 12 && !voucherCode; attempt++) {
        const candidate = generateVoucherCode();
        if (!taken.has(candidate)) voucherCode = candidate;
      }
      if (!voucherCode) throw new InboxPersistError("VOUCHER_CODE_FAILED");
    }

    const record: InboxRecord = {
      id: `msg-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`,
      type: message.type,
      payload: message.payload,
      read: false,
      voucherCode,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await writeFileInbox([record, ...records].slice(0, MAX_RECORDS));
    return { id: record.id, voucherCode };
  });
}

export async function listInbox(): Promise<InboxRecord[]> {
  if (await useDatabase()) {
    const rows = await listDbInbox();
    return rows.map((m) => ({
      id: m.id,
      type: m.type,
      payload: m.payload as Record<string, string>,
      read: m.read,
      voucherCode: m.voucherCode,
      status: m.status,
      createdAt: m.createdAt.toISOString(),
    }));
  }
  return readFileInbox();
}

export async function updateInbox(
  id: string,
  patch: { read?: boolean; status?: string }
): Promise<InboxRecord | null> {
  if (await useDatabase()) {
    const m = await updateDbInbox(id, patch);
    return {
      id: m.id,
      type: m.type,
      payload: m.payload as Record<string, string>,
      read: m.read,
      voucherCode: m.voucherCode,
      status: m.status,
      createdAt: m.createdAt.toISOString(),
    };
  }

  return exclusive(async () => {
    const records = await readFileInbox();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return null;
    const next = {
      ...records[index],
      ...(typeof patch.read === "boolean" ? { read: patch.read } : {}),
      ...(typeof patch.status === "string" ? { status: patch.status.slice(0, 40) } : {}),
    };
    records[index] = next;
    await writeFileInbox(records);
    return next;
  });
}

/** slotId → number of bookings. Public (no personal data). */
export async function bookedSlotCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  try {
    for (const m of await listInbox()) {
      const slotId = m.type === "booking" ? m.payload?.slotId : undefined;
      if (slotId) counts[slotId] = (counts[slotId] ?? 0) + 1;
    }
  } catch {
    /* no inbox yet */
  }
  return counts;
}
