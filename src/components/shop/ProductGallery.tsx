"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
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
const TAP_SLOP = 12;

function touchDistance(a: Touch, b: Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function getFocusable(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

export function ProductImageLightbox({
  images,
  index,
  title,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(index);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(
    null
  );
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const pinchUsedRef = useRef(false);
  const projectImages = filterProjectImages(images);
  const safeCurrent = Math.min(current, Math.max(0, projectImages.length - 1));
  const src = projectImages[safeCurrent] ?? projectImages[0];
  const hasMultiple = projectImages.length > 1;
  const closeLabel = language === "pl" ? "Zamknij" : "Close";
  const prevLabel = language === "pl" ? "Poprzednie zdjęcie" : "Previous image";
  const nextLabel = language === "pl" ? "Następne zdjęcie" : "Next image";

  const applyTransform = useCallback(() => {
    const el = imageWrapRef.current;
    if (!el) return;
    el.style.transform = `translate(${panRef.current.x}px, ${panRef.current.y}px) scale(${scaleRef.current})`;
  }, []);

  const resetZoom = useCallback(() => {
    scaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    applyTransform();
  }, [applyTransform]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!projectImages.length) return;
      const wrapped =
        (nextIndex + projectImages.length) % projectImages.length;
      setCurrent(wrapped);
      onIndexChange?.(wrapped);
      resetZoom();
    },
    [onIndexChange, projectImages.length, resetZoom]
  );

  const goPrev = useCallback(() => goTo(safeCurrent - 1), [goTo, safeCurrent]);
  const goNext = useCallback(() => goTo(safeCurrent + 1), [goTo, safeCurrent]);

  useEffect(() => {
    setCurrent(index);
    resetZoom();
  }, [index, resetZoom]);

  useEffect(() => {
    setMounted(true);
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      restoreFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    closeRef.current?.focus();
  }, [mounted]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && hasMultiple) {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === "ArrowRight" && hasMultiple) {
        event.preventDefault();
        goNext();
        return;
      }
      if (event.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusable = getFocusable(root);
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        } else if (!root.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [goNext, goPrev, hasMultiple, onClose]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length >= 2) {
        swipeStartRef.current = null;
        panStartRef.current = null;
        pinchUsedRef.current = true;
        pinchRef.current = {
          distance: touchDistance(event.touches[0], event.touches[1]),
          scale: scaleRef.current,
        };
        return;
      }
      if (event.touches.length === 1) {
        pinchRef.current = null;
        if (scaleRef.current > 1) {
          swipeStartRef.current = null;
          panStartRef.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
            panX: panRef.current.x,
            panY: panRef.current.y,
          };
        } else {
          panStartRef.current = null;
          swipeStartRef.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length >= 2 && pinchRef.current) {
        event.preventDefault();
        pinchUsedRef.current = true;
        const next = Math.min(
          4,
          Math.max(
            1,
            (pinchRef.current.scale * touchDistance(event.touches[0], event.touches[1])) /
              pinchRef.current.distance
          )
        );
        scaleRef.current = next;
        if (next <= 1.02) {
          scaleRef.current = 1;
          panRef.current = { x: 0, y: 0 };
        }
        applyTransform();
        return;
      }
      if (event.touches.length === 1 && panStartRef.current && scaleRef.current > 1) {
        event.preventDefault();
        panRef.current = {
          x: panStartRef.current.panX + event.touches[0].clientX - panStartRef.current.x,
          y: panStartRef.current.panY + event.touches[0].clientY - panStartRef.current.y,
        };
        applyTransform();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length >= 2) return;
      if (event.touches.length === 1) {
        pinchRef.current = null;
        return;
      }

      const pinched = pinchUsedRef.current;
      pinchRef.current = null;
      panStartRef.current = null;
      pinchUsedRef.current = false;

      if (pinched || scaleRef.current > 1) {
        swipeStartRef.current = null;
        return;
      }

      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      const end = event.changedTouches[0];
      if (!start || !end || !hasMultiple) return;
      const deltaX = end.clientX - start.x;
      const deltaY = end.clientY - start.y;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX < 0) goNext();
      else goPrev();
    };

    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    stage.addEventListener("touchend", onTouchEnd);
    stage.addEventListener("touchcancel", onTouchEnd);
    return () => {
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("touchend", onTouchEnd);
      stage.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [applyTransform, goNext, goPrev, hasMultiple, mounted]);

  if (!mounted || !src) return null;

  const arrowClass =
    "absolute top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#010a8b]/15 bg-[#faf7f0]/60 text-[#010a8b]/55 transition-opacity hover:opacity-100 active:opacity-80 before:absolute before:-inset-1 before:content-['']";

  return createPortal(
    <div
      ref={dialogRef}
      className="product-gallery-lightbox backdrop-blur-md bg-stone-900/30"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="flex min-h-full w-full items-center justify-center px-2 py-2 sm:px-4 sm:py-[max(1rem,env(safe-area-inset-top))] sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          className="product-gallery-lightbox-card relative flex flex-col rounded-xl border border-[#010a8b] bg-[#faf7f0] shadow-[0_16px_40px_rgba(28,25,23,0.16)]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#010a6b] transition-opacity hover:opacity-65 active:opacity-70"
            aria-label={closeLabel}
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>

          {hasMultiple ? (
            <button
              type="button"
              onClick={goPrev}
              className={`${arrowClass} left-4`}
              aria-label={prevLabel}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
          ) : null}

          {hasMultiple ? (
            <button
              type="button"
              onClick={goNext}
              className={`${arrowClass} right-4`}
              aria-label={nextLabel}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          ) : null}

          <div
            ref={stageRef}
            className="product-gallery-lightbox-stage relative flex min-h-0 w-full flex-1 flex-col"
          >
            <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center overflow-hidden p-3 sm:p-4">
              <div
                ref={imageWrapRef}
                className="product-gallery-lightbox-image relative flex h-full min-h-0 w-full items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${title} — ${safeCurrent + 1}`}
                  draggable={false}
                  className="h-auto w-auto max-h-full max-w-full select-none object-contain"
                />
              </div>
            </div>
          </div>

          {hasMultiple ? (
            <div className="flex shrink-0 flex-col items-center gap-2 px-4 pb-4 pt-1">
              <p className="text-center font-inter text-[11px] tabular-nums tracking-wide text-[#010a8b]/70">
                {safeCurrent + 1} / {projectImages.length}
              </p>
              <div className="flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto">
                {projectImages.map((thumbSrc, thumbIndex) => {
                  const activeThumb = safeCurrent === thumbIndex;
                  return (
                    <button
                      key={`${thumbSrc}-${thumbIndex}`}
                      type="button"
                      onClick={() => goTo(thumbIndex)}
                      aria-label={`${title} — ${thumbIndex + 1}`}
                      aria-current={activeThumb ? "true" : undefined}
                      className={[
                        "relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border transition-opacity hover:opacity-80 active:opacity-70",
                        activeThumb
                          ? "border-[#010a8b]"
                          : "border-[color-mix(in_srgb,#c4b092_50%,#ede8df)]",
                      ].join(" ")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbSrc}
                        alt=""
                        className="h-16 w-16 object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <span className="sr-only">{title}</span>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ProductGallery({
  images,
  title,
  compact = false,
  framed = true,
  imageLabels,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const pinchActive = useRef(false);
  const didSwipe = useRef(false);
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

  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  useEffect(() => {
    if (!hasMultiple) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }
      if (lightboxOpen) return;

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
  }, [goNext, goPrev, hasMultiple, lightboxOpen]);

  const fromNav = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest(".shop-product-gallery-nav"));

  const onTouchStart = (e: React.TouchEvent) => {
    if (fromNav(e.target)) return;
    if (e.touches.length !== 1) {
      pinchActive.current = true;
      touchStart.current = null;
      return;
    }
    pinchActive.current = false;
    didSwipe.current = false;
    touchStart.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      pinchActive.current = true;
      touchStart.current = null;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (fromNav(e.target)) {
      touchStart.current = null;
      pinchActive.current = false;
      return;
    }
    if (pinchActive.current) {
      pinchActive.current = false;
      touchStart.current = null;
      return;
    }
    const startX = touchStart.current;
    touchStart.current = null;
    const endX = e.changedTouches[0]?.clientX;
    if (startX === null || endX === undefined) return;
    const delta = endX - startX;
    if (hasMultiple && Math.abs(delta) >= SWIPE_THRESHOLD) {
      didSwipe.current = true;
      if (delta < 0) goNext();
      else goPrev();
      return;
    }
    if (Math.abs(delta) < TAP_SLOP) {
      openLightbox();
    }
  };

  const onGalleryClick = (e: React.MouseEvent) => {
    if (fromNav(e.target)) return;
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    openLightbox();
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
          "relative w-full shrink-0 cursor-zoom-in overflow-hidden",
          framed ? "shop-product-gallery-well rounded-xl" : "shop-product-gallery-well-plain",
          compact
            ? "aspect-[4/3] max-h-[min(48vw,16rem)] w-full max-w-[17.5rem] mx-auto lg:max-h-none lg:max-w-none lg:aspect-square"
            : customOrder
              ? "mx-auto aspect-[4/5] max-w-[27rem]"
              : "shop-product-gallery-well-standard",
        ].join(" ")}
        tabIndex={hasMultiple ? 0 : undefined}
        role={hasMultiple ? "region" : undefined}
        aria-label={hasMultiple ? `${title} — gallery` : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onGalleryClick}
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
            sizes={compact ? "(max-width:1024px) 88vw, 420px" : "(max-width:1024px) 92%, 50vw"}
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
              className="shop-product-gallery-nav absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#010a8b]/15 bg-[#faf7f0]/60 text-[#010a8b]/55 backdrop-blur-sm before:absolute before:-inset-1 before:content-[''] active:opacity-80 sm:left-3"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="shop-product-gallery-nav absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#010a8b]/15 bg-[#faf7f0]/60 text-[#010a8b]/55 backdrop-blur-sm before:absolute before:-inset-1 before:content-[''] active:opacity-80 sm:right-3"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
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
                : "mt-1 flex max-w-[min(100%,27rem)] gap-2 overflow-x-auto overscroll-x-contain p-3 scroll-px-3 sm:mt-1.5 sm:gap-2.5",
          ].join(" ")}
        >
          {projectImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              tabIndex={-1}
              onClick={() => {
                selectImage(index);
              }}
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

      {lightboxOpen && projectImages.length ? (
        <ProductImageLightbox
          images={projectImages}
          index={safeActive}
          title={title}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setActive}
        />
      ) : null}
    </div>
  );
}
