import type { AdminInboxMessage, AdminWorkshopSlot } from "@/lib/adminTypes";

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type CalendarDayCell = {
  isoDate: string;
  inMonth: boolean;
  dayNumber: number;
};

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatSlotDisplay(isoDate: string, locale: "en" | "pl" = "en"): {
  day: string;
  date: string;
} {
  const parsed = parseIsoDate(isoDate);
  return {
    day: parsed.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", { weekday: "short" }),
    date: parsed.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
      month: "short",
      day: "numeric",
    }),
  };
}

/** Parse legacy display dates like "Aug 13" into ISO (uses current year). */
export function legacyDateToIso(dateLabel: string, fallbackIso?: string): string {
  if (fallbackIso && /^\d{4}-\d{2}-\d{2}$/.test(fallbackIso)) return fallbackIso;
  const year = new Date().getFullYear();
  const parsed = new Date(`${dateLabel} ${year}`);
  if (Number.isNaN(parsed.getTime())) return formatIsoDate(new Date());
  return formatIsoDate(parsed);
}

export function buildMonthGrid(year: number, month: number): CalendarDayCell[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      isoDate: formatIsoDate(date),
      inMonth: date.getMonth() === month,
      dayNumber: date.getDate(),
    };
  });
}

export function countBookingsForSlot(inbox: AdminInboxMessage[], slotId: string): number {
  return inbox.filter(
    (message) => message.type === "booking" && message.payload.slotId === slotId
  ).length;
}

export function getBookingsForSlot(
  inbox: AdminInboxMessage[],
  slotId: string
): AdminInboxMessage[] {
  return inbox.filter(
    (message) => message.type === "booking" && message.payload.slotId === slotId
  );
}

export type SlotAvailability = {
  capacity: number;
  booked: number;
  open: number;
  isOpen: boolean;
};

export function getSlotAvailability(
  slot: AdminWorkshopSlot,
  inbox: AdminInboxMessage[]
): SlotAvailability {
  const capacity = Math.max(0, slot.capacity ?? slot.spots ?? 0);
  const booked = countBookingsForSlot(inbox, slot.id);
  const open = slot.closed ? 0 : Math.max(0, Math.min(slot.spots ?? 0, capacity - booked));
  const isOpen = !slot.closed && open > 0;
  return { capacity, booked, open, isOpen };
}

export function normalizeWorkshopSlot(
  slot: AdminWorkshopSlot,
  defaultTypeId: string
): AdminWorkshopSlot {
  const isoDate = slot.isoDate ?? legacyDateToIso(slot.date);
  const display = formatSlotDisplay(isoDate);
  const capacity = Math.max(
    0,
    typeof slot.capacity === "number" ? slot.capacity : Math.max(slot.spots ?? 0, 1)
  );
  const spots =
    typeof slot.spots === "number" && Number.isFinite(slot.spots)
      ? Math.max(0, slot.spots)
      : capacity;

  return {
    ...slot,
    isoDate,
    day: display.day,
    date: display.date,
    workshopTypeId: slot.workshopTypeId ?? defaultTypeId,
    capacity,
    spots: Math.min(spots, capacity),
    closed: slot.closed ?? !slot.available,
    available: !(slot.closed ?? !slot.available) && spots > 0,
  };
}

export function syncWorkshopsWithInbox(
  workshops: AdminWorkshopSlot[],
  inbox: AdminInboxMessage[],
  defaultTypeId: string
): AdminWorkshopSlot[] {
  return workshops.map((raw) => {
    const slot = normalizeWorkshopSlot(raw, defaultTypeId);
    const booked = countBookingsForSlot(inbox, slot.id);
    const open = slot.closed ? 0 : Math.max(0, slot.capacity - booked);
    return {
      ...slot,
      spots: open,
      available: !slot.closed && open > 0,
    };
  });
}

export function createWorkshopSlot(input: {
  isoDate: string;
  time: string;
  workshopTypeId: string;
  capacity: number;
}): AdminWorkshopSlot {
  const display = formatSlotDisplay(input.isoDate);
  const id = `slot-${input.isoDate}-${input.time.replace(":", "")}-${input.workshopTypeId}`;

  return {
    id,
    isoDate: input.isoDate,
    day: display.day,
    date: display.date,
    time: input.time,
    workshopTypeId: input.workshopTypeId,
    capacity: input.capacity,
    spots: input.capacity,
    closed: false,
    available: input.capacity > 0,
  };
}

export function monthLabel(year: number, month: number, locale: "en" | "pl" = "en"): string {
  return new Date(year, month, 1).toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
    month: "long",
    year: "numeric",
  });
}
