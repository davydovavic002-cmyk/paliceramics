import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { DemoControlsProvider } from "@/context/DemoControlsContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import { ServerContentSync } from "@/components/site/ServerContentSync";
import { NavigationProgress } from "@/components/site/NavigationProgress";
import { loadServerSnapshotScript } from "@/lib/serverSnapshot";
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

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const snapshotScript = await loadServerSnapshotScript();
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="font-body antialiased">
        {snapshotScript ? <script dangerouslySetInnerHTML={{ __html: snapshotScript }} /> : null}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{document.documentElement.dataset.theme='raw-clay';if('scrollRestoration'in history)history.scrollRestoration='manual';var nav=performance.getEntriesByType('navigation')[0];var isBack=nav&&nav.type==='back_forward';var p=location.pathname;var catalog=p==='/shop'||p==='/shop/made-to-order';var keep=catalog&&sessionStorage.getItem('pali-shop-return');if(!isBack&&!location.hash&&!keep)scrollTo(0,0);}catch(e){}})();",
          }}
        />
        <LanguageProvider>
          <CookieConsentProvider>
            <DemoControlsProvider>
              <ServerContentSync />
              <NavigationProgress />
              {children}
            </DemoControlsProvider>
          </CookieConsentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
