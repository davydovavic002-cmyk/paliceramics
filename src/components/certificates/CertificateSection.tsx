"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useFormKeyboardScroll } from "@/hooks/useFormKeyboardScroll";
import { useAdminContent } from "@/hooks/useAdminContent";
import { submitInboxMessage } from "@/lib/inboxClient";
import {
  resolveCertificateTypes,
  voucherSectionCopyForLanguage,
} from "@/lib/contentResolve";
import {
  certificateNominalNote,
  formatNominalPln,
  getCertificatePrice,
  type CertificateDraft,
} from "@/lib/certificate";
import { CertificatePreview, CertificateTypePicker } from "./CertificatePreview";
import { ConsentField } from "@/components/site/ConsentField";
import { MotionReveal } from "@/components/ui/MotionReveal";

import { brandRectButtonClass } from "@/components/ui/BrandRectButton";
import { useFormDraft } from "@/hooks/useFormDraft";

const initialCertificateDraft: CertificateDraft = {
  type: "workshop-once",
  recipientName: "",
  buyerEmail: "",
  participantCount: 1,
};

const inputClass =
  "w-full rounded-lg border border-theme/20 bg-theme-elevated/50 px-4 py-2 font-body text-sm text-theme outline-none transition-colors focus:border-[#010a8b]";

export function CertificateSection() {
  const { language } = useLanguage();
  const { voucherContent } = useAdminContent();
  const resolvedTypes = useMemo(
    () => resolveCertificateTypes(voucherContent),
    [voucherContent]
  );
  const sectionCopy = useMemo(
    () => voucherSectionCopyForLanguage(voucherContent.section, language),
    [voucherContent.section, language]
  );
  const { value: draft, setValue: setDraft, clearDraft, hydrated } = useFormDraft(
    "pali-cert-draft",
    initialCertificateDraft
  );
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useFormKeyboardScroll<HTMLFormElement>();

  useEffect(() => {
    if (!hydrated || sent) return;
    const dirty = Boolean(draft.recipientName.trim() || draft.buyerEmail.trim());
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [draft.buyerEmail, draft.recipientName, hydrated, sent]);

  const typePricing = resolvedTypes[draft.type];
  const nominalNote = certificateNominalNote(draft, language, typePricing);
  const nominalPrice = getCertificatePrice(draft, typePricing);

  const copy = {
    ...sectionCopy,
    consent:
      language === "pl"
        ? "Wyrażam zgodę na kontakt w sprawie vouchera (RODO — placeholder)."
        : "I agree to be contacted about this gift card (GDPR placeholder).",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const recipient = draft.recipientName.trim();
    const email = draft.buyerEmail.trim();
    const meta = resolvedTypes[draft.type];

    if (recipient.length < 2) {
      setError(copy.errRecipient);
      return;
    }
    if (!email.includes("@")) {
      setError(copy.errEmail);
      return;
    }
    if (!consent) {
      setError(copy.errConsent);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitInboxMessage("certificate", {
        type: draft.type,
        voucherLabel: meta.label[language],
        nominal: `${getCertificatePrice(draft, typePricing)} PLN`,
        recipient,
        buyerEmail: email,
        participantCount: String(draft.participantCount),
        lang: language,
      });

      if (!result.ok) {
        setError(language === "pl" ? "Nie udało się wysłać zapytania." : "Could not send the request.");
        return;
      }

      setSent(true);
      setConsent(false);
      clearDraft();
    } catch {
      setError(language === "pl" ? "Nie udało się wysłać zapytania." : "Could not send the request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="certificates"
      className="relative isolate scroll-mt-[var(--header-offset,5.5rem)] bg-theme-surface pb-4 text-theme transition-colors duration-700 sm:pb-8"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-border)]/20 to-transparent"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 48% 38% at 78% 28%, rgba(210,190,160,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 42% 32% at 12% 72%, rgba(90,106,130,0.06) 0%, transparent 50%)
          `,
        }}
        aria-hidden
      />

      <div className="section-inner !pt-8 sm:!pt-9 lg:!pt-10">
        <header className="mx-auto max-w-2xl text-center">
          <MotionReveal>
            <p className="font-body text-[11px] uppercase tracking-[0.32em] text-theme-muted">
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[0.06em] text-theme">
              {copy.title}
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed tracking-[0.04em] text-theme-muted sm:text-[15px]">
              {copy.subtitle}
            </p>
          </MotionReveal>
        </header>

        <div className="mx-auto mt-6 flex max-w-3xl gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--theme-accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface-accent)_35%,transparent)] px-3.5 py-2.5 lg:max-w-none">
          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-theme-muted" strokeWidth={1.5} />
          <p className="font-body text-[11px] leading-snug text-theme-muted">{copy.flowNote}</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10 xl:gap-12">
          <div className="certificate-preview-lazy mx-auto w-full max-w-[22rem] shrink-0 sm:max-w-[24rem] lg:mx-0 lg:max-w-[25rem] xl:max-w-[27rem]">
            <CertificatePreview draft={draft} />
          </div>

          <div className="mx-auto w-full max-w-[28rem] lg:mx-0 lg:max-w-none">
            {sent ? (
              <div className="space-y-4 rounded-2xl border border-[color-mix(in_srgb,var(--theme-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface-accent)_40%,transparent)] p-5">
                <p className="font-body text-sm leading-relaxed text-theme">{copy.success}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setDraft(initialCertificateDraft);
                    clearDraft();
                  }}
                  className="block font-body text-xs text-theme-muted underline underline-offset-4 hover:text-theme"
                >
                  {language === "pl" ? "Nowe zapytanie" : "New request"}
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={(e) => void submit(e)}
                className="form-keyboard-safe space-y-3.5 pb-2"
              >
                <div className="min-h-[6.75rem]">
                  <p className="mb-1.5 font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                    {copy.typeLabel}
                  </p>
                  <CertificateTypePicker
                    value={draft.type}
                    participantCount={draft.participantCount}
                    onChange={(type) => setDraft((prev) => ({ ...prev, type }))}
                  />
                </div>

                <div>
                  <span className="mb-1 block font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                    {copy.participants}
                  </span>
                  <div className="flex gap-2">
                    {([1, 2] as const).map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, participantCount: count }))}
                        className={[
                          "flex-1 min-h-[44px] px-4 py-2.5 font-body text-[10px] tracking-[0.14em] transition-colors sm:text-[11px]",
                          draft.participantCount === count
                            ? "border border-[#010a8b] bg-[#010a8b] text-[#ede8df]"
                            : "border border-[color-mix(in_srgb,#010a8b_35%,transparent)] bg-transparent text-[#010a8b] hover:bg-[color-mix(in_srgb,#010a8b_6%,transparent)]",
                        ].join(" ")}
                      >
                        {count === 1 ? copy.onePerson : copy.twoPeople}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 font-body text-[11px] leading-snug text-theme-muted lg:hidden">
                    {copy.participantsHint}
                  </p>
                  <p className="mt-1.5 font-body text-sm text-theme">
                    {language === "pl" ? "Nominał:" : "Nominal:"}{" "}
                    <span className="font-medium tabular-nums">
                      {formatNominalPln(nominalPrice, language)}
                    </span>
                    {nominalNote ? (
                      <span className="ml-1.5 font-body text-[11px] text-theme-muted">
                        ({nominalNote})
                      </span>
                    ) : null}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-1 block font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                    {copy.recipient}
                  </span>
                  <input
                    value={draft.recipientName}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, recipientName: e.target.value }))
                    }
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                    {copy.buyerEmail}
                  </span>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={draft.buyerEmail}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, buyerEmail: e.target.value }))
                    }
                    className={inputClass}
                  />
                </label>

                <ConsentField checked={consent} onChange={setConsent} purpose="certificate" />

                <div className="space-y-2 pt-1">
                  {error ? <p className="text-xs text-red-400/90">{error}</p> : null}
                  <button type="submit" disabled={submitting} className={`w-full ${brandRectButtonClass(true)}`}>
                    {copy.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
