"use client";

import { motion } from "framer-motion";
import { JapandiMicroMark, type MicroVariant } from "@/components/ui/JapandiMicroMark";

const CX = 200;
const CY = 168;
const R = 112;

const MARKS: { variant: MicroVariant; angle: number; rotate: number }[] = [
  { variant: "earth", angle: 228, rotate: -18 },
  { variant: "fire", angle: 270, rotate: 0 },
  { variant: "vessel", angle: 312, rotate: 18 },
];

function polar(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

export function HeroArcTitle() {
  const left = polar(218);
  const right = polar(322);

  return (
    <motion.header
      className="relative z-10 flex w-[min(92vw,420px)] flex-col items-center text-theme"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="sr-only">Pali ceramics</h1>

      <svg
        viewBox="0 0 400 96"
        className="box-content h-[clamp(3rem,10vw,4.75rem)] w-full overflow-visible text-theme"
        aria-hidden
      >
        <path
          d={`M ${left.x} ${left.y} A ${R} ${R} 0 0 1 ${right.x} ${right.y}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="0.5"
        />

        {MARKS.map(({ variant, angle, rotate }) => {
          const { x, y } = polar(angle);
          return (
            <g
              key={variant}
              transform={`translate(${x - 12}, ${y - 12}) rotate(${rotate}, 12, 12)`}
            >
              <JapandiMicroMark variant={variant} size={24} />
            </g>
          );
        })}
      </svg>
    </motion.header>
  );
}
