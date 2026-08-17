"use client";

import { ToggleLeft, ToggleRight } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import type { AdminWorkshopType } from "@/lib/adminTypes";
import { WorkshopCalendarAdmin } from "./WorkshopCalendarAdmin";

export function WorkshopsTab() {
  const { workshopTypes, setWorkshopTypes } = useAdminData();

  const updateType = (id: string, patch: Partial<AdminWorkshopType>) => {
    setWorkshopTypes((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const toggleType = (id: string) => {
    setWorkshopTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  return (
    <div className="space-y-6">
      <section className="admin-section p-3 sm:p-4">
        <h2 className="text-[15px] font-semibold tracking-tight text-admin-heading">Workshop types</h2>
        <p className="mt-0.5 text-[12px] text-admin-muted">
          Formats in the booking builder — PLN only.
        </p>

        <ul className="mt-4 space-y-2">
          {workshopTypes.map((type) => (
            <li key={type.id} className="admin-section-inner px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-admin-dim">
                        Title EN
                      </label>
                      <input
                        value={type.label.en}
                        onChange={(e) =>
                          updateType(type.id, {
                            label: { ...type.label, en: e.target.value },
                          })
                        }
                        className="admin-input w-full rounded-xl px-3 py-2 text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-admin-dim">
                        Title PL
                      </label>
                      <input
                        value={type.label.pl}
                        onChange={(e) =>
                          updateType(type.id, {
                            label: { ...type.label, pl: e.target.value },
                          })
                        }
                        className="admin-input w-full rounded-xl px-3 py-2 text-[13px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-admin-dim">
                        PLN
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={type.pricePln}
                        onChange={(e) =>
                          updateType(type.id, { pricePln: Number(e.target.value) || 0 })
                        }
                        className="admin-input w-24 rounded-xl px-3 py-2 font-mono text-[13px]"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleType(type.id)}
                  className={[
                    "admin-btn px-3 py-2 text-[12px]",
                    type.enabled
                      ? "border border-[color:var(--admin-success-border)] bg-[color:var(--admin-success-bg)] text-[color:var(--admin-success-text)]"
                      : "admin-btn-secondary",
                  ].join(" ")}
                >
                  {type.enabled ? (
                    <ToggleRight className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <ToggleLeft className="h-4 w-4" strokeWidth={1.5} />
                  )}
                  {type.enabled ? "Visible" : "Hidden"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <WorkshopCalendarAdmin />
    </div>
  );
}
