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
  imageLabels?: string[];
}

const SWIPE_THRESHOLD = 48;

export function ProductGallery({ images, title, compact = false, imageLabels }: ProductGalleryProps) {
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

  const goPrev = useCallback(() => {
    setActive((i) => (i <= 0 ? projectImages.length - 1 : i - 1));
  }, [projectImages.length]);

  const goNext = useCallback(() => {
    setActive((i) => (i >= projectImages.length - 1 ? 0 : i + 1));
  }, [projectImages.length]);

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

  return (
    <div
      className={[
        "flex h-full min-h-0 w-full flex-col",
        compact ? "p-3 sm:p-4 lg:px-5 lg:pt-4 lg:pb-3" : "items-center p-3 sm:p-4 lg:px-5 lg:py-4",
      ].join(" ")}
    >
      <div
        className={[
          "shop-product-gallery-well relative w-full shrink-0 overflow-hidden rounded-xl",
          compact
            ? "aspect-[4/3] sm:aspect-square"
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
              "object-contain select-none",
              compact ? "p-3 sm:p-4" : "p-4 sm:p-6",
            ].join(" ")}
            draggable={false}
          />
        </div>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,#010a8b_20%,transparent)] bg-[color-mix(in_srgb,#faf7f0_92%,transparent)] text-[#010a8b] shadow-sm backdrop-blur-sm sm:left-3 sm:h-10 sm:w-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,#010a8b_20%,transparent)] bg-[color-mix(in_srgb,#faf7f0_92%,transparent)] text-[#010a8b] shadow-sm backdrop-blur-sm sm:right-3 sm:h-10 sm:w-10"
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
            "flex gap-2 overflow-x-auto px-0.5 py-1 sm:gap-2.5",
            compact ? "mt-2 lg:mt-3" : "mt-3 max-w-[min(100%,24rem)] sm:mt-3.5",
          ].join(" ")}
        >
          {projectImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={thumbLabel(index)}
              aria-current={safeActive === index ? "true" : undefined}
              className={[
                "shop-product-thumb relative shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010a8b] focus-visible:ring-offset-2",
                imageLabels ? "h-auto w-[4.5rem] sm:w-20" : "h-14 w-14 sm:h-16 sm:w-16",
                safeActive === index ? "shop-product-thumb-active" : "",
              ].join(" ")}
            >
              <span className="relative block h-14 w-full overflow-hidden rounded-md sm:h-16">
                <Image
                  src={src}
                  alt=""
                  fill
                  quality={60}
                  unoptimized={isDataImageUrl(src)}
                  sizes="64px"
                  loading="lazy"
                  className="object-contain p-1.5"
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
