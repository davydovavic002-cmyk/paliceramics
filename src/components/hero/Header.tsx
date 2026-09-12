"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MADE_TO_ORDER_DETAIL_HREF } from "@/lib/customOrderContent";
import { siteContent } from "@/lib/content";
import { handleSectionClick } from "@/lib/scrollToSection";
import { useCompactViewport } from "@/hooks/useCompactViewport";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { HeaderBrandLogo } from "@/components/hero/HeaderBrandLogo";
import { HeaderMenuOverlay } from "@/components/hero/HeaderMenuOverlay";
import type { NavItem } from "@/types";

const SCROLL_THRESHOLD = 56;

function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}

function NavItemLink({
  item,
  language,
  fade,
  heroOverlay,
  onNavigate,
}: {
  item: NavItem;
  language: "en" | "pl";
  fade: { opacity: number; transition: { duration: number } };
  heroOverlay: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isRoute = item.href.startsWith("/");
  const resolvedHref = resolveNavHref(item.href, pathname);
  const active = isRoute && pathname === item.href;

  /* heroOverlay is the only transparent state, and it is coloured from CSS
     (.header-hero-overlay .header-nav-link); every other state sits on a solid bar. */
  const className = [
    "header-nav-link group relative font-body text-[10px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 sm:text-[11px]",
    heroOverlay ? "" : "text-theme-muted hover:text-theme",
    !heroOverlay && active ? "text-theme" : "",
  ].join(" ");

  const inner = (
    <>
      <motion.span key={`${item.id}-${language}`} animate={fade}>
        {item.label[language]}
      </motion.span>
      <span
        className={[
          "absolute -bottom-1.5 left-0 h-px transition-all duration-300",
          heroOverlay
            ? "bg-[color-mix(in_srgb,#ede8df_50%,transparent)]"
            : "bg-[var(--theme-border)]/50",
          active ? "w-full" : "w-0 group-hover:w-full",
        ].join(" ")}
        aria-hidden
      />
    </>
  );

  if (isRoute) {
    return (
      <Link
        href={item.href}
        className={className}
        data-active={active || undefined}
        onClick={onNavigate}
      >
        {inner}
      </Link>
    );
  }

  if (resolvedHref.startsWith("/#")) {
    return (
      <Link href={resolvedHref} className={className} onClick={onNavigate}>
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={resolvedHref}
      className={className}
      onClick={(e) => handleSectionClick(e, resolvedHref, onNavigate)}
    >
      {inner}
    </a>
  );
}

function useMenuCategories(language: "en" | "pl") {
  return useMemo(
    () => [
      {
        id: "shop",
        label: language === "pl" ? "Sklep" : "Shop",
        items: [
          { id: "collection", href: "#collection", label: { pl: "Kolekcja", en: "Collection" } },
          { id: "shop", href: "/shop", label: { pl: "Sklep", en: "Shop" } },
          {
            id: "made-to-order",
            href: MADE_TO_ORDER_DETAIL_HREF,
            label: { pl: "Na zamówienie", en: "Made to order" },
          },
        ] satisfies NavItem[],
      },
      {
        id: "studio",
        label: language === "pl" ? "Pracownia" : "Studio",
        items: [
          { id: "workshops", href: "#workshops", label: { pl: "Warsztaty", en: "Workshops" } },
          { id: "certificates", href: "#certificates", label: { pl: "Voucher", en: "Gift card" } },
        ] satisfies NavItem[],
      },
      {
        id: "info",
        label: language === "pl" ? "Informacje" : "Info",
        items: [
          { id: "about", href: "#about", label: { pl: "O mnie", en: "About me" } },
          { id: "delivery", href: "#delivery", label: { pl: "Dostawa", en: "Delivery" } },
          { id: "contact", href: "#contact", label: { pl: "Kontakt", en: "Contact" } },
        ] satisfies NavItem[],
      },
    ],
    [language]
  );
}

export function Header() {
  const pathname = usePathname();
  const { language, isTransitioning } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const compactViewport = useCompactViewport();
  const { nav } = siteContent;
  const menuCategories = useMenuCategories(language);

  /* Only the homepage starts behind the dark hero. Everywhere else the page opens on the
     light lookbook background, where a transparent bar left the light nav text invisible
     until the first scroll — so the bar stays solid there from the start. */
  const isHome = pathname === "/";
  const solidBar = compactViewport || scrolled || !isHome;
  const heroOverlay = isHome && !solidBar;
  const barClass = compactViewport
    ? "header-bar-mobile"
    : solidBar
      ? "header-bar-solid"
      : "border-b border-transparent bg-transparent";

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.35 },
  };

  const closeMenu = () => setOpen(false);

  return (
    <>
    <header
      className={[
        "site-header-shell pointer-events-none fixed inset-x-0 top-0 z-[70]",
        heroOverlay ? "header-hero-overlay" : "",
      ].join(" ")}
    >
      <div
        className={[
          "site-header-inner pointer-events-auto relative z-[2] flex items-center transition-[background-color,box-shadow,border-color] duration-200 ease-out",
          barClass,
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex w-full max-w-[1800px] items-center gap-4 px-5 py-2.5 md:px-8 md:py-3 lg:px-16 lg:py-3.5",
            heroOverlay ? "relative justify-end" : "justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-5",
          ].join(" ")}
        >
          {heroOverlay ? (
            <>
              <HeaderBrandLogo className="lg:hidden" />
              <nav
                className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 lg:flex xl:gap-10"
                aria-label="Main navigation"
              >
                {nav.map((item) => (
                  <motion.div key={item.id} animate={fade}>
                    <NavItemLink
                      item={item}
                      language={language}
                      fade={fade}
                      heroOverlay={heroOverlay}
                    />
                  </motion.div>
                ))}
              </nav>
            </>
          ) : (
            <HeaderBrandLogo />
          )}

          {!heroOverlay ? (
            <nav
              className="hidden items-center gap-5 lg:flex xl:gap-10"
              aria-label="Main navigation"
            >
              {nav.map((item) => (
                <motion.div key={item.id} animate={fade}>
                  <NavItemLink
                    item={item}
                    language={language}
                    fade={fade}
                    heroOverlay={heroOverlay}
                  />
                </motion.div>
              ))}
            </nav>
          ) : null}

          <div
            className={[
              "header-controls relative shrink-0",
              heroOverlay ? "relative z-[2] ml-auto" : "lg:justify-self-end",
            ].join(" ")}
          >
            <LanguageToggle onBar={solidBar} heroOverlay={heroOverlay} />
            <button
              type="button"
              className={[
                "header-icon-btn relative z-[2] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border p-0 text-theme transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2",
                solidBar
                  ? "border-[color-mix(in_srgb,var(--theme-border)_28%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_45%,transparent)]"
                  : "border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_40%,transparent)] [box-shadow:0_1px_8px_rgba(0,0,0,0.25)]",
              ].join(" ")}
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Menu"
              aria-expanded={open}
            >
              <Menu size={18} strokeWidth={1.75} className="shrink-0" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </header>
    {open ? (
      <HeaderMenuOverlay
        language={language}
        categories={menuCategories}
        onClose={closeMenu}
      />
    ) : null}
    </>
  );
}
