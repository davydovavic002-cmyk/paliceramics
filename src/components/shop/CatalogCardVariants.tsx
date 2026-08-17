"use client";

import Link from "next/link";
import Image from "next/image";
import { useMotionFlags } from "@/context/DemoControlsContext";
import type { ShopProduct } from "@/lib/shopCatalog";
import { isOutOfStock } from "@/lib/shopCatalog";
import { ShopStatusBadge } from "./ShopStatusBadge";

export type CatalogCardVariant = "a" | "b" | "c";

interface CatalogCardVariantProps {
  product: ShopProduct;
  title: string;
  collectionLabel: string;
  collectionSubtitle?: string;
  index?: number;
  variant: CatalogCardVariant;
  className?: string;
}

function StatusCorner({
  product,
  className = "left-3 top-3",
}: {
  product: ShopProduct;
  className?: string;
}) {
  const out = isOutOfStock(product);
  if (!out && product.status !== "sold") return null;
  return (
    <div className={`absolute ${className}`}>
      <ShopStatusBadge status={product.status} outOfStock={out} />
    </div>
  );
}

/** A — lookbook-lite: без серого well, тонкие линии, керамика целиком */
function CardVariantA({
  product,
  title,
  collectionLabel,
  className = "",
}: Omit<CatalogCardVariantProps, "variant" | "index" | "collectionSubtitle">) {
  const { showImageHoverScale } = useMotionFlags();

  return (
    <Link
      href={`/shop/${product.sku}`}
      className={[
        "group flex h-full w-full flex-col border border-[var(--lookbook-line)] bg-transparent text-left transition-opacity duration-300 hover:opacity-90",
        className,
      ].join(" ")}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={product.image}
          alt={title}
          fill
          sizes="(max-width:768px) 50vw, 33vw"
          className={[
            "object-contain object-center p-4 sm:p-6",
            "transition-transform duration-500",
            showImageHoverScale ? "group-hover:scale-[1.02]" : "",
          ].join(" ")}
        />
        <StatusCorner product={product} />
      </div>
      <div className="border-t border-[var(--lookbook-line)] px-4 py-3 sm:px-5 sm:py-4">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] shop-catalog-muted">
          {collectionLabel}
        </p>
        <p className="lookbook-ink mt-1.5 font-display text-sm leading-snug sm:text-[15px]">
          {title}
        </p>
        <p className="lookbook-ink mt-2 font-body text-sm">
          {product.pricePln > 0 ? `${product.pricePln} PLN` : "—"}
        </p>
      </div>
    </Link>
  );
}

/** B — мини-обложка коллекции: номер, uppercase, subtitle */
function CardVariantB({
  product,
  title,
  collectionLabel,
  collectionSubtitle,
  index = 0,
  className = "",
}: Omit<CatalogCardVariantProps, "variant">) {
  const { showImageHoverScale } = useMotionFlags();

  return (
    <Link
      href={`/shop/${product.sku}`}
      className={[
        "group relative flex h-full min-h-[280px] flex-col overflow-hidden bg-[var(--lookbook-bg-well)] text-left transition-opacity duration-300 hover:opacity-95",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-4 sm:p-5">
        <span className="shop-catalog-muted font-body text-[10px] uppercase tracking-[0.28em]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative min-h-[140px] flex-1">
        <Image
          src={product.image}
          alt={title}
          fill
          sizes="(max-width:768px) 50vw, 33vw"
          className={[
            "object-contain object-center p-6 pt-10 sm:p-7 sm:pt-11",
            "transition-transform duration-500",
            showImageHoverScale ? "group-hover:scale-[1.03]" : "",
          ].join(" ")}
        />
        <StatusCorner product={product} className="right-3 top-3" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[var(--lookbook-bg-well)] to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 shrink-0 px-4 pb-4 sm:px-5 sm:pb-5">
        <p className="lookbook-ink font-display text-[clamp(0.95rem,2vw,1.15rem)] uppercase leading-snug tracking-[0.05em]">
          {collectionLabel}
        </p>
        <p className="shop-catalog-muted mt-1 font-body text-xs leading-relaxed">
          {collectionSubtitle ?? title}
        </p>
        <p className="lookbook-ink mt-2 font-body text-sm">
          {product.pricePln > 0 ? `${product.pricePln} PLN` : "—"}
        </p>
      </div>
    </Link>
  );
}

/** C — минимум UI: фото + название + цена */
function CardVariantC({
  product,
  title,
  className = "",
}: Pick<CatalogCardVariantProps, "product" | "title" | "className">) {
  const { showImageHoverScale } = useMotionFlags();

  return (
    <Link
      href={`/shop/${product.sku}`}
      className={["group flex h-full w-full flex-col text-left", className].join(" ")}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.image}
          alt={title}
          fill
          sizes="(max-width:768px) 50vw, 33vw"
          className={[
            "object-contain object-center p-2 sm:p-3",
            "transition-transform duration-500",
            showImageHoverScale ? "group-hover:scale-[1.03]" : "",
          ].join(" ")}
        />
        <StatusCorner product={product} className="right-2 top-2" />
      </div>
      <div className="pt-2.5">
        <p className="lookbook-ink font-display text-sm leading-snug">{title}</p>
        <p className="mt-1 font-body text-sm shop-catalog-muted">
          {product.pricePln > 0 ? `${product.pricePln} PLN` : "—"}
        </p>
      </div>
    </Link>
  );
}

export function CatalogCardVariantView(props: CatalogCardVariantProps) {
  switch (props.variant) {
    case "a":
      return <CardVariantA {...props} />;
    case "b":
      return <CardVariantB {...props} />;
    case "c":
      return <CardVariantC product={props.product} title={props.title} className={props.className} />;
    default:
      return <CardVariantA {...props} />;
  }
}
