"use client";

import { LookbookArrivalsGrid } from "./LookbookArrivalsGrid";

export function HomeLookbookSection() {
  return (
    <section
      id="collection"
      className="lookbook-section relative isolate scroll-mt-28 overflow-x-clip transition-colors duration-700"
    >
      <div className="relative z-10 pt-10 sm:pt-12">
        <LookbookArrivalsGrid />
      </div>
    </section>
  );
}
