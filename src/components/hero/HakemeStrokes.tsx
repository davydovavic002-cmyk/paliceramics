"use client";

import Image from "next/image";

const STROKES = [
  "/images/strokes/stroke-0.png",
  "/images/strokes/stroke-1.png",
  "/images/strokes/stroke-2.png",
  "/images/strokes/stroke-3.png",
] as const;

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

/** Chaotic hakeme — irregular scale/skew, richer opacity */
const placements: Placement[] = [
  { stroke: 0, top: "5%", left: "2%", width: 318, rotate: -41.5, scaleX: 1.12, scaleY: 0.88, skewX: -4, opacity: 0.52, blur: 0.35, driftSec: 19, driftDelay: 0 },
  { stroke: 2, top: "11%", right: "8%", width: 274, rotate: 47.3, scaleX: 0.94, scaleY: 1.08, skewX: 6, flipX: true, opacity: 0.48, blur: 0.5, driftSec: 24, driftDelay: 1.2 },
  { stroke: 1, top: "24%", left: "14%", width: 402, rotate: 9.8, scaleX: 1.18, scaleY: 0.92, skewX: -7, opacity: 0.55, blur: 0.25, driftSec: 21, driftDelay: 2.4 },
  { stroke: 3, top: "19%", right: "-4%", width: 356, rotate: -27.6, scaleX: 1.05, scaleY: 1.14, skewX: 5, opacity: 0.5, blur: 0.4, driftSec: 17, driftDelay: 0.8 },
  { stroke: 2, top: "39%", left: "-7%", width: 438, rotate: 31.2, scaleX: 0.9, scaleY: 1.06, skewX: -9, flipX: true, opacity: 0.46, blur: 0.55, driftSec: 26, driftDelay: 3.1 },
  { stroke: 0, top: "44%", right: "16%", width: 292, rotate: -52.4, scaleX: 1.15, scaleY: 0.86, skewX: 8, opacity: 0.51, blur: 0.3, driftSec: 20, driftDelay: 1.7 },
  { stroke: 3, top: "54%", left: "28%", width: 236, rotate: 58.7, scaleX: 1.08, scaleY: 0.95, skewX: -11, opacity: 0.44, blur: 0.45, driftSec: 23, driftDelay: 4.2 },
  { stroke: 1, top: "63%", right: "3%", width: 384, rotate: -8.3, scaleX: 0.97, scaleY: 1.12, skewX: 4, flipX: true, opacity: 0.53, blur: 0.35, driftSec: 18, driftDelay: 2.9 },
  { stroke: 0, bottom: "16%", left: "5%", width: 334, rotate: 38.1, scaleX: 1.1, scaleY: 0.9, skewX: -6, opacity: 0.47, blur: 0.5, driftSec: 25, driftDelay: 5.0 },
  { stroke: 2, bottom: "6%", right: "10%", width: 416, rotate: -61.2, scaleX: 1.06, scaleY: 1.04, skewX: 10, opacity: 0.49, blur: 0.4, driftSec: 22, driftDelay: 3.6 },
];

function strokeTransform(p: Placement) {
  const sx = p.scaleX * (p.flipX ? -1 : 1);
  return `rotate(${p.rotate}deg) scale(${sx}, ${p.scaleY}) skewX(${p.skewX}deg)`;
}

function StrokeImage({ stroke, width }: { stroke: number; width: number }) {
  return (
    <Image
      src={STROKES[stroke]}
      alt=""
      width={682}
      height={256}
      draggable={false}
      className="h-auto max-w-none select-none"
      style={{ width, height: "auto" }}
    />
  );
}

export function HakemeStrokes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden max-md:opacity-75 [&>div:nth-child(n+6)]:max-md:hidden"
      aria-hidden
    >
      {placements.map((s, i) => (
        <div
          key={i}
          className="absolute w-fit animate-stroke-drift-organic"
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
              filter: `saturate(1.45) contrast(1.12) blur(${s.blur}px)`,
            }}
          >
            <StrokeImage stroke={s.stroke} width={s.width} />
          </div>
        </div>
      ))}
    </div>
  );
}
