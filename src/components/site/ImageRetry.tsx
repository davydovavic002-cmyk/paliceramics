"use client";

import { useEffect } from "react";

const MAX_RETRIES = 2;

/**
 * A slow or briefly unavailable server (deploy, restart, busy VPS) can drop an image request and leave
 * a broken-image icon until the next refresh. This retries a failed image a couple of times, site-wide.
 */
export function ImageRetry() {
  useEffect(() => {
    const onError = (event: Event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      const current = img.getAttribute("src") ?? "";
      if (!current || current.startsWith("data:")) return;

      const tries = Number(img.dataset.retry ?? "0");
      if (tries >= MAX_RETRIES) return;
      img.dataset.retry = String(tries + 1);

      const base = img.dataset.retryBase ?? current.replace(/([?&])r=\d+$/, "").replace(/[?&]$/, "");
      img.dataset.retryBase = base;

      window.setTimeout(() => {
        img.removeAttribute("srcset");
        img.src = `${base}${base.includes("?") ? "&" : "?"}r=${tries + 1}`;
      }, 1500 * (tries + 1));
    };

    // "error" does not bubble, so listen in the capture phase.
    document.addEventListener("error", onError, true);
    return () => document.removeEventListener("error", onError, true);
  }, []);

  return null;
}
