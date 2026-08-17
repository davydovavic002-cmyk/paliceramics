"use client";

import { Trash2 } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";

export function CategoriesCompact() {
  const { categories, updateCategory, removeCategory } = useAdminData();

  return (
    <details className="rounded-lg border border-admin bg-admin-card-muted text-sm">
      <summary className="cursor-pointer px-3 py-2 text-xs text-admin-muted marker:content-none [&::-webkit-details-marker]:hidden">
        Manage categories ({categories.length})
      </summary>
      <ul className="space-y-1 border-t border-admin px-2 py-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center gap-1.5">
            <input
              value={cat.label}
              onChange={(e) => updateCategory(cat.id, e.target.value)}
              className="admin-input min-w-0 flex-1 rounded px-2 py-1 text-xs"
            />
            <button
              type="button"
              disabled={categories.length <= 1}
              onClick={() => removeCategory(cat.id)}
              className="rounded p-1 text-admin-dim hover:text-[var(--admin-danger-hover)] disabled:opacity-30"
              title="Remove"
            >
              <Trash2 className="h-3 w-3" strokeWidth={1.5} />
            </button>
          </li>
        ))}
      </ul>
      <p className="border-t border-admin px-3 py-2 text-[10px] leading-relaxed text-admin-dim">
        Tip: collection names here are legacy labels — shop filters use the fixed kolekcje list above each product form.
      </p>
    </details>
  );
}
