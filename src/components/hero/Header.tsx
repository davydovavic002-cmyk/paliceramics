"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, Menu, Palette, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MADE_TO_ORDER_DETAIL_HREF } from "@/lib/customOrderContent";
import { handleSectionClick } from "@/lib/scrollToSection";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { HeaderBrandLogo } from "@/components/hero/HeaderBrandLogo";
import type { NavItem } from "@/types";

const SCROLL_THRESHOLD = 56;

function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
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
    "block rounded-md px-2.5 py-2 font-body text-[10px] uppercase tracking-[0.14em] text-[color-mix(in_srgb,#ede8df_72%,transparent)] transition-colors hover:bg-white/10 hover:text-[#ede8df]";

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
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRootRef = useRef<HTMLDivElement>(null);
  const menuCategories = useMenuCategories(language);

  const onBar = scrolled;
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
          "pointer-events-auto relative z-[2] transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out",
          onBar ? "header-bar-solid" : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-5 py-2.5 md:px-8 md:py-3 lg:px-16 lg:py-3.5">
          <HeaderBrandLogo />

          <div ref={menuRootRef} className="relative flex shrink-0 items-center gap-2.5 sm:gap-3">
            <LanguageToggle onBar={onBar} heroOverlay={heroOverlay} />
            <button
              type="button"
              className={[
                "header-icon-btn relative z-[2] inline-flex h-9 w-9 items-center justify-center rounded-full border text-theme transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2",
                open
                  ? "border-[color-mix(in_srgb,#010a8b_40%,#ede8df)] bg-[#010a8b] text-[#ede8df]"
                  : onBar
                    ? "border-[color-mix(in_srgb,var(--theme-border)_28%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_45%,transparent)]"
                    : "border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_40%,transparent)] [box-shadow:0_1px_8px_rgba(0,0,0,0.25)]",
              ].join(" ")}
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>

            {open ? (
              <div
                className="header-menu-panel pointer-events-auto absolute right-0 top-[calc(100%+0.625rem)] z-[80] w-[min(17.5rem,calc(100vw-2.5rem))] origin-top-right sm:w-[19rem]"
              >
                <div className="max-h-[min(70dvh,calc(100dvh-var(--header-offset,5.5rem)))] space-y-2.5 overflow-y-auto overscroll-contain rounded-xl border border-[color-mix(in_srgb,#ede8df_14%,#010a8b)] bg-[#010a8b] p-3 shadow-[0_16px_48px_rgba(1,10,139,0.45),0_4px_16px_rgba(0,0,0,0.35)]">
                  {menuCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div
                        key={category.id}
                        className="rounded-lg border border-[color-mix(in_srgb,#ede8df_12%,transparent)] bg-[color-mix(in_srgb,#000_18%,#010a8b)] p-2.5"
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,#ede8df_14%,transparent)] text-[#ede8df]">
                            <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </span>
                          <p className="font-body text-[9px] uppercase tracking-[0.2em] text-[#ede8df]">
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
