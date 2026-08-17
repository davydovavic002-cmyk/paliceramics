export type MotionLevel = "minimal" | "tactile" | "immersive";
export type SiteTheme = "raw-clay" | "glazed-matte";

export const MOTION_LEVELS: {
  id: MotionLevel;
  label: string;
  description: string;
}[] = [
  {
    id: "minimal",
    label: "Minimal Motion",
    description: "Simple fade-ins only — no floating backgrounds or hover tilts.",
  },
  {
    id: "tactile",
    label: "Tactile Motion",
    description: "Smooth parallax, hover tilts, and floating ceramic cards.",
  },
  {
    id: "immersive",
    label: "Immersive Motion",
    description: "Full parallax, scroll color shifts, and background micro-animations.",
  },
];

export const SITE_THEMES: {
  id: SiteTheme;
  label: string;
  description: string;
}[] = [
  {
    id: "raw-clay",
    label: "Raw Clay",
    description: "Warm sand & beige — unfired, tactile studio light.",
  },
  {
    id: "glazed-matte",
    label: "Glazed Matte",
    description: "Warm kiln charcoal — quiet fired finish.",
  },
];

export type ThemeTokens = {
  surface: string;
  surfaceElevated: string;
  surfaceAccent: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  accentHover: string;
  btnPrimary: string;
  btnSecondary: string;
  btnText: string;
  headerBg: string;
  selection: string;
};

export const THEME_TOKENS: Record<SiteTheme, ThemeTokens> = {
  "glazed-matte": {
    surface: "#2C2A27",
    surfaceElevated: "#353230",
    surfaceAccent: "#3A3732",
    text: "#EDE8DF",
    textMuted: "#A89F94",
    border: "#EDE8DF",
    accent: "#4A4844",
    accentHover: "#5A5752",
    btnPrimary: "#010A8B",
    btnSecondary: "rgba(44, 42, 39, 0.55)",
    btnText: "#EDE8DF",
    headerBg: "rgba(44, 42, 39, 0.94)",
    selection: "rgba(237, 232, 223, 0.2)",
  },
  "raw-clay": {
    surface: "#e8dfd0",
    surfaceElevated: "#f2ebe0",
    surfaceAccent: "#ddd0bc",
    text: "#3d3428",
    textMuted: "#6b5d4a",
    border: "#a89578",
    accent: "#4f5d73",
    accentHover: "#3d4556",
    btnPrimary: "#3d4556",
    btnSecondary: "rgba(61, 69, 86, 0.14)",
    btnText: "#f2ebe0",
    headerBg: "rgba(242, 235, 224, 0.96)",
    selection: "rgba(61, 52, 40, 0.15)",
  },
};

export const DEMO_STORAGE_KEY = "pali-demo-controls";
