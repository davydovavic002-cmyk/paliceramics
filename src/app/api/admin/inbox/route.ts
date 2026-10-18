import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { listInbox, updateInbox } from "@/lib/inboxStore";

export const dynamic = "force-dynamic";

async function authorized(): Promise<boolean> {
  try {
    await requireAdminSession();
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await listInbox();
    return NextResponse.json(
      { ok: true, messages },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[admin/inbox]", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await authorized())) {
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

  try {
    const updated = await updateInbox(body.id, { read: body.read, status: body.status });
    if (!updated) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, message: updated });
  } catch (error) {
    console.error("[admin/inbox]", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
