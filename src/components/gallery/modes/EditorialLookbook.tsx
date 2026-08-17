"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useDemoControls } from "@/context/DemoControlsContext";
import { getRevealProps, hoverScaleClass } from "@/lib/motionUtils";
import { galleryItems, type GalleryItem, t } from "@/lib/galleryContent";
import { ItemDetailDrawer, StatusBadge } from "../ItemDetailDrawer";

function LookbookTile({
  item,
  index,
  onSelect,
}: {
  item: GalleryItem;
  index: number;
  onSelect: (item: GalleryItem) => void;
}) {
  const { language } = useLanguage();
  const { motionLevel } = useDemoControls();

  const reveal = getRevealProps(motionLevel, { delay: index * 0.06 });

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(item)}
      className={`group relative cursor-pointer overflow-hidden rounded-[2px] border border-[#EDE8DF]/10 bg-theme-elevated/60 text-left shadow-[0_16px_40px_rgba(0,0,0,0.22)] ${item.lookbookSpan} min-h-[200px]`}
      {...(reveal ?? {})}
    >
      <div className="relative h-full min-h-[200px] w-full">
        <Image
          src={item.image}
          alt={t(item.name, language)}
          fill
          sizes="(max-width:768px) 50vw, 33vw"
          className={`motion-hover-scale object-cover opacity-90 ${hoverScaleClass(motionLevel)}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1c]/75 via-[#1a1a1c]/15 to-transparent" />
      </div>

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
        <StatusBadge status={item.status} />
        <span className="font-body text-[9px] tracking-[0.16em] text-[#EDE8DF]/50">
          {item.sku}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="font-display text-base leading-snug text-[#FAFAFA] sm:text-lg">
          {t(item.name, language)}
        </p>
        {item.pricePln ? (
          <p className="mt-1 font-body text-[11px] tracking-[0.12em] text-[#E8E8E8]/55">
            {item.pricePln} PLN
          </p>
        ) : null}
      </div>
    </motion.button>
  );
}

export function EditorialLookbook() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const { language } = useLanguage();

  return (
    <>
      <p className="mb-8 font-body text-[10px] uppercase tracking-[0.28em] text-[#E5E5E5]/45">
        {language === "en" ? "Editorial selection" : "Selekacja editorial"}
      </p>

      <div className="grid auto-rows-auto grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {galleryItems.map((item, index) => (
          <LookbookTile key={item.id} item={item} index={index} onSelect={setSelected} />
        ))}
      </div>

      <ItemDetailDrawer item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
