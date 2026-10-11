"use client";

import { useEffect, useState } from "react";

/** Matches Tailwind `lg` — phones and small tablets. */
export function useCompactViewport(breakpointPx = 1023) {
  /* Always start `false` so the first client render matches the server HTML;
     the effect below switches it on right after hydration. */
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpointPx]);

  return compact;
}
