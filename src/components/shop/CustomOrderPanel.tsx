"use client";

import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import {
  customOrderContent,
  customOrderCatalogCard,
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
  const { t, paragraphs } = useSiteTexts();

  const copy =
    language === "pl"
      ? {
          eyebrow: "Na zamówienie",
          about: t("mto.about"),
          contact: t("mto.contactHeading"),
          close: "Zamknij",
          minBadge: t("mto.stripPrice"),
          email: "Email",
          instagram: "Instagram",
          facebook: "Facebook",
        }
      : {
          eyebrow: "Made to order",
          about: t("mto.about"),
          contact: t("mto.contactHeading"),
          close: "Close",
          minBadge: t("mto.stripPrice"),
          email: "Email",
          instagram: "Instagram",
          facebook: "Facebook",
        };

  const title = t("mto.title");
  const subtitle = t("mto.subtitle");
  const eyebrow = t("mto.label");
  const body = paragraphs("mto.body");

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
    <div
      role="region"
      aria-labelledby="custom-order-title"
      className="delivery-faq-panel shop-product-sheet relative z-10 rounded-2xl sm:rounded-[1.75rem]"
    >
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="shop-product-close absolute right-2 top-2 z-30 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#faf7f0]/85 p-2 text-[#010a6b] md:hidden transition-opacity hover:opacity-65 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010a8b] focus-visible:ring-offset-2 sm:right-4 sm:top-4"
          aria-label={copy.close}
        >
          <X className="h-5 w-5" strokeWidth={2.25} />
        </button>
      ) : null}

      <div className="shop-product-sheet-inner grid min-w-0 grid-cols-1 rounded-2xl sm:rounded-[1.75rem] md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
        <div className="shop-product-gallery-zone shop-product-gallery-zone-standard flex min-h-0 min-w-0 flex-col overflow-visible rounded-t-2xl sm:rounded-t-[1.75rem] md:rounded-l-[1.75rem] md:rounded-tr-none">
          <ProductGallery
            images={customOrderCatalogCard.galleryImages}
            title={title}
            framed={false}
          />
        </div>

        <div className="shop-product-info-zone delivery-faq-split-b flex min-h-0 flex-col overflow-visible rounded-b-2xl border-[var(--delivery-faq-line)] px-4 py-5 font-inter sm:px-6 sm:py-6 md:rounded-none md:rounded-tr-[1.75rem] md:rounded-br-[1.75rem] md:border-b-0 md:border-l lg:px-8 lg:py-8">
          <div className="flex items-center justify-between gap-3">
            <p className="shop-product-collection-tag min-w-0 font-inter text-[10px] uppercase tracking-[0.18em] text-theme-muted">
              {eyebrow}
            </p>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="shop-product-close -my-2.5 -mr-2 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#010a6b] transition-opacity hover:opacity-65 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010a8b] md:inline-flex"
                aria-label={copy.close}
              >
                <X className="h-5 w-5" strokeWidth={2.25} />
              </button>
            ) : null}
          </div>

          <h1
            id="custom-order-title"
            className="mt-1.5 min-w-0 font-inter text-lg font-normal leading-snug tracking-tight text-theme sm:text-xl"
          >
            {title}
          </h1>
          <p className="mt-1 font-inter text-xs font-normal leading-relaxed text-slate-500">
            {subtitle}
          </p>

          <div className="mt-2.5 flex items-center justify-between gap-4">
            <p className="font-inter text-base font-medium tabular-nums tracking-tight text-slate-900">
              {copy.minBadge}
            </p>
          </div>

          <div className="mt-4">
            <p className="shop-product-section-label font-inter">
              {copy.about}
            </p>
            <div className="mt-2 space-y-2">
              {body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 28)}
                  className="max-w-prose font-inter text-sm font-normal leading-relaxed text-theme"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-4 pb-1">
            <p className="shop-product-section-label font-inter">
              {copy.contact}
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {contactLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="block min-h-[44px] py-3 transition-opacity hover:opacity-70 active:opacity-70"
                >
                  <span className="block font-inter text-sm font-normal text-slate-900">
                    {link.label}
                  </span>
                  <span className="mt-0.5 block break-all font-inter text-xs font-normal leading-relaxed text-slate-500">
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
