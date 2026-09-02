"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollToHashFromLocation } from "@/lib/scrollToSection";
import {
  applyPageScroll,
  isBackForwardNavigation,
  pageScrollCacheKey,
  readPageScrollForKey,
  savePageScrollForKey,
} from "@/lib/siteScrollRestore";
import {
  isShopCatalogPath,
  shouldDeferInitialScrollToTop,
  tryRestoreShopCatalogScroll,
} from "@/lib/shopScrollRestore";

/** Saves scroll per URL and restores it on browser Back/Forward. */
export function SiteScrollRestore() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const scrollYRef = useRef(0);
  const popPendingRef = useRef(false);

  useEffect(() => {
    scrollYRef.current = window.scrollY;

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const onPopState = () => {
      popPendingRef.current = true;
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
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("click", onDocumentClick, true);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [pathname, search]);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const hash = window.location.hash;
    const cacheKey = pageScrollCacheKey(pathname, search, hash);
    const shouldRestore = popPendingRef.current || isBackForwardNavigation();
    popPendingRef.current = false;

    if (hash && !shouldRestore) {
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
          window.setTimeout(runRestore, 450);
        }
        return;
      }
      if (hash) scrollToHashFromLocation();
      scrollYRef.current = window.scrollY;
      return;
    }

    if (!shouldDeferInitialScrollToTop(pathname) && !hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      scrollYRef.current = 0;
    }
  }, [pathname, search]);

  return null;
}
