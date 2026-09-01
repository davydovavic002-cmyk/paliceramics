import { decodeReturnTo } from "@/lib/shopReturnTo";

export const SHOP_RETURN_KEY = "pali-shop-return";

/** @deprecated use SHOP_RETURN_KEY */
export const SHOP_SCROLL_KEY = SHOP_RETURN_KEY;

export type ShopCatalogReturnState = {
  scrollY: number;
  returnTo: string;
};

export function currentShopLocation(pathname: string, search: string): string {
  const path = search ? `${pathname}?${search}` : pathname;
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  return `${path}${hash}`;
}

export function matchesSavedShopReturn(
  savedReturnToEncoded: string | undefined,
  pathname: string,
  search: string
): boolean {
  if (!savedReturnToEncoded) return false;
  const decoded = decodeReturnTo(savedReturnToEncoded);
  if (!decoded) return false;
  return decoded === currentShopLocation(pathname, search);
}

export function saveShopCatalogReturnState(returnToEncoded: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    SHOP_RETURN_KEY,
    JSON.stringify({
      scrollY: window.scrollY,
      returnTo: returnToEncoded,
    } satisfies ShopCatalogReturnState)
  );
}

export function peekShopCatalogReturnState(): ShopCatalogReturnState | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SHOP_RETURN_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ShopCatalogReturnState>;
    const scrollY = Number(parsed.scrollY);
    if (!Number.isFinite(scrollY)) return null;
    if (!parsed.returnTo || typeof parsed.returnTo !== "string") return null;
    return { scrollY, returnTo: parsed.returnTo };
  } catch {
    return null;
  }
}

export function clearShopCatalogReturnState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SHOP_RETURN_KEY);
}

export function consumeShopCatalogReturnState(): ShopCatalogReturnState | null {
  const restored = peekShopCatalogReturnState();
  if (restored) clearShopCatalogReturnState();
  return restored;
}

/** Saves scroll position and catalog URL for return-from-product restore. */
export function saveShopScrollPosition(returnToEncoded: string) {
  saveShopCatalogReturnState(returnToEncoded);
}

/** @deprecated use consumeShopCatalogReturnState */
export function consumeShopScrollPosition(): number | null {
  const restored = consumeShopCatalogReturnState();
  return restored?.scrollY ?? null;
}

export function buildCurrentReturnTo(pathname: string, search: string): string {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const path = search ? `${pathname}?${search}` : pathname;
  return encodeURIComponent(`${path}${hash}`);
}

/** Keep catalog returnTo when navigating between product detail pages (e.g. related items). */
export function resolveProductReturnTo(
  pathname: string,
  search: string,
  existingReturnTo: string | null | undefined
): string {
  const onCatalog = pathname === "/shop" || pathname === "/shop/made-to-order";
  if (onCatalog || !existingReturnTo) {
    return buildCurrentReturnTo(pathname, search);
  }
  return existingReturnTo;
}
