"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUp } from "lucide-react";
import type { AdminProduct } from "@/lib/adminTypes";

interface ProductOrderPanelProps {
  /** Products in the exact order the shop uses for "Rekomendowane" (made-to-order excluded). */
  products: AdminProduct[];
  statusLabel: (product: AdminProduct) => string;
  onMove: (id: string, direction: "up" | "down" | "top") => void;
}

/**
 * The order of this list IS the "Rekomendowane" (recommended) order in the shop.
 * Moving a piece up/down here moves it in the catalog straight away.
 */
export function ProductOrderPanel({ products, statusLabel, onMove }: ProductOrderPanelProps) {
  const [lastMovedId, setLastMovedId] = useState<string | null>(null);

  const move = (id: string, direction: "up" | "down" | "top") => {
    setLastMovedId(id);
    onMove(id, direction);
  };

  return (
    <section className="admin-panel overflow-hidden">
      <div className="px-3.5 pb-1 pt-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold tracking-tight text-admin-heading">
            Order in shop · Kolejność w sklepie
          </p>
          <span className="admin-badge tabular-nums">{products.length}</span>
        </div>
        <p className="mt-1 text-[12px] leading-snug text-admin-muted">
          This list sets the <strong>“Rekomendowane”</strong> sorting in the shop: the first piece
          here is shown first. Use the arrows to reorder; the change is saved automatically.
          Other sortings (Najnowsze, price) ignore this order.
        </p>
      </div>

      <ol className="admin-scroll max-h-[min(50vh,460px)] space-y-1 overflow-y-auto px-3 pb-3 pt-2">
        {products.map((product, index) => {
          const moved = lastMovedId === product.id;
          return (
            <li
              key={product.id}
              className={[
                "flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors",
                moved ? "border-[var(--admin-accent,#4f46e5)] bg-[color-mix(in_srgb,var(--admin-accent,#4f46e5)_8%,transparent)]" : "border-transparent",
              ].join(" ")}
            >
              <span className="w-6 shrink-0 text-right text-[12px] tabular-nums text-admin-muted">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-admin-heading">
                  {product.title}
                </span>
                <span className="block truncate text-[11px] text-admin-muted">
                  {product.sku} · {statusLabel(product)}
                </span>
              </span>
              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost px-2 py-1.5 disabled:opacity-30"
                  onClick={() => move(product.id, "top")}
                  disabled={index === 0}
                  aria-label={`Move ${product.sku} to the top`}
                  title="To the top"
                >
                  <ChevronsUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost px-2 py-1.5 disabled:opacity-30"
                  onClick={() => move(product.id, "up")}
                  disabled={index === 0}
                  aria-label={`Move ${product.sku} up`}
                  title="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost px-2 py-1.5 disabled:opacity-30"
                  onClick={() => move(product.id, "down")}
                  disabled={index === products.length - 1}
                  aria-label={`Move ${product.sku} down`}
                  title="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
