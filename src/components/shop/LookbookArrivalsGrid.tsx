"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { useLanguage } from "@/context/LanguageContext";
import { collectionToLookbook, getLookbookCollections } from "@/lib/catalogConfig";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { LookbookCollectionCover } from "./LookbookCollectionCover";
import { MadeToOrderStrip } from "./MadeToOrderStrip";
import { RichText } from "@/components/ui/RichText";

function collectionDividerClass(index: number) {
  if (index === 0) return "lookbook-split-r lookbook-split-b";
  if (index === 1) return "lookbook-split-b";
  if (index === 2) return "lookbook-split-r";
  return "";
}

export function LookbookArrivalsGrid() {
  const { language } = useLanguage();
  const { collections } = useShopCatalog();
  const shopCollections = useMemo(
    () => getLookbookCollections(collections).map((collection) => collectionToLookbook(collection)),
    [collections]
  );

  const { t } = useSiteTexts();
  const copy = {
    title: t("collections.title"),
    seeAll: language === "pl" ? "Zobacz wszystkie" : "See all",
    headline: t("collections.headline"),
    cta: t("collections.cta"),
  };

  return (
    <div className="w-full pb-0">
      <div className="mx-auto max-w-[1800px] px-4 pb-5 sm:px-6 lg:px-8">
        <h2 className="lookbook-ink font-display text-2xl uppercase leading-none tracking-[0.08em] sm:text-4xl lg:text-5xl">
          {copy.title}
        </h2>
      </div>

      <div className="lookbook-full-bleed">
        <MotionReveal>
          <div className="lookbook-grid lookbook-collections-grid grid grid-cols-2 gap-0 lg:grid-cols-3 lg:grid-rows-2">
            <div className="col-span-2 flex min-h-[220px] flex-col justify-start gap-5 p-5 sm:gap-6 sm:p-6 lg:col-span-1 lg:row-span-2 lg:min-h-0 lg:justify-between lg:p-8 lookbook-split-r lookbook-split-b lg:border-b-0">
              <div>
                <p className="lookbook-ink break-words font-display text-[clamp(1.25rem,2.5vw,1.75rem)] uppercase leading-snug tracking-[0.05em]">
                  {copy.headline}
                </p>
                <p className="lookbook-section-muted mt-3 max-w-md font-body text-sm leading-relaxed sm:mt-4 sm:text-[15px]">
                  <RichText text={t("collections.subtitle")} />
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex min-h-[44px] w-fit items-center justify-center bg-[var(--brand-blue)] px-6 py-3 font-body text-[11px] uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90 active:opacity-80"
              >
                {copy.cta}
              </Link>
            </div>

            {shopCollections.map((collection, index) => (
              <div key={collection.id} className={`relative aspect-[7/6] lg:aspect-[2/1] ${collectionDividerClass(index)}`}>
                <LookbookCollectionCover
                  collection={collection}
                  index={index}
                  className="h-full"
                  imagePriority={index < 2}
                />
              </div>
            ))}
          </div>
        </MotionReveal>

        <MadeToOrderStrip />
      </div>
    </div>
  );
}
