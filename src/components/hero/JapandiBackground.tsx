"use client";

/** Paper-grain wash — no bright radial glows */
export function JapandiBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden />
  );
}
