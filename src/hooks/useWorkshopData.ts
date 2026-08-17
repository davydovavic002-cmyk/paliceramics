"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_UPDATE_EVENT,
  loadAdminData,
  seedAdminData,
  type AdminWorkshopSlot,
  type AdminWorkshopType,
} from "@/lib/adminTypes";

export function useWorkshopData() {
  const [workshopTypes, setWorkshopTypes] = useState<AdminWorkshopType[]>([]);
  const [slots, setSlots] = useState<AdminWorkshopSlot[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const data = loadAdminData() ?? seedAdminData();
      setWorkshopTypes(data.workshopTypes.filter((t) => t.enabled));
      setSlots(data.workshops.filter((s) => s.available && s.spots > 0));
      setReady(true);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(ADMIN_UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADMIN_UPDATE_EVENT, sync);
    };
  }, []);

  return useMemo(() => ({ workshopTypes, slots, ready }), [workshopTypes, slots, ready]);
}
