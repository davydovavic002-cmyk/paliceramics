"use client";

import { useLanguage } from "@/context/LanguageContext";

export function SkipToContent() {
  const { language } = useLanguage();
  const label = language === "pl" ? "Przejdź do treści" : "Skip to content";

  return (
    <a href="#main-content" className="skip-to-content font-body">
      {label}
    </a>
  );
}
