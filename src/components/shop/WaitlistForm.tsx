"use client";

import { useState } from "react";
import { submitInboxMessage } from "@/lib/inboxClient";
import { useLanguage } from "@/context/LanguageContext";
import { ConsentField } from "@/components/site/ConsentField";

interface WaitlistFormProps {
  sku: string;
  productTitle: string;
  variant?: "default" | "product" | "panel";
  onSuccess?: () => void;
}

export function WaitlistForm({
  sku,
  productTitle,
  variant = "default",
  onSuccess,
}: WaitlistFormProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const light = variant === "product" || variant === "panel";

  const copy =
    language === "pl"
      ? {
          title: "Lista oczekujących",
          hint: "Powiadomimy Cię, gdy ten egzemplarz wróci do sklepu.",
          email: "Email",
          submit: "Dołącz do listy",
          success: "Zapisano zgłoszenie. Odpiszemy w ciągu 24–48 godzin.",
          errEmail: "Podaj poprawny email.",
          errConsent: "Zaznacz zgodę, aby kontynuować.",
        }
      : {
          title: "Waitlist",
          hint: "We will notify you when this piece is back in stock.",
          email: "Email",
          submit: "Join waitlist",
          success: "Request saved. We'll reply within 24–48 hours.",
          errEmail: "Please enter a valid email.",
          errConsent: "Please accept the consent to continue.",
        };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      setError(copy.errEmail);
      return;
    }
    if (!consent) {
      setError(copy.errConsent);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitInboxMessage("waitlist", {
        sku,
        product: productTitle,
        email: trimmed,
        lang: language,
      });

      if (!result.ok) {
        setError(
          language === "pl" ? "Nie udało się zapisać na listę." : "Could not join the waitlist."
        );
        return;
      }

      setSavedEmail(trimmed);
      setSent(true);
      setEmail("");
      setConsent(false);
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div
        className={
          variant === "panel"
            ? "px-4 py-4"
            : light
              ? "space-y-4 rounded-xl border border-[color-mix(in_srgb,#010a8b_12%,transparent)] bg-[color-mix(in_srgb,#ffffff_55%,transparent)] px-4 py-4"
              : "space-y-4 rounded-lg border border-[color-mix(in_srgb,var(--theme-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface-accent)_40%,transparent)] px-4 py-4"
        }
      >
        <p
          className={
            light
              ? "font-body text-sm delivery-faq-ink"
              : "font-body text-sm text-theme"
          }
        >
          {copy.success}
        </p>
      </div>
    );
  }

  if (variant === "panel" || variant === "product") {
    const formClass =
      variant === "panel"
        ? "p-4 sm:p-5"
        : "rounded-xl border border-[color-mix(in_srgb,#010a8b_10%,transparent)] bg-[color-mix(in_srgb,#ffffff_72%,transparent)] p-4 sm:p-5";

    return (
      <form onSubmit={(e) => void submit(e)} className={formClass}>
        <div>
          <p className="delivery-faq-ink font-body text-[10px] uppercase tracking-[0.2em]">
            {copy.title}
          </p>
          <p className="delivery-faq-muted mt-2 font-body text-[13px] leading-relaxed">
            {copy.hint}
          </p>
        </div>

        <label className="mt-4 block">
          <span className="sr-only">{copy.email}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.email}
            className="w-full rounded-full border border-[color-mix(in_srgb,#010a8b_14%,transparent)] bg-white px-4 py-2.5 font-body text-sm delivery-faq-ink outline-none placeholder:text-[color-mix(in_srgb,#010a8b_32%,#4a4a55)] focus:border-[#010a8b]"
          />
        </label>

        <div className="mt-3.5">
          <ConsentField checked={consent} onChange={setConsent} purpose="waitlist" tone="light" />
        </div>

        {error ? (
          <p className="mt-3 font-body text-xs text-[color-mix(in_srgb,#8b1a1a_85%,#010a8b)]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="shop-waitlist-btn mt-4 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.2em] disabled:opacity-60"
        >
          {copy.submit}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-3 rounded-lg border border-theme/20 bg-theme-surface/30 p-4">
      <div>
        <p className="font-display text-sm tracking-wide text-theme">{copy.title}</p>
        <p className="mt-1 font-body text-xs text-theme-muted">{copy.hint}</p>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={copy.email}
        className="w-full rounded-[2px] border border-theme/25 bg-theme-elevated/50 px-3 py-2.5 font-body text-sm text-theme outline-none focus:border-[var(--theme-accent)]"
      />
      <ConsentField checked={consent} onChange={setConsent} purpose="waitlist" />
      {error ? <p className="text-xs text-red-400/90">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-[2px] border border-[color-mix(in_srgb,var(--theme-accent)_45%,transparent)] bg-[var(--theme-btn-primary)] px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.2em] text-theme-btn transition-colors hover:bg-[var(--theme-accent-hover)] disabled:opacity-60"
      >
        {copy.submit}
      </button>
    </form>
  );
}
