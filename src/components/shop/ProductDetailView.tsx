"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDemoControls } from "@/context/DemoControlsContext";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import {
  findShopProductBySku,
  getRelatedProducts,
  isOutOfStock,
} from "@/lib/shopCatalog";
import { t } from "@/lib/galleryContent";
import { getCollectionLabel, shopCollectionHref } from "@/lib/lookbookCollections";
import { getFadeInProps, staggerStep } from "@/lib/motionUtils";
import { CatalogProductCard } from "./CatalogProductCard";
import { ProductDetailNotes } from "./ProductDetailNotes";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchaseMenu } from "./ProductPurchaseMenu";
import { ShopStatusBadge } from "./ShopStatusBadge";
import { WaitlistForm } from "./WaitlistForm";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function ProductDetailView({ sku }: { sku: string }) {
  const router = useRouter();
  const { motionLevel } = useDemoControls();
  const { language } = useLanguage();
  const { products, ready } = useShopCatalog();
  const product = findShopProductBySku(products, sku);
  const related = product ? getRelatedProducts(products, product) : [];

  const copy =
    language === "pl"
      ? {
          home: "Strona główna",
          products: "Produkty",
          about: "O przedmiocie",
          related: "Z tej samej kolekcji",
          notFound: "Nie znaleziono produktu.",
          back: "Katalog",
          close: "Zamknij",
        }
      : {
          home: "Home",
          products: "Products",
          about: "About the piece",
          related: "From the same collection",
          notFound: "Product not found.",
          back: "Catalog",
          close: "Close",
        };

  const closeProduct = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/shop");
  }, [router]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProduct();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeProduct]);

  if (!ready) {
    return (
      <div className="shop-catalog-page flex min-h-[50vh] items-center justify-center pt-28">
        <p className="font-body text-sm shop-catalog-muted">…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shop-catalog-page mx-auto max-w-lg px-5 py-32 text-center">
        <p className="font-body text-sm shop-catalog-muted">{copy.notFound}</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 font-body text-sm lookbook-ink underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>
      </div>
    );
  }

  const title = t(product.name, language);
  const collectionLabel = getCollectionLabel(product.categoryId, language);
  const description = t(product.description, language);
  const outOfStock = isOutOfStock(product);
  const unavailable = outOfStock || product.status === "sold";
  const showPurchase = product.status !== "sold" && !outOfStock;
  const showWaitlist = unavailable;

  return (
    <div className="shop-catalog-page min-h-[100dvh] pt-[var(--header-offset,5.5rem)] pb-14 transition-colors duration-700">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
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
            href={shopCollectionHref(product.categoryId)}
            className="transition-opacity hover:text-[var(--lookbook-ink)]"
          >
            {collectionLabel}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="lookbook-ink">{title}</span>
        </nav>

        <motion.div
          className="delivery-faq-panel shop-product-sheet relative mt-6 rounded-[1.75rem]"
          {...getFadeInProps(motionLevel, 0.04)}
        >
          <button
            type="button"
            onClick={closeProduct}
            className="shop-product-close absolute right-4 top-4 z-30 rounded-full p-2 text-[color-mix(in_srgb,#010a8b_42%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,#010a8b_7%,transparent)] hover:text-[#010a8b] sm:right-5 sm:top-5"
            aria-label={copy.close}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div className="shop-product-sheet-inner grid rounded-[1.75rem] lg:grid-cols-2 lg:items-stretch">
            <div className="shop-product-gallery-zone flex min-h-0 flex-col overflow-hidden rounded-t-[1.75rem] lg:rounded-l-[1.75rem] lg:rounded-tr-none">
              <ProductGallery images={product.images} title={title} />
            </div>

            <div className="shop-product-info-zone delivery-faq-split-b flex min-h-0 flex-col overflow-visible rounded-b-[1.75rem] border-[var(--delivery-faq-line)] px-6 py-7 sm:px-8 sm:py-8 lg:min-h-full lg:rounded-none lg:rounded-tr-[1.75rem] lg:rounded-br-[1.75rem] lg:border-b-0 lg:border-l">
              <div className="flex flex-wrap items-start justify-between gap-3 pr-11 sm:pr-12">
                <p className="shop-product-collection-tag delivery-faq-muted font-body text-[10px] uppercase">
                  {collectionLabel}
                </p>
                <p className="shop-product-sku delivery-faq-muted font-body text-[10px] uppercase">
                  {product.sku}
                </p>
              </div>

              <h1 className="delivery-faq-ink mt-3 font-display text-[clamp(1.45rem,2.6vw,2rem)] leading-[1.15] tracking-[0.02em]">
                {title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
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

              <div className={showWaitlist ? "mt-5" : "mt-6"}>
                <p className="shop-product-section-label font-body">{copy.about}</p>
                <p className="delivery-faq-ink mt-3 max-w-prose font-body text-[15px] leading-[1.75]">
                  {description}
                </p>
                <ProductDetailNotes
                  product={product}
                  language={language}
                  actions={
                    showPurchase ? (
                      <ProductPurchaseMenu
                        productTitle={title}
                        sku={product.sku}
                        pricePln={product.pricePln}
                      />
                    ) : undefined
                  }
                />

                {showWaitlist ? (
                  <div className="shop-product-actions mt-4">
                    <WaitlistForm sku={product.sku} productTitle={title} variant="product" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>

        {related.length > 0 ? (
          <MotionReveal className="mt-14" y={20}>
            <section>
              <h2 className="shop-related-heading font-body text-[10px] uppercase tracking-[0.2em] shop-catalog-muted">
                {copy.related}
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3">
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
