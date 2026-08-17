"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import { t } from "@/lib/galleryContent";
import {
  getCollectionById,
  pickCollectionLabel,
} from "@/lib/lookbookCollections";
import { findShopProductBySku } from "@/lib/shopCatalog";
import { CatalogCardVariantView, type CatalogCardVariant } from "@/components/shop/CatalogCardVariants";
import {
  ProductDetailVariantView,
  type ProductDetailVariant,
} from "@/components/shop/ProductDetailVariants";

const DEMO_SKU = "PALI-001";
const CARD_VARIANTS: { id: CatalogCardVariant; title: { en: string; pl: string } }[] = [
  { id: "a", title: { en: "A — Lookbook-lite", pl: "A — Lookbook-lite" } },
  { id: "b", title: { en: "B — Collection cover", pl: "B — Obłoka kolekcji" } },
  { id: "c", title: { en: "C — Minimal", pl: "C — Minimal" } },
];
const DETAIL_VARIANTS: { id: ProductDetailVariant; title: { en: string; pl: string } }[] = [
  { id: "a", title: { en: "A — Lookbook product page", pl: "A — Strona lookbook" } },
  { id: "b", title: { en: "B — Editorial split", pl: "B — Edytorial" } },
  { id: "c", title: { en: "C — Minimal + sticky actions", pl: "C — Minimal + sticky" } },
];

export function CatalogCardsLab() {
  const { language } = useLanguage();
  const { products, ready } = useShopCatalog();
  const product = findShopProductBySku(products, DEMO_SKU) ?? products[0];

  const copy =
    language === "pl"
      ? {
          heading: "Warianty kart katalogu",
          sub: "Porównaj A / B / C — wybierzemy jeden i wdrożymy w sklepie.",
          cards: "Karty w siatce",
          detail: "Strona produktu",
          back: "Demo",
          empty: "Brak produktu demo.",
        }
      : {
          heading: "Catalog card variants",
          sub: "Compare A / B / C — we'll pick one and ship it to the shop.",
          cards: "Grid cards",
          detail: "Product page",
          back: "Demo",
          empty: "No demo product.",
        };

  if (!ready) {
    return <p className="font-body text-sm shop-catalog-muted">…</p>;
  }

  if (!product) {
    return <p className="font-body text-sm shop-catalog-muted">{copy.empty}</p>;
  }

  const title = t(product.name, language);
  const collection = getCollectionById(product.categoryId);
  const collectionLabel = collection
    ? pickCollectionLabel(collection, language)
    : product.categoryId;
  const collectionSubtitle = collection?.subtitle[language];

  return (
    <div className="shop-catalog-page space-y-16 pb-16 pt-6">
      <header className="space-y-3">
        <Link
          href="/demo"
          className="font-body text-[10px] uppercase tracking-[0.18em] shop-catalog-muted hover:text-[var(--lookbook-ink)]"
        >
          ← {copy.back}
        </Link>
        <h1 className="lookbook-ink font-display text-[clamp(1.5rem,3vw,2rem)] leading-snug">
          {copy.heading}
        </h1>
        <p className="max-w-2xl font-body text-sm shop-catalog-muted">{copy.sub}</p>
        <p className="font-body text-xs shop-catalog-muted">
          Demo: {title} · {product.sku}
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="lookbook-ink font-display text-lg">{copy.cards}</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {CARD_VARIANTS.map((item, index) => (
            <div key={item.id} className="space-y-3">
              <p className="font-body text-[10px] uppercase tracking-[0.2em] shop-catalog-muted">
                {item.title[language]}
              </p>
              <CatalogCardVariantView
                variant={item.id}
                product={product}
                title={title}
                collectionLabel={collectionLabel}
                collectionSubtitle={collectionSubtitle}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="lookbook-ink font-display text-lg">{copy.detail}</h2>
        {DETAIL_VARIANTS.map((item) => (
          <div key={item.id} className="space-y-4 border-t border-[var(--lookbook-line)] pt-8">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] shop-catalog-muted">
              {item.title[language]}
            </p>
            <ProductDetailVariantView
              variant={item.id}
              product={product}
              language={language}
              title={title}
              collectionLabel={collectionLabel}
              collectionSubtitle={collectionSubtitle}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
