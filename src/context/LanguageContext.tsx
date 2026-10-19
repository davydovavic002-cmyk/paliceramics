"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Language } from "@/types";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const FALLBACK: LanguageContextValue = {
  language: "pl",
  setLanguage: () => {},
  isTransitioning: false,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pl");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState((current) => {
      if (current === lang) return current;
      setIsTransitioning(true);
      window.setTimeout(() => setIsTransitioning(false), 500);
      return lang;
    });
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, isTransitioning }),
    [language, setLanguage, isTransitioning]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  // Outside the provider (error/404 shells, rare edge renders) fall back to Polish
  // instead of crashing the whole page.
  return ctx ?? FALLBACK;
}
