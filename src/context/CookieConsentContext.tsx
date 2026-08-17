"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  COOKIE_CONSENT_KEY,
  type CookieConsent,
} from "@/lib/privacyContent";

interface CookieConsentContextValue {
  consent: CookieConsent | null;
  hydrated: boolean;
  mapsAllowed: boolean;
  acceptMaps: () => void;
  essentialOnly: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
  return raw === "maps" || raw === "essential" ? raw : null;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setHydrated(true);
  }, []);

  const persist = useCallback((value: CookieConsent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setConsent(value);
  }, []);

  const acceptMaps = useCallback(() => persist("maps"), [persist]);
  const essentialOnly = useCallback(() => persist("essential"), [persist]);

  const value = useMemo(
    () => ({
      consent,
      hydrated,
      mapsAllowed: consent === "maps",
      acceptMaps,
      essentialOnly,
    }),
    [consent, hydrated, acceptMaps, essentialOnly]
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent requires CookieConsentProvider");
  return ctx;
}
