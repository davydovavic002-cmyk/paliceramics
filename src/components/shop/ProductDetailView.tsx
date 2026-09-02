"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useProductPageScrollTop } from "@/hooks/useProductPageScrollTop";
import {
  findShopProductBySku,
  getRelatedProducts,
  isOutOfStock,
} from "@/lib/shopCatalog";
import { decodeReturnTo, resolveBackHref } from "@/lib/shopReturnTo";
import { clearShopCatalogReturnState } from "@/lib/shopScrollRestore";
import { t } from "@/lib/galleryContent";
import { getCollectionLabel } from "@/lib/lookbookCollections";
import { staggerStep } from "@/lib/motionUtils";
import { CatalogProductCard } from "./CatalogProductCard";
import { ProductDetailNotes } from "./ProductDetailNotes";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchaseMenu } from "./ProductPurchaseMenu";
import { ProductWaitlistMenu } from "./ProductWaitlistMenu";
import { ShopStatusBadge } from "./ShopStatusBadge";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function ProductDetailView({ sku }: { sku: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { products } = useShopCatalog();
  const product = findShopProductBySku(products, sku);
  const related = product ? getRelatedProducts(products, product) : [];

  const backHref = resolveBackHref(decodeReturnTo(searchParams.get("returnTo")));

  useProductPageScrollTop(sku);

  const copy =
    language === "pl"
      ? {
          home: "Strona główna",
          products: "Produkty",
          about: "O przedmiocie",
          related: "Z tej samej kolekcji",
          notFound: "Nie znaleziono produktu.",
          backToShop: "Wróć do sklepu",
          close: "Zamknij",
        }
      : {
          home: "Home",
          products: "Products",
          about: "About the piece",
          related: "From the same collection",
          notFound: "Product not found.",
          backToShop: "Back to shop",
          close: "Close",
        };

  const closeProduct = useCallback(() => {
    router.push(backHref, { scroll: false });
  }, [router, backHref]);

  const sheetTrapRef = useFocusTrap(true);

  const swipeStartY = useRef<number | null>(null);

  const onSwipeStart = (event: React.TouchEvent) => {
    swipeStartY.current = event.touches[0]?.clientY ?? null;
  };

  const onSwipeEnd = (event: React.TouchEvent) => {
    if (swipeStartY.current === null) return;
    const endY = event.changedTouches[0]?.clientY;
    if (endY === undefined) return;
    if (endY - swipeStartY.current > 72) closeProduct();
    swipeStartY.current = null;
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProduct();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeProduct]);

  if (!product) {
    return (
      <div className="shop-catalog-page mx-auto max-w-lg px-5 py-32 text-center">
        <p className="font-body text-sm shop-catalog-muted">{copy.notFound}</p>
        <Link
          href={backHref}
          scroll={false}
          className="mt-6 inline-block font-body text-sm lookbook-ink underline-offset-4 hover:underline"
        >
          {copy.backToShop}
        </Link>
      </div>
    );
  }

  const title = t(product.name, language);
  const collectionLabel = getCollectionLabel(product.categoryId, language);
  const description = t(product.description, language);
  const outOfStock = isOutOfStock(product);
  const showPurchase = product.status !== "sold" && !outOfStock;

  return (
    <div className="shop-catalog-page shop-product-page min-h-0 pb-10 pt-[var(--header-offset,5.5rem)] sm:pb-14 lg:min-h-[100dvh]">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-8">
        <nav className="hidden font-body text-[10px] uppercase tracking-[0.18em] shop-catalog-muted sm:block">
          <Link
            href="/"
            scroll={false}
            onClick={() => clearShopCatalogReturnState()}
            className="transition-opacity hover:text-[var(--lookbook-ink)]"
          >
            {copy.home}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href={backHref} scroll={false} className="transition-opacity hover:text-[var(--lookbook-ink)]">
            {copy.products}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="lookbook-ink">{title}</span>
        </nav>

        <motion.div
          ref={sheetTrapRef as React.RefObject<HTMLDivElement>}
          className="delivery-faq-panel shop-product-sheet relative mt-4 rounded-2xl sm:mt-6 sm:rounded-[1.75rem]"
          onTouchStart={onSwipeStart}
          onTouchEnd={onSwipeEnd}
        >
          <button
            type="button"
            onClick={closeProduct}
            className="shop-product-close absolute right-3 top-3 z-30 p-1 text-[#010a8b] transition-opacity hover:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010a8b] focus-visible:ring-offset-2 sm:right-4 sm:top-4"
            aria-label={copy.close}
          >
            <X className="h-6 w-6" strokeWidth={1.75} />
          </button>
          <div className="shop-product-sheet-inner grid rounded-2xl sm:rounded-[1.75rem] lg:grid-cols-2 lg:items-stretch">
            <div className="shop-product-gallery-zone flex min-h-0 flex-col overflow-visible rounded-t-2xl sm:rounded-t-[1.75rem] lg:rounded-l-[1.75rem] lg:rounded-tr-none">
              <ProductGallery images={product.images} title={title} />
            </div>

            <div className="shop-product-info-zone delivery-faq-split-b flex min-h-0 flex-col overflow-visible rounded-b-2xl border-[var(--delivery-faq-line)] px-4 py-5 sm:px-6 sm:py-6 lg:min-h-full lg:rounded-none lg:rounded-tr-[1.75rem] lg:rounded-br-[1.75rem] lg:border-b-0 lg:border-l lg:px-8 lg:py-8">
              <div className="flex flex-wrap items-start justify-between gap-3 pr-12">
                <p className="shop-product-collection-tag delivery-faq-muted font-body text-[10px] uppercase">
                  {collectionLabel}
                </p>
                <p className="shop-product-sku delivery-faq-muted font-body text-[10px] uppercase">
                  {product.sku}
                </p>
              </div>

              <h1 className="delivery-faq-ink mt-2 font-display text-[clamp(1.2rem,4vw,2rem)] leading-[1.15] tracking-[0.02em] sm:mt-3">
                {title}
              </h1>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2 sm:mt-4">
                {product.pricePln > 0 ? (
                  <p className="shop-product-price delivery-faq-ink font-display tabular-nums">
                    {product.pricePln} PLN
                  </p>
                ) : null}
                <ShopStatusBadge
                  status={product.status}
                  outOfStock={outOfStock}
                  variant="light"
                />
              </div>

              <div className="mt-5">
                <p className="shop-product-section-label font-body">{copy.about}</p>
                <p className="delivery-faq-ink mt-2 max-w-prose font-body text-[14px] leading-[1.65] sm:mt-3 sm:text-[15px] sm:leading-[1.75]">
                  {description}
                </p>
                <ProductDetailNotes
                  product={product}
                  language={language}
                  actions={
                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                      {showPurchase ? (
                        <ProductPurchaseMenu
                          productTitle={title}
                          sku={product.sku}
                          pricePln={product.pricePln}
                        />
                      ) : null}
                      <ProductWaitlistMenu sku={product.sku} productTitle={title} />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </motion.div>

        {related.length > 0 ? (
          <MotionReveal className="mt-10 sm:mt-14" y={20}>
            <section>
              <h2 className="shop-related-heading font-body text-[10px] uppercase tracking-[0.2em] shop-catalog-muted">
                {copy.related}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:mt-5 sm:gap-x-5 sm:gap-y-8 md:grid-cols-3">
                {related.map((item, index) => (
                  <MotionReveal key={item.sku} delay={staggerStep(index, 0.06)} y={12}>
                    <CatalogProductCard
                      product={item}
                      title={t(item.name, language)}
                      categoryLabel={getCollectionLabel(item.categoryId, language)}
                      variant="shop"
                    />
                  </MotionReveal>
                ))}
              </div>
            </section>
          </MotionReveal>
        ) : null}
      </div>
    </div>
  );
}
