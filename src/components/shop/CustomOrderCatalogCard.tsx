"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import {
  customOrderCatalogCard,
  MADE_TO_ORDER_DETAIL_HREF,
} from "@/lib/customOrderContent";

const linkFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lookbook-ink)] focus-visible:ring-offset-2";

export function CustomOrderCatalogCard() {
  const { language } = useLanguage();
  const title = pickBilingual(customOrderCatalogCard.title, customOrderCatalogCard.title, language);
  const subtitle = pickBilingual(
    customOrderCatalogCard.subtitle,
    customOrderCatalogCard.subtitle,
    language
  );
  const href = MADE_TO_ORDER_DETAIL_HREF;
  const priceLabel = language === "pl" ? "od 400 zł" : "from 400 PLN";
  const noLabel = "no";
  const sizePrefix = "size";
  const skuLabel = language === "pl" ? "ZAMÓW" : "CUSTOM";

  return (
    <Link
      href={href}
      scroll={false}
      className={["group flex h-full w-full flex-col text-left", linkFocus].join(" ")}
    >
      <div className="shop-card-image relative aspect-square w-full overflow-hidden">
        <Image
          src={customOrderCatalogCard.image}
          alt=""
          fill
          sizes="(max-width:768px) 50vw, (max-width:1280px) 33vw, 20vw"
          className="object-contain object-center p-5 sm:p-6 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex min-h-[4.75rem] flex-col gap-1 pt-2.5 font-product-medium text-[11px] leading-snug tracking-[0.06em] sm:text-[12px]">
        <p className="lookbook-ink">
          <span className="shop-catalog-muted">{noLabel}</span>{" "}
          <span className="tabular-nums">{skuLabel}</span>
        </p>
        <p className="lookbook-ink">
          <span className="shop-catalog-muted">{sizePrefix}</span>{" "}
          <span>{subtitle}</span>
        </p>
        <p className="mt-auto pt-1 font-body text-[12px] tabular-nums shop-catalog-muted sm:text-[13px]">
          {priceLabel}
        </p>
        <p className="sr-only">{title}</p>
      </div>
    </Link>
  );
}
