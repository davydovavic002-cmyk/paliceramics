"use client";

import { RichTextarea } from "./RichTextarea";

const inputCls = "admin-input w-full rounded-xl px-3 py-2 text-[13px]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="mb-1 block text-[11px] text-admin-muted">{label}</span>
      {children}
    </div>
  );
}

export function BilingualField({
  label,
  en,
  pl,
  onEn,
  onPl,
  multiline,
  rows = 3,
}: {
  label: string;
  en: string;
  pl: string;
  onEn: (v: string) => void;
  onPl: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const fieldCls = `${inputCls} ${multiline ? "min-h-[4.5rem] resize-y" : ""}`;

  return (
    <div>
      <p className="mb-2 text-[11px] font-medium tracking-tight text-admin-label">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="English">
          {multiline ? (
            <RichTextarea value={en} onChange={onEn} rows={rows} className={fieldCls} />
          ) : (
            <input value={en} onChange={(e) => onEn(e.target.value)} className={fieldCls} />
          )}
        </Field>
        <Field label="Polski">
          {multiline ? (
            <RichTextarea value={pl} onChange={onPl} rows={rows} className={fieldCls} />
          ) : (
            <input value={pl} onChange={(e) => onPl(e.target.value)} className={fieldCls} />
          )}
        </Field>
      </div>
    </div>
  );
}
