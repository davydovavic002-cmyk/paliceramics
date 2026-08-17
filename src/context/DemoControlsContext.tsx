"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_STORAGE_KEY,
  THEME_TOKENS,
  type MotionLevel,
  type SiteTheme,
} from "@/lib/demoPresets";
import { defaultMotionLevel, prefersReducedMotion } from "@/lib/motionDefaults";

interface DemoControlsValue {
  motionLevel: MotionLevel;
  siteTheme: SiteTheme;
  setMotionLevel: (level: MotionLevel) => void;
  setSiteTheme: (theme: SiteTheme) => void;
}

const DemoControlsContext = createContext<DemoControlsValue | null>(null);

function readStored(): { motionLevel: MotionLevel; siteTheme: SiteTheme } {
  const fallback = { motionLevel: defaultMotionLevel(), siteTheme: "glazed-matte" as SiteTheme };
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<{
      motionLevel: MotionLevel;
      siteTheme: SiteTheme;
    }>;
    const motionLevel =
      parsed.motionLevel && prefersReducedMotion()
        ? "minimal"
        : (parsed.motionLevel ?? fallback.motionLevel);
    return {
      motionLevel,
      siteTheme: parsed.siteTheme ?? fallback.siteTheme,
    };
  } catch {
    return fallback;
  }
}

export function DemoControlsProvider({ children }: { children: ReactNode }) {
  const [motionLevel, setMotionLevelState] = useState<MotionLevel>(defaultMotionLevel());
  const [siteTheme, setSiteThemeState] = useState<SiteTheme>("glazed-matte");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    setMotionLevelState(stored.motionLevel);
    setSiteThemeState(stored.siteTheme);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({ motionLevel, siteTheme })
    );
  }, [motionLevel, siteTheme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.dataset.motion = motionLevel;
    root.dataset.theme = siteTheme;

    const tokens = THEME_TOKENS[siteTheme];
    root.style.setProperty("--theme-surface", tokens.surface);
    root.style.setProperty("--theme-surface-elevated", tokens.surfaceElevated);
    root.style.setProperty("--theme-surface-accent", tokens.surfaceAccent);
    root.style.setProperty("--theme-text", tokens.text);
    root.style.setProperty("--theme-text-muted", tokens.textMuted);
    root.style.setProperty("--theme-border", tokens.border);
    root.style.setProperty("--theme-accent", tokens.accent);
    root.style.setProperty("--theme-accent-hover", tokens.accentHover);
    root.style.setProperty("--theme-btn-primary", tokens.btnPrimary);
    root.style.setProperty("--theme-btn-secondary", tokens.btnSecondary);
    root.style.setProperty("--theme-btn-text", tokens.btnText);
    root.style.setProperty("--theme-header-bg", tokens.headerBg);
    root.style.setProperty("--theme-selection", tokens.selection);
  }, [motionLevel, siteTheme, hydrated]);

  const setMotionLevel = useCallback((level: MotionLevel) => {
    setMotionLevelState(level);
  }, []);

  const setSiteTheme = useCallback((theme: SiteTheme) => {
    setSiteThemeState(theme);
  }, []);

  const value = useMemo(
    () => ({ motionLevel, siteTheme, setMotionLevel, setSiteTheme }),
    [motionLevel, siteTheme, setMotionLevel, setSiteTheme]
  );

  return (
    <DemoControlsContext.Provider value={value}>{children}</DemoControlsContext.Provider>
  );
}

export function useDemoControls() {
  const ctx = useContext(DemoControlsContext);
  if (!ctx) throw new Error("useDemoControls requires DemoControlsProvider");
  return ctx;
}

export function useMotionFlags() {
  const { motionLevel } = useDemoControls();
  return {
    motionLevel,
    isMinimal: motionLevel === "minimal",
    isTactile: motionLevel === "tactile",
    isImmersive: motionLevel === "immersive",
    showWebGL: motionLevel !== "minimal",
    showDriftingStrokes: motionLevel !== "minimal",
    showHoverTilt: motionLevel !== "minimal",
    showImageHoverScale: motionLevel !== "minimal",
    showScrollThemeShift: motionLevel === "immersive",
    showMicroAnimations: motionLevel === "immersive",
    showParallax: motionLevel === "immersive",
  };
}
