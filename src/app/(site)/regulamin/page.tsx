"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { termsMeta, termsSections } from "@/lib/termsContent";

function TermsParagraph({ text, language }: { text: string; language: "en" | "pl" }) {
  const privacyLabel = language === "pl" ? "Polityce Prywatności" : "Privacy Policy";
  const privacyMatch = text.match(/Polityce Prywatności \(\/privacy\)|Privacy Policy \(\/privacy\)/);

  if (privacyMatch) {
    const [before, after] = text.split(/Polityce Prywatności \(\/privacy\)|Privacy Policy \(\/privacy\)/);
    return (
      <li className="font-body text-sm leading-relaxed text-theme-muted">
        {before}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-theme">
          {privacyLabel}
        </Link>
        {after}
      </li>
    );
  }

  if (text.startsWith("http://") || text.startsWith("https://")) {
    return (
      <li className="font-body text-sm leading-relaxed text-theme-muted">
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all underline underline-offset-4 hover:text-theme"
        >
          {text}
        </a>
      </li>
    );
  }

  if (text.includes("https://")) {
    const url = text.match(/https:\/\/\S+/)?.[0];
    if (url) {
      const [before, after] = text.split(url);
      return (
        <li className="font-body text-sm leading-relaxed text-theme-muted">
          {before}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline underline-offset-4 hover:text-theme"
          >
            {url}
          </a>
          {after}
        </li>
      );
    }
  }

  return <li className="font-body text-sm leading-relaxed text-theme-muted">{text}</li>;
}

export default function TermsPage() {
  const { language } = useLanguage();
  const back = language === "pl" ? "Wróć na stronę" : "Back to site";

  return (
    <div className="min-h-[100dvh] bg-theme-surface pt-[var(--header-offset,5.5rem)] text-theme transition-colors duration-700">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 lg:px-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.18em] text-theme-muted transition-colors hover:text-theme"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          {back}
        </Link>

        <motion.header
          className="mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] tracking-[0.05em] text-theme">
            {termsMeta.title[language]}
          </h1>
          <p className="mt-3 font-body text-sm text-theme-muted">{termsMeta.updated[language]}</p>
          <p className="mt-6 font-body text-sm leading-relaxed text-theme-muted">
            {termsMeta.intro[language]}
          </p>
        </motion.header>

        <div className="mt-10 space-y-8">
          {termsSections.map((section, index) => (
            <motion.section
              key={section.title.en}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.03 }}
            >
              <h2 className="font-display text-lg tracking-[0.04em] text-theme">
                {section.title[language]}
              </h2>
              <ul className="mt-3 space-y-2">
                {section.body[language].map((paragraph) => (
                  <TermsParagraph key={paragraph} text={paragraph} language={language} />
                ))}
              </ul>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
