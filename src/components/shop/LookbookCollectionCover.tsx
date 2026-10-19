"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { shopCollectionHref, getCollectionById, type LookbookCollection } from "@/lib/lookbookCollections";
import { MADE_TO_ORDER_DETAIL_HREF } from "@/lib/customOrderContent";
import { appendReturnTo, HOME_LOOKBOOK_RETURN_TO } from "@/lib/shopReturnTo";
import { isDataImageUrl } from "@/lib/productImageUpload";
import { mediaSrc, resolvePublicImageUrl } from "@/lib/productImages";
import { images } from "@/lib/images";
import { RichText } from "@/components/ui/RichText";

interface LookbookCollectionCoverProps {
  collection: LookbookCollection;
  index: number;
  className?: string;
  imagePriority?: boolean;
}

export function LookbookCollectionCover({
  collection,
  index,
  className = "",
  imagePriority = false,
}: LookbookCollectionCoverProps) {
  const { language } = useLanguage();
  const seed = getCollectionById(collection.id);
  const resolvedSrc =
    resolvePublicImageUrl(collection.image) ?? seed?.image ?? images.accentBowl;
  const [imageSrc, setImageSrc] = useState(resolvedSrc);

  useEffect(() => {
    setImageSrc(resolvedSrc);
  }, [resolvedSrc]);

  const name = pickBilingual(collection.name, collection.name, language);
  const subtitle = pickBilingual(collection.subtitle, collection.subtitle, language);
  const href =
    (collection.href ?? shopCollectionHref(collection.id)) === MADE_TO_ORDER_DETAIL_HREF
      ? appendReturnTo(MADE_TO_ORDER_DETAIL_HREF, HOME_LOOKBOOK_RETURN_TO)
      : (collection.href ?? shopCollectionHref(collection.id));

  return (
    <Link
      href={href}
      className={[
        "lookbook-cover relative flex flex-col overflow-hidden",
        "bg-[var(--lookbook-bg-well)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--lookbook-ink)]",
        className,
      ].join(" ")}
    >
      <div data-cover-media className="lookbook-cover__media pointer-events-none absolute inset-0 z-0">
        <Image
          src={mediaSrc(imageSrc, 800)}
          alt={name}
          fill
          priority={imagePriority}
          fetchPriority={imagePriority ? "high" : undefined}
          unoptimized={isDataImageUrl(imageSrc)}
          sizes="(min-width: 1024px) 34vw, 50vw"
          quality={imagePriority ? 78 : 72}
          onError={() => {
            const fallback = seed?.image ?? images.accentBowl;
            if (imageSrc !== fallback) setImageSrc(fallback);
          }}
          className="object-cover object-center"
        />
      </div>

      <div className="lookbook-cover__lift relative z-10 flex flex-1 flex-col">
        <div className="pointer-events-none absolute left-5 top-4 z-10 sm:left-6 sm:top-5">
          <span className="font-body text-[10px] uppercase tracking-[0.28em] text-[#faf7f0] [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="relative z-10 mt-auto bg-gradient-to-t from-[rgba(18,16,14,0.82)] via-[rgba(18,16,14,0.55)] to-transparent px-5 pb-4 pt-14 sm:px-6 sm:pb-5 sm:pt-16">
          <h3 className="break-words text-[#faf7f0] font-display text-[clamp(0.95rem,1.8vw,1.15rem)] uppercase leading-snug tracking-[0.05em]">
            {name}
          </h3>
          <p className="mt-1 font-body text-[#faf7f0]/90 text-[11px] leading-snug tracking-[0.04em] sm:text-xs">
            <RichText text={subtitle} />
          </p>
        </div>
      </div>
    </Link>
  );
}
