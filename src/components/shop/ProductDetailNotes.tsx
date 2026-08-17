"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Language } from "@/types";
import type { ShopProduct } from "@/lib/shopCatalog";
import { useDemoControls } from "@/context/DemoControlsContext";
import { productCareNote, t } from "@/lib/galleryContent";
import { getExpandProps } from "@/lib/motionUtils";

function formatDetails(product: ShopProduct, language: Language): string {
  return [
    t(product.specs.dimensions, language),
    t(product.specs.glaze, language),
    t(product.specs.clayBody, language),
  ]
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

  const details = formatDetails(product, language);
  const care = productCareNote[language];

  const toggle = (key: "details" | "care") => {
    setOpen((current) => (current === key ? null : key));
  };

  return (
    <div className="shop-product-notes mt-8">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggle("details")}
            aria-expanded={open === "details"}
            className={[
              "shop-note-pill font-body",
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
              "shop-note-pill font-body",
              open === "care" ? "shop-note-pill-active" : "",
            ].join(" ")}
          >
            {copy.care}
          </button>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <AnimatePresence mode="wait">
        {open === "details" ? (
          <motion.p
            key="details"
            className="shop-product-note-text delivery-faq-ink mt-2.5 overflow-hidden font-body"
            {...expand}
          >
            {details}
          </motion.p>
        ) : null}
        {open === "care" ? (
          <motion.p
            key="care"
            className="shop-product-note-text delivery-faq-ink mt-2.5 overflow-hidden font-body"
            {...expand}
          >
            {care}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
