import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  ContentConflictError,
  MAX_CONTENT_BYTES,
  publicContent,
  readContent,
  writeContentChecked,
} from "@/lib/contentStore";

export const dynamic = "force-dynamic";

async function authorized(): Promise<boolean> {
  try {
    await requireAdminSession();
    return true;
  } catch {
    return false;
  }
}

function looksLikeAdminData(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.products) && Array.isArray(v.collections);
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const stored = await readContent();
  return NextResponse.json(
    { ok: true, data: stored ? publicContent(stored.data) : null, updatedAt: stored?.updatedAt ?? null },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const text = await request.text();
  if (text.length > MAX_CONTENT_BYTES) {
    return NextResponse.json({ ok: false, error: "Too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!looksLikeAdminData(body)) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  try {
    // The admin sends the version it last saw; if someone saved since, refuse instead of overwriting.
    const header = request.headers.get("x-base-updated-at");
    const stored = await writeContentChecked(
      publicContent(body),
      header === null ? undefined : header
    );
    return NextResponse.json({ ok: true, updatedAt: stored.updatedAt });
  } catch (error) {
    if (error instanceof ContentConflictError) {
      const current = await readContent();
      return NextResponse.json(
        { ok: false, error: "CONFLICT", updatedAt: current?.updatedAt ?? null },
        { status: 409 }
      );
    }
    console.error("[content]", error);
    return NextResponse.json({ ok: false, error: "Write failed" }, { status: 500 });
  }
}
