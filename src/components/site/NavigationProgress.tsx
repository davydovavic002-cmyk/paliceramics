"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Instant feedback for page changes: a thin bar appears the moment a visitor taps an internal
 * link and finishes when the new page has rendered. Without it a slow page looks like a dead
 * tap, so people tap again.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      clearTimers();
      setPhase("loading");
      /* safety net: never leave the bar hanging if the navigation is cancelled */
      timers.current.push(window.setTimeout(() => setPhase("idle"), 10000));
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    setPhase((current) => {
      if (current !== "loading") return current;
      return "done";
    });
    clearTimers();
    timers.current.push(window.setTimeout(() => setPhase("idle"), 400));
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]"
      style={{ opacity: phase === "done" ? 0 : 1, transition: "opacity 0.3s ease-out 0.1s" }}
    >
      <div
        className="h-full bg-[#010a8b]"
        style={{
          width: phase === "done" ? "100%" : "78%",
          transition: phase === "done" ? "width 0.15s ease-out" : "width 8s cubic-bezier(0.1, 0.6, 0.2, 1)",
        }}
      />
    </div>
  );
}
