"use client";

import { useEffect, useState } from "react";
import type {
  AdminAboutBlock,
  AdminContacts,
  AdminDelivery,
  AdminFaqItem,
  AdminPersistedData,
  AdminReview,
} from "@/lib/adminTypes";
import {
  ADMIN_UPDATE_EVENT,
  readAdminDataSync,
  seedAdminData,
} from "@/lib/adminTypes";

export type SiteContentData = {
  faq: AdminFaqItem[];
  reviews: AdminReview[];
  contacts: AdminContacts;
  delivery: AdminDelivery;
  aboutBlocks: AdminAboutBlock[];
};

function buildSiteContent(data: AdminPersistedData): SiteContentData {
  return {
    faq: data.faq,
    reviews: data.reviews,
    contacts: data.contacts,
    delivery: data.delivery,
    aboutBlocks: data.aboutBlocks,
  };
}

function readSiteContent(): SiteContentData {
  const data = typeof window === "undefined" ? seedAdminData() : readAdminDataSync();
  return buildSiteContent(data);
}

export function useSiteContent(): SiteContentData {
  const [content, setContent] = useState<SiteContentData>(() => readSiteContent());

  useEffect(() => {
    const sync = () => setContent(readSiteContent());
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
