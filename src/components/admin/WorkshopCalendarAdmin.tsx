"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import type { AdminWorkshopSlot } from "@/lib/adminTypes";
import {
  buildMonthGrid,
  createWorkshopSlot,
  formatIsoDate,
  getBookingsForSlot,
  getSlotAvailability,
  monthLabel,
  syncWorkshopsWithInbox,
  WEEKDAY_LABELS,
} from "@/lib/workshopCalendar";

function todayIso(): string {
  return formatIsoDate(new Date());
}

export function WorkshopCalendarAdmin() {
  const { workshops, setWorkshops, workshopTypes, inbox } = useAdminData();
  const defaultTypeId = workshopTypes[0]?.id ?? "one-time";

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedIsoDate, setSelectedIsoDate] = useState(todayIso());
  const [newTime, setNewTime] = useState("18:00");
  const [newCapacity, setNewCapacity] = useState(4);
  const [newTypeId, setNewTypeId] = useState(defaultTypeId);
  const [expandedSlotId, setExpandedSlotId] = useState<string | null>(null);

  const syncedWorkshops = useMemo(
    () => syncWorkshopsWithInbox(workshops, inbox, defaultTypeId),
    [workshops, inbox, defaultTypeId]
  );

  const grid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const slotsByDate = useMemo(() => {
    const map = new Map<string, AdminWorkshopSlot[]>();
    for (const slot of syncedWorkshops) {
      const iso = slot.isoDate ?? todayIso();
      const list = map.get(iso) ?? [];
      list.push(slot);
      map.set(iso, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [syncedWorkshops]);

  const selectedSlots = slotsByDate.get(selectedIsoDate) ?? [];

  const typeLabel = (typeId: string) =>
    workshopTypes.find((t) => t.id === typeId)?.label.en ?? typeId;

  const applyUpdate = (updater: (prev: AdminWorkshopSlot[]) => AdminWorkshopSlot[]) => {
    setWorkshops((prev) => syncWorkshopsWithInbox(updater(prev), inbox, defaultTypeId));
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const daySummary = (isoDate: string) => {
    const daySlots = slotsByDate.get(isoDate) ?? [];
    if (daySlots.length === 0) return null;

    let open = 0;
    let booked = 0;
    let capacity = 0;
    let allClosed = true;

    for (const slot of daySlots) {
      const avail = getSlotAvailability(slot, inbox);
      open += avail.open;
      booked += avail.booked;
      capacity += avail.capacity;
      if (!slot.closed) allClosed = false;
    }

    return { count: daySlots.length, open, booked, capacity, allClosed };
  };

  const addSlot = () => {
    if (!selectedIsoDate || !newTime || !newTypeId) return;

    const duplicate = syncedWorkshops.some(
      (s) =>
        s.isoDate === selectedIsoDate &&
        s.time === newTime &&
        s.workshopTypeId === newTypeId
    );
    if (duplicate) return;

    const slot = createWorkshopSlot({
      isoDate: selectedIsoDate,
      time: newTime,
      workshopTypeId: newTypeId,
      capacity: Math.max(1, newCapacity),
    });

    applyUpdate((prev) => [...prev, slot]);
  };

  const adjustCapacity = (id: string, delta: number) => {
    applyUpdate((prev) =>
      prev.map((slot) => {
        if (slot.id !== id) return slot;
        const nextCapacity = Math.max(1, (slot.capacity ?? 1) + delta);
        return { ...slot, capacity: nextCapacity };
      })
    );
  };

  const toggleClosed = (id: string) => {
    applyUpdate((prev) =>
      prev.map((slot) => {
        if (slot.id !== id) return slot;
        const closed = !(slot.closed ?? !slot.available);
        return { ...slot, closed, available: !closed && (slot.spots ?? 0) > 0 };
      })
    );
  };

  const removeSlot = (id: string) => {
    applyUpdate((prev) => prev.filter((slot) => slot.id !== id));
    if (expandedSlotId === id) setExpandedSlotId(null);
  };

  return (
    <section className="admin-section p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-admin-heading">Workshop calendar</h2>
          <p className="mt-1 text-sm text-admin-muted">
            Click a day to manage slots — capacity, bookings, and manual close.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-admin bg-admin-card-muted p-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-md p-2 text-admin-muted hover:bg-admin-card hover:text-admin-heading"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <span className="min-w-[10rem] px-2 text-center text-sm font-medium text-admin-heading">
            {monthLabel(viewYear, viewMonth)}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-md p-2 text-admin-muted hover:bg-admin-card hover:text-admin-heading"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-[10px] font-medium uppercase tracking-wider text-admin-dim"
          >
            {label}
          </div>
        ))}

        {grid.map((cell) => {
          const summary = daySummary(cell.isoDate);
          const isSelected = cell.isoDate === selectedIsoDate;
          const isToday = cell.isoDate === todayIso();
          const isPast = cell.isoDate < todayIso();

          let tone = "bg-admin-card-muted text-admin-muted";
          if (cell.inMonth && summary) {
            if (summary.allClosed) tone = "bg-stone-500/10 text-admin-muted";
            else if (summary.open === 0) tone = "bg-amber-500/12 text-amber-900 dark:text-amber-200";
            else tone = "bg-[color:var(--admin-success-bg)] text-[color:var(--admin-success-text)]";
          } else if (cell.inMonth) {
            tone = "bg-admin-card-muted text-admin-heading";
          }

          return (
            <button
              key={cell.isoDate}
              type="button"
              onClick={() => setSelectedIsoDate(cell.isoDate)}
              className={[
                "relative flex min-h-[3.25rem] flex-col items-center justify-center rounded-lg border px-1 py-2 text-sm transition-colors",
                cell.inMonth ? "border-admin" : "border-transparent opacity-40",
                tone,
                isSelected ? "ring-2 ring-admin-accent ring-offset-1 ring-offset-[color:var(--admin-card)]" : "",
                isPast && cell.inMonth ? "opacity-70" : "",
              ].join(" ")}
            >
              <span className={isToday ? "font-bold underline decoration-admin-accent decoration-2 underline-offset-2" : "font-medium"}>
                {cell.dayNumber}
              </span>
              {summary ? (
                <span className="mt-0.5 text-[10px] leading-tight opacity-90">
                  {summary.open > 0
                    ? `${summary.open} open`
                    : summary.booked > 0
                      ? `${summary.booked}/${summary.capacity}`
                      : `${summary.count} slot${summary.count === 1 ? "" : "s"}`}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-admin bg-admin-card-muted p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-admin-heading">
            {new Date(selectedIsoDate + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
          <span className="text-xs text-admin-dim">
            {selectedSlots.length === 0
              ? "No slots — add one below"
              : `${selectedSlots.length} slot${selectedSlots.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {selectedSlots.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {selectedSlots.map((slot) => {
              const avail = getSlotAvailability(slot, inbox);
              const bookings = getBookingsForSlot(inbox, slot.id);
              const expanded = expandedSlotId === slot.id;

              return (
                <li
                  key={slot.id}
                  className="rounded-lg border border-admin bg-admin-card px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-admin-heading">
                        {slot.time} · {typeLabel(slot.workshopTypeId)}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-admin-dim">
                        <span>
                          {avail.open} open · {avail.booked} booked · {avail.capacity} total
                        </span>
                        {avail.booked > 0 ? (
                          <button
                            type="button"
                            onClick={() => setExpandedSlotId(expanded ? null : slot.id)}
                            className="inline-flex items-center gap-1 text-admin-accent hover:underline"
                          >
                            <Users className="h-3 w-3" strokeWidth={1.75} />
                            {expanded ? "Hide bookings" : "View bookings"}
                          </button>
                        ) : null}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center rounded-lg border border-admin bg-admin-card-muted">
                        <button
                          type="button"
                          onClick={() => adjustCapacity(slot.id, -1)}
                          disabled={avail.capacity <= 1}
                          className="rounded-l-lg p-2 text-admin-muted hover:bg-admin-card disabled:opacity-40"
                          aria-label="Remove one place"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <span className="min-w-[2rem] px-2 text-center text-sm font-mono text-admin-heading">
                          {avail.capacity}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustCapacity(slot.id, 1)}
                          className="rounded-r-lg p-2 text-admin-muted hover:bg-admin-card"
                          aria-label="Add one place"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleClosed(slot.id)}
                        className={[
                          "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          !slot.closed && avail.isOpen
                            ? "border-[color:var(--admin-success-border)] bg-[color:var(--admin-success-bg)] text-[color:var(--admin-success-text)]"
                            : "border-admin-input bg-admin-card-muted text-admin-muted",
                        ].join(" ")}
                      >
                        {slot.closed || !avail.isOpen ? (
                          <ToggleLeft className="h-4 w-4" strokeWidth={1.5} />
                        ) : (
                          <ToggleRight className="h-4 w-4" strokeWidth={1.5} />
                        )}
                        {slot.closed ? "Closed" : avail.isOpen ? "Open" : "Full"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeSlot(slot.id)}
                        className="rounded-lg border border-admin p-2 text-admin-muted hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-600"
                        aria-label="Delete slot"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {expanded && bookings.length > 0 ? (
                    <ul className="mt-3 space-y-1 border-t border-admin pt-3">
                      {bookings.map((message) => (
                        <li
                          key={message.id}
                          className="flex flex-wrap justify-between gap-2 text-xs text-admin-muted"
                        >
                          <span>
                            {message.payload.name ?? message.payload.email ?? "Guest"}
                            {message.payload.participantCount
                              ? ` · ${message.payload.participantCount} people`
                              : ""}
                          </span>
                          <span className="text-admin-dim">
                            {message.payload.email ?? message.payload.buyerEmail ?? ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-admin-dim">This day has no workshop slots yet.</p>
        )}

        <div className="mt-5 border-t border-admin pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-admin-dim">
            Add slot on this day
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="min-w-[10rem] flex-1">
              <label className="mb-1 block text-xs text-admin-dim">Workshop type</label>
              <select
                value={newTypeId}
                onChange={(e) => setNewTypeId(e.target.value)}
                className="admin-input w-full rounded-lg px-3 py-2 text-sm"
              >
                {workshopTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-admin-dim">Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="admin-input rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-admin-dim">Places</label>
              <input
                type="number"
                min={1}
                max={20}
                value={newCapacity}
                onChange={(e) => setNewCapacity(Math.max(1, Number(e.target.value) || 1))}
                className="admin-input w-20 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
            <button
              type="button"
              onClick={addSlot}
              className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-4 py-2 text-sm font-medium text-white hover:bg-admin-accent-hover"
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              Add slot
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-admin-dim">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[color:var(--admin-success-bg)] ring-1 ring-[color:var(--admin-success-border)]" />
          Open spots
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/20 ring-1 ring-amber-500/30" />
          Fully booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-stone-500/15 ring-1 ring-stone-500/25" />
          Manually closed
        </span>
      </div>
    </section>
  );
}
