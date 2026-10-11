"use client";

import Link from "next/link";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { MADE_TO_ORDER_DETAIL_HREF } from "@/lib/customOrderContent";
import { appendReturnTo, HOME_LOOKBOOK_RETURN_TO } from "@/lib/shopReturnTo";

export function MadeToOrderStrip() {
  const { t } = useSiteTexts();
  const name = t("mto.label");
  const subtitle = t("mto.cardSubtitle");
  const detail = t("mto.stripDetail");
  const copy = { price: t("mto.stripPrice"), cta: t("mto.stripCta") };

  return (
    <div className="mb-6 w-full min-w-0 sm:mb-8 lg:mb-10">
      <Link
        href={appendReturnTo(MADE_TO_ORDER_DETAIL_HREF, HOME_LOOKBOOK_RETURN_TO)}
        className={[
          "made-to-order-card group flex w-full min-w-0 flex-col gap-3 px-5 py-5",
          "sm:gap-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 lg:px-8 lg:py-6",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#faf7f0]",
        ].join(" ")}
      >
        <div className="min-w-0">
          <p className="made-to-order-card__muted font-body text-[11px] uppercase tracking-[0.28em]">
            {subtitle}
          </p>
          <h3 className="mt-1 break-words font-display text-lg uppercase leading-tight tracking-[0.06em] sm:text-xl sm:tracking-[0.08em] lg:text-[1.35rem]">
            {name}
          </h3>
          <p className="made-to-order-card__muted mt-1 max-w-xl font-body text-xs leading-relaxed sm:text-sm">
            {detail}
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col items-stretch gap-3 md:w-auto md:shrink-0 md:flex-row md:items-center md:justify-end md:gap-6">
          <span className="made-to-order-card__muted font-body text-[11px] uppercase tracking-[0.2em]">
            {copy.price}
          </span>
          <span className="made-to-order-card__cta inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full bg-transparent px-6 py-2.5 text-center font-body text-[11px] uppercase tracking-[0.22em] text-[#faf7f0] md:w-auto">
            {copy.cta}
            <span aria-hidden className="made-to-order-card__arrow inline-block">
              →
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}
