"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_UPDATE_EVENT,
  readAdminDataSync,
  seedAdminData,
  type AdminWorkshopSlot,
  type AdminWorkshopType,
} from "@/lib/adminTypes";

function readWorkshopData() {
  const data = typeof window === "undefined" ? seedAdminData() : readAdminDataSync();
  return {
    workshopTypes: data.workshopTypes.filter((t) => t.enabled),
    slots: data.workshops.filter((s) => s.available && s.spots > 0),
  };
}

export function useWorkshopData() {
  const [workshopTypes, setWorkshopTypes] = useState<AdminWorkshopType[]>(
    () => readWorkshopData().workshopTypes
  );
  const [slots, setSlots] = useState<AdminWorkshopSlot[]>(() => readWorkshopData().slots);

  useEffect(() => {
    const sync = () => {
      const next = readWorkshopData();
      setWorkshopTypes(next.workshopTypes);
      setSlots(next.slots);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(ADMIN_UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADMIN_UPDATE_EVENT, sync);
    };
  }, []);

  return useMemo(() => ({ workshopTypes, slots, ready: true }), [workshopTypes, slots]);
}
