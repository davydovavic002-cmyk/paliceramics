"use client";

import { useAdminData } from "@/context/AdminDataContext";
import { pickBilingual } from "@/lib/adminTypes";

interface ProductCatalogFieldsProps {
  categoryId: string;
  pieceTypeId: string;
  onCategoryId: (id: string) => void;
  onPieceTypeId: (id: string) => void;
}

const selectClass = "admin-input w-full rounded-lg px-3 py-2 text-sm";

export function ProductCatalogFields({
  categoryId,
  pieceTypeId,
  onCategoryId,
  onPieceTypeId,
}: ProductCatalogFieldsProps) {
  const { collections, pieceTypes } = useAdminData();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-admin-label">
          Collection / Kolekcja
        </span>
        <select
          value={categoryId}
          onChange={(e) => onCategoryId(e.target.value)}
          className={selectClass}
        >
          <option value="">Choose collection…</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name.en} / {collection.name.pl}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-admin-label">
          Piece type / Rodzaj ceramiki
        </span>
        <select
          value={pieceTypeId}
          onChange={(e) => onPieceTypeId(e.target.value)}
          className={selectClass}
        >
          {pieceTypes.map((pieceType) => (
            <option key={pieceType.id} value={pieceType.id}>
              {pickBilingual(pieceType.name, pieceType.name, "en")} /{" "}
              {pickBilingual(pieceType.name, pieceType.name, "pl")}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
