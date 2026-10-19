"use client";

import { useEffect, useState } from "react";
import type { AdminInboxMessage } from "@/lib/adminTypes";

export function useServerInbox(enabled: boolean) {
  const [messages, setMessages] = useState<AdminInboxMessage[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [serverMode, setServerMode] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch("/api/admin/inbox")
      .then(async (res) => {
        if (!res.ok) {
          setServerMode(false);
          return null;
        }
        return res.json() as Promise<{
          ok: boolean;
          messages: Array<{
            id: string;
            type: AdminInboxMessage["type"];
            createdAt: string;
            read: boolean;
            status?: string;
            voucherCode?: string | null;
            payload: Record<string, string>;
          }>;
        }>;
      })
      .then((data) => {
        if (cancelled || !data?.ok) return;
        setServerMode(true);
        setMessages(
          data.messages.map((m) => ({
            id: m.id,
            type: m.type,
            createdAt: m.createdAt,
            read: m.read,
            payload: {
              ...m.payload,
              ...(m.voucherCode ? { voucherCode: m.voucherCode } : {}),
              ...(m.status ? { status: m.status } : {}),
            },
          }))
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const toggleRead = async (id: string, read: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    if (!serverMode) return;
    await fetch("/api/admin/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    window.dispatchEvent(new Event("pali-inbox-changed"));
  };

  const setStatus = async (id: string, status: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, payload: { ...m.payload, status } } : m))
    );
    if (!serverMode) return;
    await fetch("/api/admin/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, read: true }),
    });
    window.dispatchEvent(new Event("pali-inbox-changed"));
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/inbox?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok || res.status === 404) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      window.dispatchEvent(new Event("pali-inbox-changed"));
    }
    return res.ok;
  };

  const markAllRead = async () => {
    const res = await fetch("/api/admin/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true, read: true }),
    });
    if (res.ok) {
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      window.dispatchEvent(new Event("pali-inbox-changed"));
    }
  };

  return { messages, loading, serverMode, toggleRead, setStatus, remove, markAllRead };
}
