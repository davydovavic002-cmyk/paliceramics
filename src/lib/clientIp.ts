/**
 * The visitor's address as the reverse proxy saw it.
 * nginx sets X-Real-IP itself (visitors cannot fake it); the last X-Forwarded-For entry is the same address.
 */
export function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }
  return "local";
}
