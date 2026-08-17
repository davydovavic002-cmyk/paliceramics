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
import { ADMIN_UPDATE_EVENT, loadAdminData, seedAdminData } from "@/lib/adminTypes";

export type SiteContentData = {
  faq: AdminFaqItem[];
  reviews: AdminReview[];
  contacts: AdminContacts;
  delivery: AdminDelivery;
  aboutBlocks: AdminAboutBlock[];
};

export function useSiteContent(): SiteContentData | null {
  const [content, setContent] = useState<SiteContentData | null>(null);

  useEffect(() => {
    const sync = () => {
      const data = loadAdminData() ?? seedAdminData();
      setContent({
        faq: data.faq,
        reviews: data.reviews,
        contacts: data.contacts,
        delivery: data.delivery,
        aboutBlocks: data.aboutBlocks,
      });
    };
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
