"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminSiteCopy } from "@/context/AdminDataContext";
import { pickSectionCopy } from "@/lib/adminTypes";
import { handleSectionClick } from "@/lib/scrollToSection";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { workshopsHeader } from "@/lib/workshopsContent";
import { WorkshopBookingBuilder } from "./WorkshopBookingBuilder";
import { WorkshopPotteryPattern } from "./WorkshopPotteryPattern";

export function WorkshopsBookingSection() {
  const { language } = useLanguage();
  const siteCopy = useAdminSiteCopy();
  const header = pickSectionCopy(siteCopy?.workshops, workshopsHeader, language);

  const giftLink =
    language === "pl"
      ? { label: "Voucher na warsztat", hint: "Podaruj sesję" }
      : { label: "Workshop gift card", hint: "Give a session" };

  return (
    <section
      id="workshops"
      className="relative isolate scroll-mt-28 bg-theme-surface text-theme transition-colors duration-700"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-border)]/20 to-transparent"
        aria-hidden
      />

      <div className="section-inner">
        <MotionReveal>
          <header className="pointer-events-none mx-auto max-w-2xl text-center">
            <p className="font-body text-[11px] uppercase tracking-[0.32em] text-theme-muted">
              {header.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[0.06em] text-theme">
              {header.title}
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed tracking-[0.04em] text-theme-muted sm:text-[15px]">
              {header.subtitle}
            </p>

            <div className="pointer-events-auto mt-5">
              <Link
                href="#certificates"
                onClick={(e) => handleSectionClick(e, "#certificates")}
                className="group inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-theme-muted transition-colors hover:text-theme"
              >
                <span>{giftLink.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="text-theme-muted/60 normal-case tracking-normal">· {giftLink.hint}</span>
              </Link>
            </div>
          </header>

          <div className="pointer-events-auto relative z-20 mt-8 sm:mt-10">
            <div className="workshops-booking-panel relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--theme-border)_16%,transparent)] px-4 py-6 shadow-[0_24px_64px_rgba(0,0,0,0.12)] sm:px-6 sm:py-8 lg:px-8 lg:py-9">
              <WorkshopPotteryPattern />
              <div className="relative z-[1]">
                <WorkshopBookingBuilder />
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
