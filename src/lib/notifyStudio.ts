/**
 * Sends the studio an email when a visitor submits a form (booking, waitlist, voucher, contact).
 * Uses the Resend HTTP API (no extra package). Does nothing when the keys are not set,
 * and never throws: a mail problem must not break the form, the request is already saved in the inbox.
 */
const RESEND_URL = "https://api.resend.com/emails";

const SUBJECTS: Record<string, string> = {
  booking: "Nowa rezerwacja warsztatu",
  waitlist: "Nowy zapis na listę oczekujących",
  certificate: "Nowe zamówienie vouchera",
  contact: "Nowa wiadomość ze strony",
};

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyStudio(
  type: string,
  payload: Record<string, string>,
  voucherCode: string | null
): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.STUDIO_INBOX_EMAIL?.trim();
  if (!key || !from || !to) return;

  const subject = `Pali Pali: ${SUBJECTS[type] ?? "Nowe zgłoszenie"}`;
  const rows: Array<[string, string]> = Object.entries(payload)
    .map(([k, v]): [string, string] => [k, String(v ?? "").trim().slice(0, 1000)])
    .filter(([, v]) => v)
    .slice(0, 30);
  if (voucherCode) rows.push(["voucherCode", voucherCode]);

  const html =
    `<h2>${esc(subject)}</h2><table cellpadding="6" style="border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="color:#666;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`
      )
      .join("") +
    `</table><p style="color:#888">Wszystkie zgłoszenia są też w panelu admina (zakładka Inbox).</p>`;
  const text = `${subject}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}`;

  const replyTo = String(payload.email ?? payload.buyerEmail ?? "").trim();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
        ...(replyTo.includes("@") ? { reply_to: replyTo } : {}),
      }),
      signal: controller.signal,
    });
    if (!res.ok) console.error("[notify] Resend answered", res.status);
  } catch (error) {
    console.error("[notify]", error instanceof Error ? error.message : error);
  } finally {
    clearTimeout(timer);
  }
}
