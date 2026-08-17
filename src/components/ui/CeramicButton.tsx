"use client";

import type { MouseEvent, ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { handleSectionClick } from "@/lib/scrollToSection";
import { JapandiMicroMark, type MicroVariant } from "@/components/ui/JapandiMicroMark";

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

/** Hanko seal — clay & indigo, no vermillion */
const intents: Record<Intent, string> = {
  primary: [
    "bg-[var(--theme-btn-primary)]",
    "text-[var(--theme-btn-text,var(--theme-text))]",
    "border-2 border-[color-mix(in_srgb,var(--theme-accent)_50%,transparent)]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-2px_4px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.15)]",
    "hover:bg-[var(--theme-accent-hover)] hover:border-[color-mix(in_srgb,var(--theme-accent)_65%,transparent)]",
  ].join(" "),
  secondary: [
    "bg-[var(--theme-btn-secondary)]",
    "text-[color-mix(in_srgb,var(--theme-text)_85%,transparent)]",
    "border-2 border-[color-mix(in_srgb,var(--theme-border)_30%,transparent)]",
    "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
    "hover:border-[color-mix(in_srgb,var(--theme-border)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--theme-surface-accent)_35%,transparent)]",
  ].join(" "),
};

const markSize: Record<Size, number> = {
  sm: 18,
  md: 20,
  lg: 22,
};

interface CeramicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** @deprecated use microMark */
  kanji?: string;
  microMark?: MicroVariant;
  size?: Size;
  intent?: Intent;
  href?: string;
}

export function CeramicButton({
  children,
  kanji,
  microMark,
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

  const stamp = microMark ?? (kanji ? "disc" : undefined);

  const inner = (
    <>
      {stamp ? (
        <JapandiMicroMark variant={stamp} size={markSize[size]} className="opacity-90" />
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
