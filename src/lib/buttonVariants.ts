export type ButtonVariantId = "hanko" | "pill" | "slip" | "wheel" | "rim";

export type ButtonVariantMeta = {
  id: ButtonVariantId;
  name: string;
  tagline: string;
  bestFor: string;
};

export const BUTTON_VARIANTS: ButtonVariantMeta[] = [
  {
    id: "hanko",
    name: "Hanko Seal",
    tagline: "Square clay stamp — kanji above, label below.",
    bestFor: "Hero CTAs, primary actions. Current site default.",
  },
  {
    id: "pill",
    name: "Bamboo Pill",
    tagline: "Soft horizontal capsule — calm, approachable.",
    bestFor: "Tab switchers, filters, secondary navigation.",
  },
  {
    id: "slip",
    name: "Slip Trail",
    tagline: "Ghost text + brush underline — almost invisible until hover.",
    bestFor: "Editorial sections, minimal galleries, footnotes.",
  },
  {
    id: "wheel",
    name: "Wheel Circle",
    tagline: "Pottery-wheel disc — icon-first, label beneath.",
    bestFor: "Workshop dates, mood cards, icon-heavy pickers.",
  },
  {
    id: "rim",
    name: "Bowl Rim",
    tagline: "Wide shallow arc — like the lip of a tea bowl.",
    bestFor: "Product categories, collection modes, shop filters.",
  },
];

export const DEMO_TAB_ITEMS = [
  { id: "lookbook", kanji: "覧", label: "Editorial Lookbook" },
  { id: "catalog", kanji: "録", label: "Filtered Catalog" },
] as const;

export function variantTabClass(
  variant: ButtonVariantId,
  selected: boolean
): string {
  const base = "cursor-pointer font-body transition-all duration-300";

  switch (variant) {
    case "hanko":
      return [
        base,
        "group flex min-h-[4.25rem] min-w-[5.5rem] flex-col items-center justify-center gap-1.5 rounded-[2px] px-4 py-3",
        "[border-radius:3px_2px_3px_2px/2px_3px_2px_3px]",
        selected
          ? "border-2 border-[color-mix(in_srgb,var(--theme-accent)_50%,transparent)] bg-[var(--theme-btn-primary)] text-[var(--theme-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.2)]"
          : "border-2 border-[color-mix(in_srgb,var(--theme-border)_25%,transparent)] bg-[var(--theme-btn-secondary)] text-[color-mix(in_srgb,var(--theme-text)_75%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_45%,transparent)] hover:text-[var(--theme-text)]",
      ].join(" ");

    case "pill":
      return [
        base,
        "inline-flex min-h-[2.75rem] items-center gap-2.5 rounded-full px-5 py-2.5 sm:px-6",
        selected
          ? "bg-[var(--theme-btn-primary)] text-[var(--theme-text)] shadow-[0_4px_20px_rgba(0,0,0,0.18)] ring-1 ring-[color-mix(in_srgb,var(--theme-accent)_40%,transparent)]"
          : "bg-[color-mix(in_srgb,var(--theme-surface-accent)_25%,transparent)] text-[color-mix(in_srgb,var(--theme-text)_70%,transparent)] hover:bg-[color-mix(in_srgb,var(--theme-surface-accent)_40%,transparent)] hover:text-[var(--theme-text)]",
      ].join(" ");

    case "slip":
      return [
        base,
        "group relative inline-flex min-h-[2.5rem] flex-col items-center justify-center px-3 py-2",
        selected
          ? "text-[var(--theme-text)]"
          : "text-[color-mix(in_srgb,var(--theme-text-muted)_80%,transparent)] hover:text-[var(--theme-text)]",
      ].join(" ");

    case "wheel":
      return [
        base,
        "group flex w-[4.75rem] flex-col items-center gap-2 sm:w-[5.25rem]",
      ].join(" ");

    case "rim":
      return [
        base,
        "group flex min-h-[3.5rem] min-w-[6.5rem] flex-col items-center justify-end gap-1 rounded-t-[1.25rem] rounded-b-[3px] px-5 pb-2.5 pt-4 sm:min-w-[7.5rem]",
        selected
          ? "border border-b-2 border-[color-mix(in_srgb,var(--theme-accent)_45%,transparent)] border-b-[var(--theme-accent)] bg-[color-mix(in_srgb,var(--theme-btn-primary)_85%,transparent)] text-[var(--theme-text)] shadow-[0_10px_28px_rgba(0,0,0,0.15)]"
          : "border border-[color-mix(in_srgb,var(--theme-border)_18%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface)_60%,transparent)] text-[color-mix(in_srgb,var(--theme-text)_72%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_35%,transparent)] hover:text-[var(--theme-text)]",
      ].join(" ");
  }
}

export function variantKanjiClass(variant: ButtonVariantId, selected: boolean): string {
  switch (variant) {
    case "hanko":
      return "font-display text-lg leading-none transition-transform duration-300 group-hover:scale-105";
    case "pill":
      return "font-display text-base leading-none opacity-90";
    case "slip":
      return "font-display text-sm leading-none";
    case "wheel":
      return [
        "flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full font-display text-lg leading-none transition-all duration-300 sm:h-[3.5rem] sm:w-[3.5rem]",
        selected
          ? "bg-[var(--theme-btn-primary)] text-[var(--theme-text)] ring-2 ring-[color-mix(in_srgb,var(--theme-accent)_45%,transparent)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)]"
          : "bg-[color-mix(in_srgb,var(--theme-surface-accent)_35%,transparent)] text-[color-mix(in_srgb,var(--theme-text)_75%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--theme-surface-accent)_55%,transparent)] group-hover:text-[var(--theme-text)]",
      ].join(" ");
    case "rim":
      return "font-display text-base leading-none transition-transform duration-300 group-hover:-translate-y-0.5";
  }
}

export function variantLabelClass(variant: ButtonVariantId): string {
  switch (variant) {
    case "hanko":
      return "max-w-[7rem] text-center text-[8px] uppercase leading-tight tracking-[0.16em] sm:text-[9px] sm:tracking-[0.18em]";
    case "pill":
      return "text-[9px] uppercase tracking-[0.2em]";
    case "slip":
      return "text-[9px] uppercase tracking-[0.22em]";
    case "wheel":
      return "max-w-[5.5rem] text-center text-[8px] uppercase leading-tight tracking-[0.16em]";
    case "rim":
      return "text-[8px] uppercase tracking-[0.18em] sm:text-[9px]";
  }
}
