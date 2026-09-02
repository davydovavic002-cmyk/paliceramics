"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
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
  if (index === 2) return "lookbook-split-r lookbook-split-b lg:lookbook-split-b-0";
  return "lookbook-split-b lg:lookbook-split-b-0";
}

export function LookbookArrivalsGrid() {
  const { language } = useLanguage();
  const { collections } = useShopCatalog();
  const shopCollections = useMemo(
    () => getLookbookCollections(collections).map((collection) => collectionToLookbook(collection)),
    [collections]
  );
  const header = pickSectionCopy(undefined, galleryHeader, language);

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
        <h2 className="lookbook-ink font-display text-[clamp(1.35rem,3vw,2rem)] uppercase leading-none tracking-[0.08em]">
          {copy.title}
        </h2>
      </div>

      <div className="lookbook-full-bleed">
        <MotionReveal>
          <div className="lookbook-grid lookbook-collections-grid grid grid-cols-2 gap-0 lg:grid-cols-3 lg:grid-rows-2">
            <div className="col-span-2 flex min-h-[220px] flex-col justify-start gap-5 p-5 sm:gap-6 sm:p-6 lg:col-span-1 lg:row-span-2 lg:min-h-0 lg:justify-between lg:p-8 lookbook-split-r lookbook-split-b">
              <div>
                <p className="lookbook-ink font-display text-[clamp(1.25rem,2.5vw,1.75rem)] uppercase leading-snug tracking-[0.05em]">
                  {copy.headline}
                </p>
                <p className="lookbook-section-muted mt-3 max-w-md font-body text-sm leading-relaxed sm:mt-4 sm:text-[15px]">
                  {header.subtitle}
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex w-fit items-center justify-center bg-[var(--brand-blue)] px-6 py-3 font-body text-[10px] uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90"
              >
                {copy.cta}
              </Link>
            </div>

            {shopCollections.map((collection, index) => (
              <div key={collection.id} className={`min-h-[168px] lg:min-h-0 ${collectionDividerClass(index)}`}>
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
