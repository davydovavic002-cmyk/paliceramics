"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { shopCollectionHref, getCollectionById, type LookbookCollection } from "@/lib/lookbookCollections";
import { isDataImageUrl } from "@/lib/productImageUpload";
import { resolvePublicImageUrl } from "@/lib/productImages";
import { images } from "@/lib/images";

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
  const href = collection.href ?? shopCollectionHref(collection.id);

  return (
    <Link
      href={href}
      className={[
        "group relative flex flex-col overflow-hidden",
        "bg-[var(--lookbook-bg-well)] transition-[opacity,box-shadow,transform] duration-300",
        "hover:opacity-95 hover:shadow-[0_12px_32px_rgba(1,10,139,0.08)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lookbook-ink)] focus-visible:ring-offset-2",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute left-5 top-4 z-10 sm:left-6 sm:top-5">
        <span className="lookbook-section-muted font-body text-[10px] uppercase tracking-[0.28em]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex justify-center px-4 pb-1 pt-9 sm:px-5 sm:pt-10">
        <div className="relative h-[88px] w-full max-w-[9.5rem] sm:h-[96px] sm:max-w-[10.5rem] lg:h-[92px] lg:max-w-[9rem]">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority={imagePriority}
            fetchPriority={imagePriority ? "high" : undefined}
            unoptimized={isDataImageUrl(imageSrc)}
            sizes="168px"
            quality={imagePriority ? 78 : 72}
            onError={() => {
              const fallback = seed?.image ?? images.accentBowl;
              if (imageSrc !== fallback) setImageSrc(fallback);
            }}
            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="relative z-10 px-5 pb-4 pt-1 sm:px-6 sm:pb-5">
        <h3 className="lookbook-ink font-display text-[clamp(0.95rem,1.8vw,1.15rem)] uppercase leading-snug tracking-[0.05em] transition-transform duration-300 group-hover:translate-x-0.5">
          {name}
        </h3>
        <p className="lookbook-section-muted mt-1 font-body text-[11px] leading-snug tracking-[0.04em] sm:text-xs">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
