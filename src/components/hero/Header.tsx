"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Info, Menu, Palette, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MADE_TO_ORDER_DETAIL_HREF } from "@/lib/customOrderContent";
import { siteContent } from "@/lib/content";
import { appendReturnTo, HOME_LOOKBOOK_RETURN_TO } from "@/lib/shopReturnTo";
import { handleSectionClick } from "@/lib/scrollToSection";
import { useCompactViewport } from "@/hooks/useCompactViewport";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { HeaderBrandLogo } from "@/components/hero/HeaderBrandLogo";
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

function MenuNavLink({
  item,
  language,
  onNavigate,
}: {
  item: NavItem;
  language: "en" | "pl";
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const resolvedHref = resolveNavHref(item.href, pathname);
  const linkClass =
    "header-menu-panel__link block rounded-md px-2.5 py-2 font-body text-[10px] uppercase tracking-[0.14em] transition-colors";

  if (item.href.startsWith("/")) {
    const href =
      item.href === MADE_TO_ORDER_DETAIL_HREF && pathname === "/"
        ? appendReturnTo(MADE_TO_ORDER_DETAIL_HREF, HOME_LOOKBOOK_RETURN_TO)
        : item.href;
    return (
      <Link href={href} className={linkClass} onClick={onNavigate}>
        {item.label[language]}
      </Link>
    );
  }

  if (resolvedHref.startsWith("/#")) {
    return (
      <Link href={resolvedHref} className={linkClass} onClick={onNavigate}>
        {item.label[language]}
      </Link>
    );
  }

  return (
    <a
      href={resolvedHref}
      className={linkClass}
      onClick={(e) => handleSectionClick(e, resolvedHref, onNavigate)}
    >
      {item.label[language]}
    </a>
  );
}

function useMenuCategories(language: "en" | "pl") {
  return useMemo(
    () => [
      {
        id: "shop",
        label: language === "pl" ? "Sklep" : "Shop",
        icon: ShoppingBag,
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
        icon: Palette,
        items: [
          { id: "workshops", href: "#workshops", label: { pl: "Warsztaty", en: "Workshops" } },
          { id: "certificates", href: "#certificates", label: { pl: "Voucher", en: "Gift card" } },
        ] satisfies NavItem[],
      },
      {
        id: "info",
        label: language === "pl" ? "Informacje" : "Info",
        icon: Info,
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
  const menuRootRef = useRef<HTMLDivElement>(null);
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

    const onClickOutside = (event: MouseEvent) => {
      if (!menuRootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => {
      document.addEventListener("click", onClickOutside);
    }, 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
      document.removeEventListener("click", onClickOutside);
    };
  }, [open]);

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.35 },
  };

  const closeMenu = () => setOpen(false);

  return (
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
            ref={menuRootRef}
            className={[
              "header-menu-panel header-controls relative shrink-0",
              heroOverlay ? "relative z-[2] ml-auto" : "lg:justify-self-end",
            ].join(" ")}
          >
            <LanguageToggle onBar={solidBar} heroOverlay={heroOverlay} />
            <button
              type="button"
              className={[
                "header-icon-btn relative z-[2] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border p-0 text-theme transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2",
                open
                  ? "header-menu-btn-active"
                  : solidBar
                    ? "border-[color-mix(in_srgb,var(--theme-border)_28%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_45%,transparent)]"
                    : "border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_40%,transparent)] [box-shadow:0_1px_8px_rgba(0,0,0,0.25)]",
              ].join(" ")}
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? (
                <X size={18} strokeWidth={1.75} className="shrink-0" aria-hidden />
              ) : (
                <Menu size={18} strokeWidth={1.75} className="shrink-0" aria-hidden />
              )}
            </button>

            {open ? (
              <div className="header-menu-panel__dropdown pointer-events-auto absolute right-0 top-[calc(100%+0.625rem)] z-[80] w-[min(17.5rem,calc(100vw-2.5rem))] origin-top-right sm:w-[19rem]">
                <div className="header-menu-panel__body max-h-[min(70dvh,calc(100dvh-var(--header-offset,5.5rem)))] space-y-2.5 overflow-y-auto overscroll-contain rounded-xl p-3">
                  {menuCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.id} className="header-menu-panel__category rounded-lg p-2.5">
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="header-menu-panel__icon-wrap inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                            <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </span>
                          <p className="header-menu-panel__category-label font-body text-[9px] uppercase tracking-[0.2em]">
                            {category.label}
                          </p>
                        </div>
                        <ul className="space-y-0.5">
                          {category.items.map((item) => (
                            <li key={item.id}>
                              <MenuNavLink
                                item={item}
                                language={language}
                                onNavigate={closeMenu}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
