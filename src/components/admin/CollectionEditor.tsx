"use client";

import { Trash2 } from "lucide-react";
import type { AdminCollection } from "@/lib/adminTypes";
import { BilingualField } from "./BilingualField";
import { HOMEPAGE_LOOKBOOK_COLLECTION_LIMIT } from "@/lib/catalogConfig";
import { ProductPhotoUpload, productPatchFromPhotos } from "./ProductPhotoUpload";

interface CollectionEditorProps {
  collection: AdminCollection;
  productCount: number;
  canRemove: boolean;
  onUpdate: (patch: Partial<AdminCollection>) => void;
  onDelete: () => void;
}

export function CollectionEditor({
  collection,
  productCount,
  canRemove,
  onUpdate,
  onDelete,
}: CollectionEditorProps) {
  const coverPhotos = collection.coverImageUrl
    ? [{ imageUrl: collection.coverImageUrl, imageLabel: collection.coverImageLabel || "cover.jpg" }]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-admin-heading">
            Edit collection
          </h2>
          <p className="mt-0.5 text-[11px] text-admin-muted">
            {productCount} {productCount === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Remove this collection? Pieces in it will need a new home.")) {
              onDelete();
            }
          }}
          disabled={!canRemove}
          className="admin-btn admin-btn-danger px-3 py-1.5 text-[11px] disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>

      <BilingualField
        label="Collection name"
        en={collection.name.en}
        pl={collection.name.pl}
        onEn={(value) => onUpdate({ name: { ...collection.name, en: value } })}
        onPl={(value) => onUpdate({ name: { ...collection.name, pl: value } })}
      />

      <BilingualField
        label="Subtitle"
        en={collection.subtitle.en}
        pl={collection.subtitle.pl}
        onEn={(value) => onUpdate({ subtitle: { ...collection.subtitle, en: value } })}
        onPl={(value) => onUpdate({ subtitle: { ...collection.subtitle, pl: value } })}
        multiline
        rows={2}
      />

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-medium tracking-tight text-admin-label">
          Cover photo
        </span>
        <p className="mb-2 text-[10px] leading-relaxed text-admin-dim">
          Shop sidebar, lookbook, and filters.
        </p>
        <ProductPhotoUpload
          photos={coverPhotos}
          maxPhotos={1}
          onChange={(photos) => {
            const patch = productPatchFromPhotos(photos);
            onUpdate({
              coverImageUrl: patch.imageUrl,
              coverImageLabel: patch.imageLabel,
            });
          }}
        />
      </label>

      <label className="admin-checkbox-card">
        <input
          type="checkbox"
          checked={collection.showInLookbook ?? false}
          onChange={(e) => onUpdate({ showInLookbook: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-admin-input accent-[color:var(--admin-accent)]"
        />
        <span>
          <span className="block text-[13px] font-medium tracking-tight text-admin-heading">
            Show on homepage lookbook
          </span>
          <span className="mt-1 block text-[10px] leading-relaxed text-admin-muted">
            Up to {HOMEPAGE_LOOKBOOK_COLLECTION_LIMIT} collections appear on the main page.
          </span>
        </span>
      </label>
    </div>
  );
}
