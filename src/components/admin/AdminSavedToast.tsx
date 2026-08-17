"use client";

import { Check } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";

export function AdminSavedToast() {
  const { savedHint } = useAdminData();
  if (!savedHint) return null;

  return (
    <div
      className="admin-toast"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
      {savedHint}
    </div>
  );
}
