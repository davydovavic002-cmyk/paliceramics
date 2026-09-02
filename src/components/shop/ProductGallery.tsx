"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { isDataImageUrl } from "@/lib/productImageUpload";
import { filterProjectImages } from "@/lib/productImages";
import { useLanguage } from "@/context/LanguageContext";

interface ProductGalleryProps {
  images: string[];
  title: string;
  compact?: boolean;
  imageLabels?: string[];
}

const SWIPE_THRESHOLD = 48;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.75;

function pinchDistance(touches: React.TouchList | TouchList) {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

export function ProductGallery({ images, title, compact = false, imageLabels }: ProductGalleryProps) {
  const { language } = useLanguage();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);
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

  const resetZoom = useCallback(() => setZoom(1), []);

  useEffect(() => {
    resetZoom();
    setLightboxOpen(false);
  }, [active, resetZoom]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!hasMultiple) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        resetZoom();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        resetZoom();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, hasMultiple, resetZoom]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      pinchStartDistance.current = pinchDistance(e.touches);
      pinchStartZoom.current = zoom;
      touchStart.current = null;
      return;
    }
    touchStart.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length < 2 || pinchStartDistance.current === null) return;
    const distance = pinchDistance(e.touches);
    if (distance <= 0) return;
    const nextZoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, pinchStartZoom.current * (distance / pinchStartDistance.current))
    );
    setZoom(nextZoom);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length >= 1) return;
    pinchStartDistance.current = null;
    if (touchStart.current === null || !hasMultiple || zoom > 1.05) {
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
        compact ? "p-3 sm:p-4 lg:px-5 lg:pt-4 lg:pb-3" : "p-3 sm:p-5 lg:px-6 lg:pt-5 lg:pb-5",
      ].join(" ")}
    >
      <div
        className={[
          "shop-product-gallery-well relative w-full shrink-0 overflow-hidden rounded-xl",
          compact ? "aspect-[4/3] sm:aspect-square" : "aspect-[4/3] sm:aspect-square",
        ].join(" ")}
        tabIndex={hasMultiple ? 0 : undefined}
        role={hasMultiple ? "region" : undefined}
        aria-label={hasMultiple ? `${title} — gallery` : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[color-mix(in_srgb,#010a8b_20%,transparent)] bg-[color-mix(in_srgb,#faf7f0_92%,transparent)] text-[#010a8b] shadow-sm backdrop-blur-sm"
          aria-label={language === "pl" ? "Powiększ zdjęcie" : "View larger image"}
        >
          <ZoomIn className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <div
          className="pointer-events-none absolute inset-0 transition-transform duration-75 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
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
              onClick={() => {
                resetZoom();
                goPrev();
              }}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,#010a8b_20%,transparent)] bg-[color-mix(in_srgb,#faf7f0_92%,transparent)] text-[#010a8b] shadow-sm backdrop-blur-sm sm:left-3 sm:h-10 sm:w-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => {
                resetZoom();
                goNext();
              }}
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
            compact ? "mt-2 lg:mt-3" : "mt-3 sm:mt-4",
          ].join(" ")}
        >
          {projectImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => {
                resetZoom();
                setActive(index);
              }}
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

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#121418]/92 p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] z-10 rounded-full border border-white/20 bg-black/30 p-2 text-white"
            aria-label={language === "pl" ? "Zamknij" : "Close"}
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div
            className="relative h-[min(85dvh,720px)] w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeSrc}
              alt={title}
              fill
              unoptimized={unoptimized}
              sizes="100vw"
              quality={88}
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
