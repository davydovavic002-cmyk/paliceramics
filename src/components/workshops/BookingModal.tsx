"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Facebook, Instagram, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  buildBookingMessage,
  facebookUrl,
  instagramUrl,
  mailtoUrl,
} from "@/lib/booking";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  bookingDetails: string;
}

export function BookingModal({ open, onClose, bookingDetails }: BookingModalProps) {
  const { language } = useLanguage();
  const message = buildBookingMessage(bookingDetails, language);
  const subject = language === "pl" ? "Rezerwacja" : "Booking request";

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[100] cursor-pointer bg-[#1a1a1c]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close booking modal"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="pointer-events-auto fixed left-1/2 top-1/2 z-[101] w-[min(92vw,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-theme/20 bg-theme-surface/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-theme-muted transition-colors hover:text-theme"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <p className="font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted">
              {language === "en" ? "Book via message" : "Rezerwacja wiadomością"}
            </p>
            <h3 className="mt-2 font-display text-xl tracking-[0.04em] text-theme">
              {language === "en" ? "Choose channel" : "Wybierz kanał"}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-theme-muted">{message}</p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={instagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-[2px] border-2 border-[color-mix(in_srgb,var(--theme-accent)_50%,transparent)] bg-theme-surface-accent px-4 py-3.5 font-body text-[11px] uppercase tracking-[0.2em] text-theme transition-colors hover:opacity-90"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
              <a
                href={mailtoUrl(subject, message)}
                className="flex items-center justify-center gap-2 rounded-[2px] border-2 border-theme/30 bg-theme-surface/60 px-4 py-3.5 font-body text-[11px] uppercase tracking-[0.2em] text-theme transition-colors hover:border-theme/50"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
              <a
                href={facebookUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-[2px] border-2 border-theme/30 bg-theme-surface/60 px-4 py-3.5 font-body text-[11px] uppercase tracking-[0.2em] text-theme transition-colors hover:border-theme/50"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
