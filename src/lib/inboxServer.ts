import type { InboxMessageType } from "@/lib/adminTypes";

export type InboxSubmitPayload = Record<string, string>;

export type InboxSubmitBody = {
  type: InboxMessageType;
  payload: InboxSubmitPayload;
  consent: boolean;
};

function hasEmail(payload: InboxSubmitPayload): boolean {
  const email = String(payload.email ?? payload.buyerEmail ?? "").trim();
  return email.includes("@");
}

export function validateInboxSubmit(body: unknown): InboxSubmitBody | null {
  if (!body || typeof body !== "object") return null;
  const { type, payload, consent } = body as InboxSubmitBody;
  if (!type || !payload || consent !== true) return null;
  if (!["waitlist", "booking", "certificate", "contact"].includes(type)) return null;
  if (typeof payload !== "object") return null;

  if (type === "waitlist" || type === "booking" || type === "contact") {
    if (!hasEmail(payload)) return null;
  }

  if (type === "booking") {
    if (!String(payload.name ?? "").trim()) return null;
    if (!String(payload.slotId ?? "").trim()) return null;
  }

  if (type === "certificate") {
    if (!String(payload.recipient ?? "").trim()) return null;
  }

  return { type, payload, consent: true };
}
