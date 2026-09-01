"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useMotionFlags } from "@/context/DemoControlsContext";
import { siteContent } from "@/lib/content";
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

function SpacedLine({ children, className = "" }: { children: string; className?: string }) {
  return <span className={className}>{children.split("").join(" ")}</span>;
}

function HeroCtaIcon({ variant }: { variant: "ring" | "target" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-7 w-7 sm:h-8 sm:w-8"
      fill="none"
      aria-hidden
    >
      <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="1.15" />
      {variant === "target" ? <circle cx="24" cy="24" r="3.5" fill="currentColor" /> : null}
    </svg>
  );
}

function HeroSquareLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "filled" | "outline";
}) {
  return (
    <Link
      href={href}
      className={[
        "hero-square-cta flex h-[min(22vw,88px)] w-[min(22vw,88px)] flex-col items-center justify-between px-1.5 pb-2.5 pt-2.5",
        "font-display text-[9px] font-normal tracking-[0.04em] text-[#ede8df] transition-opacity duration-300 hover:opacity-90 sm:text-[10px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ede8df] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2c2a27]",
        variant === "filled"
          ? "bg-[#010A8B] text-[#ede8df]"
          : "border border-[#ede8df] bg-transparent text-[#ede8df]",
      ].join(" ")}
    >
      <span className="flex flex-1 items-center justify-center">
        <HeroCtaIcon variant={variant === "filled" ? "ring" : "target"} />
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function HeroDark() {
  const { language, isTransitioning } = useLanguage();
  const { showWebGL, showMicroAnimations } = useMotionFlags();
  const { hero } = siteContent;

  const fade = {
    opacity: isTransitioning ? 0.88 : 1,
    transition: { duration: 0.35 },
  };

  const sublineLines = hero.heroSublineLines.en;
  const headlineLines = hero.heroHeadlineLines.en;

  return (
    <section className="hero-dark-band relative isolate min-h-[100dvh] overflow-hidden bg-[#2c2a27]">
      {showWebGL ? <AmbientLightCanvas /> : null}
      <JapandiBackground />
      <ForegroundBokehCanvas />
      {showWebGL && showMicroAnimations ? <DustMotesCanvas /> : null}
      <HakemeStrokes />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1800px] flex-col px-5 lg:min-h-screen lg:px-16">
        <h1 className="sr-only">Pali ceramics</h1>

        <div className="flex flex-1 flex-col items-center justify-center pb-28 pt-[max(5.5rem,env(safe-area-inset-top))] sm:pb-32 lg:min-h-screen lg:pb-36 lg:pt-[10vh]">
          <div className="flex w-full max-w-[min(88vw,360px)] flex-col items-center text-center">
            <motion.div key={`logo-${language}`} animate={fade} className="hero-brand-logo mb-5 sm:mb-6">
              <span
                className="hero-brand-logo-mark block h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20"
                role="img"
                aria-label="Pali ceramics"
              />
            </motion.div>

            <motion.div
              key={`headline-${language}`}
              className="space-y-1 font-sans text-[11px] font-light lowercase leading-none text-[#ede8df] sm:text-[12px]"
              animate={fade}
            >
              {headlineLines.map((line) => (
                <p key={line}>
                  <SpacedLine>{line}</SpacedLine>
                </p>
              ))}
            </motion.div>

            <motion.span
              key={`dot-${language}`}
              className="my-5 block h-1.5 w-1.5 rounded-full bg-[#ede8df]"
              animate={fade}
              aria-hidden
            />

            <motion.div
              key={`lines-${language}`}
              className="space-y-1 font-sans text-[11px] font-light lowercase leading-[1.5] text-[#ede8df] sm:text-[12px] sm:leading-[1.55]"
              animate={fade}
            >
              {sublineLines.map((line) => (
                <p key={line}>
                  <SpacedLine>{line}</SpacedLine>
                </p>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          key={`cta-${language}`}
          className="pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 flex gap-2 sm:gap-2.5 lg:left-16"
          animate={fade}
        >
          <HeroSquareLink href="#collection" label={hero.ctaPrimary[language]} variant="filled" />
          <HeroSquareLink href="#contact" label={hero.ctaSecondary[language]} variant="outline" />
        </motion.div>
      </div>
    </section>
  );
}
