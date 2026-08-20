"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";
import { useSiteContent } from "@/hooks/useSiteContent";
import { handleSectionClick } from "@/lib/scrollToSection";

function contactHref(
  kind: "email" | "instagram" | "facebook" | "whatsapp",
  value: string
): string {
  const trimmed = value.trim();
  if (!trimmed) return "#";

  if (kind === "email") {
    return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`;
  }
  if (kind === "instagram") {
    if (trimmed.startsWith("http")) return trimmed;
    const handle = trimmed.replace(/^@/, "");
    return `https://instagram.com/${handle}`;
  }
  if (kind === "facebook") {
    return trimmed.startsWith("http") ? trimmed : `https://facebook.com/${trimmed.replace(/^@/, "")}`;
  }
  if (trimmed.startsWith("http")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : trimmed;
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const isHash = href.startsWith("#") || href.startsWith("/#");
  const isMailOrTel = href.startsWith("mailto:") || href.startsWith("tel:");

  if (isMailOrTel) {
    return (
      <a href={href} className="footer-muted transition-colors hover:text-[var(--footer-ink)]">
        {children}
      </a>
    );
  }

  if (isHash) {
    return (
      <Link
        href={href.startsWith("/#") ? href : `/${href}`}
        onClick={(e) => handleSectionClick(e, href.replace(/^\/?/, ""))}
        className="footer-muted transition-colors hover:text-[var(--footer-ink)]"
      >
        {children}
      </Link>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="footer-muted transition-colors hover:text-[var(--footer-ink)]"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className="footer-muted transition-colors hover:text-[var(--footer-ink)]">
      {children}
    </Link>
  );
}

function footerColClass(index: number, total: number) {
  const base = "p-6 sm:p-8";
  const isLast = index === total - 1;
  const mobileBottom = isLast ? "" : " footer-split-b";
  const tabletRight = index % 2 === 0 ? " md:footer-split-r" : "";
  const lgRight = isLast ? " lg:footer-split-b-0" : " lg:footer-split-r lg:footer-split-b-0";
  return `${base}${mobileBottom}${tabletRight}${lgRight}`;
}

export function SiteFooter() {
  const { language } = useLanguage();
  const content = useSiteContent();

  const copy =
    language === "pl"
      ? {
          studioTitle: "Z pracowni",
          studioTagline:
            "Powoli, jak w piecu — nowe prace, otwarte studio i notatki prosto z koła.",
          studioCta: "Śledź na Instagramie",
          mission:
            "Kamionina toczone na kole dla niespiesznych kuchni. Ceny z VAT, bez kosztów wysyłki.",
          menu: "Menu",
          info: "Informacje",
          contact: "Kontakt",
          privacy: "Polityka prywatności",
          terms: "Regulamin sklepu",
          rights: "© Pali Ceramics · Warszawa",
          instagram: "Instagram",
          facebook: "Facebook",
          email: "E-mail",
        }
      : {
          studioTitle: "From the studio",
          studioTagline:
            "Slow as the kiln — new pieces, open-studio dates, and wheel-side notes.",
          studioCta: "Follow on Instagram",
          mission:
            "Small-batch wheel stoneware for unhurried kitchens. All prices incl. VAT excl. shipping.",
          menu: "Menu",
          info: "Information",
          contact: "Contact",
          privacy: "Privacy policy",
          terms: "Shop terms",
          rights: "© Pali Ceramics · Warsaw",
          instagram: "Instagram",
          facebook: "Facebook",
          email: "Email",
        };

  const contacts = content?.contacts;

  const instagramHref = contacts?.instagram
    ? contactHref("instagram", contacts.instagram)
    : null;

  const navLinks = siteContent.headerSections.map((item) => ({
    href: item.href.startsWith("#") ? `/${item.href}` : item.href,
    label: item.label[language],
  }));

  const shopLinks = [
    { href: "/shop", label: language === "pl" ? "Katalog" : "Catalog" },
    { href: "/#faq", label: "FAQ" },
    { href: "/regulamin", label: copy.terms },
    { href: "/privacy", label: copy.privacy },
  ];

  return (
    <footer id="contact" className="site-footer">
      <div className="lookbook-full-bleed footer-newsletter border-b border-[var(--footer-line)]">
        <div className="mx-auto grid max-w-[1800px] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10 lg:px-10 lg:py-10">
          <div>
            <p className="footer-ink font-body text-[11px] font-medium uppercase tracking-[0.28em]">
              {copy.studioTitle}
            </p>
            <p className="footer-ink mt-2 max-w-xl font-display text-[clamp(1.1rem,2.2vw,1.5rem)] italic leading-snug tracking-[0.03em]">
              {copy.studioTagline}
            </p>
          </div>

          {instagramHref ? (
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 self-start font-body text-[10px] uppercase tracking-[0.22em] text-[var(--footer-ink)] transition-opacity hover:opacity-70 lg:self-end"
            >
              {copy.studioCta}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>

      <div className="lookbook-full-bleed">
        <div className="footer-grid mx-auto max-w-[1800px] border-x border-[var(--footer-line)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            <div className={footerColClass(0, 5)}>
              <p className="footer-ink font-display text-lg tracking-[0.06em]">Pali Ceramics</p>
              <p className="footer-muted mt-4 font-body text-sm leading-relaxed">{copy.mission}</p>
            </div>

            <div className={footerColClass(1, 5)}>
              <p className="footer-ink font-body text-[10px] uppercase tracking-[0.22em]">
                {copy.info}
              </p>
              <ul className="footer-muted mt-4 space-y-2.5 font-body text-sm">
                {shopLinks.slice(2).map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className={footerColClass(2, 5)}>
              <p className="footer-ink font-body text-[10px] uppercase tracking-[0.22em]">
                {copy.menu}
              </p>
              <ul className="mt-4 space-y-2.5 font-body text-sm">
                {navLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className={footerColClass(3, 5)}>
              <p className="footer-ink font-body text-[10px] uppercase tracking-[0.22em]">
                {language === "pl" ? "Sklep" : "Shop"}
              </p>
              <ul className="mt-4 space-y-2.5 font-body text-sm">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className={footerColClass(4, 5)}>
              <p className="footer-ink font-body text-[10px] uppercase tracking-[0.22em]">
                {copy.contact}
              </p>
              <ul className="mt-4 space-y-2.5 font-body text-sm">
                {contacts?.email ? (
                  <li>
                    <FooterLink href={contactHref("email", contacts.email)}>
                      {contacts.email}
                    </FooterLink>
                  </li>
                ) : null}
                {contacts?.instagram ? (
                  <li>
                    <FooterLink href={contactHref("instagram", contacts.instagram)} external>
                      {copy.instagram}
                    </FooterLink>
                  </li>
                ) : null}
                {contacts?.facebook ? (
                  <li>
                    <FooterLink href={contactHref("facebook", contacts.facebook)} external>
                      {copy.facebook}
                    </FooterLink>
                  </li>
                ) : null}
                {contacts?.whatsapp ? (
                  <li>
                    <FooterLink href={contactHref("whatsapp", contacts.whatsapp)} external>
                      WhatsApp
                    </FooterLink>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>

          <div className="footer-split-b border-t border-[var(--footer-line)] px-6 py-5 sm:px-8 lg:flex lg:justify-end lg:px-10">
            <p className="footer-muted font-body text-[10px] uppercase tracking-[0.18em]">
              {copy.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
