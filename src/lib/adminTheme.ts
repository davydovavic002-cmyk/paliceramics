export type AdminTheme = "dark" | "raw-clay";

export const ADMIN_THEME_KEY = "pali-admin-theme";

export const ADMIN_THEMES: { id: AdminTheme; label: string }[] = [
  { id: "dark", label: "Glazed Matte" },
  { id: "raw-clay", label: "Raw Clay" },
];

export function readAdminTheme(): AdminTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(ADMIN_THEME_KEY);
    if (stored === "raw-clay" || stored === "dark") return stored;
    const demo = localStorage.getItem("pali-demo-controls");
    if (demo) {
      const parsed = JSON.parse(demo) as { siteTheme?: string };
      if (parsed.siteTheme === "raw-clay") return "raw-clay";
    }
  } catch {
    /* ignore */
  }
  return "dark";
}
