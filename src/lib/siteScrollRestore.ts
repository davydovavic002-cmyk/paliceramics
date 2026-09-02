export const PAGE_SCROLL_PREFIX = "pali-page-scroll:";

export function pageScrollCacheKey(pathname: string, search = "", hash?: string): string {
  const h = hash ?? (typeof window !== "undefined" ? window.location.hash : "");
  const qs = search ? `?${search}` : "";
  return `${pathname}${qs}${h}`;
}

export function savePageScrollForKey(key: string, scrollY: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PAGE_SCROLL_PREFIX}${key}`, String(Math.max(0, scrollY)));
}

export function readPageScrollForKey(key: string): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${PAGE_SCROLL_PREFIX}${key}`);
  if (!raw) return null;
  const scrollY = Number(raw);
  return Number.isFinite(scrollY) ? scrollY : null;
}

export function applyPageScroll(scrollY: number): number {
  let lastTop = 0;

  const apply = () => {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    lastTop = Math.min(Math.max(0, scrollY), maxY);
    window.scrollTo({ top: lastTop, left: 0, behavior: "auto" });
    return lastTop;
  };

  apply();
  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(apply);
  });
  window.setTimeout(apply, 120);
  window.setTimeout(apply, 320);

  return lastTop;
}

export function isBackForwardNavigation(): boolean {
  if (typeof window === "undefined") return false;
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return nav?.type === "back_forward";
}
