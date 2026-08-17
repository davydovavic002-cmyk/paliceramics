"use client";

import { useEffect, useState } from "react";
import { useAdminData } from "@/context/AdminDataContext";

interface CategoryInputProps {
  categoryId: string;
  onCategoryId: (id: string) => void;
  listId: string;
  className?: string;
  placeholder?: string;
}

export function CategoryInput({
  categoryId,
  onCategoryId,
  listId,
  className = "admin-cell-input",
  placeholder = "Type category…",
}: CategoryInputProps) {
  const { categories, resolveCategoryLabel } = useAdminData();
  const label = categories.find((c) => c.id === categoryId)?.label ?? "";
  const [text, setText] = useState(label);

  useEffect(() => {
    setText(categories.find((c) => c.id === categoryId)?.label ?? "");
  }, [categoryId, categories]);

  const commit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const nextId = resolveCategoryLabel(trimmed);
    onCategoryId(nextId);
    setText(trimmed);
  };

  return (
    <>
      <input
        list={listId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder={placeholder}
        className={className}
      />
      <datalist id={listId}>
        {categories.map((c) => (
          <option key={c.id} value={c.label} />
        ))}
      </datalist>
    </>
  );
}

export const cellInput = "admin-cell-input";
