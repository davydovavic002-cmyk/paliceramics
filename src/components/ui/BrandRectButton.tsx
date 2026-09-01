"use client";

const base =
  "inline-flex min-h-[44px] flex-1 items-center justify-center px-4 py-2.5 font-display text-[10px] uppercase tracking-[0.12em] transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010a8b] focus-visible:ring-offset-2 disabled:opacity-50 sm:text-[11px]";

export function brandRectButtonClass(active: boolean, variant: "filled" | "outline" = "filled") {
  if (active || variant === "filled") {
    return `${base} border border-[#010a8b] bg-[#010a8b] text-[#ede8df] hover:opacity-90`;
  }
  return `${base} border border-[color-mix(in_srgb,#010a8b_35%,transparent)] bg-transparent text-[#010a8b] hover:bg-[color-mix(in_srgb,#010a8b_6%,transparent)]`;
}

export function BrandRectButton({
  children,
  active = false,
  variant = "filled",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  variant?: "filled" | "outline";
}) {
  return (
    <button
      type="button"
      className={`${brandRectButtonClass(active, active ? "filled" : variant)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
