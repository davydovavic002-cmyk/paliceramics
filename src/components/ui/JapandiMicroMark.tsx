"use client";

type MicroVariant = "earth" | "fire" | "vessel" | "disc" | "ring" | "dot";

interface JapandiMicroMarkProps {
  variant: MicroVariant;
  size?: number;
  className?: string;
}

/** Minimal Japandi marks — replaces kanji stamps across the site. */
export function JapandiMicroMark({
  variant,
  size = 24,
  className = "",
}: JapandiMicroMarkProps) {
  const stroke = "currentColor";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      {variant === "earth" ? (
        <>
          <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          <circle cx="12" cy="12" r="2.5" fill={stroke} opacity="0.55" />
        </>
      ) : null}

      {variant === "fire" ? (
        <>
          <path
            d="M12 5.5c-1.2 2.2-3.5 3.4-3.5 6.2a3.5 3.5 0 0 0 7 0c0-2.8-2.3-4-3.5-6.2Z"
            stroke={stroke}
            strokeWidth="1.2"
            opacity="0.85"
          />
          <path d="M12 14.5v3" stroke={stroke} strokeWidth="1" opacity="0.45" />
        </>
      ) : null}

      {variant === "vessel" ? (
        <>
          <path
            d="M5 14.5c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5"
            stroke={stroke}
            strokeWidth="1.2"
            opacity="0.85"
          />
          <path d="M6.5 14.5h11" stroke={stroke} strokeWidth="1" opacity="0.45" />
        </>
      ) : null}

      {variant === "disc" ? (
        <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth="1.4" opacity="0.9" />
      ) : null}

      {variant === "ring" ? (
        <>
          <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth="1.2" opacity="0.75" />
          <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1" opacity="0.45" />
        </>
      ) : null}

      {variant === "dot" ? (
        <>
          <circle cx="8" cy="12" r="1.5" fill={stroke} opacity="0.55" />
          <circle cx="12" cy="12" r="1.5" fill={stroke} opacity="0.75" />
          <circle cx="16" cy="12" r="1.5" fill={stroke} opacity="0.55" />
        </>
      ) : null}
    </svg>
  );
}

export type { MicroVariant };
