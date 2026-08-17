"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, ShoppingBag } from "lucide-react";
import type { Language } from "@/types";
import type { ShopProduct } from "@/lib/shopCatalog";
import { isOutOfStock } from "@/lib/shopCatalog";
import { t } from "@/lib/galleryContent";
import { bookingContact } from "@/lib/workshopsContent";
import { ShopStatusBadge } from "./ShopStatusBadge";

export type ProductDetailVariant = "a" | "b" | "c";

const SPEC_ROWS = [
  ["clayBody", { en: "Clay body", pl: "Masa" }],
  ["glaze", { en: "Glaze", pl: "Szkliwo" }],
  ["firing", { en: "Firing", pl: "Wypał" }],
  ["dimensions", { en: "Dimensions", pl: "Wymiary" }],
] as const;

function DetailActions({
  language,
  product,
  title,
  outOfStock,
  layout = "row",
}: {
  language: Language;
  product: ShopProduct;
  title: string;
  outOfStock: boolean;
  layout?: "row" | "stack";
}) {
  const copy =
    language === "pl"
      ? {
          buy: "Kup teraz",
          ask: "Zapytaj o pracę",
          waitlist: "Powiadom, gdy wróci",
        }
      : {
          buy: "Buy now",
          ask: "Ask about piece",
          waitlist: "Notify when back",
        };

  const mailSubject = encodeURIComponent(`${title} (${product.sku})`);
  const buyHref = `mailto:${bookingContact.email}?subject=${mailSubject}`;

  return (
    <div
      className={
        layout === "stack"
          ? "flex flex-col gap-2"
          : "flex flex-wrap gap-2 sm:gap-3"
      }
    >
      {!outOfStock && product.status !== "sold" ? (
        <a
          href={buyHref}
          className="inline-flex items-center justify-center gap-2 bg-[var(--brand-blue)] px-5 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          {copy.buy}
        </a>
      ) : null}
      <a
        href={buyHref}
        className="inline-flex items-center justify-center gap-2 border border-[var(--lookbook-line)] px-5 py-3 font-body text-[10px] uppercase tracking-[0.2em] lookbook-ink transition-opacity hover:opacity-75"
      >
        <Mail className="h-4 w-4" strokeWidth={1.5} />
        {outOfStock || product.status === "sold" ? copy.waitlist : copy.ask}
      </a>
    </div>
  );
}

function SpecList({ product, language }: { product: ShopProduct; language: Language }) {
  return (
    <dl className="space-y-2.5">
      {SPEC_ROWS.map(([key, labels]) => (
        <div key={key} className="grid grid-cols-[6.5rem_1fr] gap-3 text-sm">
          <dt className="font-body text-[10px] uppercase tracking-[0.16em] shop-catalog-muted">
            {labels[language]}
          </dt>
          <dd className="font-body lookbook-ink">{t(product.specs[key], language)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A — lookbook: object-contain, lookbook-токены, без тёмного бокса */
function DetailVariantA({
  product,
  language,
  title,
  collectionLabel,
}: {
  product: ShopProduct;
  language: Language;
  title: string;
  collectionLabel: string;
}) {
  const outOfStock = isOutOfStock(product);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="relative aspect-[4/5] overflow-hidden border border-[var(--lookbook-line)]">
        <Image
          src={product.image}
          alt={title}
          fill
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-contain p-6 sm:p-8"
        />
        <div className="absolute left-4 top-4">
          <ShopStatusBadge status={product.status} outOfStock={outOfStock} />
        </div>
      </div>

      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.2em] shop-catalog-muted">
          {collectionLabel}
        </p>
        <h1 className="lookbook-ink mt-2 font-display text-[clamp(1.35rem,3vw,2rem)] leading-snug">
          {title}
        </h1>
        {product.pricePln > 0 ? (
          <p className="lookbook-ink mt-3 font-body text-lg">{product.pricePln} PLN</p>
        ) : null}
        <p className="mt-1 font-body text-xs shop-catalog-muted">{product.sku}</p>

        <div className="mt-6 border-t border-[var(--lookbook-line)] pt-6">
          <SpecList product={product} language={language} />
        </div>

        <div className="mt-8">
          <DetailActions
            language={language}
            product={product}
            title={title}
            outOfStock={outOfStock}
          />
        </div>
      </div>
    </div>
  );
}

/** B — editorial: коллекция крупно, асимметричная сетка */
function DetailVariantB({
  product,
  language,
  title,
  collectionLabel,
  collectionSubtitle,
}: {
  product: ShopProduct;
  language: Language;
  title: string;
  collectionLabel: string;
  collectionSubtitle?: string;
}) {
  const outOfStock = isOutOfStock(product);

  return (
    <div className="overflow-hidden border border-[var(--lookbook-line)]">
      <div className="border-b border-[var(--lookbook-line)] px-5 py-4 sm:px-8 sm:py-5">
        <p className="font-body text-[10px] uppercase tracking-[0.28em] shop-catalog-muted">
          {collectionLabel}
        </p>
        <h1 className="lookbook-ink mt-2 font-display text-[clamp(1.5rem,3.5vw,2.25rem)] uppercase leading-snug tracking-[0.04em]">
          {title}
        </h1>
        {collectionSubtitle ? (
          <p className="shop-catalog-muted mt-2 max-w-lg font-body text-sm">{collectionSubtitle}</p>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[320px] border-b border-[var(--lookbook-line)] lg:min-h-[420px] lg:border-b-0 lg:border-r">
          <Image
            src={product.image}
            alt={title}
            fill
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-contain p-8 sm:p-10"
          />
          <div className="absolute left-4 top-4">
            <ShopStatusBadge status={product.status} outOfStock={outOfStock} />
          </div>
        </div>

        <div className="flex flex-col justify-between px-5 py-6 sm:px-8 sm:py-8">
          <div>
            {product.pricePln > 0 ? (
              <p className="lookbook-ink font-display text-2xl">{product.pricePln} PLN</p>
            ) : null}
            <p className="mt-2 font-body text-xs shop-catalog-muted">{product.sku}</p>
            <div className="mt-6">
              <SpecList product={product} language={language} />
            </div>
          </div>
          <div className="mt-8">
            <DetailActions
              language={language}
              product={product}
              title={title}
              outOfStock={outOfStock}
              layout="stack"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** C — минимум: фото сверху, sticky-панель действий */
function DetailVariantC({
  product,
  language,
  title,
}: {
  product: ShopProduct;
  language: Language;
  title: string;
}) {
  const outOfStock = isOutOfStock(product);

  return (
    <div>
      <div className="relative mx-auto max-w-md">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={title}
            fill
            sizes="(max-width:640px) 100vw, 420px"
            className="object-contain p-4"
          />
          <div className="absolute right-0 top-0">
            <ShopStatusBadge status={product.status} outOfStock={outOfStock} />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-md text-center">
        <h1 className="lookbook-ink font-display text-xl leading-snug">{title}</h1>
        {product.pricePln > 0 ? (
          <p className="lookbook-ink mt-2 font-body text-lg">{product.pricePln} PLN</p>
        ) : null}
        <p className="mt-1 font-body text-xs shop-catalog-muted">{product.sku}</p>
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <SpecList product={product} language={language} />
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-[var(--lookbook-line)] bg-[color-mix(in_srgb,var(--lookbook-bg)_92%,transparent)] px-5 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md flex-col gap-2">
          <DetailActions
            language={language}
            product={product}
            title={title}
            outOfStock={outOfStock}
            layout="stack"
          />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailVariantView({
  variant,
  product,
  language,
  title,
  collectionLabel,
  collectionSubtitle,
}: {
  variant: ProductDetailVariant;
  product: ShopProduct;
  language: Language;
  title: string;
  collectionLabel: string;
  collectionSubtitle?: string;
}) {
  switch (variant) {
    case "a":
      return (
        <DetailVariantA
          product={product}
          language={language}
          title={title}
          collectionLabel={collectionLabel}
        />
      );
    case "b":
      return (
        <DetailVariantB
          product={product}
          language={language}
          title={title}
          collectionLabel={collectionLabel}
          collectionSubtitle={collectionSubtitle}
        />
      );
    case "c":
      return <DetailVariantC product={product} language={language} title={title} />;
    default:
      return (
        <DetailVariantA
          product={product}
          language={language}
          title={title}
          collectionLabel={collectionLabel}
        />
      );
  }
}

export function ProductDetailVariantPreviewLink({
  sku,
  variant,
  label,
}: {
  sku: string;
  variant: ProductDetailVariant;
  label: string;
}) {
  return (
    <Link
      href={`/shop/${sku}?preview=${variant}`}
      className="font-body text-[10px] uppercase tracking-[0.16em] shop-catalog-muted underline underline-offset-4 hover:text-[var(--lookbook-ink)]"
    >
      {label}
    </Link>
  );
}
