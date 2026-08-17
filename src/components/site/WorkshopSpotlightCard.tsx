"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAdminSiteCopy } from "@/context/AdminDataContext";
import { handleSectionClick } from "@/lib/scrollToSection";

export function WorkshopSpotlightCard() {
  const { language } = useLanguage();
  const siteCopy = useAdminSiteCopy();

  if (!siteCopy?.spotlight.enabled) return null;

  const { spotlight } = siteCopy;

  return (
    <div className="pointer-events-auto mb-10 rounded-[2px] border border-[color-mix(in_srgb,var(--theme-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface-accent)_55%,transparent)] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.15)] backdrop-blur-sm sm:p-6">
      <p className="font-body text-[10px] uppercase tracking-[0.24em] text-[color-mix(in_srgb,var(--theme-accent)_90%,var(--theme-text))]">
        {spotlight.badge[language]}
      </p>
      <h3 className="mt-2 font-display text-xl tracking-[0.04em] text-theme sm:text-2xl">
        {spotlight.title[language]}
      </h3>
      <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-theme-muted">
        {spotlight.body[language]}
      </p>
      {spotlight.href ? (
        <a
          href={spotlight.href}
          onClick={(e) =>
            spotlight.href.startsWith("#")
              ? handleSectionClick(e, spotlight.href)
              : undefined
          }
          className="mt-4 inline-block font-body text-[10px] uppercase tracking-[0.22em] text-theme underline decoration-[color-mix(in_srgb,var(--theme-border)_50%,transparent)] underline-offset-4 transition-colors hover:decoration-[var(--theme-accent)]"
        >
          {language === "pl" ? "Dowiedz się więcej" : "Learn more"}
        </a>
      ) : null}
    </div>
  );
}
