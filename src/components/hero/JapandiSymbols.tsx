"use client";

import Image from "next/image";

const SYMBOLS = {
  vase: "/images/symbols/vase.png",
  bowl: "/images/symbols/bowl.png",
  cup: "/images/symbols/cup.png",
  branch: "/images/symbols/branch.png",
  bird: "/images/symbols/bird.png",
  plate: "/images/symbols/plate.png",
  pitcher: "/images/symbols/pitcher.png",
  pebble: "/images/symbols/pebble.png",
  pot: "/images/symbols/pot.png",
} as const;

type SymbolId = keyof typeof SYMBOLS;

type ScatterItem = {
  symbol: SymbolId;
  top?: string;
  left?: string;
  right?: string;
  width: number;
  rotate: number;
  opacity: number;
  delay: number;
};

/** Fewer, larger — pre-cut PNG silhouettes */
const heroPlacements: ScatterItem[] = [
  { symbol: "vase", top: "12%", left: "4%", width: 96, rotate: -8, opacity: 0.14, delay: 0 },
  { symbol: "branch", top: "48%", left: "2%", width: 110, rotate: -14, opacity: 0.1, delay: 1.0 },
  { symbol: "bowl", top: "62%", right: "5%", width: 100, rotate: 6, opacity: 0.11, delay: 0.3 },
  { symbol: "pot", top: "78%", left: "10%", width: 92, rotate: -5, opacity: 0.09, delay: 1.4 },
];

const lightPlacements: ScatterItem[] = [
  { symbol: "cup", top: "10%", right: "5%", width: 72, rotate: 10, opacity: 0.07, delay: 0 },
  { symbol: "plate", top: "75%", right: "6%", width: 80, rotate: 5, opacity: 0.06, delay: 0.8 },
];

function SymbolImage({
  symbol,
  width,
  variant,
}: {
  symbol: SymbolId;
  width: number;
  variant: "dark" | "light";
}) {
  return (
    <Image
      src={SYMBOLS[symbol]}
      alt=""
      width={200}
      height={200}
      draggable={false}
      className="h-auto max-w-none select-none"
      style={{
        width,
        height: "auto",
        opacity: variant === "light" ? 0.55 : 1,
        filter: variant === "light" ? "brightness(0.45) contrast(0.95)" : undefined,
      }}
    />
  );
}

function SymbolScatter({
  items,
  variant = "dark",
}: {
  items: ScatterItem[];
  variant?: "dark" | "light";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden" aria-hidden>
      {items.map((item, i) => (
        <div
          key={`${item.symbol}-${i}`}
          className="absolute w-fit animate-float"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            opacity: item.opacity,
            transform: `rotate(${item.rotate}deg)`,
            animationDelay: `${item.delay}s`,
          }}
        >
          <SymbolImage symbol={item.symbol} width={item.width} variant={variant} />
        </div>
      ))}
    </div>
  );
}

export function JapandiSymbolScatter() {
  return <SymbolScatter items={heroPlacements} variant="dark" />;
}

export function LightSectionSymbolScatter() {
  return <SymbolScatter items={lightPlacements} variant="light" />;
}
