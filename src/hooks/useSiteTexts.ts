"use client";

import { useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminContent } from "@/hooks/useAdminContent";
import { hasSiteText, resolveSiteText } from "@/lib/siteTexts";

/** Editable site texts (admin → Site → Texts) with the built-in text as fallback. */
export function useSiteTexts() {
  const { language } = useLanguage();
  const { siteTexts } = useAdminContent();

  const t = useCallback(
    (key: string) => resolveSiteText(siteTexts, key, language),
    [siteTexts, language]
  );

  const paragraphs = useCallback(
    (key: string) =>
      t(key)
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean),
    [t]
  );

  /** Both languages at once — for nav items that carry { pl, en } labels. */
  const tBoth = useCallback(
    (key: string) => ({
      pl: resolveSiteText(siteTexts, key, "pl"),
      en: resolveSiteText(siteTexts, key, "en"),
    }),
    [siteTexts]
  );

  /** Replaces labels of nav items whose id has an editable menu text. */
  const navItems = useCallback(
    <T extends { id: string; label: { pl: string; en: string } }>(items: readonly T[]): T[] =>
      items.map((item) =>
        hasSiteText(`menu.${item.id}`) ? { ...item, label: tBoth(`menu.${item.id}`) } : item
      ),
    [tBoth]
  );

  return { t, tBoth, paragraphs, navItems, language };
}
