"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'input:not([type="hidden"]), textarea, select, [contenteditable="true"]';

/** Keeps focused fields visible when the mobile keyboard opens. */
export function useFormKeyboardScroll<T extends HTMLElement>() {
  const formRef = useRef<T>(null);

  useEffect(() => {
    const root = formRef.current;
    if (!root || typeof window === "undefined") return;

    const scrollFocused = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return;
      const field = target.closest(FOCUSABLE);
      if (!(field instanceof HTMLElement)) return;

      /* Wait for the keyboard, then move the page only as far as needed. A smooth
         "center" scroll fought with iOS's own scrolling and made the screen jump. */
      window.setTimeout(() => {
        const vv = window.visualViewport;
        const viewHeight = vv ? vv.height : window.innerHeight;
        const rect = field.getBoundingClientRect();
        const topLimit = 96;
        const bottomLimit = viewHeight - 24;
        if (rect.top < topLimit) {
          window.scrollBy({ top: rect.top - topLimit, behavior: "auto" });
        } else if (rect.bottom > bottomLimit) {
          window.scrollBy({ top: rect.bottom - bottomLimit, behavior: "auto" });
        }
      }, 400);
    };

    const onFocusIn = (event: FocusEvent) => scrollFocused(event.target);
    root.addEventListener("focusin", onFocusIn);

    const vv = window.visualViewport;
    const syncKeyboardInset = () => {
      if (!vv) return;
      const keyboardOpen = vv.height < window.innerHeight * 0.82;
      const inset = keyboardOpen
        ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
        : 0;
      document.documentElement.style.setProperty("--keyboard-inset", `${inset}px`);
    };

    if (vv) {
      vv.addEventListener("resize", syncKeyboardInset);
      vv.addEventListener("scroll", syncKeyboardInset);
    }

    return () => {
      root.removeEventListener("focusin", onFocusIn);
      if (vv) {
        vv.removeEventListener("resize", syncKeyboardInset);
        vv.removeEventListener("scroll", syncKeyboardInset);
      }
      document.documentElement.style.removeProperty("--keyboard-inset");
    };
  }, []);

  return formRef;
}
