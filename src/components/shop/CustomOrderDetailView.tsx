"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import {
  customOrderContent,
  madeToOrderCategoryLabel,
  MADE_TO_ORDER_SHOP_HREF,
} from "@/lib/customOrderContent";
import { CustomOrderPanel } from "./CustomOrderPanel";

export function CustomOrderDetailView() {
  const { language } = useLanguage();

  const copy =
    language === "pl"
      ? {
          home: "Strona główna",
          products: "Produkty",
        }
      : {
          home: "Home",
          products: "Products",
        };

  const collectionLabel = pickBilingual(
    madeToOrderCategoryLabel,
    madeToOrderCategoryLabel,
    language
  );
  const title = pickBilingual(customOrderContent.title, customOrderContent.title, language);

  return (
    <div className="shop-catalog-page min-h-[100dvh] pt-[var(--header-offset,5.5rem)] pb-14 transition-colors duration-700">
      <div className="mx-auto max-w-[900px] px-5 sm:px-6">
        <nav className="font-body text-[10px] uppercase tracking-[0.18em] shop-catalog-muted">
          <Link href="/" className="transition-opacity hover:text-[var(--lookbook-ink)]">
            {copy.home}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="transition-opacity hover:text-[var(--lookbook-ink)]">
            {copy.products}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link
            href={MADE_TO_ORDER_SHOP_HREF}
            className="transition-opacity hover:text-[var(--lookbook-ink)]"
          >
            {collectionLabel}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="lookbook-ink">{title}</span>
        </nav>

        <div className="mt-5">
          <CustomOrderPanel />
        </div>
      </div>
    </div>
  );
}
