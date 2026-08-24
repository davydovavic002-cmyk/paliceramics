"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  certificateRecipientLine,
  certificateTypeMeta,
  formatNominalPln,
  getCertificatePrice,
  VOUCHER_COLORS,
  type CertificateDraft,
  type CertificateType,
} from "@/lib/certificate";

interface CertificatePreviewProps {
  draft: CertificateDraft;
  purchaseDate?: string | null;
}

function SpacedLine({ children, className = "" }: { children: string; className?: string }) {
  return <span className={className}>{children.split("").join(" ")}</span>;
}

function formatPurchaseDate(value: string | null | undefined, language: "en" | "pl"): string {
  if (!value?.trim()) {
    return "[ DD / MM / YYYY ]";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(language === "pl" ? "pl-PL" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

export function CertificatePreview({ draft, purchaseDate = null }: CertificatePreviewProps) {
  const { language } = useLanguage();
  const meta = certificateTypeMeta[draft.type];
  const titleLines = language === "pl" ? meta.titlePl : meta.titleEn;
  const detail = language === "pl" ? meta.detailPl : meta.detailEn;
  const recipientLine = certificateRecipientLine(draft, language);
  const dateLine = formatPurchaseDate(purchaseDate, language);

  const terms =
    language === "pl"
      ? [
          "voucher jest ważny przez 3 miesięcy od daty zakupu.",
          "umówienie się na zajęcia przez maila:",
          "palipali.ceramic@gmail.com",
          "lub poprzez DM na instagramie",
          "@pali.ceramics",
        ]
      : [
          "voucher is valid for 3 months from the purchase date.",
          "book a session by email:",
          "palipali.ceramic@gmail.com",
          "or via Instagram DM",
          "@pali.ceramics",
        ];

  return (
    <motion.div
      className="relative aspect-[3496/2480] w-full overflow-hidden shadow-[0_24px_56px_rgba(0,0,0,0.22)]"
      style={{ backgroundColor: VOUCHER_COLORS.paper, color: VOUCHER_COLORS.ink }}
      layout
    >
      <div className="absolute inset-0 flex flex-col px-[5.5%] pb-[5.5%] pt-[4.5%] sm:px-[6%] sm:pb-[6%] sm:pt-[4.5%]">
        <div className="flex shrink-0 items-start justify-between gap-2">
          <p className="font-body text-[6px] tracking-[0.06em] sm:text-[8px]">@pali.ceramics</p>
          <p className="font-display text-[9px] tracking-[0.28em] sm:text-[11px]">[ V O U C H E R ]</p>
          <div className="relative h-7 w-7 shrink-0 sm:h-9 sm:w-9">
            <Image
              src="/images/brand/pali-logo-circle.png"
              alt=""
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 pt-[1.5%] text-center">
            <div className="space-y-0.5 sm:space-y-1">
              {titleLines.map((line) => (
                <p
                  key={line}
                  className="font-body text-[6.5px] leading-snug tracking-[0.14em] sm:text-[9px] sm:tracking-[0.18em]"
                >
                  <SpacedLine>{line}</SpacedLine>
                </p>
              ))}
            </div>

            <p className="mt-1 font-body text-[5.5px] tracking-[0.12em] sm:mt-1.5 sm:text-[8px] sm:tracking-[0.16em]">
              <SpacedLine>{detail}</SpacedLine>
            </p>

            <p className="mt-1.5 font-body text-[7px] font-semibold tracking-[0.16em] sm:mt-2 sm:text-[10px] sm:tracking-[0.2em]">
              <SpacedLine>{recipientLine}</SpacedLine>
            </p>
          </div>

          <div className="relative mt-[2%] flex min-h-0 flex-1 items-center justify-center">
            <div className="pointer-events-none absolute left-0 top-[34%] w-[17%] max-w-[4.25rem] -translate-y-1/2 sm:max-w-[5rem]">
              <div className="relative aspect-square w-full">
                <Image
                  src="/images/vouchers/instagram-qr.png"
                  alt=""
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>

            <div className="relative h-[88%] w-[46%] max-w-[11rem] sm:max-w-[12.5rem]">
              <Image
                src="/images/hero/ceramics-collage-cutout.png"
                alt=""
                fill
                unoptimized
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>

        <div
          className="shrink-0 border-t pt-2 sm:pt-2.5"
          style={{ borderColor: `${VOUCHER_COLORS.ink}55` }}
        >
          <div className="grid grid-cols-[auto_1fr] items-end gap-x-4 gap-y-1 sm:gap-x-8">
            <div className="space-y-0.5 font-body text-[5px] leading-snug sm:text-[7px] sm:leading-relaxed">
              <p>{language === "pl" ? "data zakupu:" : "purchase date:"}</p>
              <p className="tracking-[0.08em]">{dateLine}</p>
            </div>
            <div className="space-y-0.5 text-right font-body text-[4.5px] leading-snug sm:text-[6px] sm:leading-relaxed">
              {terms.map((line) => (
                <p key={line}>{line.startsWith("palipali") || line.startsWith("@") ? line : `• ${line}`}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
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

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {(["workshop-once", "pottery-course"] as const).map((type) => {
        const meta = certificateTypeMeta[type];
        const active = value === type;
        const price = getCertificatePrice({
          type,
          participantCount: type === "workshop-once" ? participantCount : 1,
        });
        const peopleNote =
          type === "workshop-once"
            ? participantCount === 2
              ? language === "pl"
                ? " · 2 osoby"
                : " · 2 people"
              : language === "pl"
                ? " · 1 osoba"
                : " · 1 person"
            : "";

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
              {type === "workshop-once" ? peopleNote : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
