import { NextResponse } from "next/server";
import { isSessionConfigured, loginAdmin } from "@/lib/auth";
import { clientIp } from "@/lib/clientIp";

/** Simple in-memory brute-force guard: 8 attempts / 10 min per IP. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function clientKey(request: Request): string {
  return clientIp(request);
}

export async function POST(request: Request) {
  if (!isSessionConfigured()) {
    return NextResponse.json({ ok: false, error: "Session not configured" }, { status: 503 });
  }

  const key = clientKey(request);
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ ok: false, error: "Too many attempts" }, { status: 429 });
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
    const current = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(key, { count: current.count + 1, resetAt: current.resetAt });
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  attempts.delete(key);
  return NextResponse.json({ ok: true });
}
