"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAdminSiteCopy } from "@/context/AdminDataContext";
import { pickSectionCopy } from "@/lib/adminTypes";
import { aboutHeader } from "@/lib/aboutContent";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { AboutDecorCutouts } from "./AboutDecorCutouts";
import { PalinaStoryGallery } from "./PalinaStoryGallery";

export function AboutStudioSection() {
  const { language } = useLanguage();
  const siteCopy = useAdminSiteCopy();
  const header = pickSectionCopy(siteCopy?.about, aboutHeader, language);

  return (
    <section
      id="about"
      className="relative isolate scroll-mt-28 overflow-hidden bg-theme-surface text-theme transition-colors duration-700"
    >
      <AboutDecorCutouts />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-border)]/20 to-transparent"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 45% at 82% 18%, rgba(210,190,160,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 15% 75%, rgba(180,175,165,0.04) 0%, transparent 50%)
          `,
        }}
        aria-hidden
      />

      <div className="section-inner relative z-10">
        <header className="pointer-events-none mx-auto max-w-2xl text-center">
          <MotionReveal>
            <p className="font-body text-[11px] uppercase tracking-[0.32em] text-theme-muted">
              {header.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[0.06em] text-theme">
              {header.title}
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed tracking-[0.04em] text-theme-muted sm:text-[15px]">
              {header.subtitle}
            </p>
          </MotionReveal>
        </header>

        <PalinaStoryGallery />
      </div>
    </section>
  );
}
