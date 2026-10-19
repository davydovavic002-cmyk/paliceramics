"use client";

import { Check, Loader2, TriangleAlert, Save } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";

function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Always-visible save status + a "Save now" button (changes also save on their own). */
export function AdminSaveStatus() {
  const { saveState, savedAt, saveNow } = useAdminData();
  const busy = saveState === "saving";

  let label = "All changes saved on their own";
  let tone = "text-admin-muted";
  if (saveState === "pending") label = "Unsaved changes…";
  if (saveState === "saving") label = "Saving…";
  if (saveState === "saved" && savedAt) {
    label = `Saved on the server ${formatTime(savedAt)}`;
    tone = "text-emerald-700";
  }
  if (saveState === "error") {
    label = "NOT saved — press Save";
    tone = "text-red-700";
  }
  if (saveState === "conflict") {
    label = "Changed elsewhere — reload the page";
    tone = "text-red-700";
  }

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`hidden items-center gap-1 text-[11px] sm:inline-flex ${tone}`}
        role="status"
        aria-live="polite"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
        ) : saveState === "error" || saveState === "conflict" ? (
          <TriangleAlert className="h-3.5 w-3.5" strokeWidth={1.75} />
        ) : saveState === "saved" ? (
          <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
        ) : null}
        {label}
      </span>
      <button
        type="button"
        onClick={saveState === "conflict" ? () => window.location.reload() : saveNow}
        disabled={busy}
        className="admin-btn admin-btn-secondary px-2.5 py-1.5 text-[11px] disabled:opacity-60"
        title="Send all changes to the live site right now"
      >
        <Save className="h-3.5 w-3.5" strokeWidth={1.75} />
        {saveState === "conflict" ? "Reload" : "Save to site"}
      </button>
    </div>
  );
}
