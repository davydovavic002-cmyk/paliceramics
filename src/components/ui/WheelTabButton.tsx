"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface WheelTabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  glyph: ReactNode;
  label: ReactNode;
}

export function WheelTabButton({
  selected = false,
  glyph,
  label,
  className = "",
  ...props
}: WheelTabButtonProps) {
  return (
    <button
      type="button"
      className={[
        "group flex w-[4.75rem] cursor-pointer flex-col items-center gap-2 font-body transition-all duration-300 sm:w-[5.25rem]",
        className,
      ].join(" ")}
      {...props}
    >
      <span
        className={[
          "flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full font-display text-lg leading-none transition-all duration-300 sm:h-[3.5rem] sm:w-[3.5rem]",
          selected
            ? "bg-[var(--theme-btn-primary)] text-[var(--theme-btn-text,var(--theme-text))] shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] ring-2 ring-[color-mix(in_srgb,var(--theme-accent)_45%,transparent)]"
            : "bg-[color-mix(in_srgb,var(--theme-surface-accent)_35%,transparent)] text-[color-mix(in_srgb,var(--theme-text)_75%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--theme-surface-accent)_55%,transparent)] group-hover:text-theme",
        ].join(" ")}
      >
        {glyph}
      </span>
      <span
        className={[
          "max-w-[5.5rem] text-center text-[8px] uppercase leading-tight tracking-[0.16em] sm:text-[9px]",
          selected ? "text-theme" : "text-theme-muted group-hover:text-theme",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}
