"use client";

import { BilingualField } from "./BilingualField";
import { seedLegal, type AdminLegal, type LegalDoc, type LegalSection } from "@/lib/siteTexts";

function toText(paragraphs: string[]) {
  return paragraphs.join("\n\n");
}

function toParagraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function DocEditor({
  label,
  doc,
  onChange,
  onReset,
}: {
  label: string;
  doc: LegalDoc;
  onChange: (next: LegalDoc) => void;
  onReset: () => void;
}) {
  const updateSection = (index: number, next: LegalSection) =>
    onChange({ ...doc, sections: doc.sections.map((s, i) => (i === index ? next : s)) });

  return (
    <div className="admin-section-inner space-y-4 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold text-admin-heading">{label}</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Restore the original text of this document? Your edits will be lost.")) onReset();
          }}
          className="admin-btn-secondary px-3 py-2 text-[12px]"
        >
          Restore original
        </button>
      </div>

      <BilingualField
        label="Title"
        en={doc.title.en}
        pl={doc.title.pl}
        onEn={(v) => onChange({ ...doc, title: { ...doc.title, en: v } })}
        onPl={(v) => onChange({ ...doc, title: { ...doc.title, pl: v } })}
      />
      <BilingualField
        label="Date line"
        en={doc.updated.en}
        pl={doc.updated.pl}
        onEn={(v) => onChange({ ...doc, updated: { ...doc.updated, en: v } })}
        onPl={(v) => onChange({ ...doc, updated: { ...doc.updated, pl: v } })}
      />
      <BilingualField
        label="Introduction"
        multiline
        en={doc.intro.en}
        pl={doc.intro.pl}
        onEn={(v) => onChange({ ...doc, intro: { ...doc.intro, en: v } })}
        onPl={(v) => onChange({ ...doc, intro: { ...doc.intro, pl: v } })}
      />

      {doc.sections.map((section, index) => (
        <details key={index} className="rounded-xl border border-admin-border bg-admin-surface/40 p-3">
          <summary className="cursor-pointer text-[12px] font-medium text-admin-heading">
            {index + 1}. {section.title.pl || section.title.en || "Untitled section"}
          </summary>
          <div className="mt-3 space-y-3">
            <BilingualField
              label="Section title"
              en={section.title.en}
              pl={section.title.pl}
              onEn={(v) => updateSection(index, { ...section, title: { ...section.title, en: v } })}
              onPl={(v) => updateSection(index, { ...section, title: { ...section.title, pl: v } })}
            />
            <BilingualField
              label="Text (blank line = new paragraph)"
              multiline
              rows={10}
              en={toText(section.body.en)}
              pl={toText(section.body.pl)}
              onEn={(v) => updateSection(index, { ...section, body: { ...section.body, en: toParagraphs(v) } })}
              onPl={(v) => updateSection(index, { ...section, body: { ...section.body, pl: toParagraphs(v) } })}
            />
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Remove this section?")) {
                  onChange({ ...doc, sections: doc.sections.filter((_, i) => i !== index) });
                }
              }}
              className="text-[12px] text-red-500 underline underline-offset-2"
            >
              Remove section
            </button>
          </div>
        </details>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange({
            ...doc,
            sections: [
              ...doc.sections,
              { title: { pl: "Nowa sekcja", en: "New section" }, body: { pl: ["Treść…"], en: ["Text…"] } },
            ],
          })
        }
        className="admin-btn-secondary px-3 py-2 text-[12px]"
      >
        + Add section
      </button>
    </div>
  );
}

export function LegalAdminSection({
  legal,
  onChange,
}: {
  legal: AdminLegal;
  onChange: (next: AdminLegal) => void;
}) {
  return (
    <section className="admin-section space-y-4 p-3 sm:p-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-admin-heading">Legal pages</h2>
        <p className="mt-0.5 text-[12px] text-admin-muted">
          Privacy policy (/privacy) and shop terms (/regulamin). Open a section to edit its text.
        </p>
      </div>
      <DocEditor
        label="Privacy policy"
        doc={legal.privacy}
        onChange={(next) => onChange({ ...legal, privacy: next })}
        onReset={() => onChange({ ...legal, privacy: seedLegal().privacy })}
      />
      <DocEditor
        label="Shop terms (Regulamin)"
        doc={legal.terms}
        onChange={(next) => onChange({ ...legal, terms: next })}
        onReset={() => onChange({ ...legal, terms: seedLegal().terms })}
      />
    </section>
  );
}
