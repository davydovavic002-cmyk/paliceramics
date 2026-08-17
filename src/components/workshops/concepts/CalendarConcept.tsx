"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { buildBookingMessage, telegramUrl, whatsappUrl } from "@/lib/booking";
import { calendarSlots, t } from "@/lib/workshopsContent";

export function CalendarConcept() {
  const { language } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>("fri-18");

  const selected = useMemo(
    () => calendarSlots.find((s) => s.id === selectedId) ?? null,
    [selectedId]
  );

  const bookingLabel = selected
    ? language === "en"
      ? `Book for ${selected.day.en}, ${selected.date} at ${selected.time}`
      : `Rezerwuj: ${selected.day.pl}, ${selected.date}, ${selected.time}`
    : language === "en"
      ? "Select a time slot"
      : "Wybierz termin";

  const bookingDetails = selected
    ? language === "en"
      ? `a workshop slot on ${selected.day.en}, ${selected.date} at ${selected.time}`
      : `termin warsztatu: ${selected.day.pl}, ${selected.date}, ${selected.time}`
    : "";

  const message = bookingDetails ? buildBookingMessage(bookingDetails, language) : "";

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-6 font-body text-[10px] uppercase tracking-[0.28em] text-[#E5E5E5]/45">
        {language === "en" ? "Weekly availability" : "Tygodniowa dostępność"}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {calendarSlots.map((slot, index) => {
          const available = slot.spots > 0;
          const isSelected = selectedId === slot.id;

          return (
            <motion.button
              key={slot.id}
              type="button"
              disabled={!available}
              onClick={() => available && setSelectedId(slot.id)}
              className={[
                "relative cursor-pointer rounded-[2px] border p-4 text-left transition-all duration-300 sm:p-5",
                available
                  ? isSelected
                    ? "border-[#5a6a82]/55 bg-[#2c3444]/90 shadow-[0_0_0_1px_rgba(90,106,130,0.25),0_12px_32px_rgba(0,0,0,0.28)]"
                    : "border-[#EDE8DF]/15 bg-[#38383c]/45 backdrop-blur-sm hover:border-[#EDE8DF]/30 hover:bg-[#38383c]/70"
                  : "cursor-not-allowed border-[#EDE8DF]/08 bg-[#323234]/40 opacity-45",
              ].join(" ")}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#E5E5E5]/50">
                {t(slot.day, language)} · {slot.date}
              </p>
              <p className="mt-2 font-display text-xl tracking-[0.04em] text-[#FAFAFA]">
                {slot.time}
              </p>
              <p className="mt-2 font-body text-[10px] tracking-[0.14em] text-[#E8E8E8]/60">
                {available
                  ? language === "en"
                    ? `${slot.spots} slot${slot.spots > 1 ? "s" : ""} left`
                    : `${slot.spots} ${slot.spots === 1 ? "miejsce" : "miejsca"}`
                  : language === "en"
                    ? "Fully booked"
                    : "Brak miejsc"}
              </p>
              {isSelected && available ? (
                <motion.span
                  layoutId="calendar-slot-ring"
                  className="pointer-events-none absolute inset-0 rounded-[2px] border border-[#EDE8DF]/25"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        className="mt-8 rounded-[2px] border border-[#EDE8DF]/12 bg-[#38383c]/55 p-5 backdrop-blur-sm sm:p-6"
        layout
      >
        <p className="font-display text-lg tracking-[0.04em] text-[#FAFAFA] sm:text-xl">
          {bookingLabel}
        </p>

        {selected && message ? (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center rounded-[2px] border-2 border-[#5a6a82]/50 bg-[#2c3444] px-4 py-3.5 font-body text-[10px] uppercase tracking-[0.2em] text-[#EDE8DF] transition-colors hover:bg-[#343e50] sm:text-[11px]"
            >
              WhatsApp
            </a>
            <a
              href={telegramUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center rounded-[2px] border-2 border-[#EDE8DF]/30 bg-[#38383c]/60 px-4 py-3.5 font-body text-[10px] uppercase tracking-[0.2em] text-[#EDE8DF]/90 transition-colors hover:border-[#EDE8DF]/50 sm:text-[11px]"
            >
              Telegram
            </a>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
