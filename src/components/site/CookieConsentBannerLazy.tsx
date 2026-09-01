"use client";

import dynamic from "next/dynamic";

export const CookieConsentBannerLazy = dynamic(
  () => import("@/components/site/CookieConsentBanner").then((m) => m.CookieConsentBanner),
  { ssr: false }
);
