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

      window.setTimeout(() => {
        field.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      }, 320);
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
