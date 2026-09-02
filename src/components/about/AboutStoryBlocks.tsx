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
  idleFloat = false,
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
  return (
    <StoryMotionBlock
      className={`relative overflow-hidden rounded-[2px] shadow-[0_20px_52px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="absolute inset-0">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#121418]/55 via-transparent to-transparent" />
      {caption}
    </StoryMotionBlock>
  );
}

type StoryEditorialPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  delay?: number;
  sizes?: string;
  objectPosition?: string;
  caption?: ReactNode;
};

export function StoryEditorialPhoto({
  src,
  alt,
  className = "",
  priority = false,
  delay = 0,
  sizes = "40vw",
  objectPosition = "center center",
  caption,
}: StoryEditorialPhotoProps) {
  return (
    <StoryMotionBlock delay={delay} className={className}>
      <div className="relative h-full min-h-[inherit] overflow-hidden rounded-[2px] shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition }}
        />
        {caption ? (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#121418]/55 to-transparent sm:h-[38%]"
              aria-hidden
            />
            {caption}
          </>
        ) : null}
      </div>
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
  return (
    <StoryMotionBlock delay={delay} className={className}>
      <div className="rounded-[2px] border border-[#d8d0c4] bg-[#faf7f0] px-4 py-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.08)] sm:px-5 sm:py-4">
        <p className="font-body text-[12px] leading-[1.65] text-[#3d3428] sm:text-[13px]">{children}</p>
      </div>
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

export function PhotoOverlayCaption({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#121418]/90 via-[#121418]/45 to-transparent sm:h-[42%]"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 sm:px-5 sm:pb-5">
        <p className="font-body text-[11px] leading-[1.6] text-[#ebe6dc] sm:text-[12px]">{children}</p>
      </div>
    </>
  );
}
