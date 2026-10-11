"use client";

import { useEffect, useState } from "react";
import {
  ADMIN_UPDATE_EVENT,
  readAdminDataSync,
  seedAdminData,
  type AdminPersistedData,
} from "@/lib/adminTypes";
import type {
  AdminPalinaStory,
  AdminVoucherContent,
  AdminWorkshopBookingCopy,
  AdminWorkshopFormatCopy,
} from "@/lib/adminContentSeeds";

import type { AdminLegal, AdminSiteTexts } from "@/lib/siteTexts";

export type AdminContentData = {
  palinaStory: AdminPalinaStory;
  workshopFormatCopy: AdminWorkshopFormatCopy[];
  voucherContent: AdminVoucherContent;
  workshopBookingCopy: AdminWorkshopBookingCopy;
  siteTexts: AdminSiteTexts;
  legal: AdminLegal;
};

function buildAdminContent(data: AdminPersistedData): AdminContentData {
  return {
    palinaStory: data.palinaStory,
    workshopFormatCopy: data.workshopFormatCopy,
    voucherContent: data.voucherContent,
    workshopBookingCopy: data.workshopBookingCopy,
    siteTexts: data.siteTexts,
    legal: data.legal,
  };
}

function readAdminContent(): AdminContentData {
  const data = typeof window === "undefined" ? seedAdminData() : readAdminDataSync();
  return buildAdminContent(data);
}

export function useAdminContent(): AdminContentData {
  const [content, setContent] = useState<AdminContentData>(() => readAdminContent());

  useEffect(() => {
    const sync = () => setContent(readAdminContent());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(ADMIN_UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADMIN_UPDATE_EVENT, sync);
    };
  }, []);

  return content;
}
