"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { hotspots, t } from "@/lib/aboutContent";
import { images } from "@/lib/images";

function HotspotDot({
  hotspot,
  active,
  onSelect,
}: {
  hotspot: (typeof hotspots)[number];
  active: boolean;
  onSelect: () => void;
}) {
  const { language } = useLanguage();

  return (
    <button
      type="button"
      className="absolute z-30 cursor-pointer -translate-x-1/2 -translate-y-1/2 touch-manipulation"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      aria-expanded={active}
      aria-label={t(hotspot.label, language)}
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-[#EDE8DF]/30"
          animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-[#EDE8DF]/20"
          animate={{ scale: [1, 2.5, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <span
          className={`relative h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300 ${
            active
              ? "border-[#EDE8DF] bg-[#2c3444] shadow-[0_0_16px_rgba(237,232,223,0.35)]"
              : "border-[#EDE8DF]/90 bg-[#EDE8DF]/75 shadow-[0_0_12px_rgba(237,232,223,0.4)]"
          }`}
        />
      </span>
    </button>
  );
}

export function HotspotsTab() {
  const { language } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(hotspots[0]?.id ?? null);
  const active = hotspots.find((h) => h.id === activeId) ?? hotspots[0];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <p className="mb-8 text-center font-body text-[10px] uppercase tracking-[0.28em] text-[#E5E5E5]/45">
        {language === "en" ? "Deconstruction — tap a hotspot" : "Dekonstrukcja — wybierz punkt"}
      </p>

      <div className="relative mx-auto max-w-xl">
        <div className="relative overflow-hidden rounded-[2px] border border-[#EDE8DF]/12 bg-[#323234]/80 px-6 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_60px_rgba(0,0,0,0.35)] sm:px-10 sm:py-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(235,228,215,0.08) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="pointer-events-none relative mx-auto aspect-[4/3] max-h-[420px] w-full max-w-md">
            <Image
              src={images.heroPlate}
              alt="Ceramic bowl"
              fill
              sizes="(max-width:768px) 90vw, 480px"
              className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
              priority={false}
            />
          </div>

          <div className="pointer-events-auto absolute inset-0 px-6 py-10 sm:px-10 sm:py-14">
            <div className="relative mx-auto aspect-[4/3] max-h-[420px] w-full max-w-md">
              {hotspots.map((hotspot) => (
                <HotspotDot
                  key={hotspot.id}
                  hotspot={hotspot}
                  active={activeId === hotspot.id}
                  onSelect={() =>
                    setActiveId((current) => (current === hotspot.id ? null : hotspot.id))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {active && activeId ? (
            <motion.div
              key={active.id}
              className="relative z-40 mx-auto mt-5 w-[min(92vw,22rem)] sm:mt-6"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-[2px] border border-[#EDE8DF]/20 bg-[#38383c]/92 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-6">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-[#E5E5E5]/50">
                  {language === "en" ? "Philosophy" : "Filozofia"}
                </p>
                <h3 className="mt-2 font-display text-lg tracking-[0.04em] text-[#FAFAFA] sm:text-xl">
                  {t(active.label, language)}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-[#E8E8E8]/78">
                  {t(active.body, language)}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
