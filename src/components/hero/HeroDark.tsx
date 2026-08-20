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

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1800px] flex-col items-center justify-center px-5 lg:min-h-screen lg:px-16">
        <h1 className="sr-only">Pali ceramics</h1>

        <div className="flex flex-col items-center gap-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(5rem,env(safe-area-inset-top))] sm:gap-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
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
            className="theme-hero-tag max-w-md text-center font-body text-[10px] leading-relaxed tracking-[0.16em] sm:text-[11px] sm:tracking-[0.2em] lg:text-[12px] lg:tracking-[0.22em]"
            animate={fade}
          >
            {pickBilingual(siteCopy?.heroTag, hero.heroTag, language)}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
