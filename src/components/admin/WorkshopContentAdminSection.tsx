"use client";

import { BilingualField } from "./BilingualField";
import type { AdminWorkshopFormatCopy } from "@/lib/adminContentSeeds";

function paragraphsToText(paragraphs: string[]) {
  return paragraphs.join("\n\n");
}

function textToParagraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function WorkshopFormatsCopyAdminSection({
  formats,
  onChange,
}: {
  formats: AdminWorkshopFormatCopy[];
  onChange: (next: AdminWorkshopFormatCopy[]) => void;
}) {
  const updateFormat = (id: AdminWorkshopFormatCopy["id"], patch: Partial<AdminWorkshopFormatCopy>) => {
    onChange(formats.map((format) => (format.id === id ? { ...format, ...patch } : format)));
  };

  return (
    <section className="admin-section space-y-4 p-3 sm:p-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-admin-heading">Format descriptions</h2>
        <p className="mt-0.5 text-[12px] text-admin-muted">
          Long copy in the booking builder — titles/teasers here; PLN price in “Workshop types” above.
        </p>
      </div>

      {formats.map((format) => (
        <div key={format.id} className="admin-section-inner space-y-3 p-3 sm:p-4">
          <p className="text-[12px] font-medium text-admin-heading">
            {format.id === "one-time" ? "One-time workshop" : "3-session course"}
          </p>

          <BilingualField
            label="Card title"
            en={format.title.en}
            pl={format.title.pl}
            onEn={(v) => updateFormat(format.id, { title: { ...format.title, en: v } })}
            onPl={(v) => updateFormat(format.id, { title: { ...format.title, pl: v } })}
          />

          <BilingualField
            label="Card teaser"
            en={format.teaser.en}
            pl={format.teaser.pl}
            onEn={(v) => updateFormat(format.id, { teaser: { ...format.teaser, en: v } })}
            onPl={(v) => updateFormat(format.id, { teaser: { ...format.teaser, pl: v } })}
          />

          <BilingualField
            label="Price line (display)"
            en={format.priceLine.en}
            pl={format.priceLine.pl}
            onEn={(v) => updateFormat(format.id, { priceLine: { ...format.priceLine, en: v } })}
            onPl={(v) => updateFormat(format.id, { priceLine: { ...format.priceLine, pl: v } })}
          />

          <div className="grid gap-3 lg:grid-cols-2">
            <ParagraphField
              label="Description EN"
              value={paragraphsToText(format.paragraphs.en)}
              onChange={(v) =>
                updateFormat(format.id, {
                  paragraphs: { ...format.paragraphs, en: textToParagraphs(v) },
                })
              }
            />
            <ParagraphField
              label="Description PL"
              value={paragraphsToText(format.paragraphs.pl)}
              onChange={(v) =>
                updateFormat(format.id, {
                  paragraphs: { ...format.paragraphs, pl: textToParagraphs(v) },
                })
              }
            />
          </div>
        </div>
      ))}
    </section>
  );
}

function ParagraphField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-admin-dim">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="admin-input w-full rounded-lg px-3 py-2 text-[12px] leading-relaxed"
        placeholder="One paragraph per blank line"
      />
    </label>
  );
}

export function WorkshopBookingCopyAdminSection({
  copy,
  onChange,
}: {
  copy: import("@/lib/adminContentSeeds").AdminWorkshopBookingCopy;
  onChange: (next: import("@/lib/adminContentSeeds").AdminWorkshopBookingCopy) => void;
}) {
  const update = (
    key: keyof import("@/lib/adminContentSeeds").AdminWorkshopBookingCopy,
    lang: "en" | "pl",
    value: string
  ) => onChange({ ...copy, [key]: { ...copy[key], [lang]: value } });

  return (
    <section className="admin-section space-y-3 p-3 sm:p-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-admin-heading">Booking form copy</h2>
        <p className="mt-0.5 text-[12px] text-admin-muted">
          Success message and voucher checkbox on step 3 (#workshops).
        </p>
      </div>

      {(
        [
          ["sent", "Success message"],
          ["hasVoucher", "Voucher checkbox"],
          ["voucherNumber", "Voucher number placeholder"],
          ["voucherBring", "Voucher reminder"],
          ["errVoucherNumber", "Missing voucher error"],
        ] as const
      ).map(([key, label]) => (
        <BilingualField
          key={key}
          label={label}
          multiline={key === "sent" || key === "voucherBring"}
          en={copy[key].en}
          pl={copy[key].pl}
          onEn={(v) => update(key, "en", v)}
          onPl={(v) => update(key, "pl", v)}
        />
      ))}
    </section>
  );
}
