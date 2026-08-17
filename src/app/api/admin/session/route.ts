import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isDatabaseReachable } from "@/lib/db";

export async function GET() {
  if (!(await isDatabaseReachable())) {
    return NextResponse.json({ ok: true, authed: false, mode: "demo" });
  }

  const session = await getAdminSession();
  return NextResponse.json({
    ok: true,
    authed: Boolean(session),
    mode: "server",
  });
}
