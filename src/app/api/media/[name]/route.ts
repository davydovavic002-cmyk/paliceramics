import { readUpload, readUploadResized } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

const CACHE = "public, max-age=31536000, immutable";

export async function GET(request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;

  // ?w=<width> returns a smaller WebP copy (phones should not download 1400px photos for a 360px card).
  const width = Number(new URL(request.url).searchParams.get("w"));
  if (width) {
    const small = await readUploadResized(name, width);
    if (small) {
      return new Response(new Uint8Array(small), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": CACHE,
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  }

  // No ?w, an unsupported width or a resize problem: serve the original, exactly as before.
  const file = await readUpload(name);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.mime,
      "Cache-Control": CACHE,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
