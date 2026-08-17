"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  workshopMkFormats,
  type WorkshopMkFormatId,
} from "@/lib/workshopMkCopy";
import { WorkshopFormatDetailsPanel } from "@/components/workshops/WorkshopFormatDetailsPanel";

function FormatCard({
  active,
  title,
  teaser,
  onClick,
}: {
  active: boolean;
  title: string;
  teaser: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border p-3.5 text-left transition-all sm:p-4",
        active
          ? "border-[color-mix(in_srgb,var(--theme-accent)_40%,transparent)] bg-white shadow-[0_12px_32px_rgba(1,10,139,0.08)]"
          : "border-[color-mix(in_srgb,var(--theme-border)_12%,transparent)] bg-white hover:border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)]",
      ].join(" ")}
    >
      <p className="font-display text-[15px] text-theme sm:text-base">{title}</p>
      <p className="mt-1 font-body text-[11px] text-theme-muted sm:text-xs">{teaser}</p>
    </button>
  );
}

function MockPanel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-3 font-body text-[10px] uppercase tracking-[0.24em] text-theme-muted">{label}</p>
      <div className="workshops-booking-panel relative overflow-hidden rounded-[1.35rem] border border-[color-mix(in_srgb,var(--theme-border)_16%,transparent)] bg-[color-mix(in_srgb,#ffffff_92%,transparent)] px-4 py-5 shadow-[0_20px_56px_rgba(0,0,0,0.1)] sm:px-5 sm:py-6">
        {children}
      </div>
    </div>
  );
}

export function WorkshopFormatVariantA({
  formatId,
  onSelect,
}: {
  formatId: WorkshopMkFormatId;
  onSelect: (id: WorkshopMkFormatId) => void;
}) {
  const { language } = useLanguage();
  const selected = workshopMkFormats.find((f) => f.id === formatId)!;

  return (
    <>
      <p className="mb-1 font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted">Krok 1</p>
      <h3 className="font-display text-lg text-theme">Wybierz format</h3>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {workshopMkFormats.map((format) => (
          <FormatCard
            key={format.id}
            active={format.id === formatId}
            title={format.title[language]}
            teaser={format.teaser[language]}
            onClick={() => onSelect(format.id)}
          />
        ))}
      </div>
      <div className="mt-2.5">
        <WorkshopFormatDetailsPanel format={selected} variant="balanced" />
      </div>
      <button
        type="button"
        className="mt-5 w-full rounded-full border-2 border-[color-mix(in_srgb,var(--theme-accent)_50%,transparent)] bg-white py-3 font-body text-[10px] uppercase tracking-[0.22em] text-theme"
      >
        Dalej
      </button>
    </>
  );
}

export function WorkshopFormatVariantB({
  formatId,
  onSelect,
}: {
  formatId: WorkshopMkFormatId;
  onSelect: (id: WorkshopMkFormatId) => void;
}) {
  const { language } = useLanguage();
  const selected = workshopMkFormats.find((f) => f.id === formatId)!;

  return (
    <>
      <p className="mb-1 font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted">Krok 1</p>
      <h3 className="font-display text-lg text-theme">Wybierz format</h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-2">
          {workshopMkFormats.map((format) => {
            const active = format.id === formatId;
            return (
              <button
                key={format.id}
                type="button"
                onClick={() => onSelect(format.id)}
                className={[
                  "w-full rounded-xl border px-3 py-3 text-left transition-colors sm:px-4",
                  active
                    ? "border-[color-mix(in_srgb,var(--theme-accent)_40%,transparent)] bg-white shadow-[0_8px_24px_rgba(1,10,139,0.07)]"
                    : "border-[color-mix(in_srgb,var(--theme-border)_12%,transparent)] bg-white/80 hover:border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)]",
                ].join(" ")}
              >
                <p className="font-display text-sm text-theme">{format.title[language]}</p>
                <p className="mt-0.5 font-body text-[11px] text-theme-muted">{format.priceLine[language]}</p>
              </button>
            );
          })}
        </div>
        <WorkshopFormatDetailsPanel format={selected} variant="demo" />
      </div>
      <button
        type="button"
        className="mt-5 w-full rounded-full border-2 border-[color-mix(in_srgb,var(--theme-accent)_50%,transparent)] bg-white py-3 font-body text-[10px] uppercase tracking-[0.22em] text-theme"
      >
        Dalej
      </button>
    </>
  );
}

export function WorkshopFormatsDemoLab() {
  const { language } = useLanguage();
  const [formatA, setFormatA] = useState<WorkshopMkFormatId>("one-time");
  const [formatB, setFormatB] = useState<WorkshopMkFormatId>("one-time");

  const copy =
    language === "pl"
      ? {
          title: "Układ opisów warsztatów",
          subtitle:
            "Ten sam tekst Paliny — dwa sposoby pokazania w sekcji #workshops. Wybierz format w każdej kolumnie.",
          a: "Wariant A — karty + opis pod spodem",
          b: "Wariant B — lista + opis obok (desktop)",
          note: "To podgląd demo. Po wyborze wstawimy zwycięzcę na stronę główną.",
        }
      : {
          title: "Workshop copy layouts",
          subtitle:
            "Same Palina copy — two layouts for #workshops. Pick a format in each column to compare.",
          a: "Variant A — cards + description below",
          b: "Variant B — list + description beside (desktop)",
          note: "Demo preview only. We’ll ship the winner to the live workshops section.",
        };

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-[0.04em] text-theme">
          {copy.title}
        </h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-theme-muted sm:text-[15px]">
          {copy.subtitle}
        </p>
        <p className="mt-2 font-body text-xs text-theme-muted/80">{copy.note}</p>
      </header>

      <div className="grid gap-8 xl:grid-cols-2 xl:gap-10">
        <MockPanel label={copy.a}>
          <WorkshopFormatVariantA formatId={formatA} onSelect={setFormatA} />
        </MockPanel>
        <MockPanel label={copy.b}>
          <WorkshopFormatVariantB formatId={formatB} onSelect={setFormatB} />
        </MockPanel>
      </div>
    </div>
  );
}
