"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Inbox,
  LogOut,
  Package,
} from "lucide-react";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { AdminSavedToast } from "./AdminSavedToast";
import { downloadAdminBackup } from "@/lib/adminBackup";

export type AdminView = "products" | "workshops" | "site" | "inbox";

const VIEW_META: Record<
  AdminView,
  { title: string; subtitle: string; icon: typeof Package }
> = {
  products: {
    title: "Catalog",
    subtitle: "Pieces, prices, and stock.",
    icon: Package,
  },
  workshops: {
    title: "Workshops",
    subtitle: "Formats, calendar, availability.",
    icon: CalendarDays,
  },
  site: {
    title: "Site",
    subtitle: "Copy, FAQ, contacts, blocks.",
    icon: FileText,
  },
  inbox: {
    title: "Inbox",
    subtitle: "Vouchers, bookings, messages.",
    icon: Inbox,
  },
};

const PRIMARY_NAV: AdminView[] = ["products", "workshops", "site"];

interface AdminShellProps {
  view: AdminView;
  onViewChange: (view: AdminView) => void;
  unreadInbox: number;
  onLogout: () => void;
  onResetDemo: () => void;
  children: ReactNode;
}

export function AdminShell({
  view,
  onViewChange,
  unreadInbox,
  onLogout,
  onResetDemo,
  children,
}: AdminShellProps) {
  const meta = VIEW_META[view];
  const ViewIcon = meta.icon;

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <aside className="admin-sidebar admin-scroll hidden w-[11.5rem] shrink-0 flex-col overflow-y-auto border-r border-admin md:flex">
        <div className="px-3 py-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-admin-dim">
            Pali Ceramics
          </p>
          <p className="mt-0.5 text-[13px] font-semibold tracking-tight text-admin-heading">
            Studio Admin
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2" aria-label="Admin navigation">
          {PRIMARY_NAV.map((id) => (
            <NavButton
              key={id}
              active={view === id}
              icon={VIEW_META[id].icon}
              label={VIEW_META[id].title}
              onClick={() => onViewChange(id)}
            />
          ))}

          <div className="my-2 h-px bg-admin-border/80" aria-hidden />

          <NavButton
            active={view === "inbox"}
            icon={Inbox}
            label="Inbox"
            badge={unreadInbox}
            onClick={() => onViewChange("inbox")}
            accent
          />
        </nav>

        <div className="p-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item text-[11px] text-admin-muted"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            View live site
          </a>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="admin-header shrink-0 px-3 py-2 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-admin-card-muted shadow-sm">
                <ViewIcon className="h-4 w-4 text-admin-muted" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h1 className="text-[15px] font-semibold tracking-tight text-admin-heading">
                  {meta.title}
                </h1>
                <p className="text-[11px] text-admin-muted">{meta.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="admin-segmented md:hidden">
                {([...PRIMARY_NAV, "inbox"] as AdminView[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onViewChange(id)}
                    className={[
                      "admin-segmented-btn",
                      view === id ? "admin-segmented-btn-active" : "",
                    ].join(" ")}
                  >
                    {id === "inbox" && unreadInbox > 0
                      ? `Inbox ${unreadInbox}`
                      : VIEW_META[id].title.split(" ")[0]}
                  </button>
                ))}
              </div>
              <AdminThemeToggle />
              <button
                type="button"
                onClick={downloadAdminBackup}
                className="admin-toolbar-btn hidden sm:inline-block"
              >
                Export
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset all demo data to defaults? Unsaved changes will be lost."
                    )
                  ) {
                    onResetDemo();
                  }
                }}
                className="admin-toolbar-btn hidden sm:inline-block"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  void fetch("/api/admin/logout", { method: "POST" });
                  onLogout();
                }}
                className="admin-btn admin-btn-secondary px-2.5 py-1.5 text-[11px]"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </header>

        <main
          className={[
            "admin-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-3 sm:px-5 sm:py-4",
            view === "inbox" ? "admin-inbox-main" : "",
          ].join(" ")}
        >
          <div className="mx-auto max-w-5xl pb-8">{children}</div>
        </main>
      </div>
      <AdminSavedToast />
    </div>
  );
}

function NavButton({
  active,
  icon: Icon,
  label,
  badge,
  accent,
  onClick,
}: {
  active: boolean;
  icon: typeof Package;
  label: string;
  badge?: number;
  accent?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "admin-nav-item",
        active ? (accent ? "admin-nav-item-accent admin-nav-item-active" : "admin-nav-item-active") : "",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 ? (
        <span
          className={[
            "admin-badge min-w-[1.25rem] text-center",
            active && accent ? "admin-badge-accent bg-white/20" : "admin-badge-accent",
          ].join(" ")}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
