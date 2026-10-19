"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useMotionFlags } from "@/context/DemoControlsContext";
import type { ShopProduct } from "@/lib/shopCatalog";
import { isOutOfStock } from "@/lib/shopCatalog";
import { isDataImageUrl } from "@/lib/productImageUpload";
import { mediaSrc } from "@/lib/productImages";
import { appendReturnTo } from "@/lib/shopReturnTo";
import { resolveProductReturnTo, saveShopScrollPosition } from "@/lib/shopScrollRestore";
import { t } from "@/lib/galleryContent";
import { ShopStatusBadge } from "./ShopStatusBadge";

const linkFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lookbook-ink)] focus-visible:ring-offset-2";

const soldPriceClass = "line-through opacity-60 text-stone-500";

interface CatalogProductCardProps {
  product: ShopProduct;
  title: string;
  categoryLabel?: string;
  variant?: "grid" | "shop" | "lookbook" | "lookbook-tile" | "lookbook-wide";
  className?: string;
  imagePriority?: boolean;
}

function CatalogPrice({
  amount,
  unavailable,
  className,
}: {
  amount: number;
  unavailable: boolean;
  className: string;
}) {
  if (amount <= 0) return null;
  return (
    <p
      className={
        unavailable
          ? className.replace("shop-catalog-muted", "").trim() + ` ${soldPriceClass}`
          : className
      }
    >
      {amount} PLN
    </p>
  );
}

export function CatalogProductCard({
  product,
  title,
  variant = "grid",
  className = "",
  imagePriority = false,
}: CatalogProductCardProps) {
  const { language } = useLanguage();
  const { showImageHoverScale, showHoverTilt } = useMotionFlags();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const out = isOutOfStock(product);
  const sold = product.status === "sold";
  const unavailable = sold || out;
  const unoptimizedImage = isDataImageUrl(product.image);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hoverScale = showImageHoverScale
    ? "[@media(hover:hover)]:group-hover:scale-[1.02]"
    : "";

  const returnTo = resolveProductReturnTo(
    pathname,
    searchParams.toString(),
    searchParams.get("returnTo")
  );
  const productHref = appendReturnTo(`/shop/${product.sku}`, returnTo);

  const onOpenProduct = () => {
    if (pathname === "/shop" || pathname === "/shop/made-to-order") {
      saveShopScrollPosition(returnTo);
    }
  };

  if (variant === "lookbook-tile" || variant === "lookbook-wide" || variant === "lookbook") {
    const wide = variant === "lookbook-wide";
    return (
      <Link
        href={productHref}
        onClick={onOpenProduct}
        className={["group flex h-full w-full flex-col", linkFocus, className].join(" ")}
      >
        <div
          className={[
            "relative w-full flex-1 overflow-hidden",
            wide ? "min-h-[160px]" : "min-h-[200px]",
          ].join(" ")}
        >
          <Image
            src={mediaSrc(product.image, 640)}
            alt={title}
            fill
            unoptimized={unoptimizedImage}
            sizes={wide ? "(max-width:1024px) 50vw, 50vw" : "(max-width:1024px) 50vw, 25vw"}
            className={[
              "object-contain object-center p-4 sm:p-5",
              "transition-transform duration-500",
              hoverScale,
            ].join(" ")}
          />
        </div>
        <div className="shrink-0 bg-transparent p-3 pt-2 transition-opacity duration-300 sm:p-4 sm:pt-2 [@media(hover:hover)]:group-hover:opacity-90">
          <p className="lookbook-ink font-display text-sm leading-snug sm:text-[15px]">
            {title}
          </p>
          <CatalogPrice
            amount={product.pricePln}
            unavailable={unavailable}
            className="mt-0.5 font-body text-[11px] tracking-[0.08em] shop-catalog-muted"
          />
          {unavailable ? (
            <div className="mt-1">
              <ShopStatusBadge status={product.status} outOfStock={out} variant="light" />
            </div>
          ) : null}
        </div>
      </Link>
    );
  }

  if (variant === "shop") {
    const sizeLabel = t(product.specs.dimensions, language);

    return (
      <Link
        href={productHref}
        onClick={onOpenProduct}
        className={["group flex h-full w-full flex-col text-left", linkFocus, className].join(" ")}
      >
        <div className="shop-card-image relative aspect-[4/5] w-full overflow-hidden sm:aspect-square !border-0 !shadow-none">
          {!imageLoaded ? (
            <div
              className="absolute inset-0 animate-pulse bg-[color-mix(in_srgb,var(--lookbook-ink)_8%,var(--lookbook-bg))]"
              aria-hidden
            />
          ) : null}
          <Image
            src={mediaSrc(product.image, 640)}
            alt={title}
            fill
            priority={imagePriority}
            fetchPriority={imagePriority ? "high" : undefined}
            loading={imagePriority ? "eager" : "lazy"}
            quality={imagePriority ? 62 : 52}
            unoptimized={unoptimizedImage}
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
            onLoadingComplete={() => setImageLoaded(true)}
            className={[
              "object-cover object-center",
              "transition-transform duration-500 ease-out",
              hoverScale,
            ].join(" ")}
          />
        </div>

        <div className="flex min-h-[3.5rem] flex-col gap-0.5 pt-2 font-product-medium text-[11px] leading-snug tracking-[0.06em] sm:min-h-[4rem]">
          <p className="lookbook-ink line-clamp-1">
            <span className="shop-catalog-muted">{language === "pl" ? "nr" : "no"}</span>{" "}
            <span className="tabular-nums">{product.sku}</span>
          </p>
          <p className="lookbook-ink line-clamp-2">
            <span className="shop-catalog-muted">{language === "pl" ? "rozmiar" : "size"}</span>{" "}
            <span>{sizeLabel}</span>
          </p>
          <div className="mt-auto space-y-1 pt-1">
            <CatalogPrice
              amount={product.pricePln}
              unavailable={unavailable}
              className="font-body text-[12px] tabular-nums shop-catalog-muted sm:text-[13px]"
            />
            {unavailable ? (
              <ShopStatusBadge status={product.status} outOfStock={out} variant="light" />
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={productHref}
      onClick={onOpenProduct}
      className={[
        "group flex h-full w-full flex-col overflow-hidden bg-theme-surface/50 text-left shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-[transform,box-shadow] duration-500",
        showHoverTilt
          ? "[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
          : "",
        linkFocus,
        className,
      ].join(" ")}
    >
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[color-mix(in_srgb,var(--theme-surface)_85%,#2a2826)]">
        <Image
          src={mediaSrc(product.image, 640)}
          alt={title}
          fill
          unoptimized={unoptimizedImage}
          sizes="(max-width:640px) 50vw, 25vw"
          className={[
            "object-cover transition-transform duration-500",
            showImageHoverScale ? "[@media(hover:hover)]:group-hover:scale-[1.05]" : "",
          ].join(" ")}
        />
      </div>
      <div className="flex min-h-[7.25rem] flex-1 flex-col p-4 transition-colors duration-300 [@media(hover:hover)]:group-hover:bg-[color-mix(in_srgb,var(--theme-surface-accent)_12%,transparent)] sm:min-h-[7.5rem]">
        <p className="h-3 shrink-0 font-body text-[11px] leading-none tracking-[0.18em] text-theme-muted">
          {product.sku}
        </p>
        <p className="mt-1 h-[2.75rem] shrink-0 overflow-hidden font-display text-sm leading-snug text-theme sm:h-[3rem] sm:text-base">
          <span className="line-clamp-2">{title}</span>
        </p>
        <div className="mt-auto shrink-0 space-y-1 pt-2">
          <CatalogPrice
            amount={product.pricePln}
            unavailable={unavailable}
            className="font-body text-[11px] leading-none tracking-[0.1em] text-theme-muted"
          />
          {unavailable ? (
            <ShopStatusBadge status={product.status} outOfStock={out} variant="light" />
          ) : null}
        </div>
      </div>
    </Link>
  );
}
