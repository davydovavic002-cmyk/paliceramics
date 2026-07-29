"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";

/** Compact arc — sits close above the bowl */
const CX = 200;
const CY = 168;
const R = 112;

const GLYPHS = [
  { kanji: "土", angle: 228, rotate: -18 },
  { kanji: "火", angle: 270, rotate: 0 },
  { kanji: "器", angle: 312, rotate: 18 },
] as const;

function polar(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

export function HeroArcTitle() {
  const { language, isTransitioning } = useLanguage();
  const { triadKanji, arcCaption } = siteContent.hero;

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.4 },
  };

  const left = polar(218);
  const right = polar(322);

  return (
    <motion.header
      className="relative z-10 flex w-[min(92vw,420px)] flex-col items-center gap-4 sm:gap-5 lg:gap-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="sr-only">
        {triadKanji.join(" ")} — {arcCaption[language]}
      </h1>

      {/* Level 1 — display */}
      <svg
        viewBox="0 0 400 96"
        className="box-content h-[clamp(3.25rem,11vw,5.25rem)] w-full overflow-visible pb-1 sm:pb-2"
        aria-hidden
      >
        <path
          d={`M ${left.x} ${left.y} A ${R} ${R} 0 0 1 ${right.x} ${right.y}`}
          fill="none"
          stroke="rgba(243,244,246,0.09)"
          strokeWidth="0.5"
        />

        {GLYPHS.map(({ kanji, angle, rotate }) => {
          const { x, y } = polar(angle);
          return (
            <text
              key={kanji}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#F3F4F6"
              fontFamily="var(--font-display)"
              fontSize="36"
              fontWeight="500"
              transform={`rotate(${rotate}, ${x}, ${y})`}
            >
              {kanji}
            </text>
          );
        })}
      </svg>

      {/* Level 2 — caption */}
      <motion.p
        key={`arc-cap-${language}`}
        className="font-body text-[10px] tracking-[0.22em] text-[#E8E8E8] sm:text-[12px] sm:tracking-[0.28em]"
        animate={fade}
        aria-hidden
      >
        {arcCaption[language]}
      </motion.p>
    </motion.header>
  );
}
