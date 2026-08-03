"use client";

import type { MouseEvent, ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { handleSectionClick } from "@/lib/scrollToSection";

type Size = "sm" | "md" | "lg";
type Intent = "primary" | "secondary";

const stampSize: Record<Size, string> = {
  sm: "min-h-[3.75rem] min-w-[3.75rem] px-3 py-2.5",
  md: "min-h-[4.5rem] min-w-[4.5rem] px-4 py-3",
  lg: "min-h-[5.25rem] min-w-[5.25rem] px-4 py-3.5",
};

const labelSize: Record<Size, string> = {
  sm: "text-[8px] tracking-[0.2em]",
  md: "text-[9px] tracking-[0.22em]",
  lg: "text-[9px] tracking-[0.24em]",
};

const kanjiSize: Record<Size, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

/** Hanko seal — clay & indigo, no vermillion */
const intents: Record<Intent, string> = {
  primary: [
    "bg-[#2c3444]",
    "text-[#EDE8DF]",
    "border-2 border-[#5a6a82]/50",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-2px_4px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.22)]",
    "hover:bg-[#343e50] hover:border-[#6a7a92]/55",
  ].join(" "),
  secondary: [
    "bg-[#38383c]/50",
    "text-[#EDE8DF]/85",
    "border-2 border-[#EDE8DF]/30",
    "shadow-[inset_0_0_0_1px_rgba(237,232,223,0.05)]",
    "hover:border-[#EDE8DF]/50 hover:bg-[#2e2e32]/70",
  ].join(" "),
};

interface CeramicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  kanji?: string;
  size?: Size;
  intent?: Intent;
  href?: string;
}

export function CeramicButton({
  children,
  kanji,
  size = "md",
  intent = "secondary",
  href,
  className = "",
  ...props
}: CeramicButtonProps) {
  const cls = [
    "group inline-flex flex-col items-center justify-center gap-1 font-body transition-all duration-300",
    "rounded-[2px]",
    "[border-radius:3px_2px_3px_2px/2px_3px_2px_3px]",
    stampSize[size],
    labelSize[size],
    intents[intent],
    className,
  ].join(" ");

  const inner = (
    <>
      {kanji ? (
        <span className={`font-display leading-none ${kanjiSize[size]}`}>{kanji}</span>
      ) : null}
      <span className="leading-none opacity-90">{children}</span>
    </>
  );

  if (href?.startsWith("#")) {
    return (
      <a
        href={href}
        className={cls}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => handleSectionClick(e, href)}
      >
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...props}>
      {inner}
    </button>
  );
}
