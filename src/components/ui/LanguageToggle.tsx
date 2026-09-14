"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/types";

const langs: Language[] = ["pl", "en"];

const langLabels: Record<Language, string> = {
  pl: "Polski",
  en: "English",
};

const langActiveClass = "border-blue-900 bg-blue-900 text-white";
const langIdleOnDarkHero =
  "border-[color-mix(in_srgb,#ede8df_22%,transparent)] text-[#ede8df] hover:border-[color-mix(in_srgb,#ede8df_40%,transparent)] hover:text-white";
const langIdleOnLight =
  "border-slate-300 text-slate-800 hover:border-slate-400 hover:text-slate-900";

export function LanguageToggle({
  heroOverlay = false,
  menuOpen = false,
}: {
  onBar?: boolean;
  heroOverlay?: boolean;
  menuOpen?: boolean;
}) {
  const { language, setLanguage, isTransitioning } = useLanguage();
  const idleOnDarkHero = heroOverlay && !menuOpen;

  return (
    <div
      className={[
        "header-controls font-body text-[11px] font-medium uppercase",
        idleOnDarkHero ? "[text-shadow:0_1px_5px_rgba(0,0,0,0.45)]" : "",
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
            "header-lang-btn inline-flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border p-0 font-body text-[10px] font-medium uppercase leading-none tracking-normal transition-all duration-200 active:opacity-75 lg:text-[11px]",
            language === lang
              ? langActiveClass
              : idleOnDarkHero
                ? langIdleOnDarkHero
                : langIdleOnLight,
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
