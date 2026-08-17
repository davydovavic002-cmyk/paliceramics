"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useDemoControls } from "@/context/DemoControlsContext";

export function SiteThemeToggle({ onBar = false }: { onBar?: boolean }) {
  const { language } = useLanguage();
  const { siteTheme, setSiteTheme } = useDemoControls();
  const isClay = siteTheme === "raw-clay";

  const label =
    language === "pl"
      ? isClay
        ? "Przełącz na ciemny motyw"
        : "Przełącz na beżowy motyw"
      : isClay
        ? "Switch to dark theme"
        : "Switch to beige theme";

  return (
    <button
      type="button"
      onClick={() => setSiteTheme(isClay ? "glazed-matte" : "raw-clay")}
      aria-label={label}
      title={label}
      className={[
        "relative inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300",
        onBar
          ? "border-[color-mix(in_srgb,var(--theme-border)_28%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_45%,transparent)]"
          : "border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-border)_40%,transparent)] [box-shadow:0_1px_8px_rgba(0,0,0,0.25)]",
      ].join(" ")}
    >
      <span
        className="absolute inset-1 rounded-full transition-colors duration-300"
        style={{
          background: isClay
            ? "linear-gradient(135deg, #e8dfd0 0%, #c9b89a 100%)"
            : "linear-gradient(135deg, #434956 0%, #364158 100%)",
        }}
        aria-hidden
      />
      <span
        className="relative h-2.5 w-2.5 rounded-full border border-[color-mix(in_srgb,var(--theme-border)_35%,transparent)] bg-[color-mix(in_srgb,var(--theme-text)_18%,transparent)]"
        aria-hidden
      />
    </button>
  );
}
