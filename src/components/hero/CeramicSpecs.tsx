"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";

/** Level 3 — meta specifications */
export function CeramicSpecs({ className = "" }: { className?: string }) {
  const { language, isTransitioning } = useLanguage();
  const { specs } = siteContent;

  return (
    <motion.aside
      className={`pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7 }}
      aria-label="Material specifications"
    >
      {/* Mobile — compact 2×2 grid */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 lg:hidden">
        {specs.map((spec) => (
          <li key={spec.value} className="flex flex-col gap-0.5">
            <span className="font-body text-[9px] tracking-[0.18em] text-[#E5E5E5]/55">
              {spec.label[language]}
            </span>
            <span className="font-body text-[10px] tracking-[0.04em] text-[#EDE8DF]/90">
              {spec.value}
            </span>
          </li>
        ))}
      </ul>

      {/* Desktop — vertical rail */}
      <ul className="hidden space-y-2.5 border-l border-[#EDE8DF]/20 pl-4 lg:block">
        {specs.map((spec) => (
          <li key={spec.value} className="flex flex-col gap-0.5">
            <span className="font-body text-[10px] tracking-[0.22em] text-[#E5E5E5]/55">
              {spec.label[language]}
            </span>
            <span className="font-body text-[11px] tracking-[0.06em] text-[#EDE8DF]/90">
              {spec.value}
            </span>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
