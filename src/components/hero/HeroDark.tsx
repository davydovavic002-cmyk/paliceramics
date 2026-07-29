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
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-[#38383c]">
      <AmbientLightCanvas />
      <JapandiBackground />
      <ForegroundBokehCanvas />
      <DustMotesCanvas />
      <HakemeStrokes />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1800px] flex-col px-5 lg:min-h-screen lg:px-16">
        {/* Center stage */}
        <div className="flex flex-1 flex-col items-center justify-center pt-[max(3.5rem,env(safe-area-inset-top))] pb-2 lg:min-h-screen lg:justify-center lg:pt-[13vh] lg:pb-[12vh]">
          <motion.div
            className="pointer-events-none flex w-full max-w-[min(92vw,520px)] flex-col items-center gap-3 sm:gap-4 lg:gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroArcTitle />

            <div className="relative flex h-[22vh] min-h-[150px] w-full items-end justify-center sm:h-[24vh] sm:min-h-[170px] lg:h-[32vh] lg:min-h-[200px] lg:max-h-[400px]">
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
                quality={85}
                className="relative z-[1] max-h-full w-auto max-w-[min(76vw,280px)] object-contain sm:max-w-[min(68vw,320px)] lg:max-w-[360px]"
                sizes="(max-width:640px) 76vw, (max-width:1024px) 68vw, 360px"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom rail */}
        <motion.div
          className="shrink-0 space-y-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:space-y-6 lg:absolute lg:inset-x-16 lg:bottom-[max(6rem,12vh)] lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:space-y-0 lg:pb-0 lg:pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <CeramicSpecs className="lg:col-span-4 xl:col-span-3" />

          <div className="hidden lg:col-span-4 lg:block xl:col-span-6" aria-hidden />

          <div className="flex flex-col items-center gap-4 lg:col-span-4 lg:col-start-10 lg:items-end xl:col-span-3 xl:col-start-10">
            <div className="flex items-end justify-center gap-3 sm:gap-5">
              <motion.div key={`btn1-${language}`} animate={fade}>
                <CeramicButton
                  href="#collection"
                  size="md"
                  intent="primary"
                  kanji={hero.ctaPrimaryKanji}
                  className="lg:hidden"
                >
                  {hero.ctaPrimary[language]}
                </CeramicButton>
                <CeramicButton
                  href="#collection"
                  size="lg"
                  intent="primary"
                  kanji={hero.ctaPrimaryKanji}
                  className="hidden lg:inline-flex"
                >
                  {hero.ctaPrimary[language]}
                </CeramicButton>
              </motion.div>
              <motion.div key={`btn2-${language}`} animate={fade}>
                <CeramicButton
                  href="#about"
                  size="md"
                  intent="secondary"
                  kanji={hero.ctaSecondaryKanji}
                  className="lg:hidden"
                >
                  {hero.ctaSecondary[language]}
                </CeramicButton>
                <CeramicButton
                  href="#about"
                  size="lg"
                  intent="secondary"
                  kanji={hero.ctaSecondaryKanji}
                  className="hidden lg:inline-flex"
                >
                  {hero.ctaSecondary[language]}
                </CeramicButton>
              </motion.div>
            </div>

            <motion.p
              key={`tag-${language}`}
              className="max-w-[18rem] text-center font-body text-[10px] leading-relaxed tracking-[0.16em] text-[#E8E8E8]/75 sm:text-[11px] sm:tracking-[0.2em] lg:max-w-none lg:text-right lg:text-[12px] lg:tracking-[0.22em]"
              animate={fade}
            >
              {hero.heroTag[language]}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
