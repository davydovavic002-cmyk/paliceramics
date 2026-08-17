import type { MotionLevel } from "@/lib/demoPresets";

type RevealOptions = {
  delay?: number;
  y?: number;
};

/** Smooth editorial ease — no bounce */
export const MODERN_EASE = [0.16, 1, 0.3, 1] as const;

/** Scroll reveal only for immersive — triggers when section is actually on screen */
const SCROLL_VIEWPORT = { once: true, amount: 0.12, margin: "0px 0px -6% 0px" as const };

export function getRevealProps(motionLevel: MotionLevel, options: RevealOptions = {}) {
  const { delay = 0 } = options;

  // Default (tactile/minimal): no scroll-triggered motion — feels dated on long pages
  if (motionLevel !== "immersive") return null;

  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: SCROLL_VIEWPORT,
    transition: { duration: 0.38, delay, ease: MODERN_EASE },
  };
}

export function getFadeInProps(motionLevel: MotionLevel, delay = 0) {
  if (motionLevel === "immersive") {
    return {
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.65, delay, ease: MODERN_EASE },
    };
  }

  // tactile / minimal — visible on first paint, no load fade that can stick
  return {
    initial: false as const,
    animate: { opacity: 1 },
  };
}

export function getMenuPanelProps(motionLevel: MotionLevel) {
  if (motionLevel === "minimal") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    };
  }

  return {
    initial: { opacity: 0, y: -4, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -3, scale: 0.99 },
    transition: { duration: 0.22, ease: MODERN_EASE },
  };
}

export function getExpandProps(motionLevel: MotionLevel) {
  if (motionLevel === "minimal") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    };
  }

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.22, ease: MODERN_EASE },
  };
}

export function hoverScaleClass(motionLevel: MotionLevel) {
  if (motionLevel === "minimal") return "";
  return motionLevel === "immersive"
    ? "transition-transform duration-500 group-hover:scale-[1.03]"
    : "transition-transform duration-300 group-hover:scale-[1.015]";
}

export function staggerStep(index: number, step = 0.04, cap = 0.2) {
  return Math.min(index * step, cap);
}
