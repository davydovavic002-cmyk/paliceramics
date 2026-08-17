"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CookieConsentBanner } from "@/components/site/CookieConsentBanner";
import { HashScrollHandler } from "@/components/HashScrollHandler";
import { ScrollThemeDriver } from "@/components/demo/ScrollThemeDriver";
import { Header } from "@/components/hero/Header";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function NotFound() {
  const { language } = useLanguage();

  const copy =
    language === "pl"
      ? {
          code: "404",
          title: "Strony nie ma",
          body: "Ten adres nie prowadzi do żadnej sekcji — może naczynie się jeszcze wypala.",
          home: "Wróć na stronę główną",
          shop: "Przejdź do katalogu",
        }
      : {
          code: "404",
          title: "Page not found",
          body: "This address does not lead anywhere — perhaps the piece is still in the kiln.",
          home: "Back to homepage",
          shop: "Browse the catalog",
        };

  return (
    <>
      <ScrollThemeDriver />
      <HashScrollHandler />
      <Header />
      <main className="min-h-[100dvh] bg-theme-surface pt-[var(--header-offset,5.5rem)] text-theme transition-colors duration-700">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28 lg:px-16">
          <motion.p
            className="font-display text-[clamp(4rem,18vw,7rem)] leading-none tracking-[0.08em] text-theme/15"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            aria-hidden
          >
            {copy.code}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <p className="font-body text-[11px] uppercase tracking-[0.32em] text-theme-muted">
              {copy.code}
            </p>
            <h1 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[0.06em] text-theme">
              {copy.title}
            </h1>
            <p className="mt-4 font-body text-sm leading-relaxed text-theme-muted sm:text-[15px]">
              {copy.body}
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--theme-accent)_45%,transparent)] bg-[var(--theme-btn-primary)] px-5 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-theme-btn transition-colors hover:bg-[var(--theme-accent-hover)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              {copy.home}
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full border border-theme/20 bg-theme-elevated/40 px-5 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-theme-muted transition-colors hover:border-theme/35 hover:text-theme"
            >
              {copy.shop}
            </Link>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
      <CookieConsentBanner />
    </>
  );
}
