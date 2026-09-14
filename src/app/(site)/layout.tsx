import { ScrollThemeDriver } from "@/components/demo/ScrollThemeDriver";
import { CookieConsentBannerLazy } from "@/components/site/CookieConsentBannerLazy";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SkipToContent } from "@/components/site/SkipToContent";
import { Header } from "@/components/hero/Header";
import { HashScrollHandler } from "@/components/HashScrollHandler";
import { SiteScrollRestoreBoundary } from "@/components/SiteScrollRestoreBoundary";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollThemeDriver />
      <SiteScrollRestoreBoundary />
      <HashScrollHandler />
      <SkipToContent />
      <Header />
      <main id="main-content" tabIndex={-1} className="overflow-x-hidden">
        {children}
      </main>
      <SiteFooter />
      <CookieConsentBannerLazy />
    </>
  );
}
