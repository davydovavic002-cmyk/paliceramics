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
import { appendReturnTo } from "@/lib/shopReturnTo";
import { resolveProductReturnTo, saveShopScrollPosition } from "@/lib/shopScrollRestore";
import { statusLabels, t } from "@/lib/galleryContent";

const linkFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lookbook-ink)] focus-visible:ring-offset-2";

interface CatalogProductCardProps {
  product: ShopProduct;
  title: string;
  categoryLabel?: string;
  variant?: "grid" | "shop" | "lookbook" | "lookbook-tile" | "lookbook-wide";
  className?: string;
  imagePriority?: boolean;
}

function cardStatusLine(
  product: ShopProduct,
  language: "en" | "pl",
  out: boolean
): string | null {
  if (product.status === "sold") {
    return t(statusLabels.sold, language);
  }
  if (out) {
    return language === "pl" ? "Wyprzedane" : "Sold out";
  }
  return null;
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
  const statusLine = cardStatusLine(product, language, out);
  const unoptimizedImage = isDataImageUrl(product.image);
  const [imageLoaded, setImageLoaded] = useState(false);

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
        className={[
          "group flex h-full w-full flex-col bg-transparent p-3 transition-opacity duration-300 hover:opacity-90 sm:p-4",
          linkFocus,
          className,
        ].join(" ")}
      >
        <div
          className={[
            "relative w-full flex-1 overflow-hidden",
            wide ? "min-h-[160px]" : "min-h-[200px]",
          ].join(" ")}
        >
          <Image
            src={product.image}
            alt={title}
            fill
            unoptimized={unoptimizedImage}
            sizes={wide ? "(max-width:1024px) 50vw, 50vw" : "(max-width:1024px) 50vw, 25vw"}
            className={[
              "object-contain object-center p-4 sm:p-5",
              "transition-transform duration-500",
              showImageHoverScale ? "group-hover:scale-[1.02]" : "",
            ].join(" ")}
          />
        </div>
        <div className="shrink-0 pt-2">
          <p className="lookbook-ink font-display text-sm leading-snug sm:text-[15px]">
            {title}
          </p>
          {product.pricePln > 0 ? (
            <p className="mt-0.5 font-body text-[11px] tracking-[0.08em] shop-catalog-muted">
              {product.pricePln} PLN
            </p>
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
        className={[
          "group flex h-full w-full flex-col text-left",
          linkFocus,
          className,
        ].join(" ")}
      >
        <div className="shop-card-image relative aspect-[4/5] w-full overflow-hidden sm:aspect-square">
          {!imageLoaded ? (
            <div
              className="absolute inset-0 animate-pulse bg-[color-mix(in_srgb,var(--lookbook-ink)_8%,var(--lookbook-bg))]"
              aria-hidden
            />
          ) : null}
          <Image
            src={product.image}
            alt={title}
            fill
            priority={imagePriority}
            fetchPriority={imagePriority ? "high" : undefined}
            loading={imagePriority ? "eager" : "lazy"}
            quality={imagePriority ? 62 : 52}
            unoptimized={unoptimizedImage}
            sizes="(max-width: 768px) 180px, (max-width: 1280px) 220px, 180px"
            onLoad={() => setImageLoaded(true)}
            onLoadingComplete={() => setImageLoaded(true)}
            className={[
              "object-contain object-center p-3 sm:p-5",
              "transition-transform duration-500 ease-out",
              showImageHoverScale ? "group-hover:scale-[1.02]" : "",
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
          <div className="mt-auto space-y-0.5 pt-1">
            {product.pricePln > 0 ? (
              <p className="font-body text-[12px] tabular-nums shop-catalog-muted sm:text-[13px]">
                {product.pricePln} PLN
              </p>
            ) : null}
            {statusLine ? (
              <p className="font-body text-[11px] shop-catalog-muted">{statusLine}</p>
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
        linkFocus,
        showHoverTilt ? "hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.22)]" : "",
        className,
      ].join(" ")}
    >
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[color-mix(in_srgb,var(--theme-surface)_85%,#2a2826)]">
        <Image
          src={product.image}
          alt={title}
          fill
          unoptimized={unoptimizedImage}
          sizes="(max-width:640px) 50vw, 25vw"
          className={[
            "object-cover transition-transform duration-500",
            showImageHoverScale ? "group-hover:scale-[1.05]" : "",
          ].join(" ")}
        />
      </div>
      <div className="flex min-h-[7.25rem] flex-1 flex-col p-4 transition-colors duration-300 group-hover:bg-[color-mix(in_srgb,var(--theme-surface-accent)_12%,transparent)] sm:min-h-[7.5rem]">
        <p className="h-3 shrink-0 font-body text-[9px] leading-none tracking-[0.18em] text-theme-muted">
          {product.sku}
        </p>
        <p className="mt-1 h-[2.75rem] shrink-0 overflow-hidden font-display text-sm leading-snug text-theme sm:h-[3rem] sm:text-base">
          <span className="line-clamp-2">{title}</span>
        </p>
        <p className="mt-auto h-5 shrink-0 pt-2 font-body text-[11px] leading-none tracking-[0.1em] text-theme-muted">
          {product.pricePln > 0 ? `${product.pricePln} PLN` : "—"}
        </p>
      </div>
    </Link>
  );
}
