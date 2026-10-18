import { NextResponse } from "next/server";
import { getAdminSession, isSessionConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({
    ok: true,
    authed: Boolean(session),
    /** "server" = inbox + content live on the server (database or files). */
    mode: isSessionConfigured() ? "server" : "demo",
    /** Admin content is saved in files on the server (works without a database). */
    contentServer: isSessionConfigured(),
  });
}
