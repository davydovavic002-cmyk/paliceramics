"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useMotionFlags } from "@/context/DemoControlsContext";
import { siteContent } from "@/lib/content";

const HakemeStrokes = dynamic(() => import("./HakemeStrokes").then((m) => m.HakemeStrokes), {
  ssr: false,
});

function HeroCopyLine({ children }: { children: string }) {
  return <span className="hero-copy-line">{children}</span>;
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
        "font-display text-[9px] font-normal tracking-[0.04em] text-[#f7f4ef] transition-opacity duration-300 hover:opacity-90 sm:text-[10px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7f4ef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#353230]",
        variant === "filled"
          ? "bg-[#010A8B] text-[#f7f4ef]"
          : "border border-[#f7f4ef] bg-transparent text-[#f7f4ef]",
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
  const { showDriftingStrokes } = useMotionFlags();
  const { hero } = siteContent;

  const fade = {
    opacity: isTransitioning ? 0.88 : 1,
    transition: { duration: 0.35 },
  };

  /* the hero statement stays in English in both locales, as in the reference design */
  const sublineLines = hero.heroSublineLines.en;
  const headlineLines = hero.heroHeadlineLines.en;

  return (
    <section className="hero-dark-band hero-viewport-height relative isolate flex flex-col items-center justify-center overflow-hidden overflow-x-clip bg-[#353230] pb-20 md:pb-0">
      {showDriftingStrokes ? <HakemeStrokes /> : null}

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col overflow-x-clip px-5 lg:px-16">
        <h1 className="sr-only">Pali ceramics</h1>

        <div className="flex flex-1 flex-col items-center justify-center pb-44 pt-[max(4.5rem,env(safe-area-inset-top))] md:pb-32">
          <div className="hero-copy-column flex w-full flex-col items-center text-center">
            <motion.div key={`logo-${language}`} animate={fade} className="hero-brand-logo">
              <span className="hero-brand-logo-mark block" role="img" aria-label="Pali ceramics" />
            </motion.div>

            <motion.div
              key={`headline-${language}`}
              className="hero-copy hero-copy-headline"
              animate={fade}
            >
              {headlineLines.map((line) => (
                <p key={line}>
                  <HeroCopyLine>{line}</HeroCopyLine>
                </p>
              ))}
            </motion.div>

            <motion.span
              key={`dot-${language}`}
              className="hero-copy-dot block h-1.5 w-1.5 rounded-full"
              animate={fade}
              aria-hidden
            />

            <motion.div
              key={`lines-${language}`}
              className="hero-copy hero-copy-subline"
              animate={fade}
            >
              {sublineLines.map((line) => (
                <p key={line}>
                  <HeroCopyLine>{line}</HeroCopyLine>
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* pinned to the section, not the max-w-[1800px] track, so the offset stays 32px
          from the screen edge on wide monitors */}
      <motion.div
        key={`cta-${language}`}
        className="pointer-events-auto absolute bottom-[max(5rem,env(safe-area-inset-bottom))] left-8 z-10 flex gap-2 sm:gap-2.5 md:bottom-[max(2rem,env(safe-area-inset-bottom))]"
        animate={fade}
      >
        <HeroSquareLink href="#collection" label={hero.ctaPrimary[language]} variant="filled" />
        <HeroSquareLink href="#contact" label={hero.ctaSecondary[language]} variant="outline" />
      </motion.div>
    </section>
  );
}
