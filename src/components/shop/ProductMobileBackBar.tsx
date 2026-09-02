"use client";

import { ChevronLeft } from "lucide-react";

interface ProductMobileBackBarProps {
  label: string;
  onBack: () => void;
}

export function ProductMobileBackBar({ label, onBack }: ProductMobileBackBarProps) {
  return (
    <div className="mb-3 flex items-center border-b border-[var(--lookbook-line)] pb-2 sm:hidden">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-md font-body text-[11px] uppercase tracking-[0.14em] shop-catalog-muted transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lookbook-ink)] focus-visible:ring-offset-2"
      >
        <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={1.5} />
        <span className="lookbook-ink">{label}</span>
      </button>
    </div>
  );
}
