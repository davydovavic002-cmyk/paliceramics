"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useMotionFlags } from "@/context/DemoControlsContext";
import { scrapbookItems, t } from "@/lib/aboutContent";

function TextureCard({ texture }: { texture: "glaze" | "sketch" }) {
  if (texture === "glaze") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 25%, rgba(255,252,245,0.12) 0%, transparent 45%),
            radial-gradient(circle at 70% 80%, rgba(90,106,130,0.25) 0%, transparent 50%),
            linear-gradient(145deg, #3a3632 0%, #2c3444 45%, #323234 100%)
          `,
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-[#2e2e32]">
      <svg viewBox="0 0 200 200" className="h-full w-full opacity-60" aria-hidden>
        <path
          d="M24 140 Q 60 90, 100 110 T 176 60"
          fill="none"
          stroke="#EDE8DF"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.25"
        />
        <ellipse cx="100" cy="118" rx="52" ry="18" fill="none" stroke="#EDE8DF" strokeWidth="1" opacity="0.18" />
        <path d="M72 148 L128 148" stroke="#EDE8DF" strokeWidth="0.8" opacity="0.15" />
      </svg>
    </div>
  );
}

function ScrapbookCard({
  item,
  index,
}: {
  item: (typeof scrapbookItems)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const { language } = useLanguage();
  const { showHoverTilt } = useMotionFlags();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showHoverTilt) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  };

  return (
    <motion.article
      ref={ref}
      className={`group relative cursor-pointer ${item.span} min-h-[180px]`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={showHoverTilt ? handleMove : undefined}
      onMouseEnter={() => showHoverTilt && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={showHoverTilt ? { perspective: 900 } : undefined}
    >
      <motion.div
        className="relative h-full overflow-hidden rounded-[2px] border border-[#EDE8DF]/12 bg-[#323234] shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          y: hovered ? -6 : 0,
          scale: hovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {item.type === "image" ? (
          <div className="relative aspect-[4/3] h-full min-h-[180px] w-full sm:aspect-auto sm:min-h-[220px]">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#38383c]/90 via-[#38383c]/20 to-transparent" />
          </div>
        ) : null}

        {item.type === "texture" ? (
          <div className="relative min-h-[180px] w-full sm:min-h-[220px]">
            <TextureCard texture={item.texture} />
          </div>
        ) : null}

        {item.type === "quote" ? (
          <div className="flex min-h-[180px] items-center justify-center border border-[#EDE8DF]/8 bg-[#2c3444]/50 p-6 sm:min-h-[220px]">
            <p className="font-display text-center text-lg leading-relaxed text-[#EDE8DF]/90 sm:text-xl">
              “{t(item.quote, language)}”
            </p>
          </div>
        ) : null}

        {item.type !== "quote" ? (
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="font-display text-sm leading-snug text-[#FAFAFA]/95 sm:text-base">
              “{t(item.quote, language)}”
            </p>
          </div>
        ) : null}

        <motion.div
          className="pointer-events-none absolute inset-0 flex items-end bg-[#2c3444]/85 p-4 backdrop-blur-[3px] sm:p-5"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.24em] text-[#EDE8DF]/85">
            {t(item.meta, language)}
          </p>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

export function ScrapbookTab() {
  const { language } = useLanguage();

  return (
    <div>
      <p className="mb-8 font-body text-[10px] uppercase tracking-[0.28em] text-[#E5E5E5]/45">
        {language === "en" ? "Moodboard" : "Tablica nastroju"}
      </p>
      <div className="grid auto-rows-auto grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {scrapbookItems.map((item, index) => (
          <ScrapbookCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
