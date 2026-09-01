"use client";

import { useLayoutEffect, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  clearShopCatalogReturnState,
  matchesSavedShopReturn,
  peekShopCatalogReturnState,
  type ShopCatalogReturnState,
} from "@/lib/shopScrollRestore";

function runShopCatalogScrollRestore(state: ShopCatalogReturnState) {
  const { scrollY } = state;

  const apply = () => {
    window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
  };

  apply();
  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(() => {
      apply();
      clearShopCatalogReturnState();
    });
  });

  window.setTimeout(apply, 0);
  window.setTimeout(apply, 50);
  window.setTimeout(() => {
    apply();
    clearShopCatalogReturnState();
  }, 120);
}

function tryRestoreShopCatalogScroll(pathname: string, search: string) {
  const state = peekShopCatalogReturnState();
  if (!state || !matchesSavedShopReturn(state.returnTo, pathname, search)) {
    clearShopCatalogReturnState();
    return;
  }
  runShopCatalogScrollRestore(state);
}

/** Restore catalog scroll when returning from product detail to the same catalog URL. */
export function useShopCatalogScrollRestore() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onCatalog = pathname === "/shop";
  const search = searchParams.toString();

  useLayoutEffect(() => {
    if (!onCatalog) return;
    tryRestoreShopCatalogScroll(pathname, search);
  }, [onCatalog, pathname, search]);

  useEffect(() => {
    if (!onCatalog) return;

    const onPopState = () => {
      window.setTimeout(() => {
        if (window.location.pathname !== "/shop") return;
        tryRestoreShopCatalogScroll(
          window.location.pathname,
          window.location.search.replace(/^\?/, "")
        );
      }, 0);
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || window.location.pathname !== "/shop") return;
      tryRestoreShopCatalogScroll(
        window.location.pathname,
        window.location.search.replace(/^\?/, "")
      );
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [onCatalog, pathname, search]);
}
