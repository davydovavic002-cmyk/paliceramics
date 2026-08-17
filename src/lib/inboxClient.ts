"use client";

import {
  addInboxMessage,
  type InboxMessageType,
} from "@/lib/adminTypes";
import { generateVoucherCode } from "@/lib/voucherCode";

export type InboxSubmitResult = {
  ok: boolean;
  mode: "database" | "local";
  id?: string;
  voucherCode?: string | null;
  error?: string;
};

const useApi = process.env.NEXT_PUBLIC_USE_INBOX_API === "true";

export async function submitInboxMessage(
  type: InboxMessageType,
  payload: Record<string, string>
): Promise<InboxSubmitResult> {
  if (useApi) {
    try {
      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload, consent: true }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        id?: string;
        voucherCode?: string | null;
        error?: string;
      };

      if (res.ok && data.ok) {
        return {
          ok: true,
          mode: "database",
          id: data.id,
          voucherCode: data.voucherCode ?? null,
        };
      }

      if (data.error === "SLOT_UNAVAILABLE") {
        return { ok: false, mode: "database", error: "SLOT_UNAVAILABLE" };
      }

      /* API down / no DB — fall through to local demo */
    } catch {
      /* network error — fall through */
    }
  }

  const voucherCode = type === "certificate" ? generateVoucherCode() : null;
  const storedPayload = voucherCode ? { ...payload, voucherCode } : payload;
  const entry = addInboxMessage(type, storedPayload);

  return { ok: true, mode: "local", id: entry.id, voucherCode };
}
