"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollToHashFromLocation } from "@/lib/scrollToSection";
import {
  applyPageScroll,
  cancelPendingPageScroll,
  hasExplicitSectionHash,
  isBackForwardNavigation,
  pageScrollCacheKey,
  readPageScrollForKey,
  savePageScrollForKey,
  shouldResetHomeScrollToTop,
} from "@/lib/siteScrollRestore";
import {
  isShopCatalogPath,
  shouldDeferInitialScrollToTop,
  tryRestoreShopCatalogScroll,
} from "@/lib/shopScrollRestore";

function snapWindowToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function blurHomepageFormFocus() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || active === document.body) return;
  if (!active.closest("form, #workshops, #certificates, #contact")) return;
  active.blur();
}

/** Saves scroll per URL and restores it on browser Back/Forward. */
export function SiteScrollRestore() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const scrollYRef = useRef(0);
  const popPendingRef = useRef(false);
  const initialDocumentPassRef = useRef(true);
  const homeRestoreTimerRef = useRef<number | null>(null);
  const homePinTimersRef = useRef<number[]>([]);
  const homePinCancelledRef = useRef(false);
  const freshHomeGuardRef = useRef(false);

  const clearHomeRestoreTimer = () => {
    if (homeRestoreTimerRef.current === null) return;
    window.clearTimeout(homeRestoreTimerRef.current);
    homeRestoreTimerRef.current = null;
  };

  const clearHomePinTimers = () => {
    for (const id of homePinTimersRef.current) window.clearTimeout(id);
    homePinTimersRef.current = [];
  };

  const cancelFreshHomePin = () => {
    homePinCancelledRef.current = true;
    freshHomeGuardRef.current = false;
    clearHomePinTimers();
  };

  useEffect(() => {
    scrollYRef.current = window.scrollY;

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const onPopState = () => {
      popPendingRef.current = true;
      cancelFreshHomePin();
    };

    const onHashChange = () => {
      if (hasExplicitSectionHash()) cancelFreshHomePin();
    };

    const onUserIntent = () => {
      cancelFreshHomePin();
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!freshHomeGuardRef.current) return;
      if (hasExplicitSectionHash()) return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest("form, #workshops, #certificates, #contact")) return;
      target.blur();
      snapWindowToTop();
      scrollYRef.current = 0;
    };

    const onPageHide = () => {
      savePageScrollForKey(
        pageScrollCacheKey(pathname, search, window.location.hash),
        scrollYRef.current
      );
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }
      if (href.startsWith("http") && !href.startsWith(window.location.origin)) return;
      savePageScrollForKey(
        pageScrollCacheKey(pathname, search, window.location.hash),
        scrollYRef.current
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("wheel", onUserIntent, { passive: true });
    window.addEventListener("pointerdown", onUserIntent);
    window.addEventListener("touchstart", onUserIntent, { passive: true });
    window.addEventListener("keydown", onUserIntent);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("click", onDocumentClick, true);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("pointerdown", onUserIntent);
      window.removeEventListener("touchstart", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("click", onDocumentClick, true);
      clearHomeRestoreTimer();
      clearHomePinTimers();
    };
  }, [pathname, search]);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    clearHomeRestoreTimer();
    clearHomePinTimers();
    cancelPendingPageScroll();
    freshHomeGuardRef.current = false;

    const hash = window.location.hash;
    const explicitHash = hasExplicitSectionHash(hash);
    const cacheKey = pageScrollCacheKey(pathname, search, hash);
    const isInitialDocumentPass = initialDocumentPassRef.current;
    initialDocumentPassRef.current = false;

    const isPop = popPendingRef.current;
    const isDocumentBackForward = isInitialDocumentPass && isBackForwardNavigation();
    const shouldRestore = isPop || isDocumentBackForward;
    popPendingRef.current = false;

    if (explicitHash && !shouldRestore) {
      scrollToHashFromLocation();
      scrollYRef.current = window.scrollY;
      return;
    }

    if (isShopCatalogPath(pathname)) {
      const shopRestored = tryRestoreShopCatalogScroll(pathname, search);
      if (shopRestored) {
        scrollYRef.current = window.scrollY;
        return;
      }
    }

    if (shouldRestore) {
      const cached = readPageScrollForKey(cacheKey);
      if (cached !== null) {
        const runRestore = () => {
          scrollYRef.current = applyPageScroll(cached);
        };
        runRestore();
        if (pathname === "/") {
          homeRestoreTimerRef.current = window.setTimeout(runRestore, 450);
        }
        return;
      }
      if (explicitHash) scrollToHashFromLocation();
      scrollYRef.current = window.scrollY;
      return;
    }

    if (!shouldDeferInitialScrollToTop(pathname) && !explicitHash) {
      snapWindowToTop();
      scrollYRef.current = 0;
    }

    if (
      isInitialDocumentPass &&
      shouldResetHomeScrollToTop({
        pathname,
        hash,
        isPopState: isPop,
        isDocumentBackForward,
      })
    ) {
      homePinCancelledRef.current = false;
      freshHomeGuardRef.current = true;
      const pinTop = () => {
        if (homePinCancelledRef.current) return;
        if (hasExplicitSectionHash()) return;
        blurHomepageFormFocus();
        snapWindowToTop();
        scrollYRef.current = 0;
      };
      requestAnimationFrame(pinTop);
      homePinTimersRef.current = [window.setTimeout(pinTop, 0), window.setTimeout(pinTop, 500)];
    }
  }, [pathname, search]);

  return null;
}
