"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isDataImageUrl } from "@/lib/productImageUpload";
import { filterProjectImages } from "@/lib/productImages";

interface ProductGalleryProps {
  images: string[];
  title: string;
  compact?: boolean;
  /** Cream well + inset padding around the photo. Regular product cards keep this on. */
  framed?: boolean;
  imageLabels?: string[];
}

const SWIPE_THRESHOLD = 48;

export function ProductGallery({
  images,
  title,
  compact = false,
  framed = true,
  imageLabels,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const projectImages = filterProjectImages(images);
  const safeActive = Math.min(active, Math.max(0, projectImages.length - 1));
  const activeSrc = projectImages[safeActive] ?? projectImages[0];
  const unoptimized = isDataImageUrl(activeSrc);
  const activeLabel = imageLabels?.[safeActive];
  const thumbLabel = (index: number) =>
    imageLabels?.[index] ?? `${title} — ${index + 1}`;
  const hasMultiple = projectImages.length > 1;

  const blurGalleryFocus = useCallback(() => {
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused.closest(".shop-product-thumb, .shop-product-gallery-nav")) {
      focused.blur();
    }
  }, []);

  const goPrev = useCallback(() => {
    setActive((i) => (i <= 0 ? projectImages.length - 1 : i - 1));
    blurGalleryFocus();
  }, [blurGalleryFocus, projectImages.length]);

  const goNext = useCallback(() => {
    setActive((i) => (i >= projectImages.length - 1 ? 0 : i + 1));
    blurGalleryFocus();
  }, [blurGalleryFocus, projectImages.length]);

  const selectImage = useCallback(
    (index: number) => {
      setActive(index);
      blurGalleryFocus();
    },
    [blurGalleryFocus]
  );

  useEffect(() => {
    if (!hasMultiple) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, hasMultiple]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStart.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null || !hasMultiple) {
      touchStart.current = null;
      return;
    }
    const endX = e.changedTouches[0]?.clientX;
    if (endX === undefined) return;
    const delta = endX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  if (!activeSrc) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--lookbook-ink)_4%,var(--lookbook-bg))] sm:aspect-square">
        <span className="font-body text-xs shop-catalog-muted">—</span>
      </div>
    );
  }

  const customOrder = !framed && !compact;

  return (
    <div
      className={[
        "flex h-full min-h-0 w-full min-w-0 flex-col",
        compact
          ? "p-3 sm:p-4 lg:px-5 lg:pt-4 lg:pb-3"
          : customOrder
            ? "p-3 sm:p-4 lg:px-5 lg:py-4"
            : "items-center p-3 sm:p-4 lg:px-5 lg:py-4",
      ].join(" ")}
    >
      <div
        className={[
          "relative w-full shrink-0 overflow-hidden",
          framed ? "shop-product-gallery-well rounded-xl" : "shop-product-gallery-well-plain",
          compact
            ? "aspect-[4/3] max-h-[min(48vw,16rem)] w-full max-w-[17.5rem] mx-auto lg:max-h-none lg:max-w-none lg:aspect-square"
            : customOrder
              ? "aspect-square"
              : "shop-product-gallery-well-standard",
        ].join(" ")}
        tabIndex={hasMultiple ? 0 : undefined}
        role={hasMultiple ? "region" : undefined}
        aria-label={hasMultiple ? `${title} — gallery` : undefined}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0">
          <Image
            key={activeSrc}
            src={activeSrc}
            alt={title}
            fill
            priority={safeActive === 0}
            quality={compact ? 72 : 80}
            unoptimized={unoptimized}
            sizes={compact ? "(max-width:1024px) 88vw, 420px" : "(max-width:1024px) 100vw, 50vw"}
            className={[
              "h-full w-full object-contain select-none",
              compact ? "p-3 sm:p-4" : customOrder ? "p-2 sm:p-3" : "p-4 sm:p-6",
            ].join(" ")}
            draggable={false}
          />
        </div>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="shop-product-gallery-nav absolute left-2 top-1/2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,#010a8b_20%,transparent)] bg-[color-mix(in_srgb,#faf7f0_92%,transparent)] text-[#010a8b] shadow-sm backdrop-blur-sm active:opacity-75 sm:left-3"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="shop-product-gallery-nav absolute right-2 top-1/2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,#010a8b_20%,transparent)] bg-[color-mix(in_srgb,#faf7f0_92%,transparent)] text-[#010a8b] shadow-sm backdrop-blur-sm active:opacity-75 sm:right-3"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 max-w-[min(92%,16rem)] -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,#faf7f0_88%,transparent)] px-2.5 py-0.5 text-center font-body text-[11px] shop-catalog-muted backdrop-blur-sm">
              {activeLabel ? (
                <>
                  <span className="lookbook-ink">{activeLabel}</span>
                  <span className="ml-1.5 tabular-nums opacity-75">
                    {safeActive + 1}/{projectImages.length}
                  </span>
                </>
              ) : (
                <span className="tabular-nums">
                  {safeActive + 1} / {projectImages.length}
                </span>
              )}
            </p>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div
          className={[
            /* overflow-x-auto also forces overflow-y to compute to auto, so this strip clips
               on every side. The 12px gutter is what keeps the focus ring (ring-2 +
               ring-offset-2 = 4px) and the active thumb's shadow from being sliced; the top
               margins below are reduced by the same amount so spacing is unchanged. */
            compact
              ? "mt-1 flex w-full min-w-0 max-w-[17.5rem] gap-2 overflow-x-auto overscroll-x-contain p-3 scroll-px-3 sm:gap-2.5 mx-auto lg:mt-1 lg:max-w-none"
              : customOrder
                ? "mt-3 grid w-full grid-cols-5 gap-2"
                : "mt-1 flex max-w-[min(100%,24rem)] gap-2 overflow-x-auto overscroll-x-contain p-3 scroll-px-3 sm:mt-1.5 sm:gap-2.5",
          ].join(" ")}
        >
          {projectImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              tabIndex={-1}
              onClick={() => selectImage(index)}
              aria-label={thumbLabel(index)}
              aria-current={safeActive === index ? "true" : undefined}
              className={[
                "shop-product-thumb relative rounded-lg outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                customOrder
                  ? "aspect-square h-auto w-full min-w-0"
                  : imageLabels
                    ? "h-auto w-[4.5rem] shrink-0 sm:w-20"
                    : "h-14 w-14 shrink-0 sm:h-16 sm:w-16",
                safeActive === index
                  ? "shop-product-thumb-active border-blue-900 ring-2 ring-inset ring-blue-900"
                  : "",
              ].join(" ")}
            >
              <span
                className={[
                  "relative block w-full overflow-hidden rounded-md",
                  customOrder ? "aspect-square h-full" : "h-14 sm:h-16",
                ].join(" ")}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  quality={60}
                  unoptimized={isDataImageUrl(src)}
                  sizes={customOrder ? "80px" : "64px"}
                  loading="lazy"
                  className="h-full w-full object-contain p-1"
                />
              </span>
              {imageLabels?.[index] ? (
                <span className="mt-1 block truncate px-0.5 text-center font-body text-[10px] leading-tight shop-catalog-muted">
                  {imageLabels[index]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
