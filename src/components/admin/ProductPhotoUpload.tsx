"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { processProductImageFile } from "@/lib/productImageUpload";

export type ProductPhotoItem = {
  imageUrl: string;
  imageLabel: string;
};

interface ProductPhotoUploadProps {
  photos: ProductPhotoItem[];
  onChange: (photos: ProductPhotoItem[]) => void;
  maxPhotos?: number;
}

export function ProductPhotoUpload({
  photos,
  onChange,
  maxPhotos = 8,
}: ProductPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canAddMore = photos.length < maxPhotos;

  const addFiles = async (files: FileList | null) => {
    if (!files?.length || !canAddMore) return;

    setBusy(true);
    setError("");
    try {
      const next = [...photos];
      for (const file of Array.from(files)) {
        if (next.length >= maxPhotos) break;
        const result = await processProductImageFile(file);
        next.push(result);
      }
      onChange(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...photos];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => void addFiles(e.target.files)}
      />

      {photos.length > 0 ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={`${photo.imageLabel}-${index}`}
                className="overflow-hidden rounded-lg border border-admin-input bg-admin-card-muted"
              >
                <div className="relative aspect-square bg-admin-input">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.imageLabel || `Photo ${index + 1}`}
                    fill
                    unoptimized
                    className="object-contain p-1.5"
                  />
                  {index === 0 ? (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded bg-admin-accent px-1.5 py-0.5 text-[9px] font-medium text-white">
                      <Star className="h-2.5 w-2.5" fill="currentColor" />
                      Cover
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-1 border-t border-admin-input px-2 py-1.5">
                  <p className="min-w-0 truncate text-[10px] text-admin-muted">
                    {photo.imageLabel || `Photo ${index + 1}`}
                  </p>
                  <div className="flex shrink-0 gap-1">
                    {index > 0 ? (
                      <button
                        type="button"
                        onClick={() => setCover(index)}
                        className="text-[10px] text-admin-label hover:text-admin-heading"
                      >
                        Cover
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeAt(index)}
                      className="text-admin-danger hover:opacity-80"
                      aria-label="Remove photo"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canAddMore ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-admin-label hover:text-admin-heading disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              Add more photos ({photos.length}/{maxPhotos})
            </button>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void addFiles(e.dataTransfer.files);
          }}
          className={[
            "flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center transition-colors",
            dragOver ? "border-admin-accent bg-admin-accent-soft" : "border-admin-input bg-admin-card-muted",
            busy ? "opacity-70" : "hover:border-admin-accent",
          ].join(" ")}
        >
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin text-admin-muted" strokeWidth={1.5} />
          ) : (
            <ImagePlus className="h-6 w-6 text-admin-dim" strokeWidth={1.25} />
          )}
          <p className="mt-2 text-sm font-medium text-admin-label">Add product photos</p>
          <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-admin-muted">
            Choose one or several photos from phone or computer, or drag files here. First photo is
            the cover.
          </p>
        </button>
      )}

      {error ? <p className="text-xs text-admin-danger">{error}</p> : null}
    </div>
  );
}

export function photosFromProduct(product: {
  imageUrl?: string;
  imageLabel?: string;
  imageUrls?: string[];
}): ProductPhotoItem[] {
  if (product.imageUrls?.length) {
    return product.imageUrls.map((imageUrl, index) => ({
      imageUrl,
      imageLabel: index === 0 ? product.imageLabel || "photo.jpg" : `photo-${index + 1}.jpg`,
    }));
  }
  if (product.imageUrl) {
    return [{ imageUrl: product.imageUrl, imageLabel: product.imageLabel || "photo.jpg" }];
  }
  return [];
}

export function productPatchFromPhotos(photos: ProductPhotoItem[]): {
  imageUrl?: string;
  imageLabel: string;
  imageUrls?: string[];
} {
  if (!photos.length) {
    return { imageUrl: "", imageLabel: "", imageUrls: [] };
  }
  return {
    imageUrl: photos[0].imageUrl,
    imageLabel: photos[0].imageLabel,
    imageUrls: photos.map((photo) => photo.imageUrl),
  };
}
