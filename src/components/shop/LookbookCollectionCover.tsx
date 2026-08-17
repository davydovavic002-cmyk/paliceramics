"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { shopCollectionHref, type LookbookCollection } from "@/lib/lookbookCollections";
import { isDataImageUrl } from "@/lib/productImageUpload";

interface LookbookCollectionCoverProps {
  collection: LookbookCollection;
  index: number;
  className?: string;
}

export function LookbookCollectionCover({
  collection,
  index,
  className = "",
}: LookbookCollectionCoverProps) {
  const { language } = useLanguage();
  const name = pickBilingual(collection.name, collection.name, language);
  const subtitle = pickBilingual(collection.subtitle, collection.subtitle, language);
  const href = collection.href ?? shopCollectionHref(collection.id);

  return (
    <Link
      href={href}
      className={[
        "group relative flex h-full min-h-[200px] flex-col overflow-hidden",
        "bg-[var(--lookbook-bg-well)] transition-opacity duration-300 hover:opacity-95 lg:min-h-[210px]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-5 sm:p-6">
        <span className="lookbook-section-muted font-body text-[10px] uppercase tracking-[0.28em]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative min-h-[128px] flex-1 sm:min-h-[140px]">
        <Image
          src={collection.image}
          alt=""
          fill
          unoptimized={isDataImageUrl(collection.image)}
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-contain object-center p-6 pb-3 pt-10 transition-transform duration-500 group-hover:scale-[1.03] sm:p-7 sm:pt-11"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--lookbook-bg-well)] to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 shrink-0 px-5 pb-5 sm:px-6 sm:pb-6">
        <h3 className="lookbook-ink font-display text-[clamp(1.1rem,2.2vw,1.45rem)] uppercase leading-snug tracking-[0.05em]">
          {name}
        </h3>
        <p className="lookbook-section-muted mt-2 font-body text-xs leading-relaxed tracking-[0.04em] sm:text-[13px]">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
