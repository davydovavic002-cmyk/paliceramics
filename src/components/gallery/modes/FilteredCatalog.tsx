"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useDemoControls } from "@/context/DemoControlsContext";
import { hoverScaleClass } from "@/lib/motionUtils";
import {
  catalogFilters,
  filterCatalogItems,
  galleryItems,
  type CatalogFilter,
  type GalleryItem,
  t,
} from "@/lib/galleryContent";
import { ItemDetailDrawer, StatusBadge } from "../ItemDetailDrawer";

function CatalogCard({
  item,
  onSelect,
}: {
  item: GalleryItem;
  onSelect: (item: GalleryItem) => void;
}) {
  const { language } = useLanguage();
  const { motionLevel } = useDemoControls();
  const scaleAnim =
    motionLevel === "minimal"
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
      : {
          initial: { opacity: 0, scale: 0.96 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.94 },
        };

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(item)}
      className="group cursor-pointer overflow-hidden rounded-[2px] border border-theme bg-theme-surface/50 text-left shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_48px_rgba(0,0,0,0.2)]"
      {...scaleAnim}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#2a2826]">
        <Image
          src={item.image}
          alt={t(item.name, language)}
          fill
          sizes="(max-width:640px) 50vw, 25vw"
          className={`motion-hover-scale object-cover ${hoverScaleClass(motionLevel)} ease-out ${motionLevel === "immersive" ? "duration-700 group-hover:scale-110" : motionLevel === "tactile" ? "duration-500 group-hover:scale-105" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1c]/60 via-transparent to-transparent opacity-80" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="border-t border-[#EDE8DF]/08 p-4">
        <p className="font-body text-[9px] tracking-[0.18em] text-[#E5E5E5]/45">{item.sku}</p>
        <p className="mt-1 font-display text-sm leading-snug text-[#FAFAFA] sm:text-base">
          {t(item.name, language)}
        </p>
        {item.pricePln ? (
          <p className="mt-2 font-body text-[11px] tracking-[0.1em] text-[#E8E8E8]/55">
            {item.pricePln} PLN
          </p>
        ) : null}
      </div>
    </motion.button>
  );
}

export function FilteredCatalog() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<CatalogFilter>("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () => filterCatalogItems(galleryItems, filter),
    [filter]
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
        {catalogFilters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={[
                "cursor-pointer rounded-[2px] border px-3.5 py-2 font-body text-[10px] uppercase tracking-[0.18em] transition-all duration-300 sm:px-4 sm:text-[11px] sm:tracking-[0.2em]",
                active
                  ? "border-[#5a6a82]/50 bg-[#2c3444] text-[#EDE8DF]"
                  : "border-[#EDE8DF]/18 bg-[#38383c]/40 text-[#E8E8E8]/60 hover:border-[#EDE8DF]/35 hover:text-[#FAFAFA]",
              ].join(" ")}
            >
              {t(f.label, language)}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {filtered.map((item) => (
          <CatalogCard key={item.id} item={item} onSelect={setSelected} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-body text-sm text-[#E8E8E8]/50">
          {language === "en" ? "No pieces in this view." : "Brak prac w tym widoku."}
        </p>
      ) : null}

      <ItemDetailDrawer item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
