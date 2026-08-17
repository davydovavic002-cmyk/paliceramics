"use client";

import { useState } from "react";
import Image from "next/image";
import { isDataImageUrl } from "@/lib/productImageUpload";

interface ProductGalleryProps {
  images: string[];
  title: string;
  compact?: boolean;
}

export function ProductGallery({ images, title, compact = false }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const safeActive = Math.min(active, Math.max(0, images.length - 1));
  const activeSrc = images[safeActive];
  const unoptimized = isDataImageUrl(activeSrc);

  return (
    <div
      className={[
        "flex h-full min-h-0 w-full flex-col",
        compact ? "p-4 sm:p-5 lg:px-5 lg:pt-5 lg:pb-4" : "p-5 sm:p-6 lg:px-7 lg:pt-6 lg:pb-6",
      ].join(" ")}
    >
      <div
        className={[
          "shop-product-gallery-well relative aspect-square w-full shrink-0 overflow-hidden rounded-xl",
          compact ? "shop-product-gallery-well-compact mx-auto lg:mx-0" : "",
        ].join(" ")}
      >
        <Image
          key={activeSrc}
          src={activeSrc}
          alt={title}
          fill
          priority
          unoptimized={unoptimized}
          sizes="(max-width:1024px) 100vw, 50vw"
          className={[
            "object-contain",
            compact ? "p-4 sm:p-5" : "p-5 sm:p-7",
          ].join(" ")}
        />
      </div>

      {images.length > 1 ? (
        <div
          className={[
            "flex gap-2.5 overflow-x-auto sm:gap-3",
            compact ? "mt-3 lg:mt-auto lg:pt-3" : "mt-5 lg:mt-auto lg:pt-4",
          ].join(" ")}
        >
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${title} — ${index + 1}`}
              className={[
                "shop-product-thumb relative shrink-0 overflow-hidden rounded-xl",
                compact ? "h-16 w-16 sm:h-[4.25rem] sm:w-[4.25rem]" : "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20",
                safeActive === index ? "shop-product-thumb-active" : "",
              ].join(" ")}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized={isDataImageUrl(src)}
                sizes="80px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
