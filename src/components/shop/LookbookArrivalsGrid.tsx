"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminSiteCopy } from "@/context/AdminDataContext";
import { pickSectionCopy } from "@/lib/adminTypes";
import { galleryHeader } from "@/lib/galleryContent";
import { collectionToLookbook, getLookbookCollections } from "@/lib/catalogConfig";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { LookbookCollectionCover } from "./LookbookCollectionCover";
import { MadeToOrderStrip } from "./MadeToOrderStrip";

function collectionDividerClass(index: number) {
  if (index === 0) return "lookbook-split-r lookbook-split-b";
  if (index === 1) return "lookbook-split-b";
  if (index === 2) return "lookbook-split-r lookbook-split-b";
  return "lookbook-split-b";
}

export function LookbookArrivalsGrid() {
  const { language } = useLanguage();
  const siteCopy = useAdminSiteCopy();
  const { collections } = useShopCatalog();
  const shopCollections = useMemo(
    () => getLookbookCollections(collections).map((collection) => collectionToLookbook(collection)),
    [collections]
  );
  const header = pickSectionCopy(siteCopy?.gallery, galleryHeader, language);

  const copy =
    language === "pl"
      ? {
          title: "Kolekcje",
          seeAll: "Zobacz wszystkie",
          headline: "Nie tylko talerz, nie tylko filiżanka",
          cta: "Zobacz katalog",
        }
      : {
          title: "Collections",
          seeAll: "See all",
          headline: "Not just a plate, not just a cup",
          cta: "View catalog",
        };

  return (
    <div className="w-full pb-0">
      <div className="mx-auto max-w-[1800px] px-5 pb-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="lookbook-ink font-display text-[clamp(1.35rem,3vw,2rem)] uppercase leading-none tracking-[0.08em]">
            {copy.title}
          </h2>
          <Link
            href="/shop"
            className="lookbook-ink shrink-0 font-body text-[10px] uppercase tracking-[0.22em] transition-opacity hover:opacity-75"
          >
            {copy.seeAll}
          </Link>
        </div>
      </div>

      <div className="lookbook-full-bleed">
        <MotionReveal>
          <div className="lookbook-grid grid grid-cols-2 gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-2">
            <div className="col-span-2 flex min-h-[240px] flex-col justify-between p-6 sm:p-8 lg:col-span-1 lg:row-span-2 lg:min-h-[420px] lookbook-split-r lookbook-split-b lg:lookbook-split-b-0">
              <div>
                <p className="lookbook-ink font-display text-[clamp(1.25rem,2.5vw,2rem)] uppercase leading-snug tracking-[0.05em]">
                  {copy.headline}
                </p>
                <p className="lookbook-section-muted mt-4 max-w-md font-body text-sm leading-relaxed sm:text-[15px]">
                  {header.subtitle}
                </p>
              </div>
              <Link
                href="/shop"
                className="mt-8 inline-flex w-fit items-center justify-center bg-[var(--brand-blue)] px-6 py-3 font-body text-[10px] uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90 lg:mt-0"
              >
                {copy.cta}
              </Link>
            </div>

            {shopCollections.map((collection, index) => (
              <div
                key={collection.id}
                className={`min-h-[200px] lg:min-h-[210px] ${collectionDividerClass(index)}`}
              >
                <LookbookCollectionCover collection={collection} index={index} className="h-full" />
              </div>
            ))}
          </div>
        </MotionReveal>

        <MadeToOrderStrip />
      </div>
    </div>
  );
}
