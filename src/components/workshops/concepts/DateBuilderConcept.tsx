"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  builderAtmospheres,
  builderFormats,
  t,
} from "@/lib/workshopsContent";
import { BookingModal } from "../BookingModal";

type FormatId = (typeof builderFormats)[number]["id"];
type AtmosphereId = (typeof builderAtmospheres)[number]["id"];

export function DateBuilderConcept() {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState<FormatId | null>(null);
  const [atmosphere, setAtmosphere] = useState<AtmosphereId | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const formatLabel = builderFormats.find((f) => f.id === format);
  const atmosphereLabel = builderAtmospheres.find((a) => a.id === atmosphere);

  const bookingDetails =
    formatLabel && atmosphereLabel
      ? language === "en"
        ? `${t(formatLabel.label, language)} with ${t(atmosphereLabel.label, language)} atmosphere`
        : `${t(formatLabel.label, language)} — ${t(atmosphereLabel.label, language)}`
      : "";

  const canProceedStep1 = format !== null;
  const canProceedStep2 = atmosphere !== null;

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-center gap-2 sm:gap-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 sm:gap-3">
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-[2px] border font-body text-[11px] tracking-[0.12em] transition-colors",
                  step >= s
                    ? "border-[#5a6a82]/50 bg-[#2c3444] text-[#EDE8DF]"
                    : "border-[#EDE8DF]/15 bg-[#323234]/50 text-[#E8E8E8]/40",
                ].join(" ")}
              >
                {s}
              </span>
              {s < 3 ? (
                <span className="h-px w-6 bg-[#EDE8DF]/15 sm:w-10" aria-hidden />
              ) : null}
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
              <p className="mb-2 font-body text-[10px] uppercase tracking-[0.28em] text-[#E5E5E5]/45">
                {language === "en" ? "Step 1 — Format" : "Krok 1 — Format"}
              </p>
              <h3 className="font-display text-xl tracking-[0.04em] text-[#FAFAFA] sm:text-2xl">
                {language === "en" ? "Choose your session" : "Wybierz sesję"}
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {builderFormats.map((item) => {
                  const selected = format === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormat(item.id)}
                      className={[
                        "cursor-pointer rounded-[2px] border p-5 text-left transition-all duration-300 sm:p-6",
                        selected
                          ? "border-[#5a6a82]/55 bg-[#2c3444]/85 shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
                          : "border-[#EDE8DF]/15 bg-[#38383c]/45 hover:border-[#EDE8DF]/30",
                      ].join(" ")}
                    >
                      <span className="font-display text-xl text-[#EDE8DF]/50">{item.kanji}</span>
                      <p className="mt-2 font-display text-lg text-[#FAFAFA]">
                        {t(item.label, language)}
                      </p>
                      <p className="mt-1 font-body text-sm text-[#E8E8E8]/65">
                        {t(item.desc, language)}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="mt-8 w-full cursor-pointer rounded-[2px] border-2 border-[#5a6a82]/50 bg-[#2c3444] px-4 py-3.5 font-body text-[11px] uppercase tracking-[0.22em] text-[#EDE8DF] transition-all hover:bg-[#343e50] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {language === "en" ? "Continue" : "Dalej"}
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
              <p className="mb-2 font-body text-[10px] uppercase tracking-[0.28em] text-[#E5E5E5]/45">
                {language === "en" ? "Step 2 — Atmosphere" : "Krok 2 — Atmosfera"}
              </p>
              <h3 className="font-display text-xl tracking-[0.04em] text-[#FAFAFA] sm:text-2xl">
                {language === "en" ? "Set the mood" : "Wybierz nastrój"}
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {builderAtmospheres.map((item) => {
                  const selected = atmosphere === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAtmosphere(item.id)}
                      className={[
                        "cursor-pointer rounded-[2px] border p-5 text-left transition-all duration-300 sm:p-6",
                        selected
                          ? "border-[#5a6a82]/55 bg-[#2c3444]/85 shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
                          : "border-[#EDE8DF]/15 bg-[#38383c]/45 hover:border-[#EDE8DF]/30",
                      ].join(" ")}
                    >
                      <span className="font-display text-xl text-[#EDE8DF]/50">{item.kanji}</span>
                      <p className="mt-2 font-display text-lg text-[#FAFAFA]">
                        {t(item.label, language)}
                      </p>
                      <p className="mt-1 font-body text-sm text-[#E8E8E8]/65">
                        {t(item.desc, language)}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 cursor-pointer rounded-[2px] border-2 border-[#EDE8DF]/25 bg-[#38383c]/50 px-4 py-3.5 font-body text-[11px] uppercase tracking-[0.2em] text-[#EDE8DF]/80 transition-colors hover:border-[#EDE8DF]/40"
                >
                  {language === "en" ? "Back" : "Wstecz"}
                </button>
                <button
                  type="button"
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  className="flex-[2] cursor-pointer rounded-[2px] border-2 border-[#5a6a82]/50 bg-[#2c3444] px-4 py-3.5 font-body text-[11px] uppercase tracking-[0.22em] text-[#EDE8DF] transition-all hover:bg-[#343e50] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {language === "en" ? "Continue" : "Dalej"}
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
              <p className="mb-2 font-body text-[10px] uppercase tracking-[0.28em] text-[#E5E5E5]/45">
                {language === "en" ? "Step 3 — Confirm" : "Krok 3 — Potwierdzenie"}
              </p>
              <h3 className="font-display text-xl tracking-[0.04em] text-[#FAFAFA] sm:text-2xl">
                {language === "en" ? "Your session" : "Twoja sesja"}
              </h3>

              <div className="mt-6 rounded-[2px] border border-[#EDE8DF]/15 bg-[#38383c]/55 p-6 backdrop-blur-sm">
                {formatLabel && atmosphereLabel ? (
                  <dl className="space-y-4">
                    <div>
                      <dt className="font-body text-[10px] uppercase tracking-[0.22em] text-[#E5E5E5]/45">
                        {language === "en" ? "Format" : "Format"}
                      </dt>
                      <dd className="mt-1 font-display text-lg text-[#FAFAFA]">
                        {t(formatLabel.label, language)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-body text-[10px] uppercase tracking-[0.22em] text-[#E5E5E5]/45">
                        {language === "en" ? "Atmosphere" : "Atmosfera"}
                      </dt>
                      <dd className="mt-1 font-display text-lg text-[#FAFAFA]">
                        {t(atmosphereLabel.label, language)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-body text-[10px] uppercase tracking-[0.22em] text-[#E5E5E5]/45">
                        {language === "en" ? "Duration" : "Czas trwania"}
                      </dt>
                      <dd className="mt-1 font-body text-sm text-[#E8E8E8]/75">
                        2.5 {language === "en" ? "hours" : "godziny"}
                      </dd>
                    </div>
                  </dl>
                ) : null}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 cursor-pointer rounded-[2px] border-2 border-[#EDE8DF]/25 bg-[#38383c]/50 px-4 py-3.5 font-body text-[11px] uppercase tracking-[0.2em] text-[#EDE8DF]/80 transition-colors hover:border-[#EDE8DF]/40"
                >
                  {language === "en" ? "Back" : "Wstecz"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="flex-[2] cursor-pointer rounded-[2px] border-2 border-[#5a6a82]/50 bg-[#2c3444] px-4 py-3.5 font-body text-[11px] uppercase tracking-[0.22em] text-[#EDE8DF] transition-all hover:bg-[#343e50]"
                >
                  {language === "en" ? "Book Slot" : "Rezerwuj"}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bookingDetails={bookingDetails}
      />
    </>
  );
}
