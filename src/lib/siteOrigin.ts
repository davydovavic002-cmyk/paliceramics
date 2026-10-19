import { headers } from "next/headers";

const FALLBACK = "https://pali.neostudio.space";

/**
 * Public address of the site, worked out per request so it stays right after a domain move.
 * Order: SITE_URL from .env.local (read at runtime) → the Host the visitor used → fallback.
 */
export async function siteOrigin(): Promise<string> {
  const fromEnv = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  try {
    const h = await headers();
    const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0].trim();
    if (host && !/^(localhost|127\.|\[::1\]|0\.0\.0\.0)/i.test(host)) {
      const proto = (h.get("x-forwarded-proto") ?? "https").split(",")[0].trim();
      return `${proto}://${host}`;
    }
  } catch {
    /* no request (build time) */
  }
  return FALLBACK;
}
