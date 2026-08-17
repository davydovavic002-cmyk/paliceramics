"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { AdminPieceType } from "@/lib/adminTypes";
import { BilingualField } from "./BilingualField";

interface PieceTypesPanelProps {
  pieceTypes: AdminPieceType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<AdminPieceType>) => void;
  onAdd: (nameEn: string) => void;
  onRemove: (id: string) => void;
}

export function PieceTypesPanel({
  pieceTypes,
  selectedId,
  onSelect,
  onUpdate,
  onAdd,
  onRemove,
}: PieceTypesPanelProps) {
  const [draft, setDraft] = useState("");
  const selected = pieceTypes.find((type) => type.id === selectedId) ?? null;

  return (
    <details className="admin-disclosure">
      <summary>Piece types ({pieceTypes.length})</summary>
      <div className="space-y-2 border-t border-admin-input px-2 py-2">
        <div className="admin-group">
          {pieceTypes.map((pieceType) => (
            <button
              key={pieceType.id}
              type="button"
              onClick={() => onSelect(pieceType.id)}
              className={[
                "admin-group-item justify-between",
                selectedId === pieceType.id ? "admin-group-item-active" : "",
              ].join(" ")}
            >
              <span>{pieceType.name.en}</span>
              <span className="text-admin-dim">{pieceType.name.pl}</span>
            </button>
          ))}
        </div>

        <form
          className="flex gap-1.5 pt-0.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            onAdd(draft.trim());
            setDraft("");
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="New type…"
            className="admin-input min-w-0 flex-1 rounded-lg px-2.5 py-1.5 text-[12px]"
          />
          <button type="submit" className="admin-btn admin-btn-primary px-2.5 py-1.5">
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </form>

        {selected ? (
          <div className="admin-section-inner space-y-2 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-admin-label">Edit type</p>
              <button
                type="button"
                disabled={pieceTypes.length <= 1}
                onClick={() => {
                  if (window.confirm("Remove this piece type?")) {
                    onRemove(selected.id);
                  }
                }}
                className="admin-btn-ghost rounded-lg p-1 text-admin-danger disabled:opacity-40"
                aria-label="Remove piece type"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <BilingualField
              label="Name"
              en={selected.name.en}
              pl={selected.name.pl}
              onEn={(value) => onUpdate(selected.id, { name: { ...selected.name, en: value } })}
              onPl={(value) => onUpdate(selected.id, { name: { ...selected.name, pl: value } })}
            />
          </div>
        ) : null}
      </div>
    </details>
  );
}
