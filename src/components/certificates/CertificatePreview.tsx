"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  formatNominalPln,
  generateCertificatePng,
  getCertificatePrice,
  VOUCHER_COLORS,
  type CertificateDraft,
} from "@/lib/certificate";
import { useAdminContent } from "@/hooks/useAdminContent";
import { resolveCertificateTypes } from "@/lib/contentResolve";
import type { CertificateType } from "@/lib/certificate";

interface CertificatePreviewProps {
  draft: CertificateDraft;
  purchaseDate?: string | null;
}

function previewCacheKey(
  draft: CertificateDraft,
  language: "en" | "pl",
  purchaseDate?: string | null
) {
  return [
    draft.type,
    draft.participantCount,
    draft.recipientName.trim(),
    language,
    purchaseDate ?? "",
  ].join("|");
}

function preloadObjectUrl(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Preview image failed to load"));
    img.src = url;
  });
}

async function ensurePreview(
  draft: CertificateDraft,
  language: "en" | "pl",
  purchaseDate: string | null | undefined,
  cache: Map<string, string>
) {
  const key = previewCacheKey(draft, language, purchaseDate);
  const cached = cache.get(key);
  if (cached) return cached;

  const blob = await generateCertificatePng(draft, language, purchaseDate);
  const url = URL.createObjectURL(blob);
  await preloadObjectUrl(url);
  cache.set(key, url);
  return url;
}

export function CertificatePreview({ draft, purchaseDate = null }: CertificatePreviewProps) {
  const { language } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const requestRef = useRef(0);
  const displaySrcRef = useRef<string | null>(null);

  useEffect(() => {
    displaySrcRef.current = displaySrc;
  }, [displaySrc]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const requestId = ++requestRef.current;

    const timer = window.setTimeout(() => {
      void ensurePreview(draft, language, purchaseDate, cacheRef.current)
        .then((url) => {
          if (requestRef.current !== requestId) return;
          setDisplaySrc(url);
        })
        .catch(() => {
          if (requestRef.current === requestId && !displaySrcRef.current) {
            setDisplaySrc(null);
          }
        });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [draft.type, draft.participantCount, draft.recipientName, inView, language, purchaseDate]);

  useEffect(
    () => () => {
      for (const url of cacheRef.current.values()) {
        URL.revokeObjectURL(url);
      }
      cacheRef.current.clear();
    },
    []
  );

  return (
    <div
      ref={rootRef}
      className="relative aspect-[3496/2480] w-full shrink-0 overflow-hidden shadow-[0_24px_56px_rgba(0,0,0,0.22)]"
      style={{ backgroundColor: VOUCHER_COLORS.paper, contain: "layout paint" }}
    >
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={language === "pl" ? "Podgląd vouchera" : "Gift voucher preview"}
          width={3496}
          height={2480}
          className="absolute inset-0 block h-full w-full object-fill"
          draggable={false}
        />
      ) : (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: `color-mix(in srgb, ${VOUCHER_COLORS.paper} 96%, #010a8b)` }}
          aria-hidden
        />
      )}
    </div>
  );
}

function voucherPickerBtn(active: boolean) {
  return [
    "flex min-h-[44px] flex-1 flex-col items-start justify-center px-3 py-2.5 text-left transition-colors sm:min-w-[11rem] sm:px-4",
    active
      ? "border border-[#010a8b] bg-[#010a8b] text-[#ede8df]"
      : "border border-[color-mix(in_srgb,#010a8b_35%,transparent)] bg-transparent text-[#010a8b] hover:bg-[color-mix(in_srgb,#010a8b_6%,transparent)]",
  ].join(" ");
}

export function CertificateTypePicker({
  value,
  participantCount = 1,
  onChange,
}: {
  value: CertificateType;
  participantCount?: 1 | 2;
  onChange: (value: CertificateType) => void;
}) {
  const { language } = useLanguage();
  const { voucherContent } = useAdminContent();
  const resolvedTypes = useMemo(
    () => resolveCertificateTypes(voucherContent),
    [voucherContent]
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-nowrap">
      {(["workshop-once", "pottery-course"] as const).map((type) => {
        const meta = resolvedTypes[type];
        const active = value === type;
        const price = getCertificatePrice(
          {
            type,
            participantCount,
          },
          meta
        );
        const peopleNote =
          participantCount === 2
            ? language === "pl"
              ? " · 2 osoby"
              : " · 2 people"
            : language === "pl"
              ? " · 1 osoba"
              : " · 1 person";

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={voucherPickerBtn(active)}
          >
            <span className="block font-display text-[13px] tracking-[0.03em] sm:text-sm">
              {meta.label[language]}
            </span>
            <span className="mt-0.5 block font-body text-[9px] tracking-[0.08em] opacity-80 sm:text-[10px]">
              {language === "pl" ? meta.detailPl : meta.detailEn} ·{" "}
              {formatNominalPln(price, language)}
              {peopleNote}
            </span>
          </button>
        );
      })}
    </div>
  );
}
