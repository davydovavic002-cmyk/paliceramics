import { NextResponse } from "next/server";
import { clientIp } from "@/lib/clientIp";
import { isRateLimited } from "@/lib/rateLimit";
import { InboxPersistError } from "@/lib/inboxDb";
import { persistInbox } from "@/lib/inboxStore";
import { validateInboxSubmit } from "@/lib/inboxServer";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Spam guard: a real visitor sends a few requests, a bot sends hundreds.
  if (isRateLimited("inbox", clientIp(request), 12, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const message = validateInboxSubmit(body);
  if (!message) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  try {
    const result = await persistInbox(message);
    return NextResponse.json({
      ok: true,
      id: result.id,
      voucherCode: result.voucherCode,
      mode: "server",
    });
  } catch (error) {
    if (error instanceof InboxPersistError) {
      const status = error.code === "SLOT_UNAVAILABLE" ? 409 : 400;
      return NextResponse.json({ ok: false, error: error.code }, { status });
    }
    console.error("[inbox]", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
