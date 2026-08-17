"use client";

import { useEffect, useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { ADMIN_DEMO_PASSWORD } from "@/lib/adminTypes";
import { AdminThemeToggle } from "./AdminThemeToggle";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [serverMode, setServerMode] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data: { mode?: string; authed?: boolean }) => {
        setServerMode(data.mode === "server");
        if (data.authed) onLogin();
      })
      .catch(() => setServerMode(false));
  }, [onLogin]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (serverMode) {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onLogin();
        setSubmitting(false);
        return;
      }
      if (res.status !== 503) {
        setError("Incorrect password.");
        setSubmitting(false);
        return;
      }
    }

    if (password !== ADMIN_DEMO_PASSWORD) {
      setError("Incorrect password.");
      setSubmitting(false);
      return;
    }
    onLogin();
    setSubmitting(false);
  };

  return (
    <div className="relative flex h-full min-h-0 items-center justify-center overflow-y-auto px-4 py-10">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <AdminThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-admin-input bg-admin-card">
            <Lock className="h-5 w-5 text-admin-muted" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-admin">Pali Ceramics</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-admin-heading">
            Studio Admin
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-admin-muted">
            A quiet place to update your shop and workshop calendar.
          </p>
        </div>

        <form
          onSubmit={(e) => void submit(e)}
          className="rounded-xl border border-admin bg-admin-card p-6 shadow-[0_20px_50px_var(--admin-shadow)]"
        >
          <label htmlFor="admin-password" className="block text-sm font-medium text-admin-label">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter studio password"
            className="admin-input mt-2 w-full rounded-lg px-3.5 py-2.5 text-sm placeholder:text-admin-dim focus:ring-2 focus:ring-[color-mix(in_srgb,var(--admin-accent)_25%,transparent)]"
            autoComplete="current-password"
          />
          {error ? <p className="mt-2 text-xs text-admin-danger">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-admin-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-admin-accent-hover disabled:opacity-60"
          >
            Login
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>

          {serverMode === false ? (
            <p className="mt-4 text-center text-xs text-admin-dim">
              Demo mode — connect PostgreSQL for server auth.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
