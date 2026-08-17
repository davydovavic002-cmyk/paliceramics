import { ScrollThemeDriver } from "@/components/demo/ScrollThemeDriver";
import { CookieConsentBanner } from "@/components/site/CookieConsentBanner";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Header } from "@/components/hero/Header";
import { HashScrollHandler } from "@/components/HashScrollHandler";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollThemeDriver />
      <HashScrollHandler />
      <Header />
      <main>{children}</main>
      <SiteFooter />
      <CookieConsentBanner />
    </>
  );
}
