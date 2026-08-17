"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";
import { images } from "@/lib/images";

/** Drawn illustration accents — scattered, not grouped. */
const CUTOUTS = [
  {
    src: images.heroCeramicsCollage,
    alt: "",
    className: "left-[1%] top-[5%] w-[min(11vw,82px)] lg:w-[min(9vw,92px)]",
    depth: 16,
    rotate: -10,
  },
  {
    src: images.heroCeramics,
    alt: "",
    className: "right-[2%] top-[18%] w-[min(10vw,76px)] lg:w-[min(8vw,86px)]",
    depth: 20,
    rotate: 12,
  },
  {
    src: images.heroCeramicsCollage,
    alt: "",
    className: "left-[4%] bottom-[22%] w-[min(9vw,70px)] lg:w-[min(8vw,78px)] hidden md:block",
    depth: 12,
    rotate: 5,
  },
] as const;

export function AboutDecorCutouts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || typeof window === "undefined") return;
      if (!window.matchMedia("(pointer: fine)").matches) return;

      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;

      el.style.setProperty("--about-px", String(nx));
      el.style.setProperty("--about-py", String(ny));
    },
    [reduceMotion]
  );

  const onMouseLeave = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty("--about-px", "0");
    el.style.setProperty("--about-py", "0");
  }, []);

  return (
    <div
      ref={sectionRef}
      className="about-story-parallax pointer-events-none absolute inset-0 overflow-visible"
      aria-hidden
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {CUTOUTS.map((item, index) => (
        <motion.div
          key={`${item.src}-${index}`}
          className={`about-story-cutout absolute ${item.className}`}
          style={{ "--cutout-depth": item.depth } as React.CSSProperties}
          initial={{ opacity: 0, scale: 0.92, rotate: item.rotate }}
          whileInView={{ opacity: 1, scale: 1, rotate: item.rotate }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={180}
            height={180}
            className="h-auto w-full select-none object-contain"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
