"use client";

import { useEffect } from "react";
import { scrollToHashFromLocation, scrollToSection } from "@/lib/scrollToSection";

/** In-page #anchor clicks and hashchange — scroll restore lives in SiteScrollRestore. */
export function HashScrollHandler() {
  useEffect(() => {
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
