"use client";

import { X } from "lucide-react";
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

interface CustomOrderPanelProps {
  onClose?: () => void;
}

export function CustomOrderPanel({ onClose }: CustomOrderPanelProps) {
  const { language } = useLanguage();

  const copy =
    language === "pl"
      ? {
          eyebrow: "Na zamówienie",
          about: "O zamówieniach",
          contact: "Kontakt",
          close: "Zamknij",
          minBadge: "od 400 zł",
          email: "Email",
          instagram: "Instagram",
          facebook: "Facebook",
        }
      : {
          eyebrow: "Made to order",
          about: "About custom orders",
          contact: "Contact",
          close: "Close",
          minBadge: "from 400 PLN",
          email: "Email",
          instagram: "Instagram",
          facebook: "Facebook",
        };

  const title = pickBilingual(customOrderContent.title, customOrderContent.title, language);
  const galleryLabels = customOrderCatalogCard.galleryImageLabels.map((label) =>
    pickBilingual(label, label, language)
  );
  const subtitle = pickBilingual(customOrderContent.subtitle, customOrderContent.subtitle, language);
  const eyebrow = pickBilingual(madeToOrderCategoryLabel, madeToOrderCategoryLabel, language);
  const body = customOrderContent.body[language];

  const emailHref = contactHref("email", customOrderContent.email);
  const instagramHref = contactHref("instagram", customOrderContent.instagram);
  const facebookHref = contactHref("facebook", customOrderContent.facebook);

  const contactLinks = [
    {
      key: "email",
      href: emailHref,
      label: copy.email,
      detail: customOrderContent.email,
      external: false,
    },
    {
      key: "instagram",
      href: instagramHref,
      label: copy.instagram,
      detail: customOrderContent.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "@"),
      external: true,
    },
    {
      key: "facebook",
      href: facebookHref,
      label: copy.facebook,
      detail: language === "pl" ? "Messenger / Facebook" : "Messenger / Facebook",
      external: true,
    },
  ] as const;

  return (
    <div className="delivery-faq-panel shop-product-sheet shop-product-sheet-compact relative overflow-hidden rounded-[1.35rem]">
      <div className="shop-product-sheet-inner grid min-w-0 rounded-[1.35rem] lg:grid-cols-2 lg:items-stretch">
        <div className="shop-product-gallery-zone flex min-h-0 min-w-0 flex-col overflow-hidden rounded-t-[1.35rem] border-b border-[var(--delivery-faq-line)] lg:rounded-l-[1.35rem] lg:rounded-tr-none lg:border-b-0 lg:border-r">
          <ProductGallery
            images={customOrderCatalogCard.galleryImages}
            title={title}
            compact
            imageLabels={galleryLabels}
          />
        </div>

        <div className="shop-product-info-zone shop-product-info-zone-compact delivery-faq-split-b flex min-h-0 min-w-0 flex-col overflow-hidden rounded-b-[1.35rem] border-[var(--delivery-faq-line)] px-5 py-5 sm:px-6 sm:py-6 lg:min-h-full lg:overflow-visible lg:rounded-none lg:rounded-tr-[1.35rem] lg:rounded-br-[1.35rem] lg:border-b-0 lg:border-l">
          {onClose ? (
            <div className="mb-1 hidden justify-end lg:mb-0 lg:flex">
              <button
                type="button"
                onClick={onClose}
                className="shop-product-close -mr-1 -mt-1 p-1 text-[#010a8b] transition-opacity hover:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010a8b] focus-visible:ring-offset-2"
                aria-label={copy.close}
              >
                <X className="h-6 w-6" strokeWidth={1.75} />
              </button>
            </div>
          ) : null}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="shop-product-collection-tag delivery-faq-muted font-body text-[10px] uppercase">
              {eyebrow}
            </p>
          </div>

          <h1 className="delivery-faq-ink mt-2 font-display text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.15] tracking-[0.02em]">
            {title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <p className="shop-product-price delivery-faq-ink font-display tabular-nums">
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

          <div className="mt-5 pb-1">
            <p className="shop-product-section-label font-body">{copy.contact}</p>
            <div className="mt-2.5 flex flex-col gap-2">
              {contactLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="shop-buy-menu-panel block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,#010a8b_5%,transparent)]"
                >
                  <span className="delivery-faq-ink block font-body text-sm">{link.label}</span>
                  <span className="delivery-faq-muted mt-0.5 block break-all font-body text-[11px] leading-snug">
                    {link.detail}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
