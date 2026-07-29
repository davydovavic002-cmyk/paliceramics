"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/types";

const langs: Language[] = ["en", "pl"];

export function LanguageToggle() {
  const { language, setLanguage, isTransitioning } = useLanguage();

  return (
    <div
      className="flex items-center gap-0 font-body text-[11px] font-medium uppercase tracking-[0.2em] [text-shadow:0_1px_5px_rgba(0,0,0,0.45)]"
      role="group"
      aria-label="Language"
    >
      {langs.map((lang, i) => (
        <span key={lang} className="inline-flex items-center">
          {i > 0 ? (
            <span className="mx-2 text-[#F0F0F0]/35" aria-hidden>
              ·
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLanguage(lang)}
            className={`transition-colors duration-200 ${
              language === lang
                ? "text-[#FAFAFA]"
                : "text-[#F0F0F0]/50 hover:text-[#F0F0F0]/80"
            }`}
            aria-pressed={language === lang}
          >
            <motion.span
              animate={{ opacity: isTransitioning ? 0.3 : 1 }}
              transition={{ duration: 0.35 }}
            >
              {lang}
            </motion.span>
          </button>
        </span>
      ))}
    </div>
  );
}
