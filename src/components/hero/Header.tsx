"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";
import { handleSectionClick } from "@/lib/scrollToSection";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { HeaderBrandLogo } from "@/components/hero/HeaderBrandLogo";
import { HeaderSectionsMenu } from "@/components/hero/HeaderSectionsMenu";
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
  onBar,
  heroOverlay,
  onNavigate,
}: {
  item: NavItem;
  language: "en" | "pl";
  fade: { opacity: number; transition: { duration: number } };
  onBar: boolean;
  heroOverlay: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isRoute = item.href.startsWith("/");
  const resolvedHref = resolveNavHref(item.href, pathname);
  const active = isRoute && pathname === item.href;

  const className = [
    "header-nav-link group relative font-body text-[10px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 sm:text-[11px]",
    heroOverlay
      ? ""
      : onBar
        ? "text-theme-muted hover:text-theme"
        : "text-theme/90 hover:text-theme [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]",
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

function MobileNavLink({
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
    "block py-3.5 font-body text-[11px] uppercase tracking-[0.18em] text-theme-muted transition-colors hover:text-theme";

  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={linkClass} onClick={onNavigate}>
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

export function Header() {
  const pathname = usePathname();
  const { language, isTransitioning } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { nav, mobileNavExtra, headerSections } = siteContent;

  const primaryMobileNav = useMemo(() => {
    const extras = mobileNavExtra ?? [];
    const seen = new Set<string>();
    return [...nav, ...extras].filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [nav, mobileNavExtra]);

  const secondaryMobileSections = useMemo(() => {
    const primaryIds = new Set(primaryMobileNav.map((item) => item.id));
    return headerSections.filter((item) => !primaryIds.has(item.id));
  }, [headerSections, primaryMobileNav]);

  const onBar = scrolled || open;
  const heroOverlay = pathname === "/" && !onBar;

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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.35 },
  };

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-[70]",
        heroOverlay ? "header-hero-overlay" : "",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-auto transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out",
          onBar ? "header-bar-solid" : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex max-w-[1800px] items-center gap-4 px-5 py-2.5 md:px-8 md:py-3 lg:px-16 lg:py-3.5",
            heroOverlay ? "relative justify-end" : "justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-5",
          ].join(" ")}
        >
          {heroOverlay ? (
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
                    onBar={onBar}
                    heroOverlay={heroOverlay}
                  />
                </motion.div>
              ))}
            </nav>
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
                    onBar={onBar}
                    heroOverlay={heroOverlay}
                  />
                </motion.div>
              ))}
            </nav>
          ) : null}

          <div
            className={[
              "flex shrink-0 items-center gap-2.5 sm:gap-3",
              heroOverlay ? "relative z-[2] ml-auto" : "lg:justify-self-end",
            ].join(" ")}
          >
            <HeaderSectionsMenu onBar={onBar} heroOverlay={heroOverlay} />
            <LanguageToggle onBar={onBar} heroOverlay={heroOverlay} />
            <button
              type="button"
              className={[
                "header-icon-btn relative z-[2] inline-flex h-8 w-8 items-center justify-center rounded-full border text-theme transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2 lg:hidden",
                onBar
                  ? "border-[color-mix(in_srgb,var(--theme-border)_28%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_45%,transparent)]"
                  : "border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_40%,transparent)] [box-shadow:0_1px_8px_rgba(0,0,0,0.25)]",
              ].join(" ")}
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        <div
          className={[
            "grid overflow-hidden border-t border-[color-mix(in_srgb,var(--theme-border)_12%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface)_99%,transparent)] transition-[grid-template-rows] duration-300 ease-out lg:hidden",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          ].join(" ")}
        >
          <div className="min-h-0 overflow-hidden">
            <ul className="divide-y divide-[color-mix(in_srgb,var(--theme-border)_10%,transparent)] px-5 py-2">
              {primaryMobileNav.map((item) => (
                <li key={item.id}>
                  <MobileNavLink item={item} language={language} onNavigate={closeMenu} />
                </li>
              ))}
              {secondaryMobileSections.length > 0 ? (
                <li className="px-0 py-2">
                  <p className="font-body text-[9px] uppercase tracking-[0.22em] text-theme-muted/70">
                    {language === "pl" ? "Sekcje" : "Sections"}
                  </p>
                </li>
              ) : null}
              {secondaryMobileSections.map((item) => (
                <li key={item.id}>
                  <MobileNavLink item={item} language={language} onNavigate={closeMenu} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
