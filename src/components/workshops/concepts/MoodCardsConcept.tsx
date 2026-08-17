"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { workshopFormats, t, tList } from "@/lib/workshopsContent";
import { BookingModal } from "../BookingModal";

export function MoodCardsConcept() {
  const { language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState("");

  const openBooking = (details: string) => {
    setBookingDetails(details);
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {workshopFormats.map((format, index) => (
          <motion.article
            key={format.id}
            className="group relative flex flex-col rounded-[2px] border border-[#EDE8DF]/12 bg-[#38383c]/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(210,190,160,0.06) 0%, transparent 70%)",
              }}
              aria-hidden
            />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="font-display text-2xl leading-none text-[#EDE8DF]/40">
                  {format.kanji}
                </span>
                <h3 className="mt-3 font-display text-2xl tracking-[0.04em] text-[#FAFAFA] sm:text-[1.65rem]">
                  {t(format.title, language)}
                </h3>
                <p className="mt-1 font-body text-[11px] uppercase tracking-[0.22em] text-[#E5E5E5]/50">
                  {t(format.subtitle, language)}
                </p>
              </div>
              <span className="shrink-0 rounded-[2px] border border-[#EDE8DF]/15 bg-[#323234]/80 px-3 py-1.5 font-body text-[10px] tracking-[0.16em] text-[#E8E8E8]/75">
                {t(format.duration, language)}
              </span>
            </div>

            <ul className="relative mt-8 space-y-3 border-t border-[#EDE8DF]/10 pt-6">
              {tList(format.features, language).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 font-body text-sm leading-relaxed text-[#E8E8E8]/78"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#EDE8DF]/45" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="relative mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-[#E5E5E5]/45">
                  {language === "en" ? "From" : "Od"}
                </p>
                <p className="mt-1 font-display text-2xl tracking-[0.02em] text-[#FAFAFA]">
                  {format.pricePln} PLN
                </p>
              </div>

              <button
                type="button"
                onClick={() => openBooking(t(format.messageKey, language))}
                className="cursor-pointer rounded-[2px] border-2 border-[#5a6a82]/50 bg-[#2c3444] px-6 py-3.5 font-body text-[10px] uppercase tracking-[0.22em] text-[#EDE8DF] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.25)] transition-all hover:bg-[#343e50] hover:border-[#6a7a92]/55 sm:text-[11px]"
              >
                {language === "en" ? "Book Slot" : "Rezerwuj"}
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bookingDetails={bookingDetails}
      />
    </>
  );
}
