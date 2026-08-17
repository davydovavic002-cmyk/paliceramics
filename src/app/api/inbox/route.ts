import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import { InboxPersistError, persistInboxMessage } from "@/lib/inboxDb";
import { validateInboxSubmit } from "@/lib/inboxServer";

export async function POST(request: Request) {
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

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const result = await persistInboxMessage(message);
    return NextResponse.json({
      ok: true,
      id: result.id,
      voucherCode: result.voucherCode,
      mode: "database",
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
