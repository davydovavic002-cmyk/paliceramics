"use client";

import { useEffect, useRef, useState } from "react";
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
  return (
    <button
      type="button"
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onClick={onSelect}
      aria-expanded={active}
      aria-label={hotspot.label.en}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-[#EDE8DF]/35"
          animate={{ scale: [1, 1.8, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-[#EDE8DF]/25"
          animate={{ scale: [1, 2.4, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <span
          className={`relative h-3 w-3 rounded-full border-2 transition-colors duration-300 ${
            active
              ? "border-[#EDE8DF] bg-[#2c3444]"
              : "border-[#EDE8DF]/90 bg-[#EDE8DF]/80 shadow-[0_0_12px_rgba(237,232,223,0.45)]"
          }`}
        />
      </span>
    </button>
  );
}

export function HotspotsTab() {
  const { language } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(hotspots[0]?.id ?? null);
  const panelRef = useRef<HTMLDivElement>(null);
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
      <p className="mb-8 text-center font-sans text-[11px] uppercase tracking-[0.28em] text-[#3d3835]/50">
        {language === "en" ? "Deconstruction — tap a hotspot" : "Dekonstrukcja — wybierz punkt"}
      </p>

      <div ref={panelRef} className="relative mx-auto max-w-xl">
        <div className="relative overflow-hidden rounded-sm bg-[#E8E2D8] px-6 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_24px_60px_rgba(61,56,53,0.12)] sm:px-10 sm:py-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,252,245,0.65) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative mx-auto aspect-[4/3] max-h-[420px] w-full max-w-md">
            <Image
              src={images.heroPlate}
              alt="Ceramic bowl"
              fill
              sizes="(max-width:768px) 90vw, 480px"
              className="object-contain drop-shadow-[0_20px_40px_rgba(42,40,38,0.18)]"
              priority={false}
            />

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

        <AnimatePresence mode="wait">
          {active && activeId ? (
            <motion.div
              key={active.id}
              className="absolute left-1/2 top-[calc(100%+1rem)] z-20 w-[min(92vw,22rem)] -translate-x-1/2 sm:top-[calc(100%+1.25rem)]"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-sm border border-[#3d3835]/12 bg-[#F7F3EC]/72 p-5 shadow-[0_20px_50px_rgba(42,40,38,0.14)] backdrop-blur-xl sm:p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#3d3835]/55">
                  {language === "en" ? "Philosophy" : "Filozofia"}
                </p>
                <h3 className="mt-2 font-display text-lg text-[#2a2826] sm:text-xl">
                  {t(active.label, language)}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-[#3d3835]/82">
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
