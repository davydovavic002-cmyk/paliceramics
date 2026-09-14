"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    "inline-flex min-h-[44px] items-center justify-center px-2 py-2 text-center font-sans text-[1.375rem] font-normal leading-snug text-theme transition-opacity hover:opacity-60 active:opacity-70 sm:text-xl md:text-2xl";

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
      className="header-menu-overlay fixed inset-0 z-40 h-[100dvh] w-full overflow-x-hidden overflow-y-auto bg-[#F5F2EC] font-sans text-theme"
      role="dialog"
      aria-modal="true"
      aria-label={language === "pl" ? "Menu" : "Menu"}
    >
      <nav className="flex min-h-full w-full flex-col items-center justify-start px-6 pb-10 pt-[var(--header-offset)] text-center sm:justify-center">
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
          {categories.map((category) => (
            <div key={category.id}>
              <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-theme/40 md:mb-4">
                {category.label}
              </p>
              <ul className="space-y-3.5 sm:space-y-4">
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
  );
}
