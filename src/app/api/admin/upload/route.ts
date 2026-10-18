import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { MAX_UPLOAD_BYTES, extForMime, saveUpload } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

/** Raw image body (Content-Type: image/jpeg|png|webp|gif) → /api/media/<name> */
export async function POST(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const mime = (request.headers.get("content-type") ?? "").split(";")[0].trim();
  const ext = extForMime(mime);
  if (!ext) {
    return NextResponse.json({ ok: false, error: "Unsupported type" }, { status: 415 });
  }

  const bytes = Buffer.from(await request.arrayBuffer());
  if (bytes.length === 0 || bytes.length > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: "Bad size" }, { status: 413 });
  }

  try {
    const name = await saveUpload(bytes, ext);
    return NextResponse.json({ ok: true, url: `/api/media/${name}` });
  } catch (error) {
    console.error("[upload]", error);
    return NextResponse.json({ ok: false, error: "Write failed" }, { status: 500 });
  }
}
