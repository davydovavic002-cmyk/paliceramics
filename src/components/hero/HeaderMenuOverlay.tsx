"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { HeaderBrandLogo } from "@/components/hero/HeaderBrandLogo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { MADE_TO_ORDER_DETAIL_HREF } from "@/lib/customOrderContent";
import { appendReturnTo, HOME_LOOKBOOK_RETURN_TO } from "@/lib/shopReturnTo";
import { handleSectionClick } from "@/lib/scrollToSection";
import type { NavItem } from "@/types";

function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}

function OverlayNavLink({
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
  const className =
    "font-sans text-xl font-normal text-theme transition-opacity hover:opacity-60 md:text-2xl";

  if (item.href.startsWith("/")) {
    const href =
      item.href === MADE_TO_ORDER_DETAIL_HREF && pathname === "/"
        ? appendReturnTo(MADE_TO_ORDER_DETAIL_HREF, HOME_LOOKBOOK_RETURN_TO)
        : item.href;
    return (
      <Link href={href} className={className} onClick={onNavigate}>
        {item.label[language]}
      </Link>
    );
  }

  if (resolvedHref.startsWith("/#")) {
    return (
      <Link href={resolvedHref} className={className} onClick={onNavigate}>
        {item.label[language]}
      </Link>
    );
  }

  return (
    <a
      href={resolvedHref}
      className={className}
      onClick={(event) => handleSectionClick(event, resolvedHref, onNavigate)}
    >
      {item.label[language]}
    </a>
  );
}

export type MenuCategory = {
  id: string;
  label: string;
  items: NavItem[];
};

export function HeaderMenuOverlay({
  language,
  categories,
  onClose,
}: {
  language: "en" | "pl";
  categories: MenuCategory[];
  onClose: () => void;
}) {
  return (
    <div
      className="header-menu-overlay pointer-events-auto fixed inset-0 z-[80] bg-[#F9F7F2]/95 font-sans text-theme backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={language === "pl" ? "Menu" : "Menu"}
    >
      <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(0.625rem,env(safe-area-inset-top))] md:px-8 lg:px-16">
        <div className="flex items-center justify-between gap-4 py-2.5 md:py-3">
          <span onClick={onClose}>
            <HeaderBrandLogo className="text-theme" />
          </span>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-theme/20 text-theme transition-colors hover:bg-theme/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/30 focus-visible:ring-offset-2"
              aria-label={language === "pl" ? "Zamknij menu" : "Close menu"}
            >
              <X size={18} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-8 md:py-12">
          <div className="space-y-10 md:space-y-12">
            {categories.map((category) => (
              <div key={category.id}>
                <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-theme/40">
                  {category.label}
                </p>
                <ul className="space-y-3.5">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <OverlayNavLink
                        item={item}
                        language={language}
                        onNavigate={onClose}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
