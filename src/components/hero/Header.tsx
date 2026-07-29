"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";
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
    <a href={item.href} className={NAV_LINK} onClick={onNavigate}>
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
      <div className="mx-auto grid max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-8 py-6 lg:px-16 lg:py-7">
        {/* Logo lockup — kanji stamp + structured wordmark */}
        <a href="#" className="pointer-events-auto inline-flex items-center gap-3.5">
          <span
            className="font-display text-[1.65rem] leading-none text-[#FAFAFA] [text-shadow:0_1px_5px_rgba(0,0,0,0.5)]"
            aria-hidden
          >
            {logo.kanji}
          </span>
          <span className="flex flex-col gap-0.5 border-l border-[#EDE8DF]/18 pl-3.5">
            <motion.span
              key={`wm-${language}`}
              className="font-display text-[13px] font-medium leading-none tracking-[0.32em] text-[#FAFAFA] [text-shadow:0_1px_4px_rgba(0,0,0,0.45)]"
              animate={fade}
            >
              {logo.wordmark[language]}
            </motion.span>
            <span className="font-body text-[10px] font-normal leading-none tracking-[0.18em] text-[#E8E8E8]/82">
              {logo.descriptor}
            </span>
            <span className="font-body text-[8px] leading-none tracking-[0.24em] text-[#E5E5E5]/42">
              {logo.subtitle}
            </span>
          </span>
        </a>

        {/* Center nav — hanko rail */}
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

        {/* Right */}
        <div className="pointer-events-auto flex items-center justify-end gap-4">
          <LanguageToggle />
          <button
            type="button"
            className="text-[#F3F4F6] transition-opacity hover:opacity-80 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <motion.div
        className="pointer-events-auto overflow-hidden border-t border-[#EDE8DF]/15 bg-[#38383c] md:hidden"
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      >
        <ul className="grid grid-cols-2 gap-px bg-[#EDE8DF]/10 px-6 py-4">
          {nav.map((item) => (
            <li key={item.id} className="bg-[#38383c]">
              <a
                href={item.href}
                className="flex flex-col items-center gap-1.5 px-3 py-4 transition-colors hover:bg-[#3a3a3e]"
                onClick={() => setOpen(false)}
              >
                <span className="font-display text-lg leading-none text-[#F5F5F5]">{item.kanji}</span>
                <span className="font-body text-[10px] tracking-[0.18em] text-[#E8E8E8]/80">
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
