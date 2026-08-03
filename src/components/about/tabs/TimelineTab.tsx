"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { timelineEntries, t } from "@/lib/aboutContent";

function TimelineItem({
  entry,
  index,
}: {
  entry: (typeof timelineEntries)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { language } = useLanguage();
  const isLast = index === timelineEntries.length - 1;

  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-1 sm:grid-cols-[6rem_1fr] sm:gap-x-10"
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {!isLast ? (
        <div
          className="absolute left-[2.15rem] top-10 bottom-0 w-px bg-[#3d3835]/15 sm:left-[2.95rem]"
          aria-hidden
        />
      ) : null}

      <div className="relative z-[1] flex flex-col items-center pt-1">
        <span className="font-display text-[11px] tracking-[0.2em] text-[#3d3835]/55 sm:text-xs">
          {entry.year}
        </span>
        <motion.span
          className="mt-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#3d3835]/20 bg-[#F7F3EC] font-display text-sm text-[#3d3835]/80 shadow-[0_8px_24px_rgba(61,56,53,0.08)]"
          initial={{ scale: 0.6 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.15, type: "spring", stiffness: 220 }}
        >
          {entry.kanji}
        </motion.span>
      </div>

      <article className="pb-12 sm:pb-16">
        <h3 className="font-display text-xl tracking-[0.04em] text-[#2a2826] sm:text-2xl">
          {t(entry.title, language)}
        </h3>
        <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-[#3d3835]/78 sm:text-[15px]">
          {t(entry.body, language)}
        </p>
      </article>
    </motion.div>
  );
}

export function TimelineTab() {
  const { language } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-1">
      <p className="mb-10 font-sans text-[11px] uppercase tracking-[0.28em] text-[#3d3835]/50">
        {language === "en" ? "Interactive diary" : "Interaktywny dziennik"}
      </p>
      <div className="relative">
        {timelineEntries.map((entry, index) => (
          <TimelineItem key={entry.year} entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
}
