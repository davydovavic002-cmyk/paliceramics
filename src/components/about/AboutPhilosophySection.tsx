"use client";

import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminSiteCopy } from "@/context/AdminDataContext";
import { pickSectionCopy } from "@/lib/adminTypes";
import {
  aboutHeader,
  aboutTabs,
  type AboutTabId,
} from "@/lib/aboutContent";
import { TimelineTab } from "./tabs/TimelineTab";
import { ScrapbookTab } from "./tabs/ScrapbookTab";
import { HotspotsTab } from "./tabs/HotspotsTab";
import { VideoMeditationTab } from "./tabs/VideoMeditationTab";
import { WheelTabButton } from "@/components/ui/WheelTabButton";

const tabPanels: Record<AboutTabId, ComponentType> = {
  timeline: TimelineTab,
  scrapbook: ScrapbookTab,
  hotspots: HotspotsTab,
  video: VideoMeditationTab,
};

export function AboutPhilosophySection() {
  const { language } = useLanguage();
  const siteCopy = useAdminSiteCopy();
  const header = pickSectionCopy(siteCopy?.about, aboutHeader, language);
  const [activeTab, setActiveTab] = useState<AboutTabId>("timeline");
  const ActivePanel = tabPanels[activeTab];

  return (
    <section
      id="about"
      className="relative isolate scroll-mt-28 bg-theme-surface text-theme transition-colors duration-700"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EDE8DF]/20 to-transparent"
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

      <p
        className="pointer-events-none absolute right-6 top-[8%] hidden select-none font-display text-[clamp(4rem,10vw,7rem)] leading-none text-[#F3F4F6]/[0.07] lg:right-14 lg:block"
        style={{ writingMode: "vertical-rl" }}
        aria-hidden
      >
        道
      </p>

      <div className="section-inner">
        <header className="pointer-events-none mx-auto max-w-2xl text-center">
          <motion.p
            className="font-body text-[11px] uppercase tracking-[0.32em] text-[#E5E5E5]/55"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
          >
            {header.eyebrow}
          </motion.p>
          <motion.h2
            className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[0.06em] text-theme"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            {header.title}
          </motion.h2>
          <motion.p
            className="mt-4 font-body text-sm leading-relaxed tracking-[0.04em] text-theme-muted sm:text-[15px]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.14 }}
          >
            {header.subtitle}
          </motion.p>
        </header>

        <div className="pointer-events-auto relative z-20 mt-12 sm:mt-14">
          <div
            className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4"
            role="tablist"
            aria-label="About layout variations"
          >
            {aboutTabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <WheelTabButton
                  key={tab.id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`about-panel-${tab.id}`}
                  id={`about-tab-${tab.id}`}
                  selected={selected}
                  glyph={tab.kanji}
                  label={tab.label}
                  onClick={() => setActiveTab(tab.id)}
                />
              );
            })}
          </div>
        </div>

        <div className="pointer-events-auto relative z-20 mt-12 sm:mt-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              id={`about-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`about-tab-${activeTab}`}
              className="relative"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, pointerEvents: "none" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActivePanel />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
