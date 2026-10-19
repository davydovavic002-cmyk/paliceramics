"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { KeyRound, LogOut, X } from "lucide-react";

const ERRORS: Record<string, string> = {
  INVALID_CURRENT: "The current password is not correct.",
  PASSWORD_TOO_SHORT: "The new password must be at least 8 characters.",
};

/** Change the password and sign out other devices — no help from the developer needed. */
export function AdminAccountButton() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const close = () => {
    setOpen(false);
    setCurrent("");
    setNext("");
    setRepeat("");
    setMessage(null);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (next.trim().length < 8) {
      setMessage({ ok: false, text: ERRORS.PASSWORD_TOO_SHORT });
      return;
    }
    if (next !== repeat) {
      setMessage({ ok: false, text: "The two new passwords are different." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, nextPassword: next }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && json?.ok) {
        setCurrent("");
        setNext("");
        setRepeat("");
        setMessage({
          ok: true,
          text: "Password changed. Other devices were signed out — you stay logged in here.",
        });
      } else if (res.status === 429) {
        setMessage({ ok: false, text: "Too many attempts. Try again in a few minutes." });
      } else {
        setMessage({
          ok: false,
          text: ERRORS[json?.error ?? ""] ?? "Could not change the password. Try again.",
        });
      }
    } catch {
      setMessage({ ok: false, text: "No connection. Try again." });
    } finally {
      setBusy(false);
    }
  };

  const signOutOthers = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/signout-all", { method: "POST" });
      setMessage(
        res.ok
          ? { ok: true, text: "Done. Every other phone and computer must log in again." }
          : { ok: false, text: "Could not do that. Try again." }
      );
    } catch {
      setMessage({ ok: false, text: "No connection. Try again." });
    } finally {
      setBusy(false);
    }
  };

  const field =
    "admin-input mt-1 w-full rounded-lg px-3 py-2.5 text-base sm:text-sm placeholder:text-admin-dim";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="admin-btn admin-btn-secondary px-2.5 py-1.5 text-[11px]"
        title="Password and security"
      >
        <KeyRound className="h-3.5 w-3.5" strokeWidth={1.75} />
        <span className="hidden sm:inline">Account</span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
        <div
          className="fixed inset-0 z-[300] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Account"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-admin bg-admin-card p-5 shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-admin-heading">Password and security</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-lg p-2 text-admin-muted hover:text-admin-heading"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={(e) => void changePassword(e)} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-admin-label" htmlFor="acc-current">
                  Current password
                </label>
                <input
                  id="acc-current"
                  type="password"
                  autoComplete="current-password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-admin-label" htmlFor="acc-next">
                  New password (8+ characters)
                </label>
                <input
                  id="acc-next"
                  type="password"
                  autoComplete="new-password"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-admin-label" htmlFor="acc-repeat">
                  New password again
                </label>
                <input
                  id="acc-repeat"
                  type="password"
                  autoComplete="new-password"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  className={field}
                />
              </div>
              <button
                type="submit"
                disabled={busy || !current || !next || !repeat}
                className="w-full rounded-lg bg-admin-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-admin-accent-hover disabled:opacity-60"
              >
                Change password
              </button>
            </form>

            <div className="mt-5 border-t border-admin pt-4">
              <p className="text-xs leading-relaxed text-admin-muted">
                Lost a phone or logged in on someone else&apos;s computer? This logs out every
                other device. You stay logged in here.
              </p>
              <button
                type="button"
                onClick={() => void signOutOthers()}
                disabled={busy}
                className="admin-btn admin-btn-secondary mt-3 w-full justify-center px-3 py-2.5 text-xs disabled:opacity-60"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                Sign out on other devices
              </button>
            </div>

            {message ? (
              <p
                role="status"
                className={`mt-4 text-sm ${message.ok ? "text-emerald-700" : "text-red-700"}`}
              >
                {message.text}
              </p>
            ) : null}
          </div>
        </div>,
          document.querySelector(".admin-shell") ?? document.body
        )
        : null}
    </>
  );
}
