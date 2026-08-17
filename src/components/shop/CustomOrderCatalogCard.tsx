"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import {
  customOrderCatalogCard,
  MADE_TO_ORDER_DETAIL_HREF,
} from "@/lib/customOrderContent";

export function CustomOrderCatalogCard({ openDetail: _openDetail = false }: { openDetail?: boolean }) {
  const { language } = useLanguage();
  const title = pickBilingual(customOrderCatalogCard.title, customOrderCatalogCard.title, language);
  const subtitle = pickBilingual(
    customOrderCatalogCard.subtitle,
    customOrderCatalogCard.subtitle,
    language
  );
  const href = MADE_TO_ORDER_DETAIL_HREF;
  const priceLabel = language === "pl" ? "od 400 zł" : "from 400 PLN";

  return (
    <Link
      href={href}
      scroll={false}
      className="group flex h-full w-full flex-col text-left"
    >
      <div className="shop-card-image relative aspect-square w-full overflow-hidden">
        <Image
          src={customOrderCatalogCard.image}
          alt=""
          fill
          sizes="(max-width:768px) 50vw, 33vw"
          className="object-contain object-center p-6 sm:p-7 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex min-h-[5.5rem] flex-col pt-3">
        <p className="lookbook-ink line-clamp-2 font-body text-[13px] leading-snug">{title}</p>
        <p className="mt-1 font-body text-[12px] leading-snug shop-catalog-muted">{subtitle}</p>
        <p className="mt-auto pt-2 font-body text-[12px] tabular-nums shop-catalog-muted">{priceLabel}</p>
      </div>
    </Link>
  );
}
