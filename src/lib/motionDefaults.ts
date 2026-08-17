import type { MotionLevel } from "@/lib/demoPresets";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function defaultMotionLevel(): MotionLevel {
  return prefersReducedMotion() ? "minimal" : "tactile";
}
