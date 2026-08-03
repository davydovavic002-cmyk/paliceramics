"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { scrapbookItems, t } from "@/lib/aboutContent";

function TextureCard({ texture }: { texture: "glaze" | "sketch" }) {
  if (texture === "glaze") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 25%, rgba(255,252,245,0.55) 0%, transparent 45%),
            radial-gradient(circle at 70% 80%, rgba(120,95,70,0.35) 0%, transparent 50%),
            linear-gradient(145deg, #c8b59a 0%, #9a8670 45%, #7a6a58 100%)
          `,
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-[#F7F3EC]">
      <svg viewBox="0 0 200 200" className="h-full w-full opacity-70" aria-hidden>
        <path
          d="M24 140 Q 60 90, 100 110 T 176 60"
          fill="none"
          stroke="#3d3835"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.35"
        />
        <ellipse cx="100" cy="118" rx="52" ry="18" fill="none" stroke="#3d3835" strokeWidth="1" opacity="0.25" />
        <path d="M72 148 L128 148" stroke="#3d3835" strokeWidth="0.8" opacity="0.2" />
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

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      className={`group relative ${item.span} min-h-[180px]`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={{ perspective: 900 }}
    >
      <motion.div
        className="relative h-full overflow-hidden rounded-[2px] border border-[#3d3835]/10 bg-[#F7F3EC] shadow-[0_18px_40px_rgba(61,56,53,0.08)]"
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
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a2826]/55 via-transparent to-transparent" />
          </div>
        ) : null}

        {item.type === "texture" ? (
          <div className="relative min-h-[180px] w-full sm:min-h-[220px]">
            <TextureCard texture={item.texture} />
          </div>
        ) : null}

        {item.type === "quote" ? (
          <div className="flex min-h-[180px] items-center justify-center bg-[#EDE8DF] p-6 sm:min-h-[220px]">
            <p className="font-display text-center text-lg leading-relaxed text-[#2a2826]/85 sm:text-xl">
              “{t(item.quote, language)}”
            </p>
          </div>
        ) : null}

        {item.type !== "quote" ? (
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="font-display text-sm leading-snug text-[#F7F3EC] sm:text-base">
              “{t(item.quote, language)}”
            </p>
          </div>
        ) : null}

        <motion.div
          className="pointer-events-none absolute inset-0 flex items-end bg-[#2a2826]/72 p-4 backdrop-blur-[2px] sm:p-5"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#EDE8DF]/90">
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
      <p className="mb-8 font-sans text-[11px] uppercase tracking-[0.28em] text-[#3d3835]/50">
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
