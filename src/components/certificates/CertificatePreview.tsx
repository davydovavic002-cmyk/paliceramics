"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminContent } from "@/hooks/useAdminContent";
import { resolveCertificateTypes } from "@/lib/contentResolve";
import {
  certificateRecipientLine,
  formatNominalPln,
  getCertificatePrice,
  voucherTemplateLayout,
  VOUCHER_COLORS,
  type CertificateDraft,
  type CertificateType,
  type VoucherOverlayRect,
} from "@/lib/certificate";

interface CertificatePreviewProps {
  draft: CertificateDraft;
  purchaseDate?: string | null;
}

function SpacedLine({ children, className = "" }: { children: string; className?: string }) {
  return <span className={className}>{children.split("").join(" ")}</span>;
}

function formatPurchaseDate(value: string | null | undefined, language: "en" | "pl"): string | null {
  if (!value?.trim()) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(language === "pl" ? "pl-PL" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function overlayStyle(rect: VoucherOverlayRect): CSSProperties {
  return {
    top: `${rect.top * 100}%`,
    left: `${rect.left * 100}%`,
    width: `${rect.width * 100}%`,
    height: `${rect.height * 100}%`,
  };
}

export function CertificatePreview({ draft, purchaseDate = null }: CertificatePreviewProps) {
  const { language } = useLanguage();
  const layout = voucherTemplateLayout[draft.type];
  const recipientLine = certificateRecipientLine(draft, language);
  const dateLine = formatPurchaseDate(purchaseDate, language);

  return (
    <motion.div
      className="relative aspect-[3496/2480] w-full overflow-hidden shadow-[0_24px_56px_rgba(0,0,0,0.22)]"
      layout
    >
      <Image
        src={layout.src}
        alt=""
        fill
        priority
        unoptimized
        sizes="(max-width:768px) 90vw, 432px"
        className="object-cover object-center"
      />

      <div
        className="pointer-events-none absolute flex items-center justify-center"
        style={{ ...overlayStyle(layout.recipient), backgroundColor: VOUCHER_COLORS.paper }}
        aria-hidden
      >
        <p
          className="w-full text-center font-sans font-semibold leading-none tracking-[0.18em]"
          style={{ color: VOUCHER_COLORS.ink, fontSize: "clamp(7px, 2.05vw, 11px)" }}
        >
          <SpacedLine>{recipientLine}</SpacedLine>
        </p>
      </div>

      {dateLine ? (
        <div
          className="pointer-events-none absolute flex items-center"
          style={{ ...overlayStyle(layout.dateValue), backgroundColor: VOUCHER_COLORS.paper }}
          aria-hidden
        >
          <p
            className="font-sans leading-none tracking-[0.08em]"
            style={{ color: VOUCHER_COLORS.ink, fontSize: "clamp(6px, 1.55vw, 9px)" }}
          >
            {dateLine}
          </p>
        </div>
      ) : null}
    </motion.div>
  );
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
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
            className={[
              "flex-1 rounded-full border px-3 py-2.5 text-left transition-colors sm:min-w-[11rem] sm:px-4",
              active
                ? "border-[color-mix(in_srgb,var(--theme-accent)_55%,transparent)] bg-[var(--theme-btn-primary)] text-theme-btn"
                : "border-theme/20 bg-theme-elevated/40 text-theme-muted hover:border-theme/35 hover:text-theme",
            ].join(" ")}
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
