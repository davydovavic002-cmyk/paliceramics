"use client";

import { useLayoutEffect } from "react";

/** Snap product detail to top on open — catalog scroll is restored only when returning to /shop. */
export function useProductPageScrollTop(activeKey: string) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeKey]);
}
