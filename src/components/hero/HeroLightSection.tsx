"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/lib/content";
import { images } from "@/lib/images";
import { LightSectionSymbolScatter } from "./JapandiSymbols";

function InlineCeramic({
  type,
  className = "",
}: {
  type: "bowl" | "tableware";
  className?: string;
}) {
  const src = type === "bowl" ? images.accentBowl : images.accentTableware;
  const size = type === "bowl" ? "h-14 w-14 md:h-16 md:w-16" : "h-16 w-16 md:h-20 md:w-20";

  return (
    <span className={`relative mx-2 inline-block align-middle ${size} ${className}`}>
      <Image src={src} alt="" fill className="object-contain" sizes="80px" />
    </span>
  );
}

export function HeroLightSection() {
  const { language, isTransitioning } = useLanguage();
  const { hero } = siteContent;
  const parts = hero.lightStatement[language];

  const fade = {
    opacity: isTransitioning ? 0 : 1,
    transition: { duration: 0.35 },
  };

  return (
    <section id="collection" className="relative overflow-hidden bg-slip text-ink">
      <LightSectionSymbolScatter />

      <div className="relative z-10 mx-auto max-w-6xl px-8 py-24 lg:px-16 lg:py-32">
        <motion.p
          key={`coll-${language}`}
          className="font-body mb-6 text-[10px] font-medium tracking-[0.2em] text-[#3d4a5c]/60 uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          animate={fade}
        >
          {siteContent.collectionLabel[language]}
        </motion.p>

        <motion.p
          key={`script-${language}`}
          className="font-display mb-3 text-2xl tracking-[0.14em] text-[#3d4a5c]/80 md:text-3xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={fade}
        >
          器
        </motion.p>

        <motion.p
          key={`script2-${language}`}
          className="font-body mb-10 text-base tracking-[0.08em] text-[#3d4a5c]/65 md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={fade}
        >
          {hero.lightScript[language]}
        </motion.p>

        <motion.p
          key={`statement-${language}`}
          className="font-display text-xl leading-[1.65] tracking-[0.02em] md:text-[1.65rem] md:leading-[1.6] lg:text-[1.85rem]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          animate={fade}
        >
          {parts.map((part, i) =>
            part.image ? (
              <InlineCeramic
                key={i}
                type={part.image}
                className={part.image === "bowl" ? "-rotate-6" : "rotate-6"}
              />
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
        </motion.p>
      </div>
    </section>
  );
}
