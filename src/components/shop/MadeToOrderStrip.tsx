"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { MADE_TO_ORDER_DETAIL_HREF } from "@/lib/customOrderContent";
import { madeToOrderCollection } from "@/lib/lookbookCollections";

export function MadeToOrderStrip() {
  const { language } = useLanguage();
  const name = pickBilingual(madeToOrderCollection.name, madeToOrderCollection.name, language);
  const subtitle = pickBilingual(
    madeToOrderCollection.subtitle,
    madeToOrderCollection.subtitle,
    language
  );
  const cta = language === "pl" ? "Szczegóły" : "Details";

  return (
    <Link
      href={MADE_TO_ORDER_DETAIL_HREF}
      className="group flex items-center justify-between gap-4 border-y border-[var(--lookbook-line)] px-5 py-5 transition-colors hover:bg-[color-mix(in_srgb,var(--lookbook-ink)_4%,var(--lookbook-bg))] sm:px-8 sm:py-6 lg:px-10"
    >
      <div className="min-w-0">
        <p className="lookbook-ink font-display text-[clamp(0.95rem,2vw,1.15rem)] uppercase tracking-[0.06em]">
          {name}
        </p>
        <p className="lookbook-section-muted mt-1 font-body text-xs leading-relaxed sm:text-[13px]">
          {subtitle}
        </p>
      </div>
      <span className="shrink-0 font-body text-[10px] uppercase tracking-[0.22em] lookbook-ink transition-transform group-hover:translate-x-0.5">
        {cta} →
      </span>
    </Link>
  );
}
