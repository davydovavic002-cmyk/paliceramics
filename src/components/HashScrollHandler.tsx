"use client";

import { useEffect } from "react";
import { SHOP_RETURN_KEY } from "@/lib/shopScrollRestore";
import { scrollToHashFromLocation, scrollToSection } from "@/lib/scrollToSection";

/** Global in-page anchor scrolling — works for nav, CTAs, and direct #hash URLs. */
export function HashScrollHandler() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
      scrollToHashFromLocation();
    } else if (!sessionStorage.getItem(SHOP_RETURN_KEY)) {
      window.scrollTo(0, 0);
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const section = document.getElementById(hash.slice(1));
      if (!section) return;

      event.preventDefault();
      scrollToSection(hash);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", scrollToHashFromLocation);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", scrollToHashFromLocation);
    };
  }, []);

  return null;
}
