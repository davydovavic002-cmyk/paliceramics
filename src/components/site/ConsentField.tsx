"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface ConsentFieldProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  purpose: "booking" | "waitlist" | "certificate";
  tone?: "default" | "light";
}

export function ConsentField({ checked, onChange, purpose, tone = "default" }: ConsentFieldProps) {
  const { language } = useLanguage();
  const light = tone === "light";
  const labelClass = light
    ? "font-body text-[11px] leading-relaxed delivery-faq-muted"
    : "font-body text-[11px] leading-relaxed text-theme-muted";
  const linkClass = light
    ? "underline underline-offset-4 hover:opacity-75 delivery-faq-ink"
    : "underline underline-offset-4 hover:text-theme";

  const policy =
    language === "pl" ? (
      <>
        {purpose === "booking" ? (
          <>
            Akceptuję{" "}
            <Link href="/regulamin" className={linkClass}>
              regulamin sklepu
            </Link>{" "}
            i wyrażam zgodę na kontakt w sprawie rezerwacji warsztatu. Zapoznałem/am się z{" "}
          </>
        ) : (
          <>
            Akceptuję{" "}
            <Link href="/regulamin" className={linkClass}>
              regulamin sklepu
            </Link>{" "}
            i wyrażam zgodę na kontakt w sprawie{" "}
            {purpose === "waitlist" ? "powiadomienia o dostępności" : "obsługi vouchera upominkowego"}
            . Zapoznałem/am się z{" "}
          </>
        )}
        <Link href="/privacy" className={linkClass}>
          polityką prywatności
        </Link>
        . Zgoda jest dobrowolna i może być wycofana.
      </>
    ) : (
      <>
        I accept the{" "}
        <Link href="/regulamin" className={linkClass}>
          shop terms
        </Link>{" "}
        and agree to be contacted about{" "}
        {purpose === "booking"
          ? "my workshop booking"
          : purpose === "waitlist"
            ? "product availability"
            : "gift voucher handling"}
        . I have read the{" "}
        <Link href="/privacy" className={linkClass}>
          privacy policy
        </Link>
        . Consent is voluntary and may be withdrawn.
      </>
    );

  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={
          light
            ? "mt-1 h-3.5 w-3.5 shrink-0 rounded-[2px] border border-[color-mix(in_srgb,var(--delivery-faq-ink)_35%,transparent)] accent-[var(--delivery-faq-ink)]"
            : "mt-1 h-3.5 w-3.5 shrink-0 rounded-[2px] accent-[var(--theme-accent)]"
        }
        required
      />
      <span className={[labelClass, "min-w-0 flex-1 leading-[1.55]"].join(" ")}>{policy}</span>
    </label>
  );
}
