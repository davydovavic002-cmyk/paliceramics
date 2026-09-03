/** Encode current location for product / detail back navigation. */
export function buildReturnTo(pathname: string, search: string): string {
  const path = search ? `${pathname}?${search}` : pathname;
  return encodeURIComponent(path);
}

/** Homepage lookbook block — used when opening made-to-order from `/`. */
export const HOME_LOOKBOOK_RETURN_TO = encodeURIComponent("/#collection");

export function isHomeLookbookReturn(returnTo: string | null | undefined): boolean {
  return decodeReturnTo(returnTo) === "/#collection";
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

type BackRouter = {
  push: (href: string, options?: { scroll?: boolean }) => void;
};

/** Navigate back from product detail, including `/#section` on the homepage. */
export function navigateBackFromProduct(
  router: BackRouter,
  returnTo: string | null,
  fallback: string,
  scrollToSection?: (hash: string) => boolean
) {
  const href = resolveBackHref(returnTo, fallback);
  const hashIndex = href.indexOf("#");

  if (hashIndex === -1) {
    router.push(href, { scroll: false });
    return;
  }

  const path = href.slice(0, hashIndex) || "/";
  const hash = href.slice(hashIndex);
  router.push(path, { scroll: false });

  if (scrollToSection) {
    window.setTimeout(() => scrollToSection(hash), 0);
  }
}
