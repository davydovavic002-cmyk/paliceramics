"use client";

import { useLanguage } from "@/context/LanguageContext";
import { statusLabels, t, type ItemStatus } from "@/lib/galleryContent";

export function ShopStatusBadge({
  status,
  outOfStock = false,
  variant = "dark",
  className = "",
}: {
  status: ItemStatus;
  outOfStock?: boolean;
  variant?: "dark" | "light";
  className?: string;
}) {
  const { language } = useLanguage();
  const light = variant === "light";

  if (status === "sold") {
    const label = statusLabels.sold;
    return (
      <span
        className={[
          "inline-flex items-center rounded-[2px] border px-2 py-0.5 font-body text-[8px] uppercase tracking-[0.16em] sm:text-[9px]",
          light
            ? "border-[color-mix(in_srgb,#010a8b_18%,transparent)] bg-[color-mix(in_srgb,#010a8b_6%,transparent)] text-[color-mix(in_srgb,#010a8b_55%,#4a4a55)]"
            : "border-[#EDE8DF]/12 bg-[#2a2826]/85 text-[#E8E8E8]/45",
          className,
        ].join(" ")}
      >
        {t(label, language)}
      </span>
    );
  }

  if (outOfStock) {
    const label = language === "pl" ? "Wyprzedane" : "Sold out";
    return (
      <span
        className={[
          "inline-flex items-center rounded-[2px] border px-2 py-0.5 font-body text-[8px] uppercase tracking-[0.16em] sm:text-[9px]",
          light
            ? "border-[color-mix(in_srgb,#010a8b_18%,transparent)] bg-[color-mix(in_srgb,#010a8b_6%,transparent)] text-[color-mix(in_srgb,#010a8b_55%,#4a4a55)]"
            : "border-[#EDE8DF]/15 bg-[#2a2826]/85 text-[#E8E8E8]/55",
          className,
        ].join(" ")}
      >
        {label}
      </span>
    );
  }

  const label = statusLabels[status];
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 font-body text-[8px] uppercase tracking-[0.16em] sm:text-[9px]",
        light ? "" : "backdrop-blur-md",
        light
          ? status === "available"
            ? "border-[#7a9a7e]/45 bg-[color-mix(in_srgb,#7a9a7e_14%,#faf7f0)] text-[#010a8b]"
            : "border-[color-mix(in_srgb,#5a6a82_35%,transparent)] bg-[color-mix(in_srgb,#5a6a82_10%,#faf7f0)] text-[#010a8b]"
          : status === "available"
            ? "border-[#7a9a7e]/35 bg-[#323234]/90 text-[#EDE8DF]/90"
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
