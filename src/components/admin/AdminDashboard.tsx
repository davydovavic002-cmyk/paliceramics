"use client";

import { useState } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { ProductsTab } from "./ProductsTab";
import { WorkshopsTab } from "./WorkshopsTab";
import { SiteTab } from "./SiteTab";
import { InboxTab } from "./InboxTab";
import { AdminShell, type AdminView } from "./AdminShell";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [view, setView] = useState<AdminView>("products");
  const { resetAll, inbox } = useAdminData();
  const unreadInbox = inbox.filter((m) => !m.read).length;

  return (
    <AdminShell
      view={view}
      onViewChange={setView}
      unreadInbox={unreadInbox}
      onLogout={onLogout}
      onResetDemo={resetAll}
    >
      {view === "products" ? <ProductsTab /> : null}
      {view === "workshops" ? <WorkshopsTab /> : null}
      {view === "site" ? <SiteTab /> : null}
      {view === "inbox" ? <InboxTab /> : null}
    </AdminShell>
  );
}
