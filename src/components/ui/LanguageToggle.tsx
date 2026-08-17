"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/types";

const langs: Language[] = ["pl", "en"];

const langLabels: Record<Language, string> = {
  pl: "Polski",
  en: "English",
};

export function LanguageToggle({ onBar = false }: { onBar?: boolean }) {
  const { language, setLanguage, isTransitioning } = useLanguage();

  return (
    <div
      className={[
        "flex items-center gap-1.5 font-body text-[11px] font-medium uppercase tracking-[0.2em]",
        onBar ? "" : "[text-shadow:0_1px_5px_rgba(0,0,0,0.45)]",
      ].join(" ")}
      role="group"
      aria-label="Language"
    >
      {langs.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-full border text-[10px] transition-all duration-200",
            language === lang
              ? "border-[color-mix(in_srgb,var(--theme-accent)_45%,transparent)] bg-[var(--theme-btn-primary)] text-[var(--theme-btn-text,var(--theme-text))]"
              : "border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] text-theme-muted/70 hover:border-[color-mix(in_srgb,var(--theme-border)_40%,transparent)] hover:text-theme-muted",
          ].join(" ")}
          aria-pressed={language === lang}
          aria-label={langLabels[lang]}
        >
          <motion.span
            animate={{ opacity: isTransitioning ? 0.3 : 1 }}
            transition={{ duration: 0.35 }}
          >
            {lang}
          </motion.span>
        </button>
      ))}
    </div>
  );
}
