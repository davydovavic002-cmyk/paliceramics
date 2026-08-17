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
  voucherCode?: string | null;
}

function SpacedLine({ children, className = "" }: { children: string; className?: string }) {
  return <span className={className}>{children.split("").join(" ")}</span>;
}

export function CertificatePreview({ draft, voucherCode }: CertificatePreviewProps) {
  const { language } = useLanguage();
  const meta = certificateTypeMeta[draft.type];
  const titleLines = language === "pl" ? meta.titlePl : meta.titleEn;
  const detail = language === "pl" ? meta.detailPl : meta.detailEn;
  const recipientLine = certificateRecipientLine(draft, language);

  return (
    <motion.div
      className="relative aspect-[3496/2480] w-full overflow-hidden shadow-[0_24px_56px_rgba(0,0,0,0.22)]"
      style={{ backgroundColor: VOUCHER_COLORS.paper, color: VOUCHER_COLORS.ink }}
      layout
    >
      <div className="absolute inset-0 flex flex-col px-[5%] pb-[6%] pt-[4%] sm:px-[6%] sm:pb-[6.5%] sm:pt-[4.5%]">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <p className="font-body text-[7px] tracking-[0.08em] sm:text-[9px]">
            @pali.ceramics
          </p>
          <p className="font-display text-[10px] tracking-[0.32em] sm:text-xs">
            [ V O U C H E R ]
          </p>
          <div className="relative h-8 w-8 shrink-0 sm:h-10 sm:w-10">
            <Image
              src="/images/brand/pali-logo-circle.png"
              alt=""
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-[1.5%] text-center">
          <div className="space-y-0.5 sm:space-y-1">
            {titleLines.map((line) => (
              <p
                key={line}
                className="font-body text-[7px] leading-snug tracking-[0.16em] sm:text-[10px] sm:tracking-[0.2em]"
              >
                <SpacedLine>{line}</SpacedLine>
              </p>
            ))}
          </div>

          <p className="mt-1.5 font-body text-[6px] tracking-[0.14em] sm:mt-2 sm:text-[9px] sm:tracking-[0.18em]">
            <SpacedLine>{detail}</SpacedLine>
          </p>

          <p className="mt-2 font-body text-[8px] font-semibold tracking-[0.18em] sm:mt-2.5 sm:text-[11px] sm:tracking-[0.22em]">
            <SpacedLine>{recipientLine}</SpacedLine>
          </p>

          <div className="relative my-2 h-[12%] max-h-[3.25rem] w-[32%] shrink-0 sm:my-2.5 sm:max-h-[4rem]">
            <Image
              src="/images/hero/ceramics-collage-cutout.png"
              alt=""
              fill
              unoptimized
              className="object-contain object-center"
            />
          </div>
        </div>

        <div
          className="shrink-0 border-t pt-2 sm:pt-2.5"
          style={{ borderColor: `${VOUCHER_COLORS.ink}33` }}
        >
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 sm:gap-x-6">
            <div className="space-y-1">
              {voucherCode ? (
                <>
                  <p className="font-body text-[5px] leading-snug tracking-[0.1em] sm:text-[7px]">
                    <SpacedLine>{language === "pl" ? "kod vouchera:" : "voucher code:"}</SpacedLine>
                  </p>
                  <p className="font-mono text-[7px] font-bold leading-snug sm:text-[9px]">
                    {voucherCode}
                  </p>
                </>
              ) : null}
            </div>
            <div className="space-y-0.5 text-right font-body text-[4.5px] leading-snug sm:text-[6px] sm:leading-relaxed">
              <p>
                {language === "pl" ? "Voucher ważny 3 miesiące." : "Voucher valid for 3 months."}
              </p>
              <p>palipali.ceramic@gmail.com</p>
              <p>@pali.ceramics</p>
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
