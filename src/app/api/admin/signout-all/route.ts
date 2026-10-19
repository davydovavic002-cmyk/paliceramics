import { NextResponse } from "next/server";
import { getAdminSession, signOutEverywhere } from "@/lib/auth";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  await signOutEverywhere();
  return NextResponse.json({ ok: true });
}
