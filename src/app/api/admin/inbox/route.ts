import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { listInboxMessages, updateInboxMessage } from "@/lib/inboxDb";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const messages = await listInboxMessages();
  return NextResponse.json({
    ok: true,
    messages: messages.map((m) => ({
      id: m.id,
      type: m.type,
      createdAt: m.createdAt.toISOString(),
      read: m.read,
      status: m.status,
      voucherCode: m.voucherCode,
      payload: m.payload as Record<string, string>,
    })),
  });
}

export async function PATCH(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; read?: boolean; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  const updated = await updateInboxMessage(body.id, {
    read: body.read,
    status: body.status,
  });

  return NextResponse.json({ ok: true, message: updated });
}
