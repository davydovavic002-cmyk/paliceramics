import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { DemoControlsProvider } from "@/context/DemoControlsContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import { notoSerifJP, shipporiMincho } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "pali ceramics",
  description: "Quiet handcrafted ceramics — Japandi atelier",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://paliceramics.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${notoSerifJP.variable} ${shipporiMincho.variable}`}>
      <body className="font-body antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if('scrollRestoration'in history)history.scrollRestoration='manual';if(!location.hash)scrollTo(0,0);}catch(e){}})();",
          }}
        />
        <LanguageProvider>
          <CookieConsentProvider>
            <DemoControlsProvider>{children}</DemoControlsProvider>
          </CookieConsentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
