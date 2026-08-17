"use client";

import { Palette } from "lucide-react";
import { ADMIN_THEMES, type AdminTheme } from "@/lib/adminTheme";
import { useAdminTheme } from "@/context/AdminThemeContext";

export function AdminThemeToggle() {
  const { theme, setTheme } = useAdminTheme();

  return (
    <div className="admin-segmented items-center" role="group" aria-label="Admin color theme">
      <Palette className="ml-1.5 h-3.5 w-3.5 text-admin-dim" strokeWidth={1.75} />
      {ADMIN_THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTheme(t.id as AdminTheme)}
          className={[
            "admin-segmented-btn",
            theme === t.id ? "admin-segmented-btn-active" : "",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
