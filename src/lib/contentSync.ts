"use client";

import {
  ADMIN_DATA_KEY,
  ADMIN_UPDATE_EVENT,
  seedAdminData,
  type AdminInboxMessage,
  type AdminPersistedData,
} from "@/lib/adminTypes";

/** Set while the admin has changes that did not reach the server yet. */
export const ADMIN_PENDING_KEY = "pali-admin-pending";
const CONTENT_VERSION_KEY = "pali-content-version";

/** data URL → uploaded file URL, so the same photo is never uploaded twice. */
const uploadedCache = new Map<string, string>();

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string | null): boolean {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function setAdminPending(pending: boolean) {
  safeSet(ADMIN_PENDING_KEY, pending ? "1" : null);
}

export async function uploadDataUrl(dataUrl: string): Promise<string> {
  const cached = uploadedCache.get(dataUrl);
  if (cached) return cached;

  const blob = await (await fetch(dataUrl)).blob();
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": blob.type || "image/jpeg" },
    body: blob,
  });
  const json = (await res.json().catch(() => null)) as { ok?: boolean; url?: string } | null;
  if (!res.ok || !json?.ok || !json.url) throw new Error("UPLOAD_FAILED");

  uploadedCache.set(dataUrl, json.url);
  return json.url;
}

/** Replaces every embedded data:image/... string with an uploaded file URL. */
async function externalizeImages<T>(value: T): Promise<T> {
  if (typeof value === "string") {
    if (value.startsWith("data:image/")) return (await uploadDataUrl(value)) as unknown as T;
    return value;
  }
  if (Array.isArray(value)) {
    const out: unknown[] = [];
    for (const item of value) out.push(await externalizeImages(item));
    return out as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      out[key] = await externalizeImages(item);
    }
    return out as T;
  }
  return value;
}

export type PushResult =
  | { ok: true; data: AdminPersistedData; changed: boolean }
  | { ok: false; error: string };

/** Uploads photos as files, then saves the content JSON on the server. */
export async function pushContent(data: AdminPersistedData): Promise<PushResult> {
  try {
    // customer messages live in their own server inbox, never in the content file
    const withoutInbox: AdminPersistedData = { ...data, inbox: [] };
    const slim = await externalizeImages(withoutInbox);
    const changed = JSON.stringify(slim) !== JSON.stringify(withoutInbox);

    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slim),
    });
    if (res.status === 401) return { ok: false, error: "SESSION_EXPIRED" };
    if (!res.ok) return { ok: false, error: `HTTP_${res.status}` };
    return { ok: true, data: slim, changed };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "NETWORK" };
  }
}

export async function fetchPublicContent(): Promise<{
  data: AdminPersistedData | null;
  updatedAt: string | null;
  bookedSlots: Record<string, number>;
} | null> {
  try {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      ok?: boolean;
      data?: AdminPersistedData | null;
      updatedAt?: string | null;
      bookedSlots?: Record<string, number>;
    };
    if (!json.ok) return null;
    return {
      data: json.data ?? null,
      updatedAt: json.updatedAt ?? null,
      bookedSlots: json.bookedSlots ?? {},
    };
  } catch {
    return null;
  }
}

/** Admin: the real inbox from the server (bookings, vouchers, waitlist, contact). */
export async function fetchServerInbox(): Promise<AdminInboxMessage[] | null> {
  try {
    const res = await fetch("/api/admin/inbox", { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      ok?: boolean;
      messages?: Array<{
        id: string;
        type: AdminInboxMessage["type"];
        createdAt: string;
        read: boolean;
        status?: string;
        voucherCode?: string | null;
        payload: Record<string, string>;
      }>;
    };
    if (!json.ok || !json.messages) return null;
    return json.messages.map((m) => ({
      id: m.id,
      type: m.type,
      createdAt: m.createdAt,
      read: m.read,
      payload: {
        ...m.payload,
        ...(m.voucherCode ? { voucherCode: m.voucherCode } : {}),
        ...(m.status ? { status: m.status } : {}),
      },
    }));
  } catch {
    return null;
  }
}

/** Server-confirmed bookings, as anonymous entries so free places are counted right everywhere. */
function bookingsAsInbox(bookedSlots: Record<string, number>): AdminInboxMessage[] {
  const out: AdminInboxMessage[] = [];
  for (const [slotId, count] of Object.entries(bookedSlots)) {
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

/** Visitors (and the admin's own browser): pull the latest saved content into the local cache. */
export async function syncPublicContent(): Promise<void> {
  if (safeGet(ADMIN_PENDING_KEY)) return;

  const remote = await fetchPublicContent();
  if (!remote) return;
  const hasBookings = Object.keys(remote.bookedSlots).length > 0;
  if (!remote.data && !hasBookings) return;

  const version = `${remote.updatedAt ?? "none"}|${JSON.stringify(remote.bookedSlots)}`;
  if (safeGet(CONTENT_VERSION_KEY) === version) return;

  let local: Partial<AdminPersistedData> | null = null;
  try {
    const raw = safeGet(ADMIN_DATA_KEY);
    if (raw) local = JSON.parse(raw) as Partial<AdminPersistedData>;
  } catch {
    local = null;
  }

  // Messages made in this browser while the server was unreachable stay; the rest is the server's.
  const localOnly = (local?.inbox ?? []).filter((m) => /^msg-[a-z0-9]+$/.test(m.id));
  const base = (remote.data ?? local ?? seedAdminData()) as AdminPersistedData;
  const merged = { ...base, inbox: [...localOnly, ...bookingsAsInbox(remote.bookedSlots)] };
  if (!safeSet(ADMIN_DATA_KEY, JSON.stringify(merged))) return;
  safeSet(CONTENT_VERSION_KEY, version);
  window.dispatchEvent(new Event(ADMIN_UPDATE_EVENT));
}
