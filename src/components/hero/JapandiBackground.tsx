"use client";

import { siteContent } from "@/lib/content";

/** Paper-grain wash + single large kanji upper-right */
export function JapandiBackground() {
  const { verticalKanji } = siteContent.hero;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 45% at 82% 18%, rgba(210,190,160,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 15% 75%, rgba(180,175,165,0.04) 0%, transparent 50%)
          `,
        }}
      />

      <p
        className="font-display absolute right-4 top-[10%] hidden select-none text-[clamp(5rem,12vw,9rem)] leading-none text-[#F3F4F6]/[0.14] lg:right-10 lg:top-[12%] lg:block xl:right-14"
        style={{ writingMode: "vertical-rl" }}
      >
        {verticalKanji}
      </p>
    </div>
  );
}
