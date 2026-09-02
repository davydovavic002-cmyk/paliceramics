"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type SortKey = "collection" | "price-asc" | "price-desc" | "name";

interface ShopSortMenuProps {
  value: SortKey;
  labels: Record<SortKey, string>;
  options: SortKey[];
  sortLabel: string;
  onChange: (value: SortKey) => void;
}

export function ShopSortMenu({
  value,
  labels,
  options,
  sortLabel,
  onChange,
}: ShopSortMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !rootRef.current) return;
    const firstOption = rootRef.current.querySelector<HTMLButtonElement>(
      '[role="listbox"] button'
    );
    firstOption?.focus();
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full sm:w-auto">
      <span className="mb-1.5 block font-body text-[11px] uppercase tracking-[0.14em] shop-catalog-muted sm:sr-only">
        {sortLabel}
      </span>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="shop-filter-touch lookbook-ink flex w-full min-h-[44px] items-center justify-between gap-3 rounded-full border border-[var(--lookbook-line)] bg-[color-mix(in_srgb,var(--lookbook-bg-well)_75%,transparent)] px-4 py-2.5 font-body text-sm sm:min-w-[12.5rem]"
      >
        <span>{labels[value]}</span>
        <ChevronDown
          className={["h-4 w-4 shrink-0 shop-catalog-muted transition-transform", open ? "rotate-180" : ""].join(" ")}
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={sortLabel}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-full min-w-[12.5rem] overflow-hidden rounded-xl border border-[var(--lookbook-line)] bg-[#fffef9] py-1 shadow-[0_16px_40px_rgba(1,10,139,0.12)]"
        >
          {options.map((key) => (
            <li key={key} role="option" aria-selected={value === key}>
              <button
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className={[
                  "shop-filter-touch flex w-full min-h-[44px] items-center px-4 py-2.5 text-left font-body text-sm transition-colors",
                  value === key
                    ? "lookbook-ink bg-[color-mix(in_srgb,var(--lookbook-ink)_8%,var(--lookbook-bg))]"
                    : "shop-catalog-muted hover:bg-[color-mix(in_srgb,var(--lookbook-ink)_4%,transparent)] hover:text-[var(--lookbook-ink)]",
                ].join(" ")}
              >
                {labels[key]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
