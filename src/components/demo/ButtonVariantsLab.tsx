"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import {
  BUTTON_VARIANTS,
  DEMO_TAB_ITEMS,
  variantKanjiClass,
  variantLabelClass,
  variantTabClass,
  type ButtonVariantId,
} from "@/lib/buttonVariants";
import { galleryHeader } from "@/lib/galleryContent";

function VariantTabRow({ variant }: { variant: ButtonVariantId }) {
  const [active, setActive] = useState<(typeof DEMO_TAB_ITEMS)[number]["id"]>("lookbook");

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {DEMO_TAB_ITEMS.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={variantTabClass(variant, selected)}
          >
            {variant === "pill" ? (
              <>
                <span className={variantKanjiClass(variant, selected)}>{tab.kanji}</span>
                <span className={variantLabelClass(variant)}>{tab.label}</span>
              </>
            ) : variant === "wheel" ? (
              <>
                <span className={variantKanjiClass(variant, selected)}>{tab.kanji}</span>
                <span className={variantLabelClass(variant)}>{tab.label}</span>
              </>
            ) : (
              <>
                <span className={variantKanjiClass(variant, selected)}>{tab.kanji}</span>
                <span className={variantLabelClass(variant)}>{tab.label}</span>
                {variant === "slip" ? (
                  <span
                    className={[
                      "absolute -bottom-0.5 h-px bg-[var(--theme-accent)] transition-all duration-300",
                      selected ? "w-full opacity-80" : "w-0 opacity-0 group-hover:w-2/3 group-hover:opacity-40",
                    ].join(" ")}
                    aria-hidden
                  />
                ) : null}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

function GalleryBlockPreview({ variant }: { variant: ButtonVariantId }) {
  const meta = BUTTON_VARIANTS.find((v) => v.id === variant)!;

  return (
    <article className="rounded-xl border border-[#252b38] bg-[#161922] p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5c6578]">
            Variant {BUTTON_VARIANTS.findIndex((v) => v.id === variant) + 1}
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">{meta.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#8b95a8]">{meta.tagline}</p>
        </div>
        {variant === "hanko" ? (
          <span className="rounded-full border border-[#3d5a48]/40 bg-[#1a2e22]/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#9fd4a8]">
            Current
          </span>
        ) : null}
      </div>

      {/* Duplicated Gallery header (static preview) */}
      <div className="rounded-lg border border-[#2a3142] bg-theme-elevated px-4 py-8 text-theme transition-colors sm:px-6">
        <header className="mx-auto max-w-md text-center">
          <p className="font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted">
            {galleryHeader.eyebrow.en}
          </p>
          <h4 className="mt-3 font-display text-xl leading-tight tracking-[0.05em] sm:text-2xl">
            {galleryHeader.title.en}
          </h4>
          <p className="mt-2 font-body text-xs leading-relaxed text-theme-muted sm:text-sm">
            {galleryHeader.subtitle.en}
          </p>
        </header>

        <div className="mt-8">
          <VariantTabRow variant={variant} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 opacity-60">
          <div className="aspect-[3/4] rounded-[2px] border border-theme bg-theme-surface/50" />
          <div className="aspect-[3/4] rounded-[2px] border border-theme bg-theme-surface/50" />
        </div>
      </div>

      <p className="mt-3 text-xs text-[#6b7588]">
        <span className="text-[#8b95a8]">Best for:</span> {meta.bestFor}
      </p>
    </article>
  );
}

export function ButtonVariantsLab() {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Layers className="h-4 w-4 text-[#8b95a8]" strokeWidth={1.5} />
        <div>
          <h2 className="text-sm font-semibold text-white">Button styles lab</h2>
          <p className="text-xs text-[#8b95a8]">
            Gallery block duplicated — same content, five tab-button shapes.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {BUTTON_VARIANTS.map((variant) => (
          <GalleryBlockPreview key={variant.id} variant={variant.id} />
        ))}
      </div>
    </section>
  );
}
