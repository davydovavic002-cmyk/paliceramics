"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import {
  customOrderContent,
  customOrderCatalogCard,
  madeToOrderCategoryLabel,
} from "@/lib/customOrderContent";
import { ProductGallery } from "./ProductGallery";

function contactHref(kind: "email" | "instagram" | "facebook", value: string): string {
  const trimmed = value.trim();
  if (kind === "email") return `mailto:${trimmed}`;
  if (kind === "instagram") {
    return trimmed.startsWith("http") ? trimmed : `https://instagram.com/${trimmed.replace(/^@/, "")}`;
  }
  return trimmed.startsWith("http") ? trimmed : `https://facebook.com/${trimmed.replace(/^@/, "")}`;
}

export function CustomOrderPanel() {
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const copy =
    language === "pl"
      ? {
          eyebrow: "Na zamówienie",
          about: "O zamówieniach",
          contact: "Kontakt",
          minBadge: "od 400 zł",
          cta: "Napisz do nas",
          choose: "Wybierz sposób kontaktu",
          email: "Email",
          instagram: "Instagram",
          facebook: "Facebook",
        }
      : {
          eyebrow: "Made to order",
          about: "About custom orders",
          contact: "Contact",
          minBadge: "from 400 PLN",
          cta: "Get in touch",
          choose: "Choose how to reach us",
          email: "Email",
          instagram: "Instagram",
          facebook: "Facebook",
        };

  const title = pickBilingual(customOrderContent.title, customOrderContent.title, language);
  const subtitle = pickBilingual(customOrderContent.subtitle, customOrderContent.subtitle, language);
  const eyebrow = pickBilingual(madeToOrderCategoryLabel, madeToOrderCategoryLabel, language);
  const body = customOrderContent.body[language];

  const emailHref = contactHref("email", customOrderContent.email);
  const instagramHref = contactHref("instagram", customOrderContent.instagram);
  const facebookHref = contactHref("facebook", customOrderContent.facebook);

  useEffect(() => {
    if (!menuOpen) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("click", onClickOutside);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="delivery-faq-panel shop-product-sheet shop-product-sheet-compact relative rounded-[1.35rem]">
      <div className="shop-product-sheet-inner grid rounded-[1.35rem] lg:grid-cols-2 lg:items-stretch">
        <div className="shop-product-gallery-zone flex min-h-0 flex-col overflow-hidden rounded-t-[1.35rem] lg:rounded-l-[1.35rem] lg:rounded-tr-none">
          <ProductGallery
            images={customOrderCatalogCard.galleryImages}
            title={title}
            compact
          />
        </div>

        <div className="shop-product-info-zone shop-product-info-zone-compact delivery-faq-split-b flex min-h-0 flex-col overflow-visible rounded-b-[1.35rem] border-[var(--delivery-faq-line)] px-5 py-5 sm:px-6 sm:py-6 lg:min-h-full lg:rounded-none lg:rounded-tr-[1.35rem] lg:rounded-br-[1.35rem] lg:border-b-0 lg:border-l">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="shop-product-collection-tag delivery-faq-muted font-body text-[10px] uppercase">
              {eyebrow}
            </p>
          </div>

          <h1 className="delivery-faq-ink mt-2 font-display text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.15] tracking-[0.02em]">
            {title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <p className="shop-product-price delivery-faq-ink font-display text-[1rem] tabular-nums">
              {copy.minBadge}
            </p>
            <p className="delivery-faq-muted font-body text-[11px]">{subtitle}</p>
          </div>

          <div className="mt-5">
            <p className="shop-product-section-label font-body">{copy.about}</p>
            <div className="mt-2.5 space-y-2">
              {body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 28)}
                  className="delivery-faq-ink max-w-prose font-body text-[13px] leading-[1.6]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="shop-product-section-label font-body">{copy.contact}</p>
            <div ref={menuRef} className="relative z-30 mt-2.5 inline-block w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="shop-buy-btn inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.22em] sm:w-auto"
              >
                {copy.cta}
                <ChevronDown
                  className={["h-3.5 w-3.5 transition-transform", menuOpen ? "rotate-180" : ""].join(" ")}
                />
              </button>

              {menuOpen ? (
                <div className="shop-buy-menu-panel delivery-faq-panel absolute left-0 top-[calc(100%+0.5rem)] z-40 w-full min-w-[15rem] overflow-hidden rounded-xl sm:min-w-[16.5rem]">
                  <p className="delivery-faq-ink border-b border-[color-mix(in_srgb,#010a8b_12%,transparent)] px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.2em]">
                    {copy.choose}
                  </p>
                  <div className="p-1.5">
                    <a
                      href={emailHref}
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,#010a8b_6%,transparent)]"
                    >
                      <span className="delivery-faq-ink font-body text-sm">{copy.email}</span>
                      <span className="delivery-faq-muted mt-0.5 block font-body text-[11px] leading-snug">
                        {customOrderContent.email}
                      </span>
                    </a>
                    <a
                      href={instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,#010a8b_6%,transparent)]"
                    >
                      <span className="delivery-faq-ink font-body text-sm">{copy.instagram}</span>
                    </a>
                    <a
                      href={facebookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,#010a8b_6%,transparent)]"
                    >
                      <span className="delivery-faq-ink font-body text-sm">{copy.facebook}</span>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
