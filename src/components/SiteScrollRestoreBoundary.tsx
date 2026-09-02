"use client";

import { Suspense } from "react";
import { SiteScrollRestore } from "@/components/SiteScrollRestore";

export function SiteScrollRestoreBoundary() {
  return (
    <Suspense fallback={null}>
      <SiteScrollRestore />
    </Suspense>
  );
}
