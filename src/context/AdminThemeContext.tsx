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
  ADMIN_THEME_KEY,
  readAdminTheme,
  type AdminTheme,
} from "@/lib/adminTheme";

interface AdminThemeContextValue {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setThemeState(readAdminTheme());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ADMIN_THEME_KEY, theme);
  }, [theme, hydrated]);

  const setTheme = useCallback((next: AdminTheme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "raw-clay" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <AdminThemeContext.Provider value={value}>
      <div
        className="admin-shell h-full min-h-0 overflow-hidden font-sans text-admin"
        data-admin-theme={hydrated ? theme : "dark"}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error("useAdminTheme requires AdminThemeProvider");
  return ctx;
}
