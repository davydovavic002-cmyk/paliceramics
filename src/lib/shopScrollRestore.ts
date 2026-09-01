export const SHOP_RETURN_KEY = "pali-shop-return";

/** @deprecated use SHOP_RETURN_KEY */
export const SHOP_SCROLL_KEY = SHOP_RETURN_KEY;

export type ShopCatalogReturnState = {
  scrollY: number;
};

export function saveShopCatalogReturnState() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    SHOP_RETURN_KEY,
    JSON.stringify({ scrollY: window.scrollY } satisfies ShopCatalogReturnState)
  );
}

export function consumeShopCatalogReturnState(): ShopCatalogReturnState | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SHOP_RETURN_KEY);
  sessionStorage.removeItem(SHOP_RETURN_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ShopCatalogReturnState>;
    const scrollY = Number(parsed.scrollY);
    if (!Number.isFinite(scrollY)) return null;
    return { scrollY };
  } catch {
    return null;
  }
}

/** Saves scroll position for catalog return. */
export function saveShopScrollPosition() {
  saveShopCatalogReturnState();
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
