"use client";

import Image from "next/image";

const STROKES = [
  "/images/strokes/stroke-0.webp",
  "/images/strokes/stroke-1.webp",
  "/images/strokes/stroke-2.webp",
  "/images/strokes/stroke-3.webp",
] as const;

const STROKE_INK = "#010A8B";

type Placement = {
  stroke: 0 | 1 | 2 | 3;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  flipX?: boolean;
  opacity: number;
  blur: number;
  driftSec: number;
  driftDelay: number;
};

/** Chaotic hakeme — PNG assets are already brand blue; no CSS filter tint. */
const desktopPlacements: Placement[] = [
  { stroke: 0, top: "5%", left: "2%", width: 318, rotate: -41.5, scaleX: 1.12, scaleY: 0.88, skewX: -4, opacity: 0.4, blur: 0.35, driftSec: 19, driftDelay: 0 },
  { stroke: 2, top: "11%", right: "8%", width: 274, rotate: 47.3, scaleX: 0.94, scaleY: 1.08, skewX: 6, flipX: true, opacity: 0.22, blur: 0.5, driftSec: 24, driftDelay: 1.2 },
  { stroke: 1, top: "24%", left: "14%", width: 402, rotate: 9.8, scaleX: 1.18, scaleY: 0.92, skewX: -7, opacity: 0.38, blur: 0.25, driftSec: 21, driftDelay: 2.4 },
  { stroke: 3, top: "19%", right: "-4%", width: 356, rotate: -27.6, scaleX: 1.05, scaleY: 1.14, skewX: 5, opacity: 0.18, blur: 0.4, driftSec: 17, driftDelay: 0.8 },
  { stroke: 2, top: "39%", left: "-7%", width: 438, rotate: 31.2, scaleX: 0.9, scaleY: 1.06, skewX: -9, flipX: true, opacity: 0.28, blur: 0.55, driftSec: 26, driftDelay: 3.1 },
  { stroke: 0, top: "44%", right: "16%", width: 292, rotate: -52.4, scaleX: 1.15, scaleY: 0.86, skewX: 8, opacity: 0.34, blur: 0.3, driftSec: 20, driftDelay: 1.7 },
  { stroke: 3, top: "54%", left: "28%", width: 236, rotate: 58.7, scaleX: 1.08, scaleY: 0.95, skewX: -11, opacity: 0.2, blur: 0.45, driftSec: 23, driftDelay: 4.2 },
  { stroke: 1, top: "63%", right: "3%", width: 384, rotate: -8.3, scaleX: 0.97, scaleY: 1.12, skewX: 4, flipX: true, opacity: 0.36, blur: 0.35, driftSec: 18, driftDelay: 2.9 },
  { stroke: 0, bottom: "16%", left: "5%", width: 334, rotate: 38.1, scaleX: 1.1, scaleY: 0.9, skewX: -6, opacity: 0.24, blur: 0.5, driftSec: 25, driftDelay: 5.0 },
  { stroke: 2, bottom: "6%", right: "10%", width: 416, rotate: -61.2, scaleX: 1.06, scaleY: 1.04, skewX: 10, opacity: 0.3, blur: 0.4, driftSec: 22, driftDelay: 3.6 },
];

/** Edge-only layout for <768px — keep the centre clear for hero copy. */
const mobilePlacements: Placement[] = [
  { stroke: 0, top: "2.5rem", left: "-3rem", width: 200, rotate: -38, scaleX: 1.04, scaleY: 0.9, skewX: -4, opacity: 0.34, blur: 0.4, driftSec: 19, driftDelay: 0 },
  { stroke: 2, top: "2.5rem", right: "-3rem", width: 180, rotate: 44, scaleX: 0.94, scaleY: 1.04, skewX: 6, flipX: true, opacity: 0.28, blur: 0.5, driftSec: 24, driftDelay: 1.2 },
  { stroke: 1, top: "42%", left: "-4rem", width: 196, rotate: 16, scaleX: 1.08, scaleY: 0.92, skewX: -6, opacity: 0.3, blur: 0.35, driftSec: 21, driftDelay: 2.4 },
  { stroke: 3, top: "38%", right: "-3.5rem", width: 188, rotate: -26, scaleX: 1.02, scaleY: 1.06, skewX: 5, opacity: 0.26, blur: 0.4, driftSec: 17, driftDelay: 0.8 },
  { stroke: 2, bottom: "2.5rem", left: "-3rem", width: 200, rotate: 32, scaleX: 0.92, scaleY: 1.02, skewX: -8, flipX: true, opacity: 0.3, blur: 0.5, driftSec: 26, driftDelay: 3.1 },
  { stroke: 0, bottom: "2.5rem", right: "-3rem", width: 210, rotate: -48, scaleX: 1.06, scaleY: 0.88, skewX: 8, opacity: 0.32, blur: 0.35, driftSec: 20, driftDelay: 1.7 },
];

function strokeTransform(p: Placement) {
  const sx = p.scaleX * (p.flipX ? -1 : 1);
  return `rotate(${p.rotate}deg) scale(${sx}, ${p.scaleY}) skewX(${p.skewX}deg)`;
}

function StrokeImage({
  stroke,
  width,
  sizes,
}: {
  stroke: number;
  width: number;
  sizes: string;
}) {
  return (
    <Image
      src={STROKES[stroke]}
      alt=""
      width={682}
      height={256}
      sizes={sizes}
      draggable={false}
      loading="lazy"
      className="h-auto max-w-none select-none"
      style={{ width, height: "auto" }}
    />
  );
}

function StrokeLayer({
  placements,
  className,
  sizes,
  markClassName,
}: {
  placements: Placement[];
  className?: string;
  sizes: string;
  markClassName?: string;
}) {
  return (
    <div
      className={["pointer-events-none absolute inset-0 z-[3] overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      style={{ color: STROKE_INK }}
      aria-hidden
    >
      {placements.map((s, i) => (
        <div
          key={i}
          className={["absolute w-fit motion-drift animate-stroke-drift-organic", markClassName]
            .filter(Boolean)
            .join(" ")}
          style={{
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            opacity: s.opacity,
            animationDuration: `${s.driftSec}s`,
            animationDelay: `${s.driftDelay}s`,
          }}
        >
          <div
            style={{
              transform: strokeTransform(s),
              filter: `blur(${s.blur}px)`,
            }}
          >
            <StrokeImage stroke={s.stroke} width={s.width} sizes={sizes} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HakemeStrokes() {
  return (
    <>
      <StrokeLayer
        placements={desktopPlacements}
        className="hidden md:block"
        sizes="440px"
      />
      <StrokeLayer
        placements={mobilePlacements}
        className="md:hidden"
        sizes="200px"
        markClassName="origin-center scale-75"
      />
    </>
  );
}
