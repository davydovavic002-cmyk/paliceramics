"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { useProductPageScrollTop } from "@/hooks/useProductPageScrollTop";
import {
  customOrderContent,
  madeToOrderCategoryLabel,
  MADE_TO_ORDER_SHOP_HREF,
} from "@/lib/customOrderContent";
import {
  decodeReturnTo,
  isHomeLookbookReturn,
  navigateBackFromProduct,
  resolveBackHref,
} from "@/lib/shopReturnTo";
import { scrollToSection } from "@/lib/scrollToSection";
import { CustomOrderPanel } from "./CustomOrderPanel";
import { ProductMobileBackBar } from "./ProductMobileBackBar";

export function CustomOrderDetailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const returnToParam = searchParams.get("returnTo");
  const fromLookbook = isHomeLookbookReturn(returnToParam);
  const backHref = resolveBackHref(decodeReturnTo(returnToParam), MADE_TO_ORDER_SHOP_HREF);

  useProductPageScrollTop("made-to-order");

  const copy =
    language === "pl"
      ? {
          back: fromLookbook ? "Wróć do kolekcji" : "Wróć do sklepu",
          close: "Zamknij",
        }
      : {
          back: fromLookbook ? "Back to collection" : "Back to shop",
          close: "Close",
        };

  const closePanel = useCallback(() => {
    navigateBackFromProduct(
      router,
      decodeReturnTo(returnToParam),
      MADE_TO_ORDER_SHOP_HREF,
      scrollToSection
    );
  }, [router, returnToParam]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  const collectionLabel = pickBilingual(
    madeToOrderCategoryLabel,
    madeToOrderCategoryLabel,
    language
  );
  const title = pickBilingual(customOrderContent.title, customOrderContent.title, language);

  return (
    <div className="shop-catalog-page shop-product-page min-h-0 pb-10 pt-[var(--header-offset,5.5rem)] sm:pb-14">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6">
        <nav className="hidden font-body text-[10px] uppercase tracking-[0.18em] shop-catalog-muted sm:block">
          <Link
            href="/"
            scroll={false}
            className="transition-opacity hover:text-[var(--lookbook-ink)]"
          >
            {language === "pl" ? "Strona główna" : "Home"}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link
            href={fromLookbook ? "/" : backHref}
            scroll={false}
            onClick={
              fromLookbook
                ? (event) => {
                    event.preventDefault();
                    closePanel();
                  }
                : undefined
            }
            className="transition-opacity hover:text-[var(--lookbook-ink)]"
          >
            {fromLookbook
              ? language === "pl"
                ? "Kolekcja"
                : "Collection"
              : language === "pl"
                ? "Produkty"
                : "Products"}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="lookbook-ink">{collectionLabel}</span>
          <span className="mx-2 opacity-40">/</span>
          <span className="lookbook-ink">{title}</span>
        </nav>

        <ProductMobileBackBar label={copy.back} onBack={closePanel} />

        <div className="relative mt-4 sm:mt-5">
          <CustomOrderPanel onClose={closePanel} />
        </div>
      </div>
    </div>
  );
}
