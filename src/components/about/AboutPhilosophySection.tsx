"use client";

import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { inter } from "@/lib/fonts";
import {
  aboutHeader,
  aboutTabs,
  type AboutTabId,
  t,
} from "@/lib/aboutContent";
import { TimelineTab } from "./tabs/TimelineTab";
import { ScrapbookTab } from "./tabs/ScrapbookTab";
import { HotspotsTab } from "./tabs/HotspotsTab";
import { VideoMeditationTab } from "./tabs/VideoMeditationTab";

const tabPanels: Record<AboutTabId, ComponentType> = {
  timeline: TimelineTab,
  scrapbook: ScrapbookTab,
  hotspots: HotspotsTab,
  video: VideoMeditationTab,
};

export function AboutPhilosophySection() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<AboutTabId>("timeline");
  const ActivePanel = tabPanels[activeTab];

  return (
    <section
      id="about"
      className={`${inter.variable} relative scroll-mt-28 bg-[#EDE8DF] font-sans text-[#2a2826]`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 50% 40% at 10% 20%, rgba(210,190,160,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 45% 35% at 90% 80%, rgba(180,170,155,0.1) 0%, transparent 50%)
          `,
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
        <header className="mx-auto max-w-2xl text-center">
          <motion.p
            className="font-sans text-[11px] uppercase tracking-[0.32em] text-[#3d3835]/55"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
          >
            {t(aboutHeader.eyebrow, language)}
          </motion.p>
          <motion.h2
            className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[0.04em] text-[#2a2826]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            {t(aboutHeader.title, language)}
          </motion.h2>
          <motion.p
            className="mt-4 font-sans text-sm leading-relaxed text-[#3d3835]/72 sm:text-[15px]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.14 }}
          >
            {t(aboutHeader.subtitle, language)}
          </motion.p>
        </header>

        <div className="mt-12 sm:mt-14">
          <div
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            role="tablist"
            aria-label="About layout variations"
          >
            {aboutTabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`about-panel-${tab.id}`}
                  id={`about-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 sm:px-5 sm:text-xs sm:tracking-[0.2em] ${
                    selected
                      ? "text-[#F7F3EC]"
                      : "text-[#3d3835]/65 hover:text-[#2a2826]"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="about-tab-pill"
                      className="absolute inset-0 rounded-full bg-[#2a2826] shadow-[0_8px_24px_rgba(42,40,38,0.18)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative font-display text-sm leading-none opacity-80">{tab.kanji}</span>
                  <span className="relative">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={`about-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`about-tab-${activeTab}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
