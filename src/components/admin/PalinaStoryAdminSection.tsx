"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { processProductImageFile } from "@/lib/productImageUpload";
import { BilingualField } from "./BilingualField";
import type { AdminPalinaStory, AdminPalinaStoryImageId } from "@/lib/adminContentSeeds";

const IMAGE_LABELS: Record<AdminPalinaStoryImageId, string> = {
  japan: "Hero (large cell)",
  wheel: "Wheel photo",
  glaze: "Glaze photo",
  studio: "Studio photo",
};

export function PalinaStoryAdminSection({
  story,
  onChange,
}: {
  story: AdminPalinaStory;
  onChange: (next: AdminPalinaStory) => void;
}) {
  const update = (patch: Partial<AdminPalinaStory>) => onChange({ ...story, ...patch });

  return (
    <section className="admin-section space-y-4 p-3 sm:p-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-admin-heading">Palina story</h2>
        <p className="mt-0.5 text-[12px] text-admin-muted">
          About section (#about) — texts and photos shown in the editorial grid.
        </p>
      </div>

      <BilingualField
        label="Section label"
        en={story.sectionLabel.en}
        pl={story.sectionLabel.pl}
        onEn={(v) => update({ sectionLabel: { ...story.sectionLabel, en: v } })}
        onPl={(v) => update({ sectionLabel: { ...story.sectionLabel, pl: v } })}
      />

      {(
        [
          ["lead", "Lead"],
          ["origin", "Origin"],
          ["brand", "Brand"],
          ["workshops", "Workshops"],
          ["craft", "Craft"],
          ["closing", "Closing"],
        ] as const
      ).map(([key, label]) => (
        <BilingualField
          key={key}
          label={label}
          multiline
          en={story[key].en}
          pl={story[key].pl}
          onEn={(v) => update({ [key]: { ...story[key], en: v } })}
          onPl={(v) => update({ [key]: { ...story[key], pl: v } })}
        />
      ))}

      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-wider text-admin-dim">Photos</p>
        {story.images.map((image) => (
          <StoryImageEditor
            key={image.id}
            image={image}
            onChange={(next) =>
              update({
                images: story.images.map((item) => (item.id === image.id ? next : item)),
              })
            }
          />
        ))}
      </div>
    </section>
  );
}

function StoryImageEditor({
  image,
  onChange,
}: {
  image: AdminPalinaStory["images"][number];
  onChange: (next: AdminPalinaStory["images"][number]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const result = await processProductImageFile(file);
      onChange({ ...image, src: result.imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="admin-section-inner space-y-3 p-3">
      <p className="text-[12px] font-medium text-admin-heading">{IMAGE_LABELS[image.id]}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg border border-admin-border bg-admin-surface">
          {image.src ? (
            <Image src={image.src} alt="" fill unoptimized className="object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => void upload(e.target.files)}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="admin-btn-secondary inline-flex items-center gap-2 px-3 py-2 text-[12px]"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Replace photo
          </button>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-admin-dim">
              Image URL (optional)
            </span>
            <input
              value={image.src}
              onChange={(e) => onChange({ ...image, src: e.target.value })}
              className="admin-input w-full rounded-lg px-3 py-2 text-[12px]"
            />
          </label>
          <BilingualField
            label="Alt text"
            en={image.alt.en}
            pl={image.alt.pl}
            onEn={(v) => onChange({ ...image, alt: { ...image.alt, en: v } })}
            onPl={(v) => onChange({ ...image, alt: { ...image.alt, pl: v } })}
          />
          {error ? <p className="text-[11px] text-red-500">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
