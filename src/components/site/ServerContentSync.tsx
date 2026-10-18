"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { syncPublicContent } from "@/lib/contentSync";

/** Pulls the content saved in the admin (on the server) so every device shows the same site. */
export function ServerContentSync() {
  const pathname = usePathname();
  const inAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (inAdmin) return;
    void syncPublicContent();

    const onVisible = () => {
      if (document.visibilityState === "visible") void syncPublicContent();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [inAdmin]);

  return null;
}
