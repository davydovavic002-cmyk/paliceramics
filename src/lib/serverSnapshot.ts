import { readContent, publicContent } from "@/lib/contentStore";
import { bookedSlotCounts } from "@/lib/inboxStore";
import {
  setServerSnapshot,
  SERVER_SNAPSHOT_KEY,
  type AdminInboxMessage,
  type AdminPersistedData,
} from "@/lib/adminTypes";

/** Booked places as anonymous entries, so free seats are right on the very first paint. */
function bookingsAsInbox(counts: Record<string, number>): AdminInboxMessage[] {
  const out: AdminInboxMessage[] = [];
  for (const [slotId, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i++) {
      out.push({
        id: `srv-${slotId}-${i}`,
        type: "booking",
        createdAt: "1970-01-01T00:00:00.000Z",
        read: true,
        payload: { slotId },
      });
    }
  }
  return out;
}

/** Loads what the admin saved and publishes it for this render; returns the inline <script> text. */
export async function loadServerSnapshotScript(): Promise<string | null> {
  try {
    const stored = await readContent();
    if (!stored) {
      setServerSnapshot(null);
      return null;
    }
    const counts = await bookedSlotCounts();
    const data = {
      ...publicContent(stored.data),
      inbox: bookingsAsInbox(counts),
    } as unknown as AdminPersistedData;
    setServerSnapshot(data);
    return `window.${SERVER_SNAPSHOT_KEY}=${JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028|\u2029/g, "")};`;
  } catch {
    setServerSnapshot(null);
    return null;
  }
}
