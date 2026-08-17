/** Shared WebGL performance helpers for hero canvases. */

export function getHeroPixelRatio(): number {
  if (typeof window === "undefined") return 1;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  if (reduced || mobile) return 1;
  return Math.min(window.devicePixelRatio, 1.5);
}

export function createVisibilityAwareLoop(container: HTMLElement, tick: () => void) {
  let raf = 0;
  let active = true;
  let pageVisible = !document.hidden;
  let inView = true;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!active || !pageVisible || !inView) return;
    tick();
  };

  const onVisibility = () => {
    pageVisible = !document.hidden;
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry?.isIntersecting ?? false;
    },
    { rootMargin: "80px 0px" }
  );
  observer.observe(container);

  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(frame);

  return () => {
    active = false;
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
    observer.disconnect();
  };
}
