import { NextResponse } from "next/server";
import { changeAdminPassword, getAdminSession, requireAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { currentPassword?: string; nextPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await changeAdminPassword(
    session.adminId,
    body.currentPassword?.trim() ?? "",
    body.nextPassword?.trim() ?? ""
  );

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
