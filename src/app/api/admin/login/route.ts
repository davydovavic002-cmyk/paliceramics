import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";
import { isDatabaseReachable } from "@/lib/db";

export async function POST(request: Request) {
  if (!(await isDatabaseReachable())) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password) {
    return NextResponse.json({ ok: false, error: "Password required" }, { status: 400 });
  }

  const ok = await loginAdmin(password);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
