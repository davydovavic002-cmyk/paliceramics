"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/types";

const langs: Language[] = ["pl", "en"];

const langLabels: Record<Language, string> = {
  pl: "Polski",
  en: "English",
};

const langActiveClass =
  "border-[color-mix(in_srgb,#010a8b_55%,transparent)] bg-[#010a8b] text-[#ede8df]";
const langIdleClass =
  "border-[color-mix(in_srgb,#010a8b_22%,transparent)] text-theme-muted/80 hover:border-[color-mix(in_srgb,#010a8b_35%,transparent)] hover:text-theme";

export function LanguageToggle({
  onBar = false,
  heroOverlay = false,
}: {
  onBar?: boolean;
  heroOverlay?: boolean;
}) {
  const { language, setLanguage, isTransitioning } = useLanguage();

  return (
    <div
      className={[
        "header-controls font-body text-[11px] font-medium uppercase",
        heroOverlay ? "[text-shadow:0_1px_5px_rgba(0,0,0,0.45)]" : "",
      ].join(" ")}
      role="group"
      aria-label="Language"
    >
      {langs.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          data-active={language === lang || undefined}
          className={[
            "header-lang-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border p-0 font-body text-[10px] font-medium uppercase leading-none tracking-normal transition-all duration-200",
            language === lang ? langActiveClass : langIdleClass,
          ].join(" ")}
          aria-pressed={language === lang}
          aria-label={langLabels[lang]}
        >
          <motion.span
            className="block leading-none"
            animate={{ opacity: isTransitioning ? 0.35 : 1 }}
            transition={{ duration: 0.35 }}
          >
            {lang}
          </motion.span>
        </button>
      ))}
    </div>
  );
}
