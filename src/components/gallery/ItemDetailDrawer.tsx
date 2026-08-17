"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { buildBookingMessage, telegramUrl, whatsappUrl } from "@/lib/booking";
import { type GalleryItem, statusLabels, t } from "@/lib/galleryContent";

interface ItemDetailDrawerProps {
  item: GalleryItem | null;
  onClose: () => void;
}

const SPEC_ROWS = [
  ["clayBody", { en: "Clay body", pl: "Masa" }],
  ["glaze", { en: "Glaze", pl: "Szkliwo" }],
  ["firing", { en: "Firing", pl: "Wypał" }],
  ["dimensions", { en: "Dimensions", pl: "Wymiary" }],
] as const;

export function ItemDetailDrawer({ item, onClose }: ItemDetailDrawerProps) {
  const { language } = useLanguage();

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  const claimDetails =
    item &&
    (language === "en"
      ? `item ${item.sku} — ${t(item.name, language)}`
      : `przedmiot ${item.sku} — ${t(item.name, language)}`);

  const message = claimDetails ? buildBookingMessage(claimDetails, language) : "";
  const canClaim = item && item.status !== "sold";

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {item ? (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.button
            type="button"
            className="absolute inset-0 cursor-pointer bg-[#1a1a1c]/78 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-item-title"
            className="pointer-events-auto relative z-[201] flex max-h-[min(88dvh,640px)] w-full max-w-[22rem] flex-col overflow-hidden rounded-t-[3px] border border-[#EDE8DF]/18 bg-[#323234] shadow-[0_28px_70px_rgba(0,0,0,0.5)] sm:max-w-sm sm:rounded-[2px]"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-[2px] p-1 text-[#EDE8DF]/55 transition-colors hover:bg-[#38383c]/80 hover:text-[#FAFAFA]"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="relative h-44 shrink-0 bg-[#2a2826] sm:h-48">
              <Image
                src={item.image}
                alt={t(item.name, language)}
                fill
                sizes="384px"
                className="object-contain p-5"
                priority
              />
              <div className="absolute left-3 top-3">
                <StatusBadge status={item.status} />
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <p className="font-body text-[10px] uppercase tracking-[0.26em] text-[#E5E5E5]/48">
                {item.sku}
              </p>
              <h3
                id="gallery-item-title"
                className="mt-1.5 font-display text-lg leading-snug tracking-[0.03em] text-[#FAFAFA] sm:text-xl"
              >
                {t(item.name, language)}
              </h3>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#EDE8DF]/10 pt-4">
                {SPEC_ROWS.map(([key, labels]) => (
                  <div key={key}>
                    <dt className="font-body text-[9px] uppercase tracking-[0.18em] text-[#E5E5E5]/45">
                      {t(labels, language)}
                    </dt>
                    <dd className="mt-0.5 font-body text-[13px] leading-snug text-[#E8E8E8]/88">
                      {t(item.specs[key], language)}
                    </dd>
                  </div>
                ))}
              </dl>

              {item.pricePln ? (
                <p className="mt-4 font-display text-lg text-[#FAFAFA]">
                  {item.pricePln} PLN
                  {item.priceUsd ? (
                    <span className="ml-1.5 font-body text-xs text-[#E8E8E8]/50">
                      ≈ ${item.priceUsd}
                    </span>
                  ) : null}
                </p>
              ) : null}

              {canClaim && message ? (
                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href={whatsappUrl(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-[2px] border-2 border-[#5a6a82]/50 bg-[#2c3444] px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-[#EDE8DF] transition-colors hover:bg-[#343e50]"
                  >
                    {language === "en" ? "Claim Item" : "Rezerwuj przedmiot"}
                  </a>
                  <a
                    href={telegramUrl(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-[2px] border border-[#EDE8DF]/22 bg-[#38383c]/70 px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.18em] text-[#EDE8DF]/80 transition-colors hover:border-[#EDE8DF]/40"
                  >
                    Telegram
                  </a>
                </div>
              ) : (
                <p className="mt-5 font-body text-sm leading-relaxed text-[#E8E8E8]/55">
                  {language === "en"
                    ? "This piece has entered the archive."
                    : "Ten egzemplarz trafił do archiwum."}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function StatusBadge({
  status,
  className = "",
}: {
  status: GalleryItem["status"];
  className?: string;
}) {
  const { language } = useLanguage();
  const label = statusLabels[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 font-body text-[8px] uppercase tracking-[0.16em] backdrop-blur-md sm:text-[9px]",
        status === "available"
          ? "border-[#7a9a7e]/35 bg-[#323234]/90 text-[#EDE8DF]/90"
          : status === "sold"
            ? "border-[#EDE8DF]/12 bg-[#2a2826]/85 text-[#E8E8E8]/45"
            : "border-[#5a6a82]/40 bg-[#2c3444]/85 text-[#EDE8DF]/85",
        className,
      ].join(" ")}
    >
      {status === "available" ? (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: label.dot }}
          aria-hidden
        />
      ) : null}
      {t(label, language)}
    </span>
  );
}
