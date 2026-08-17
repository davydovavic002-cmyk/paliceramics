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
          className="absolute left-[2.15rem] top-10 bottom-0 w-px bg-[#EDE8DF]/15 sm:left-[2.95rem]"
          aria-hidden
        />
      ) : null}

      <div className="relative z-[1] flex flex-col items-center pt-1">
        <span className="font-body text-[11px] tracking-[0.22em] text-[#E5E5E5]/50 sm:text-xs">
          {entry.year}
        </span>
        <motion.span
          className="mt-3 flex h-10 w-10 items-center justify-center rounded-[2px] border-2 border-[#5a6a82]/45 bg-[#2c3444] font-display text-sm text-[#EDE8DF] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.22)]"
          initial={{ scale: 0.6 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.15, type: "spring", stiffness: 220 }}
        >
          {entry.kanji}
        </motion.span>
      </div>

      <article className="border-l border-[#EDE8DF]/10 pb-12 pl-0 sm:pb-16 sm:pl-2">
        <h3 className="font-display text-xl tracking-[0.06em] text-[#FAFAFA] sm:text-2xl">
          {t(entry.title, language)}
        </h3>
        <p className="mt-3 max-w-lg font-body text-sm leading-relaxed tracking-[0.02em] text-[#E8E8E8]/75 sm:text-[15px]">
          {t(entry.body, language)}
        </p>
      </article>
    </motion.div>
  );
}

export function TimelineTab() {
  const { language } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl rounded-[2px] border border-[#EDE8DF]/10 bg-[#323234]/40 p-6 sm:p-10">
      <p className="mb-10 font-body text-[10px] uppercase tracking-[0.28em] text-[#E5E5E5]/45">
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
