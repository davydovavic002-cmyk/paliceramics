"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { submitInboxMessage } from "@/lib/inboxClient";
import { pickBilingual } from "@/lib/adminTypes";
import { useWorkshopData } from "@/hooks/useWorkshopData";
import { buildBookingMessage } from "@/lib/booking";
import { ContactChannelPanel } from "@/components/site/ContactChannelPanel";
import { getWorkshopMkFormat, type WorkshopMkFormatId } from "@/lib/workshopMkCopy";
import { WorkshopFormatDetailsPanel } from "./WorkshopFormatDetailsPanel";
import { ConsentField } from "@/components/site/ConsentField";

export function WorkshopBookingBuilder() {
  const { language } = useLanguage();
  const { workshopTypes, slots, ready } = useWorkshopData();
  const [step, setStep] = useState(1);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const selectedType = workshopTypes.find((t) => t.id === typeId);
  const selectedMkFormat =
    typeId === "one-time" || typeId === "three-session"
      ? getWorkshopMkFormat(typeId as WorkshopMkFormatId)
      : undefined;
  const selectedSlot = slots.find((s) => s.id === slotId);

  const copy =
    language === "pl"
      ? {
          step1: "Krok 1 — Warsztat",
          step2: "Krok 2 — Termin",
          step3: "Krok 3 — Kontakt",
          chooseType: "Wybierz format",
          chooseDate: "Wybierz termin",
          contact: "Potwierdź i napisz",
          continue: "Dalej",
          back: "Wstecz",
          summary: "Twoja rezerwacja",
          name: "Imię",
          emailLabel: "Email",
          consent:
            "Wyrażam zgodę na kontakt w sprawie rezerwacji (RODO — placeholder).",
          send: "Zapisz rezerwację",
          sent: "Rezerwacja zapisana. Wybierz sposób kontaktu z Paliną:",
          errSlotTaken: "Ten termin właśnie się zapełnił — wybierz inny.",
          errType: "Wybierz warsztat.",
          errSlot: "Wybierz termin.",
          errName: "Podaj imię.",
          errEmail: "Podaj poprawny email.",
          errConsent: "Zaznacz zgodę.",
          noSlots: "Brak wolnych terminów — napisz do nas bezpośrednio.",
          spots: "miejsc",
          instagram: "Instagram Direct",
          facebook: "Facebook",
          emailBtn: "Email",
        }
      : {
          step1: "Step 1 — Workshop",
          step2: "Step 2 — Date",
          step3: "Step 3 — Contact",
          chooseType: "Choose your session",
          chooseDate: "Pick a date",
          contact: "Confirm & reach out",
          continue: "Continue",
          back: "Back",
          summary: "Your booking",
          name: "Name",
          emailLabel: "Email",
          consent: "I agree to be contacted about this booking (GDPR placeholder).",
          send: "Save booking",
          sent: "Booking saved. Choose how to message Palina:",
          errSlotTaken: "This slot just filled up — please pick another one.",
          errType: "Choose a workshop type.",
          errSlot: "Choose a time slot.",
          errName: "Please enter your name.",
          errEmail: "Please enter a valid email.",
          errConsent: "Please accept the consent.",
          noSlots: "No open slots right now — message us directly.",
          spots: "spots",
          instagram: "Instagram Direct",
          facebook: "Facebook",
          emailBtn: "Email",
        };

  const bookingDetails =
    selectedType && selectedSlot
      ? `${pickBilingual(selectedType.label, selectedType.label, language)} — ${selectedSlot.day}, ${selectedSlot.date} ${selectedSlot.time}`
      : "";

  const message = bookingDetails ? buildBookingMessage(bookingDetails, language) : "";

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedType || !selectedSlot) return;
    if (!name.trim()) {
      setError(copy.errName);
      return;
    }
    if (!email.trim().includes("@")) {
      setError(copy.errEmail);
      return;
    }
    if (!consent) {
      setError(copy.errConsent);
      return;
    }

    const result = await submitInboxMessage("booking", {
      name: name.trim(),
      email: email.trim(),
      workshop: pickBilingual(selectedType.label, selectedType.label, language),
      workshopId: selectedType.id,
      slot: `${selectedSlot.day}, ${selectedSlot.date} · ${selectedSlot.time}`,
      slotId: selectedSlot.id,
      pricePln: String(selectedType.pricePln),
      lang: language,
    });

    if (!result.ok) {
      setError(result.error === "SLOT_UNAVAILABLE" ? copy.errSlotTaken : copy.errEmail);
      return;
    }

    setSent(true);
  };

  const cardClass = (selected: boolean) =>
    [
      "relative z-[1] cursor-pointer rounded-xl border p-4 text-left transition-all duration-300 sm:p-[1.125rem]",
      selected
        ? "border-[color-mix(in_srgb,var(--theme-accent)_40%,transparent)] bg-white shadow-[0_10px_28px_rgba(1,10,139,0.07)]"
        : "border-[color-mix(in_srgb,var(--theme-border)_12%,transparent)] bg-white hover:border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)]",
    ].join(" ");

  const btnPrimary =
    "relative z-[1] cursor-pointer rounded-full border-2 border-[color-mix(in_srgb,var(--theme-accent)_50%,transparent)] bg-white px-5 py-3.5 font-body text-[11px] uppercase tracking-[0.22em] text-theme transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35";

  const btnSecondary =
    "relative z-[1] cursor-pointer rounded-full border-2 border-theme/25 bg-white px-5 py-3.5 font-body text-[11px] uppercase tracking-[0.2em] text-theme-muted transition-colors hover:border-theme/40";

  if (!ready) {
    return <p className="py-12 text-center font-body text-sm text-theme-muted">…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-center gap-2 sm:gap-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 sm:gap-3">
            <span
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full border font-body text-[11px] tracking-[0.12em] transition-colors",
                step >= s
                  ? "border-[color-mix(in_srgb,var(--theme-accent)_50%,transparent)] bg-white text-theme"
                  : "border-theme/15 bg-white/90 text-theme-muted/50",
              ].join(" ")}
            >
              {s}
            </span>
            {s < 3 ? <span className="h-px w-6 bg-theme/15 sm:w-10" aria-hidden /> : null}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2 font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted">
              {copy.step1}
            </p>
            <h3 className="font-display text-xl tracking-[0.04em] text-theme sm:text-2xl">
              {copy.chooseType}
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {workshopTypes.map((item) => {
                const mkFormat =
                  item.id === "one-time" || item.id === "three-session"
                    ? getWorkshopMkFormat(item.id as WorkshopMkFormatId)
                    : undefined;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTypeId(item.id)}
                    className={cardClass(typeId === item.id)}
                  >
                    <p className="font-display text-base leading-snug text-theme sm:text-[17px]">
                      {mkFormat?.title[language] ??
                        pickBilingual(item.label, item.label, language)}
                    </p>
                    <p className="mt-1 font-body text-xs leading-snug text-theme-muted">
                      {mkFormat?.teaser[language] ??
                        pickBilingual(item.description, item.description, language)}
                    </p>
                    {mkFormat ? (
                      <p className="mt-2 font-body text-[11px] tracking-[0.06em] text-theme-muted/90">
                        {mkFormat.priceLine[language]}
                      </p>
                    ) : (
                      <p className="mt-2 font-body text-[11px] tracking-[0.08em] text-theme-muted">
                        {`${item.pricePln} PLN · ${pickBilingual(item.duration, item.duration, language)}`}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {selectedMkFormat ? (
                <motion.div
                  key={selectedMkFormat.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    <WorkshopFormatDetailsPanel format={selectedMkFormat} variant="balanced" />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <button
              type="button"
              disabled={!typeId}
              onClick={() => setStep(2)}
              className={`mt-6 w-full ${btnPrimary}`}
            >
              {copy.continue}
            </button>
          </motion.div>
        ) : null}

        {step === 2 ? (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2 font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted">
              {copy.step2}
            </p>
            <h3 className="font-display text-xl tracking-[0.04em] text-theme sm:text-2xl">
              {copy.chooseDate}
            </h3>

            {slots.length === 0 ? (
              <p className="mt-6 font-body text-sm text-theme-muted">{copy.noSlots}</p>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSlotId(slot.id)}
                    className={cardClass(slotId === slot.id)}
                  >
                    <p className="font-display text-lg text-theme">
                      {slot.day}, {slot.date}
                    </p>
                    <p className="mt-1 font-body text-sm text-theme-muted">{slot.time}</p>
                    <p className="mt-2 font-body text-[10px] uppercase tracking-[0.14em] text-theme-muted">
                      {slot.spots} {copy.spots}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setStep(1)} className={`flex-1 ${btnSecondary}`}>
                {copy.back}
              </button>
              <button
                type="button"
                disabled={!slotId}
                onClick={() => setStep(3)}
                className={`flex-[2] ${btnPrimary}`}
              >
                {copy.continue}
              </button>
            </div>
          </motion.div>
        ) : null}

        {step === 3 ? (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2 font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted">
              {copy.step3}
            </p>
            <h3 className="font-display text-xl tracking-[0.04em] text-theme sm:text-2xl">
              {copy.contact}
            </h3>

            <div className="mt-6 rounded-[2px] border border-theme/15 bg-white p-6">
              <p className="font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                {copy.summary}
              </p>
              {selectedType && selectedSlot ? (
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-theme-muted">
                      {language === "pl" ? "Warsztat" : "Workshop"}
                    </dt>
                    <dd className="mt-1 font-display text-lg text-theme">
                      {pickBilingual(selectedType.label, selectedType.label, language)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-theme-muted">
                      {language === "pl" ? "Termin" : "Date"}
                    </dt>
                    <dd className="mt-1 font-body text-theme">
                      {selectedSlot.day}, {selectedSlot.date} · {selectedSlot.time}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-theme-muted">
                      PLN
                    </dt>
                    <dd className="mt-1 font-body text-theme">{selectedType.pricePln} PLN</dd>
                  </div>
                </dl>
              ) : null}
            </div>

            {sent ? (
              <div className="mt-6 space-y-4">
                <p className="rounded-lg border border-theme/20 bg-white px-4 py-3 font-body text-sm text-theme">
                  {copy.sent}
                </p>
                {message ? (
                  <ContactChannelPanel
                    message={message}
                    subject={language === "pl" ? "Rezerwacja warsztatu" : "Workshop booking"}
                  />
                ) : null}
              </div>
            ) : (
              <form onSubmit={(e) => void submitBooking(e)} className="mt-6 space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={copy.name}
                  className="w-full rounded-[2px] border border-theme/25 bg-white px-3 py-2.5 font-body text-sm text-theme outline-none focus:border-[var(--theme-accent)]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailLabel}
                  className="w-full rounded-[2px] border border-theme/25 bg-white px-3 py-2.5 font-body text-sm text-theme outline-none focus:border-[var(--theme-accent)]"
                />
                <ConsentField checked={consent} onChange={setConsent} purpose="booking" />
                {error ? <p className="text-xs text-red-400/90">{error}</p> : null}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`flex-1 ${btnSecondary}`}
                  >
                    {copy.back}
                  </button>
                  <button type="submit" className={`flex-[2] ${btnPrimary}`}>
                    {copy.send}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
