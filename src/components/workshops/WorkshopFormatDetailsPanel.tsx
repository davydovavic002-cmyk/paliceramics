"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { WorkshopMkCopyBlock } from "@/lib/workshopMkCopy";
import { RichText } from "@/components/ui/RichText";

type WorkshopFormatDetailsPanelProps = {
  format: WorkshopMkCopyBlock;
};

export function WorkshopFormatDetailsPanel({
  format,
}: WorkshopFormatDetailsPanelProps) {
  const { language } = useLanguage();

  return (
    <div className="workshop-mk-details-panel rounded-xl border border-[color-mix(in_srgb,var(--theme-border)_12%,transparent)] bg-white/95">
      <div className="border-b border-[color-mix(in_srgb,var(--theme-border)_8%,transparent)] px-3 py-2 sm:px-3.5">
        <p className="font-body text-[11px] uppercase tracking-[0.18em] text-theme-muted">
          {language === "pl" ? "Szczegóły" : "Details"}
        </p>
        <p className="mt-0.5 font-display text-lg text-theme">{format.title[language]}</p>
      </div>
      <div className="flex items-baseline justify-end border-b border-[color-mix(in_srgb,var(--theme-border)_8%,transparent)] px-3 py-1.5 sm:px-3.5">
        <p className="font-body text-[13px] tracking-[0.04em] text-theme">{format.priceLine[language]}</p>
      </div>
      <div className="px-4 py-3 sm:px-5 sm:py-4">
        <div className="space-y-3">
          {format.paragraphs[language].map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="whitespace-pre-line font-body text-base leading-relaxed text-theme sm:text-[17px]"
            >
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
