"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { cookieBannerCopy } from "@/lib/privacyContent";

export function CookieConsentBanner() {
  const { language } = useLanguage();
  const { consent, hydrated, acceptMaps, essentialOnly } = useCookieConsent();

  if (!hydrated || consent) return null;

  return (
    <AnimatePresence>
      <motion.aside
        role="dialog"
        aria-live="polite"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="pointer-events-auto mx-auto flex max-w-2xl flex-col gap-4 rounded-[2px] border border-[color-mix(in_srgb,var(--theme-border)_28%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface)_96%,transparent)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-md sm:flex-row sm:items-end sm:p-5">
          <div className="flex-1">
            <p className="font-display text-sm tracking-[0.04em] text-theme">
              {cookieBannerCopy.title[language]}
            </p>
            <p className="mt-2 font-body text-xs leading-relaxed text-theme-muted">
              {cookieBannerCopy.body[language]}{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-theme">
                {cookieBannerCopy.policy[language]}
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <button
              type="button"
              onClick={essentialOnly}
              className="rounded-full border border-theme/25 px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-theme-muted transition-colors hover:border-theme/40 hover:text-theme"
            >
              {cookieBannerCopy.essential[language]}
            </button>
            <button
              type="button"
              onClick={acceptMaps}
              className="rounded-full border border-[color-mix(in_srgb,var(--theme-accent)_45%,transparent)] bg-[var(--theme-btn-primary)] px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-theme-btn transition-colors hover:bg-[var(--theme-accent-hover)]"
            >
              {cookieBannerCopy.accept[language]}
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
