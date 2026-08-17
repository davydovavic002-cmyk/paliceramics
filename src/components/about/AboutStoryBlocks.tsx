"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const blockReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const hoverLift = {
  y: -5,
  rotate: 0,
  boxShadow: "0 22px 48px rgba(0,0,0,0.18)",
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
};

type StoryBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  idleFloat?: boolean;
};

export function StoryMotionBlock({
  children,
  className = "",
  delay = 0,
  idleFloat = true,
}: StoryBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={blockReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
      whileHover={reduceMotion ? undefined : hoverLift}
      animate={
        reduceMotion || !idleFloat
          ? undefined
          : {
              y: [0, -3, 0],
              transition: {
                duration: 7 + delay,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}

type StoryHeroPhotoProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  caption: ReactNode;
  className?: string;
};

export function StoryHeroPhoto({
  src,
  alt,
  priority = false,
  sizes,
  caption,
  className = "",
}: StoryHeroPhotoProps) {
  const reduceMotion = useReducedMotion();

  return (
    <StoryMotionBlock
      className={`group relative overflow-hidden rounded-[2px] shadow-[0_20px_52px_rgba(0,0,0,0.18)] ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        whileHover={reduceMotion ? undefined : { scale: 1.04 }}
        transition={{ duration: 12, ease: "easeOut" }}
      >
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#121418]/55 via-transparent to-transparent transition-opacity duration-500 group-hover:from-[#121418]/62" />
      {caption}
    </StoryMotionBlock>
  );
}

type StoryEditorialPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  rotate?: number;
  delay?: number;
  sizes?: string;
  objectPosition?: string;
};

export function StoryEditorialPhoto({
  src,
  alt,
  className = "",
  priority = false,
  rotate = 0,
  delay = 0,
  sizes = "40vw",
  objectPosition = "center center",
}: StoryEditorialPhotoProps) {
  const reduceMotion = useReducedMotion();

  return (
    <StoryMotionBlock delay={delay} className={className}>
      <motion.div
        className="relative h-full min-h-[inherit] overflow-hidden rounded-[2px] shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
        style={{ rotate: `${rotate}deg` }}
        whileHover={
          reduceMotion
            ? undefined
            : {
                rotate: rotate + (rotate > 0 ? 1.5 : -1.5),
                scale: 1.02,
                boxShadow: "0 22px 48px rgba(0,0,0,0.2)",
              }
        }
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition }}
        />
      </motion.div>
    </StoryMotionBlock>
  );
}

export function StoryPanelText({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <StoryMotionBlock delay={delay} idleFloat={false} className={className}>
      <motion.div
        className="rounded-[2px] border border-[#d8d0c4] bg-[#faf7f0] px-4 py-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.08)] sm:px-5 sm:py-4"
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -3,
                borderColor: "#c8bfb0",
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
              }
        }
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-body text-[12px] leading-[1.65] text-[#3d3428] sm:text-[13px]">{children}</p>
      </motion.div>
    </StoryMotionBlock>
  );
}

export function PhotoCaption({ lead, body }: { lead: string; body: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121418]/97 via-[#121418]/82 to-transparent px-5 pb-5 pt-16 sm:px-6 sm:pb-6 sm:pt-20 lg:px-6 lg:pb-6 lg:pt-24 xl:px-7 xl:pb-7">
      <p className="font-display text-[15px] leading-snug tracking-[0.03em] text-[#f7f4ee] sm:text-base lg:text-[17px] xl:text-lg">
        {lead}
      </p>
      <p className="mt-2 max-w-md font-body text-[12px] leading-[1.65] text-[#ebe6dc] sm:text-[13px] lg:mt-3">
        {body}
      </p>
    </div>
  );
}
