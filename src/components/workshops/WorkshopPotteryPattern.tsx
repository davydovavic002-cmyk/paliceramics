"use client";

import Image from "next/image";

const ASSETS = [
  { src: "/images/workshops/bowl-outline.png", width: 72, tint: false },
  { src: "/images/workshops/cup-silhouette.png", width: 54, tint: false },
  { src: "/images/workshops/cups-pair.png", width: 88, tint: true },
] as const;

/** Edge/corner only — center stays clear for the booking form */
const placements = [
  { asset: 0, top: "2%", left: "1%", rotate: -12, opacity: 0.22 },
  { asset: 2, top: "6%", left: "9%", rotate: 8, opacity: 0.18 },
  { asset: 1, top: "3%", left: "90%", rotate: 14, opacity: 0.2 },
  { asset: 0, top: "8%", left: "94%", rotate: -6, opacity: 0.16 },
  { asset: 1, top: "32%", left: "0%", rotate: -18, opacity: 0.17 },
  { asset: 2, top: "48%", left: "2%", rotate: 5, opacity: 0.14 },
  { asset: 0, top: "68%", left: "1%", rotate: 16, opacity: 0.15 },
  { asset: 2, top: "36%", left: "93%", rotate: -10, opacity: 0.16 },
  { asset: 1, top: "52%", left: "95%", rotate: 12, opacity: 0.14 },
  { asset: 0, top: "70%", left: "91%", rotate: -8, opacity: 0.15 },
  { asset: 2, top: "86%", left: "4%", rotate: -14, opacity: 0.18 },
  { asset: 1, top: "90%", left: "11%", rotate: 6, opacity: 0.14 },
  { asset: 0, top: "88%", left: "86%", rotate: 10, opacity: 0.16 },
  { asset: 2, top: "92%", left: "93%", rotate: -7, opacity: 0.15 },
] as const;

export function WorkshopPotteryPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {placements.map((p, i) => {
        const asset = ASSETS[p.asset];
        return (
          <div
            key={i}
            className="workshop-pattern-piece absolute"
            style={{
              top: p.top,
              left: p.left,
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <Image
              src={asset.src}
              alt=""
              width={asset.width * 2}
              height={asset.width * 2}
              draggable={false}
              unoptimized
              className={[
                "h-auto max-w-none select-none",
                asset.tint ? "workshop-pattern-tint" : "",
              ].join(" ")}
              style={{ width: asset.width, height: "auto" }}
            />
          </div>
        );
      })}
    </div>
  );
}
