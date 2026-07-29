"use client";

import {
  createContext,
  useCallback,
  useContext,
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isTransitioning, setIsTransitioning] = useState(false);

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
  if (!ctx) throw new Error("useLanguage requires LanguageProvider");
  return ctx;
}
