import { NextResponse } from "next/server";
import { publicContent, readContent } from "@/lib/contentStore";
import { bookedSlotCounts } from "@/lib/inboxStore";

export const dynamic = "force-dynamic";

/** Public: site content edited in the admin (without customer messages). */
export async function GET() {
  const stored = await readContent();
  const bookedSlots = await bookedSlotCounts();
  if (!stored) {
    return NextResponse.json(
      { ok: true, data: null, updatedAt: null, bookedSlots },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
  return NextResponse.json(
    { ok: true, data: publicContent(stored.data), updatedAt: stored.updatedAt, bookedSlots },
    { headers: { "Cache-Control": "no-store" } }
  );
}
