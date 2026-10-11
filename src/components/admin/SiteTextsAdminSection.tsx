"use client";

import { BilingualField } from "./BilingualField";
import {
  SITE_TEXT_DEFS,
  SITE_TEXT_GROUPS,
  type AdminSiteTexts,
  type SiteTextGroup,
} from "@/lib/siteTexts";

export function SiteTextsAdminSection({
  group,
  texts,
  onChange,
}: {
  group: SiteTextGroup;
  texts: AdminSiteTexts;
  onChange: (next: AdminSiteTexts) => void;
}) {
  const info = SITE_TEXT_GROUPS.find((item) => item.id === group);
  const defs = SITE_TEXT_DEFS.filter((def) => def.group === group);

  const setValue = (key: string, lang: "en" | "pl", value: string) => {
    const def = defs.find((item) => item.key === key);
    if (!def) return;
    const current = texts[key] ?? { en: def.en, pl: def.pl };
    onChange({ ...texts, [key]: { ...current, [lang]: value } });
  };

  const resetGroup = () => {
    const next = { ...texts };
    for (const def of defs) delete next[def.key];
    onChange(next);
  };

  return (
    <section className="admin-section space-y-4 p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-admin-heading">{info?.title}</h2>
          <p className="mt-0.5 text-[12px] text-admin-muted">{info?.detail}</p>
        </div>
        <button
          type="button"
          onClick={resetGroup}
          className="admin-btn-secondary shrink-0 px-3 py-2 text-[12px]"
        >
          Restore defaults
        </button>
      </div>

      {defs.map((def) => {
        const value = texts[def.key] ?? { en: def.en, pl: def.pl };
        return (
          <BilingualField
            key={def.key}
            label={def.label}
            multiline={def.multiline}
            rows={def.key === "mto.body" ? 9 : 3}
            en={value.en}
            pl={value.pl}
            onEn={(v) => setValue(def.key, "en", v)}
            onPl={(v) => setValue(def.key, "pl", v)}
          />
        );
      })}
    </section>
  );
}
