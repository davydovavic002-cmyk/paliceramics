"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Language } from "@/types";
import type { ShopProduct } from "@/lib/shopCatalog";
import { useDemoControls } from "@/context/DemoControlsContext";
import { productCareNote, t } from "@/lib/galleryContent";
import { getExpandProps } from "@/lib/motionUtils";

function formatDetails(product: ShopProduct, language: Language): string {
  return [t(product.specs.glaze, language), t(product.specs.clayBody, language)]
    .filter((part) => part && part !== "—")
    .join(" · ");
}

interface ProductDetailNotesProps {
  product: ShopProduct;
  language: Language;
  actions?: ReactNode;
}

type OpenNote = "details" | "care" | null;

export function ProductDetailNotes({ product, language, actions }: ProductDetailNotesProps) {
  const { motionLevel } = useDemoControls();
  const [open, setOpen] = useState<OpenNote>(null);
  const expand = getExpandProps(motionLevel);

  const copy =
    language === "pl"
      ? { details: "Detale", care: "Pielęgnacja" }
      : { details: "Details", care: "Care" };

  const noteTabs = [
    { key: "details" as const, text: formatDetails(product, language) },
    { key: "care" as const, text: productCareNote[language] },
  ];

  const toggle = (key: "details" | "care") => {
    setOpen((current) => (current === key ? null : key));
  };

  return (
    <div className="shop-product-notes mt-5 bg-transparent">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggle("details")}
          aria-expanded={open === "details"}
          className={[
            "shop-note-pill font-inter",
            open === "details" ? "shop-note-pill-active" : "",
          ].join(" ")}
        >
          {copy.details}
        </button>
        <button
          type="button"
          onClick={() => toggle("care")}
          aria-expanded={open === "care"}
          className={[
            "shop-note-pill font-inter",
            open === "care" ? "shop-note-pill-active" : "",
          ].join(" ")}
        >
          {copy.care}
        </button>
      </div>

      {/* Both notes occupy the same grid cell so the block is always as tall as the longer
          copy. min-h covers the 3–4 line wrap of Pielęgnacja on a 360px panel, so switching
          Detale ↔ Pielęgnacja cannot move KUP TERAZ or the sheet edge. */}
      <div className="mt-2.5 grid min-h-[5rem] bg-transparent">
        {noteTabs.map(({ key, text }) => (
          <motion.p
            key={key}
            className="shop-product-note-text col-start-1 row-start-1 font-inter text-sm font-normal leading-relaxed text-theme-muted"
            initial={false}
            animate={{ opacity: open === key ? 1 : 0 }}
            transition={expand.transition}
            style={{ visibility: open === key ? "visible" : "hidden" }}
            aria-hidden={open !== key}
          >
            {text}
          </motion.p>
        ))}
      </div>

      {actions ? (
        <div className="shop-product-notes-actions mt-3 flex w-full min-w-0 flex-col gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
