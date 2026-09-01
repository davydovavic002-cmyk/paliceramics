"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import {
  customOrderContent,
  madeToOrderCategoryLabel,
  MADE_TO_ORDER_SHOP_HREF,
} from "@/lib/customOrderContent";
import { decodeReturnTo, resolveBackHref } from "@/lib/shopReturnTo";
import { CustomOrderPanel } from "./CustomOrderPanel";

export function CustomOrderDetailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const backHref = resolveBackHref(decodeReturnTo(searchParams.get("returnTo")), MADE_TO_ORDER_SHOP_HREF);

  const copy =
    language === "pl"
      ? {
          back: "Wróć",
          close: "Zamknij",
        }
      : {
          back: "Back",
          close: "Close",
        };

  const closePanel = useCallback(() => {
    router.push(backHref, { scroll: false });
  }, [router, backHref]);

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
      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        <nav className="hidden font-body text-[10px] uppercase tracking-[0.18em] shop-catalog-muted sm:block">
          <Link href={backHref} scroll={false} className="transition-opacity hover:text-[var(--lookbook-ink)]">
            {language === "pl" ? "Produkty" : "Products"}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="lookbook-ink">{collectionLabel}</span>
          <span className="mx-2 opacity-40">/</span>
          <span className="lookbook-ink">{title}</span>
        </nav>

        <div className="relative mt-4 sm:mt-5">
          <button
            type="button"
            onClick={closePanel}
            className="shop-product-close absolute right-2 top-2 z-30 p-1 text-[#010a8b] transition-opacity hover:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010a8b] focus-visible:ring-offset-2 sm:right-3 sm:top-3"
            aria-label={copy.close}
          >
            <X className="h-6 w-6" strokeWidth={1.75} />
          </button>
          <CustomOrderPanel />
        </div>
      </div>
    </div>
  );
}
