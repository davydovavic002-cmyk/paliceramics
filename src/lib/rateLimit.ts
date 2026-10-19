/** Tiny in-memory limiter (one Node process). Returns true when the caller is over the limit. */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(
  bucket: string,
  key: string,
  max: number,
  windowMs: number
): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }
  const id = `${bucket}:${key}`;
  const entry = buckets.get(id);
  if (!entry || entry.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}
