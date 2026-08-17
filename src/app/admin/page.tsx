"use client";

import { useEffect, useState } from "react";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { LoginScreen } from "@/components/admin/LoginScreen";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data: { authed?: boolean }) => setAuthed(Boolean(data.authed)))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return (
      <div className="flex h-full items-center justify-center overflow-y-auto text-sm text-admin-muted">
        …
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <AdminDataProvider>
      <AdminDashboard onLogout={() => setAuthed(false)} />
    </AdminDataProvider>
  );
}
