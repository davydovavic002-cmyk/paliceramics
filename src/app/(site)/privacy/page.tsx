"use client";

import { motion } from "framer-motion";
import { LegalBackLink } from "@/components/site/LegalBackLink";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminContent } from "@/hooks/useAdminContent";
import { RichText } from "@/components/ui/RichText";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const { legal } = useAdminContent();
  const doc = legal.privacy;

  const back = language === "pl" ? "Wróć na stronę" : "Back to site";

  return (
    <div className="min-h-[100dvh] bg-theme-surface pt-[var(--header-offset,5.5rem)] text-theme transition-colors duration-700">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 lg:px-16">
        <LegalBackLink
          label={back}
          className="inline-flex min-h-[44px] items-center gap-2 font-body text-[11px] uppercase tracking-[0.18em] text-theme-muted transition-colors hover:text-theme"
        />

        <motion.header
          className="mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] tracking-[0.05em] text-theme">
            {doc.title[language]}
          </h1>
          <p className="mt-3 font-body text-sm text-theme-muted">{doc.updated[language]}</p>
          <p className="mt-6 font-body text-sm leading-relaxed text-theme-muted">
            {doc.intro[language]}
          </p>
        </motion.header>

        <div className="mt-10 space-y-8">
          {doc.sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
            >
              <h2 className="font-display text-lg tracking-[0.04em] text-theme">
                {section.title[language]}
              </h2>
              <ul className="mt-3 space-y-2">
                {section.body[language].map((paragraph, pIdx) => (
                  <li
                    key={`${index}-${pIdx}`}
                    className="font-body text-sm leading-relaxed text-theme-muted"
                  >
                    <RichText text={paragraph} />
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
