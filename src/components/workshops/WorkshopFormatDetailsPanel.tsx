"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { WorkshopMkCopyBlock } from "@/lib/workshopMkCopy";

type WorkshopFormatDetailsPanelProps = {
  format: WorkshopMkCopyBlock;
  /** Live booking uses balanced scroll; compact/demo for previews. */
  variant?: "compact" | "balanced" | "demo";
};

export function WorkshopFormatDetailsPanel({
  format,
  variant = "balanced",
}: WorkshopFormatDetailsPanelProps) {
  const { language } = useLanguage();
  const scrollClass =
    variant === "compact"
      ? "max-h-[7.25rem] sm:max-h-[8rem]"
      : variant === "balanced"
        ? "max-h-[9.75rem] sm:max-h-[11rem]"
        : "max-h-[min(32vh,13rem)]";

  return (
    <div className="workshop-mk-details-panel rounded-xl border border-[color-mix(in_srgb,var(--theme-border)_12%,transparent)] bg-white/95">
      <div className="border-b border-[color-mix(in_srgb,var(--theme-border)_8%,transparent)] px-3.5 py-2.5 sm:px-4">
        <p className="font-body text-[9px] uppercase tracking-[0.18em] text-theme-muted">
          {language === "pl" ? "Szczegóły" : "Details"}
        </p>
        <p className="mt-0.5 font-display text-sm text-theme">{format.title[language]}</p>
      </div>
      <div className="flex items-baseline justify-end border-b border-[color-mix(in_srgb,var(--theme-border)_8%,transparent)] px-3.5 py-2 sm:px-4">
        <p className="font-body text-[11px] tracking-[0.04em] text-theme">{format.priceLine[language]}</p>
      </div>
      <div
        className={`workshop-mk-details-scroll workshop-mk-details-scroll-fade ${scrollClass} overflow-y-auto px-3.5 py-3 sm:px-4`}
      >
        <div className="space-y-2.5">
          {format.paragraphs[language].map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="font-body text-[11px] leading-[1.62] text-theme-muted sm:text-[12px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
