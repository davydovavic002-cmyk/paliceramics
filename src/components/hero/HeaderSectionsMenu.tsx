"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";
import { handleSectionClick } from "@/lib/scrollToSection";
import type { NavItem } from "@/types";

function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}

function SectionLink({
  item,
  language,
  resolvedHref,
  onNavigate,
}: {
  item: NavItem;
  language: "en" | "pl";
  resolvedHref: string;
  onNavigate: () => void;
}) {
  const className =
    "block rounded-md px-3 py-2 font-body text-[11px] uppercase tracking-[0.16em] text-theme-muted transition-colors hover:bg-[color-mix(in_srgb,var(--theme-border)_10%,transparent)] hover:text-theme";

  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={className} onClick={onNavigate}>
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
      onClick={(e) => handleSectionClick(e, resolvedHref, onNavigate)}
    >
      {item.label[language]}
    </a>
  );
}

export function HeaderSectionsMenu({ onBar }: { onBar: boolean }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { headerSections } = siteContent;

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("click", onClickOutside);
    }, 0);
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClickOutside);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={[
          "inline-flex h-8 w-8 items-center justify-center rounded-full border text-theme transition-colors hover:opacity-90",
          onBar
            ? "border-[color-mix(in_srgb,var(--theme-border)_28%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_45%,transparent)]"
            : "border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_40%,transparent)] [box-shadow:0_1px_8px_rgba(0,0,0,0.25)]",
        ].join(" ")}
        aria-label={language === "pl" ? "Sekcje strony" : "Page sections"}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <LayoutGrid size={16} strokeWidth={1.5} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[80] min-w-[11.5rem] overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface)_98%,transparent)] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-md"
        >
          <p className="px-3 py-2 font-body text-[9px] uppercase tracking-[0.2em] text-theme-muted/80">
            {language === "pl" ? "Sekcje" : "Sections"}
          </p>
          {headerSections.map((item) => (
            <SectionLink
              key={item.id}
              item={item}
              language={language}
              resolvedHref={resolveNavHref(item.href, pathname)}
              onNavigate={close}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
