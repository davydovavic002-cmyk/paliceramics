"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useMotionFlags } from "@/context/DemoControlsContext";
import { useAdminSiteCopy } from "@/context/AdminDataContext";
import { pickBilingual } from "@/lib/adminTypes";
import { siteContent } from "@/lib/content";
import { CeramicButton } from "@/components/ui/CeramicButton";
import { JapandiBackground } from "./JapandiBackground";
import { HakemeStrokes } from "./HakemeStrokes";
import { CeramicSpecs } from "./CeramicSpecs";
import { HeroCeramicsIllustration } from "./HeroCeramicsIllustration";

const AmbientLightCanvas = dynamic(
  () => import("./AmbientLightCanvas").then((m) => m.AmbientLightCanvas),
  { ssr: false }
);

const ForegroundBokehCanvas = dynamic(
  () => import("./ForegroundBokehCanvas").then((m) => m.ForegroundBokehCanvas),
  { ssr: false }
);

const DustMotesCanvas = dynamic(
  () => import("./DustMotesCanvas").then((m) => m.DustMotesCanvas),
  { ssr: false }
);

export function HeroDark() {
  const { language, isTransitioning } = useLanguage();
  const siteCopy = useAdminSiteCopy();
  const { showWebGL, showMicroAnimations } = useMotionFlags();
  const { hero } = siteContent;

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.4 },
  };

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-theme-surface transition-colors duration-700">
      {showWebGL ? <AmbientLightCanvas /> : null}
      <JapandiBackground />
      <ForegroundBokehCanvas />
      {showWebGL && showMicroAnimations ? <DustMotesCanvas /> : null}
      <HakemeStrokes />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1800px] flex-col px-5 lg:min-h-screen lg:px-16">
        <h1 className="sr-only">Pali ceramics</h1>
        <div className="flex flex-1 flex-col items-center justify-center pt-[max(3rem,env(safe-area-inset-top))] pb-2 lg:min-h-screen lg:justify-center lg:pt-[10vh] lg:pb-[12vh]">
          <div className="pointer-events-none flex w-full max-w-[min(88vw,440px)] flex-col items-center">
            <div className="relative flex min-h-[200px] w-full items-center justify-center sm:min-h-[240px] lg:min-h-[280px]">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[min(72vw,340px)] w-[min(72vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(235,228,215,0.14) 0%, rgba(200,190,175,0.05) 42%, transparent 72%)",
                }}
                aria-hidden
              />

              <HeroCeramicsIllustration className="relative z-[20] w-full max-w-[min(78vw,280px)] sm:max-w-[min(70vw,320px)] lg:max-w-[380px]" />
            </div>
          </div>
        </div>

        <div className="pointer-events-auto shrink-0 space-y-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:space-y-6 lg:absolute lg:inset-x-16 lg:bottom-[max(6rem,12vh)] lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:space-y-0 lg:pb-0 lg:pt-0">
          <CeramicSpecs className="lg:col-span-4 xl:col-span-3" />

          <div className="hidden lg:col-span-4 lg:block xl:col-span-6" aria-hidden />

          <div className="pointer-events-auto flex flex-col items-center gap-4 lg:col-span-4 lg:col-start-10 lg:items-end xl:col-span-3 xl:col-start-10">
            <div className="pointer-events-auto flex items-end justify-center gap-3 sm:gap-5">
              <motion.div key={`btn1-${language}`} animate={fade}>
                <CeramicButton
                  href="#collection"
                  size="md"
                  intent="primary"
                  microMark="disc"
                  className="lg:hidden"
                >
                  {hero.ctaPrimary[language]}
                </CeramicButton>
                <CeramicButton
                  href="#collection"
                  size="lg"
                  intent="primary"
                  microMark="disc"
                  className="hidden lg:inline-flex"
                >
                  {hero.ctaPrimary[language]}
                </CeramicButton>
              </motion.div>
              <motion.div key={`btn2-${language}`} animate={fade}>
                <CeramicButton
                  href="#contact"
                  size="md"
                  intent="secondary"
                  microMark="ring"
                  className="lg:hidden"
                >
                  {hero.ctaSecondary[language]}
                </CeramicButton>
                <CeramicButton
                  href="#contact"
                  size="lg"
                  intent="secondary"
                  microMark="ring"
                  className="hidden lg:inline-flex"
                >
                  {hero.ctaSecondary[language]}
                </CeramicButton>
              </motion.div>
            </div>

            <motion.p
              key={`tag-${language}`}
              className="theme-hero-tag max-w-[18rem] text-center font-body text-[10px] leading-relaxed tracking-[0.16em] sm:text-[11px] sm:tracking-[0.2em] lg:max-w-none lg:text-right lg:text-[12px] lg:tracking-[0.22em]"
              animate={fade}
            >
              {pickBilingual(siteCopy?.heroTag, hero.heroTag, language)}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
