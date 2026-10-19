import { NextResponse } from "next/server";
import {
  changeAdminPassword,
  changeFilePassword,
  getAdminSession,
} from "@/lib/auth";
import { isDatabaseConfigured, isDatabaseReachable } from "@/lib/db";
import { isRateLimited } from "@/lib/rateLimit";
import { clientIp } from "@/lib/clientIp";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (isRateLimited("password", clientIp(request), 8, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts" }, { status: 429 });
  }

  let body: { currentPassword?: string; nextPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const current = body.currentPassword?.trim() ?? "";
  const next = body.nextPassword?.trim() ?? "";

  const useDb =
    session.adminId !== "file-admin" && isDatabaseConfigured() && (await isDatabaseReachable());
  const result = useDb
    ? await changeAdminPassword(session.adminId, current, next)
    : await changeFilePassword(current, next);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
