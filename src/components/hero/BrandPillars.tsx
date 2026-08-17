"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";

export function BrandPillars() {
  const { language, isTransitioning } = useLanguage();
  const { pillars } = siteContent;

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.35 },
  };

  return (
    <section
      id="atelier"
      className="relative border-y border-porcelain/[0.06] bg-[#323234] py-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-5xl gap-14 px-8 md:grid-cols-3 lg:gap-10 lg:px-16">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.kanji}
            className="flex flex-col items-start gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7 }}
            animate={fade}
          >
            <span className="font-display text-3xl text-porcelain/25">{pillar.kanji}</span>
            <h3 className="font-display text-lg tracking-[0.08em] text-porcelain/70">
              {pillar.title[language]}
            </h3>
            <p className="font-body text-sm leading-[1.85] tracking-[0.03em] text-porcelain/40">
              {pillar.text[language]}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
