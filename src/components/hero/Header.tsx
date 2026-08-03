"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";
import { handleSectionClick } from "@/lib/scrollToSection";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import type { NavItem } from "@/types";

const NAV_LINK =
  "group flex flex-col items-center gap-1 transition-colors duration-300 [text-shadow:0_1px_6px_rgba(0,0,0,0.55),0_0_1px_rgba(0,0,0,0.4)]";

function NavHankoItem({
  item,
  language,
  fade,
  onNavigate,
}: {
  item: NavItem;
  language: "en" | "pl";
  fade: { opacity: number; transition: { duration: number } };
  onNavigate?: () => void;
}) {
  return (
    <a
      href={item.href}
      className={NAV_LINK}
      onClick={(e) => handleSectionClick(e, item.href, onNavigate)}
    >
      <span className="font-display text-[15px] leading-none text-[#F5F5F5]/88 transition-colors duration-300 group-hover:text-white">
        {item.kanji}
      </span>
      <motion.span
        key={`${item.id}-${language}`}
        className="relative font-body text-[9px] font-medium leading-none tracking-[0.22em] text-[#E8E8E8]/72 transition-colors duration-300 group-hover:text-[#F5F5F5]"
        animate={fade}
      >
        {item.label[language]}
        <span
          className="absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#EDE8DF]/50 transition-all duration-300 group-hover:w-full"
          aria-hidden
        />
      </motion.span>
    </a>
  );
}

export function Header() {
  const { language, isTransitioning } = useLanguage();
  const [open, setOpen] = useState(false);
  const { logo, nav } = siteContent;

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.35 },
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-5 py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-8 md:py-6 lg:px-16 lg:py-7">
        <a href="#" className="pointer-events-auto inline-flex min-w-0 items-center gap-2.5 sm:gap-3.5">
          <span
            className="font-display shrink-0 text-[1.45rem] leading-none text-[#FAFAFA] sm:text-[1.65rem] [text-shadow:0_1px_5px_rgba(0,0,0,0.5)]"
            aria-hidden
          >
            {logo.kanji}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5 border-l border-[#EDE8DF]/18 pl-2.5 sm:pl-3.5">
            <motion.span
              key={`wm-${language}`}
              className="font-display truncate text-[12px] font-medium leading-none tracking-[0.28em] text-[#FAFAFA] sm:text-[13px] sm:tracking-[0.32em] [text-shadow:0_1px_4px_rgba(0,0,0,0.45)]"
              animate={fade}
            >
              {logo.wordmark[language]}
            </motion.span>
            <span className="font-body text-[9px] font-normal leading-none tracking-[0.14em] text-[#E8E8E8]/82 sm:text-[10px] sm:tracking-[0.18em]">
              {logo.descriptor}
            </span>
            <span className="hidden font-body text-[8px] leading-none tracking-[0.24em] text-[#E5E5E5]/42 sm:block">
              {logo.subtitle}
            </span>
          </span>
        </a>

        <nav
          className="pointer-events-auto hidden items-end gap-8 md:flex lg:gap-10"
          aria-label="Main navigation"
        >
          {nav.map((item) => (
            <motion.div key={item.id} animate={fade}>
              <NavHankoItem item={item} language={language} fade={fade} />
            </motion.div>
          ))}
        </nav>

        <div className="pointer-events-auto flex shrink-0 items-center justify-end gap-3 sm:gap-4 md:justify-self-end">
          <LanguageToggle />
          <button
            type="button"
            className="text-[#F3F4F6] transition-opacity hover:opacity-80 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <motion.div
        className="pointer-events-auto overflow-hidden border-t border-[#EDE8DF]/15 bg-[#38383c]/98 backdrop-blur-sm md:hidden"
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      >
        <ul className="divide-y divide-[#EDE8DF]/10 px-5 py-2">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="flex items-center gap-4 py-3.5 transition-colors active:bg-[#3a3a3e]"
                onClick={(e) => handleSectionClick(e, item.href, () => setOpen(false))}
              >
                <span className="font-display w-6 text-center text-lg leading-none text-[#F5F5F5]">
                  {item.kanji}
                </span>
                <span className="font-body text-[11px] tracking-[0.18em] text-[#E8E8E8]/85">
                  {item.label[language]}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </header>
  );
}
