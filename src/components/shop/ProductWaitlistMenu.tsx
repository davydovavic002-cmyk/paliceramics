"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDemoControls } from "@/context/DemoControlsContext";
import { getMenuPanelProps } from "@/lib/motionUtils";
import { WaitlistForm } from "./WaitlistForm";

interface ProductWaitlistMenuProps {
  sku: string;
  productTitle: string;
}

export function ProductWaitlistMenu({ sku, productTitle }: ProductWaitlistMenuProps) {
  const { language } = useLanguage();
  const { motionLevel } = useDemoControls();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const label = language === "pl" ? "Lista oczekujących" : "Waitlist";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const menuMotion = getMenuPanelProps(motionLevel);

  return (
    <div ref={rootRef} className="shop-product-waitlist relative z-30 w-full min-w-0 sm:w-auto sm:shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="shop-waitlist-trigger inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,#010a8b_22%,transparent)] bg-white/85 px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] text-[#010a8b] transition-colors hover:bg-[color-mix(in_srgb,#010a8b_5%,white)] sm:w-auto sm:tracking-[0.18em]"
      >
        <Bell className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
        <span className="truncate">{label}</span>
        <ChevronDown
          className={["h-3.5 w-3.5 shrink-0 transition-transform duration-300", open ? "rotate-180" : ""].join(" ")}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="shop-waitlist-panel delivery-faq-panel absolute left-0 top-[calc(100%+0.625rem)] z-40 w-[min(100%,22rem)] overflow-hidden rounded-xl shadow-[0_20px_48px_rgba(1,10,139,0.14)] sm:left-auto sm:right-0"
            {...menuMotion}
          >
            <WaitlistForm
              sku={sku}
              productTitle={productTitle}
              variant="panel"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
