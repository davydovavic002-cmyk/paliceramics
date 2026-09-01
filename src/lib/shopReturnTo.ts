/** Encode current location for product / detail back navigation. */
export function buildReturnTo(pathname: string, search: string): string {
  const path = search ? `${pathname}?${search}` : pathname;
  return encodeURIComponent(path);
}

export function appendReturnTo(href: string, returnToEncoded: string): string {
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}returnTo=${returnToEncoded}`;
}

export function decodeReturnTo(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value);
    if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function resolveBackHref(
  returnTo: string | null,
  fallback = "/shop"
): string {
  return returnTo ?? fallback;
}
