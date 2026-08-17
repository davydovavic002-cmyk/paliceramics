"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Gift,
  Inbox,
  Mail,
  MessageSquare,
  Users,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useServerInbox } from "@/hooks/useServerInbox";
import type { AdminInboxMessage, InboxMessageType } from "@/lib/adminTypes";

type InboxFilter = "all" | InboxMessageType;

const FILTER_OPTIONS: {
  id: InboxFilter;
  label: string;
  icon: typeof Inbox;
}[] = [
  { id: "all", label: "All", icon: Inbox },
  { id: "certificate", label: "Vouchers", icon: Gift },
  { id: "booking", label: "Bookings", icon: CalendarDays },
  { id: "waitlist", label: "Waitlist", icon: Users },
  { id: "contact", label: "Contact", icon: MessageSquare },
];

const FIELD_LABELS: Record<string, string> = {
  recipient: "Recipient",
  buyerEmail: "Buyer email",
  email: "Email",
  nominal: "Nominal",
  voucherCode: "Voucher code",
  voucherLabel: "Voucher type",
  type: "Type",
  workshop: "Workshop",
  workshopId: "Workshop ID",
  slotId: "Slot",
  slotLabel: "Date & time",
  participantCount: "People",
  lang: "Language",
  status: "Status",
  message: "Message",
  name: "Name",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function messagePreview(message: AdminInboxMessage): string {
  const p = message.payload;
  switch (message.type) {
    case "certificate":
      return [p.recipient, p.nominal, p.voucherCode].filter(Boolean).join(" · ");
    case "booking":
      return [p.workshop ?? p.workshopId, p.slotLabel ?? p.slotId].filter(Boolean).join(" · ");
    case "waitlist":
      return p.email ?? p.name ?? "Waitlist signup";
    case "contact":
      return p.message ?? p.email ?? p.name ?? "Contact message";
    default:
      return Object.values(p).slice(0, 2).join(" · ");
  }
}

function typeAccent(type: InboxMessageType): string {
  switch (type) {
    case "certificate":
      return "text-violet-700 bg-violet-500/12";
    case "booking":
      return "text-sky-800 bg-sky-500/12";
    case "waitlist":
      return "text-amber-800 bg-amber-500/12";
    case "contact":
      return "text-emerald-800 bg-emerald-500/12";
    default:
      return "text-admin-muted bg-admin-card-muted";
  }
}

function typeLabel(type: InboxMessageType): string {
  switch (type) {
    case "certificate":
      return "Gift voucher";
    case "booking":
      return "Workshop booking";
    case "waitlist":
      return "Waitlist";
    case "contact":
      return "Contact";
    default:
      return type;
  }
}

export function InboxTab() {
  const { inbox, toggleInboxRead } = useAdminData();
  const [serverAuth, setServerAuth] = useState(false);
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const server = useServerInbox(serverAuth);
  const messages = server.serverMode ? server.messages : inbox;

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data: { authed?: boolean; mode?: string }) => {
        setServerAuth(Boolean(data.authed && data.mode === "server"));
      })
      .catch(() => setServerAuth(false));
  }, []);

  const sorted = useMemo(
    () => [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [messages]
  );

  const filtered = useMemo(
    () => (filter === "all" ? sorted : sorted.filter((m) => m.type === filter)),
    [sorted, filter]
  );

  const counts = useMemo(() => {
    const unread = sorted.filter((m) => !m.read).length;
    const byType = (type: InboxMessageType) => sorted.filter((m) => m.type === type).length;
    return {
      all: sorted.length,
      unread,
      certificate: byType("certificate"),
      booking: byType("booking"),
      waitlist: byType("waitlist"),
      contact: byType("contact"),
    };
  }, [sorted]);

  const activeMessage =
    (selectedId ? filtered.find((m) => m.id === selectedId) : null) ?? filtered[0] ?? null;

  const handleToggleRead = (id: string) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;

    if (server.serverMode) {
      void server.toggleRead(id, !message.read);
      return;
    }
    toggleInboxRead(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 admin-panel px-3 py-2">
        <p className="text-xs text-admin-muted">
          {server.serverMode
            ? "Synced with studio server."
            : "Local demo inbox until PostgreSQL is connected."}
        </p>
        {counts.unread > 0 ? (
          <span className="admin-badge admin-badge-accent">
            {counts.unread} unread
          </span>
        ) : null}
      </div>

      <div className="admin-segmented flex flex-wrap">
        {FILTER_OPTIONS.map(({ id, label, icon: Icon }) => {
          const count = id === "all" ? counts.all : counts[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setFilter(id);
                setSelectedId(null);
              }}
              className={[
                "admin-segmented-btn inline-flex items-center gap-1.5",
                filter === id ? "admin-segmented-btn-active" : "",
              ].join(" ")}
            >
              <Icon className="h-3 w-3" strokeWidth={2} />
              {label}
              <span className={filter === id ? "opacity-70" : "text-admin-dim"}>{count}</span>
            </button>
          );
        })}
      </div>

      {server.loading ? (
        <p className="py-16 text-center text-sm text-admin-muted">Loading inbox…</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-admin-input bg-admin-card py-16 text-center">
          <Mail className="h-9 w-9 text-admin-dim" strokeWidth={1.25} />
          <p className="mt-4 text-sm font-medium text-admin-heading">No messages here</p>
          <p className="mt-1 max-w-sm text-sm text-admin-muted">
            {filter === "all"
              ? "Voucher requests, bookings, and waitlist signups will land here."
              : "Nothing in this category yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:items-start">
          <ul className="admin-panel admin-group p-1">
            {filtered.map((message) => {
              const active = activeMessage?.id === message.id;
              return (
                <li key={message.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(message.id)}
                    className={[
                      "admin-group-item flex-col items-start gap-0.5 py-2",
                      active ? "admin-group-item-active" : "",
                      !message.read && !active ? "border-l-2 border-admin-accent pl-2" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          typeAccent(message.type),
                        ].join(" ")}
                      >
                        {typeLabel(message.type)}
                      </span>
                      {!message.read ? (
                        <span className="rounded-full bg-admin-accent px-1.5 py-0.5 text-[9px] font-medium text-white">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-admin-heading line-clamp-2">
                      {messagePreview(message) || "—"}
                    </p>
                    <time className="mt-1 block text-[11px] text-admin-dim">
                      {formatDate(message.createdAt)}
                    </time>
                  </button>
                </li>
              );
            })}
          </ul>

          {activeMessage ? (
            <MessageDetail
              message={activeMessage}
              serverMode={server.serverMode}
              onToggleRead={() => handleToggleRead(activeMessage.id)}
              onConfirmVoucher={() => void server.setStatus(activeMessage.id, "confirmed")}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

function MessageDetail({
  message,
  serverMode,
  onToggleRead,
  onConfirmVoucher,
}: {
  message: AdminInboxMessage;
  serverMode: boolean;
  onToggleRead: () => void;
  onConfirmVoucher: () => void;
}) {
  const status = message.payload.status;
  const orderedKeys = Object.keys(message.payload).sort((a, b) => {
    const priority = [
      "recipient",
      "voucherCode",
      "nominal",
      "workshop",
      "slotLabel",
      "email",
      "buyerEmail",
      "message",
    ];
    return (priority.indexOf(a) === -1 ? 99 : priority.indexOf(a)) -
      (priority.indexOf(b) === -1 ? 99 : priority.indexOf(b));
  });

  return (
    <article className="admin-panel p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-admin pb-4">
        <div>
          <span
            className={[
              "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
              typeAccent(message.type),
            ].join(" ")}
          >
            {typeLabel(message.type)}
          </span>
          <h3 className="mt-2 text-base font-semibold text-admin-heading">
            {messagePreview(message) || "Message details"}
          </h3>
          <time className="mt-1 block text-xs text-admin-dim">{formatDate(message.createdAt)}</time>
        </div>
        <div className="flex flex-wrap gap-2">
          {status === "confirmed" || status === "used" ? (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
              {status}
            </span>
          ) : null}
          {!message.read ? (
            <span className="rounded-full bg-admin-accent/15 px-2.5 py-1 text-[10px] font-medium text-admin-label">
              Unread
            </span>
          ) : null}
        </div>
      </div>

      <dl className="mt-5 space-y-3">
        {orderedKeys.map((key) => (
          <div
            key={key}
            className="grid gap-1 rounded-lg border border-admin-input bg-admin-card-muted px-3 py-2.5 sm:grid-cols-[8.5rem_1fr]"
          >
            <dt className="text-[10px] font-medium uppercase tracking-wider text-admin-dim">
              {FIELD_LABELS[key] ?? key}
            </dt>
            <dd className="break-all text-sm text-admin">{message.payload[key]}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-admin pt-4">
        <button
          type="button"
          onClick={onToggleRead}
          className="rounded-lg border border-admin-input px-3 py-2 text-xs font-medium text-admin-muted hover:border-admin-accent hover:text-admin-label"
        >
          {message.read ? "Mark as unread" : "Mark as read"}
        </button>
        {serverMode && message.type === "certificate" && status !== "confirmed" && status !== "used" ? (
          <button
            type="button"
            onClick={onConfirmVoucher}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirm voucher
          </button>
        ) : null}
      </div>
    </article>
  );
}
