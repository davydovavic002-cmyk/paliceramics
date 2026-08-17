"use client";

import Link from "next/link";
import { ExternalLink, Palette, Sparkles, Waves } from "lucide-react";
import { useDemoControls } from "@/context/DemoControlsContext";
import { MOTION_LEVELS, SITE_THEMES } from "@/lib/demoPresets";

export function FloatingControls() {
  const { motionLevel, siteTheme, setMotionLevel, setSiteTheme } = useDemoControls();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5c6578]">
          Live demo controls
        </p>
        <h1 className="mt-2 font-display text-2xl text-white sm:text-3xl">
          Motion & Theme Studio
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#8b95a8]">
          Adjust settings here, then open the site — your choices persist in this browser.
        </p>
      </header>

      <section className="rounded-xl border border-[#252b38] bg-[#161922] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Waves className="h-4 w-4 text-[#8b95a8]" strokeWidth={1.5} />
          <h2 className="text-sm font-semibold text-white">Animation intensity</h2>
        </div>
        <div className="space-y-2">
          {MOTION_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setMotionLevel(level.id)}
              className={[
                "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                motionLevel === level.id
                  ? "border-[#5a6a82] bg-[#5a6a82]/15"
                  : "border-[#2a3142] bg-[#0f1117]/60 hover:border-[#3a4254]",
              ].join(" ")}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-[#e8eaed]">
                {motionLevel === level.id ? (
                  <Sparkles className="h-3.5 w-3.5 text-[#9fd4a8]" strokeWidth={1.75} />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-[#3a4254]" />
                )}
                {level.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-[#8b95a8]">
                {level.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#252b38] bg-[#161922] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-[#8b95a8]" strokeWidth={1.5} />
          <h2 className="text-sm font-semibold text-white">Color theme</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {SITE_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSiteTheme(theme.id)}
              className={[
                "rounded-lg border px-4 py-4 text-left transition-colors",
                siteTheme === theme.id
                  ? "border-[#5a6a82] bg-[#5a6a82]/15"
                  : "border-[#2a3142] bg-[#0f1117]/60 hover:border-[#3a4254]",
              ].join(" ")}
            >
              <ThemeSwatch themeId={theme.id} active={siteTheme === theme.id} />
              <span className="mt-3 block text-sm font-medium text-[#e8eaed]">
                {theme.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-[#8b95a8]">
                {theme.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5a6a82] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#6a7a92] sm:w-auto"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
          Open site with these settings
        </Link>
        <p className="text-center text-xs text-[#5c6578] sm:text-left">
          Scroll the homepage to feel Immersive Motion.
        </p>
      </div>
    </div>
  );
}

function ThemeSwatch({ themeId, active }: { themeId: string; active: boolean }) {
  const isClay = themeId === "raw-clay";
  return (
    <div
      className={[
        "flex h-10 overflow-hidden rounded-md border",
        active ? "border-[#5a6a82]" : "border-[#2a3142]",
      ].join(" ")}
    >
      <span
        className="flex-1"
        style={{ background: isClay ? "#e8dfd0" : "#38383c" }}
      />
      <span
        className="w-8"
        style={{ background: isClay ? "#8b7355" : "#5a6a82" }}
      />
      <span
        className="flex-1"
        style={{ background: isClay ? "#f2ebe0" : "#323234" }}
      />
    </div>
  );
}
