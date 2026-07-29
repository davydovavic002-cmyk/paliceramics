"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";
import { images } from "@/lib/images";
import { CeramicButton } from "@/components/ui/CeramicButton";
import { JapandiBackground } from "./JapandiBackground";
import { HakemeStrokes } from "./HakemeStrokes";
import { CeramicSpecs } from "./CeramicSpecs";
import { HeroArcTitle } from "./HeroArcTitle";

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
  const { hero } = siteContent;

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.4 },
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#38383c]">
      <AmbientLightCanvas />
      <JapandiBackground />
      <ForegroundBokehCanvas />
      <DustMotesCanvas />
      <HakemeStrokes />

      {/* Unified 12-col grid — same max-width & gutters as header */}
      <div className="relative z-10 mx-auto min-h-screen max-w-[1800px] px-8 lg:px-16">
        {/* Stage — balanced around header (~14vh) and bottom rail (~13vh) */}
        <div className="flex min-h-screen flex-col items-center justify-center pt-[14vh] pb-[11vh] lg:pt-[13vh] lg:pb-[12vh]">
          <motion.div
            className="pointer-events-none flex w-full max-w-[min(80vw,520px)] flex-col items-center gap-4 lg:gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroArcTitle />

            <div className="relative flex h-[28vh] min-h-[200px] w-full items-end justify-center lg:h-[32vh] lg:max-h-[400px]">
              <div
                className="pointer-events-none absolute left-1/2 top-[18%] h-[72%] w-[78%] -translate-x-1/2 rounded-[50%] opacity-90"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 65% at 50% 42%, rgba(235,228,215,0.14) 0%, rgba(200,190,175,0.05) 42%, transparent 72%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[22%] h-[65%] w-[55%] -translate-x-1/2 rounded-[50%] blur-md"
                style={{
                  background:
                    "radial-gradient(ellipse at 38% 30%, rgba(255,252,245,0.08) 0%, transparent 65%)",
                }}
                aria-hidden
              />

              <Image
                src={images.heroPlate}
                alt="Hand-thrown stoneware bowl"
                width={1065}
                height={586}
                priority
                quality={100}
                className="relative z-[1] max-h-full w-auto max-w-[min(68vw,360px)] object-contain lg:max-w-[360px]"
                sizes="(max-width:768px) 68vw, 360px"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom rail — raised on desktop; in-flow on mobile */}
        <div className="mt-16 grid grid-cols-12 items-end gap-x-6 gap-y-10 lg:absolute lg:inset-x-16 lg:bottom-[max(6rem,12vh)] lg:mt-0">
          <CeramicSpecs className="col-span-12 lg:col-span-4 xl:col-span-3" />

          <div className="hidden lg:col-span-4 lg:block xl:col-span-6" aria-hidden />

          <motion.div
            className="col-span-12 flex flex-col items-start gap-5 lg:col-span-4 lg:col-start-10 lg:items-end xl:col-span-3 xl:col-start-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-end gap-5">
              <motion.div key={`btn1-${language}`} animate={fade}>
                <CeramicButton href="#collection" size="lg" intent="primary" kanji={hero.ctaPrimaryKanji}>
                  {hero.ctaPrimary[language]}
                </CeramicButton>
              </motion.div>
              <motion.div key={`btn2-${language}`} animate={fade}>
                <CeramicButton href="#about" size="lg" intent="secondary" kanji={hero.ctaSecondaryKanji}>
                  {hero.ctaSecondary[language]}
                </CeramicButton>
              </motion.div>
            </div>

            <motion.p
              key={`tag-${language}`}
              className="font-body text-[12px] tracking-[0.22em] text-[#E8E8E8]/75 lg:text-right"
              animate={fade}
            >
              {hero.heroTag[language]}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
