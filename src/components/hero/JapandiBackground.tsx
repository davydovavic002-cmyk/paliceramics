"use client";

/** Paper-grain wash + subtle vertical micro marks upper-right */
export function JapandiBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 45% at 82% 18%, rgba(210,190,160,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 15% 75%, rgba(180,175,165,0.04) 0%, transparent 50%)
          `,
        }}
      />

      <div className="absolute right-4 top-[10%] hidden flex-col items-center gap-3 opacity-[0.14] lg:right-10 lg:top-[12%] lg:flex xl:right-14">
        <span className="h-12 w-px bg-[color-mix(in_srgb,var(--theme-text)_70%,transparent)]" />
        <span className="h-2 w-2 rounded-full border border-[color-mix(in_srgb,var(--theme-text)_80%,transparent)]" />
        <span className="h-2 w-2 rounded-full bg-[color-mix(in_srgb,var(--theme-text)_55%,transparent)]" />
        <span className="h-2 w-2 rounded-full border border-[color-mix(in_srgb,var(--theme-text)_80%,transparent)]" />
        <span className="h-12 w-px bg-[color-mix(in_srgb,var(--theme-text)_70%,transparent)]" />
      </div>
    </div>
  );
}
