"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { t, videoMeditation } from "@/lib/aboutContent";

function WheelAmbience() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#2a2826]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 55%, rgba(90,106,130,0.22) 0%, transparent 65%)",
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[min(70vw,420px)] w-[min(70vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#EDE8DF]/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-[12%] rounded-full border border-[#EDE8DF]/07" />
        <div className="absolute inset-[24%] rounded-full border border-[#EDE8DF]/05" />
        <div className="absolute inset-[38%] rounded-full bg-[#38383c]/70 blur-sm" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[min(42vw,240px)] w-[min(42vw,240px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(180,160,140,0.06), rgba(44,52,68,0.28), rgba(180,160,140,0.06))",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(26,26,28,0.65)_100%)]" />
    </div>
  );
}

export function VideoMeditationTab() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { language } = useLanguage();

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[2px] border border-[#EDE8DF]/12"
    >
      <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[560px]">
        <WheelAmbience />

        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-soft-light"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/cutout/hero-plate.png"
        >
          <source src="/videos/wheel-loop.mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none relative z-10 flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[520px] lg:min-h-[560px]">
          <motion.p
            className="font-body text-[10px] uppercase tracking-[0.32em] text-[#EDE8DF]/45"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            {language === "en" ? "Cinematic preview" : "Podgląd kinowy"}
          </motion.p>

          <motion.h3
            className="mt-6 font-display text-3xl tracking-[0.08em] text-[#FAFAFA] sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {t(videoMeditation.title, language)}
          </motion.h3>

          <div className="mt-10 space-y-3 sm:mt-12 sm:space-y-4">
            {videoMeditation.lines.map((line, index) => (
              <motion.p
                key={index}
                className="font-body text-base tracking-[0.14em] text-[#EDE8DF]/88 sm:text-lg"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.75,
                  delay: 0.35 + index * 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {t(line, language)}
              </motion.p>
            ))}
          </div>

          <motion.p
            className="mt-12 font-body text-[11px] tracking-[0.24em] text-[#EDE8DF]/38"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {t(videoMeditation.caption, language)}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
