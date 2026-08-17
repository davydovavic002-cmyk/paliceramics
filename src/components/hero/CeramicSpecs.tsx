"use client";

import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";

/** Level 3 — meta specifications */
export function CeramicSpecs({ className = "" }: { className?: string }) {
  const { language } = useLanguage();
  const { specs } = siteContent;

  return (
    <aside className={`pointer-events-none ${className}`} aria-label="Material specifications">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 lg:hidden">
        {specs.map((spec) => (
          <li key={spec.value} className="flex flex-col gap-0.5">
            <span className="font-body text-[9px] tracking-[0.18em] text-theme-muted">
              {spec.label[language]}
            </span>
            <span className="font-body text-[10px] tracking-[0.04em] text-theme/90">
              {spec.value}
            </span>
          </li>
        ))}
      </ul>

      <ul className="hidden space-y-2.5 border-l border-[color-mix(in_srgb,var(--theme-border)_20%,transparent)] pl-4 lg:block">
        {specs.map((spec) => (
          <li key={spec.value} className="flex flex-col gap-0.5">
            <span className="font-body text-[10px] tracking-[0.22em] text-theme-muted">
              {spec.label[language]}
            </span>
            <span className="font-body text-[11px] tracking-[0.06em] text-theme/90">
              {spec.value}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
