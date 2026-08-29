"use client";

import { BilingualField } from "./BilingualField";
import type { AdminVoucherContent } from "@/lib/adminContentSeeds";

const SECTION_FIELDS = [
  ["eyebrow", "Eyebrow"],
  ["title", "Title"],
  ["subtitle", "Subtitle"],
  ["typeLabel", "Type label"],
  ["participants", "Participants label"],
  ["participantsHint", "Participants hint"],
  ["onePerson", "1 person button"],
  ["twoPeople", "2 people button"],
  ["recipient", "Recipient label"],
  ["buyerEmail", "Buyer email label"],
  ["submit", "Submit button"],
  ["flowNote", "Flow note"],
  ["success", "Success message"],
  ["errRecipient", "Error — recipient"],
  ["errEmail", "Error — email"],
  ["errConsent", "Error — consent"],
] as const;

export function VoucherContentAdminSection({
  content,
  onChange,
}: {
  content: AdminVoucherContent;
  onChange: (next: AdminVoucherContent) => void;
}) {
  const updateSection = (
    key: (typeof SECTION_FIELDS)[number][0],
    lang: "en" | "pl",
    value: string
  ) =>
    onChange({
      ...content,
      section: { ...content.section, [key]: { ...content.section[key], [lang]: value } },
    });

  const updateType = (
    id: AdminVoucherContent["types"][number]["id"],
    patch: Partial<AdminVoucherContent["types"][number]>
  ) =>
    onChange({
      ...content,
      types: content.types.map((type) => (type.id === id ? { ...type, ...patch } : type)),
    });

  return (
    <section className="admin-section space-y-4 p-3 sm:p-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-admin-heading">Vouchers</h2>
        <p className="mt-0.5 text-[12px] text-admin-muted">
          Form texts and prices (#certificates). PDF templates stay fixed — only “dla N osób” changes live.
        </p>
      </div>

      {content.types.map((type) => (
        <div key={type.id} className="admin-section-inner space-y-3 p-3 sm:p-4">
          <p className="text-[12px] font-medium text-admin-heading">
            {type.id === "workshop-once" ? "One-time workshop voucher" : "Pottery course voucher"}
          </p>

          <BilingualField
            label="Type label"
            en={type.label.en}
            pl={type.label.pl}
            onEn={(v) => updateType(type.id, { label: { ...type.label, en: v } })}
            onPl={(v) => updateType(type.id, { label: { ...type.label, pl: v } })}
          />

          <BilingualField
            label="Detail line (on picker)"
            en={type.detail.en}
            pl={type.detail.pl}
            onEn={(v) => updateType(type.id, { detail: { ...type.detail, en: v } })}
            onPl={(v) => updateType(type.id, { detail: { ...type.detail, pl: v } })}
          />

          <div className="flex flex-wrap gap-3">
            <label>
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-admin-dim">
                Price 1 osoba (PLN)
              </span>
              <input
                type="number"
                min={0}
                value={type.pricePln}
                onChange={(e) => updateType(type.id, { pricePln: Number(e.target.value) || 0 })}
                className="admin-input w-28 rounded-lg px-3 py-2 font-mono text-[13px]"
              />
            </label>
            <label>
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-admin-dim">
                Price 2 osoby (PLN)
              </span>
              <input
                type="number"
                min={0}
                value={type.pricePlnForTwo}
                onChange={(e) =>
                  updateType(type.id, { pricePlnForTwo: Number(e.target.value) || 0 })
                }
                className="admin-input w-28 rounded-lg px-3 py-2 font-mono text-[13px]"
              />
            </label>
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-wider text-admin-dim">Section copy</p>
        {SECTION_FIELDS.map(([key, label]) => (
          <BilingualField
            key={key}
            label={label}
            multiline={
              key === "subtitle" || key === "flowNote" || key === "success" || key === "participantsHint"
            }
            en={content.section[key].en}
            pl={content.section[key].pl}
            onEn={(v) => updateSection(key, "en", v)}
            onPl={(v) => updateSection(key, "pl", v)}
          />
        ))}
      </div>
    </section>
  );
}
