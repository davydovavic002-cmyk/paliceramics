"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Plus, Star } from "lucide-react";
import Image from "next/image";
import type { AdminCollection, AdminProduct } from "@/lib/adminTypes";
import { productPhotos } from "@/lib/adminTypes";
import { isDataImageUrl } from "@/lib/productImageUpload";

export type InventorySelection =
  | { kind: "collection"; id: string }
  | { kind: "product"; id: string };

interface ProductsInventoryPanelProps {
  collections: AdminCollection[];
  products: AdminProduct[];
  expandedCollectionIds: Set<string>;
  selection: InventorySelection | null;
  onToggleCollection: (id: string) => void;
  onSelectCollection: (id: string) => void;
  onSelectProduct: (id: string) => void;
  onAddCollection: (name: string) => void;
  onAddProductToCollection: (collectionId: string) => void;
  statusLabel: (product: AdminProduct) => string;
}

export function ProductsInventoryPanel({
  collections,
  products,
  expandedCollectionIds,
  selection,
  onToggleCollection,
  onSelectCollection,
  onSelectProduct,
  onAddCollection,
  onAddProductToCollection,
  statusLabel,
}: ProductsInventoryPanelProps) {
  const [collectionDraft, setCollectionDraft] = useState("");

  const productsByCollection = useMemo(() => {
    const map = new Map<string, AdminProduct[]>();
    for (const collection of collections) {
      map.set(
        collection.id,
        products.filter((product) => product.categoryId === collection.id)
      );
    }
    const knownIds = new Set(collections.map((collection) => collection.id));
    const uncategorized = products.filter((product) => !knownIds.has(product.categoryId));
    if (uncategorized.length) map.set("__uncategorized__", uncategorized);
    return map;
  }, [collections, products]);

  return (
    <section className="admin-panel overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <p className="text-[13px] font-semibold tracking-tight text-admin-heading">Collections</p>
        <span className="admin-badge tabular-nums">
          {collections.length} · {products.length}
        </span>
      </div>

      <div className="admin-scroll max-h-[min(68vh,640px)] overflow-y-auto px-3 pb-3">
        <div className="admin-bento-grid">
          {collections.map((collection) => {
            const items = productsByCollection.get(collection.id) ?? [];
            const expanded = expandedCollectionIds.has(collection.id);
            const collectionActive =
              selection?.kind === "collection" && selection.id === collection.id;
            const productSelectedInCollection =
              selection?.kind === "product" &&
              items.some((product) => product.id === selection.id);

            return (
              <article
                key={collection.id}
                className={[
                  "admin-collection-card",
                  collectionActive || productSelectedInCollection
                    ? "admin-collection-card-active"
                    : "",
                  expanded ? "admin-collection-card-open" : "",
                ].join(" ")}
              >
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => onSelectCollection(collection.id)}
                    className="admin-collection-cover block w-full overflow-hidden rounded-lg"
                  >
                    {collection.coverImageUrl ? (
                      <Image
                        src={collection.coverImageUrl}
                        alt=""
                        width={480}
                        height={360}
                        unoptimized={isDataImageUrl(collection.coverImageUrl)}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-admin-input text-[10px] text-admin-dim">
                        —
                      </div>
                    )}
                  </button>

                  <div className="mt-2 flex items-start gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectCollection(collection.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-1">
                        <p className="truncate text-[12px] font-semibold tracking-tight text-admin-heading">
                          {collection.name.en}
                        </p>
                        {collection.showInLookbook ? (
                          <Star
                            className="h-2.5 w-2.5 shrink-0 text-amber-500"
                            fill="currentColor"
                            aria-label="Lookbook"
                          />
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-[10px] text-admin-muted">
                        {items.length} piece{items.length === 1 ? "" : "s"}
                      </p>
                    </button>

                    <div className="flex shrink-0 items-center">
                      <button
                        type="button"
                        onClick={() => onAddProductToCollection(collection.id)}
                        className="admin-collection-action"
                        aria-label="Add piece"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleCollection(collection.id)}
                        className="admin-collection-action"
                        aria-expanded={expanded}
                        aria-label={expanded ? "Hide pieces" : "Show pieces"}
                      >
                        <ChevronRight
                          className={[
                            "h-3.5 w-3.5 transition-transform duration-200 ease-out",
                            expanded ? "rotate-90" : "",
                          ].join(" ")}
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {expanded ? (
                  <div className="admin-collection-pieces">
                    {items.length === 0 ? (
                      <p className="px-2 py-2.5 text-center text-[10px] text-admin-muted">Empty</p>
                    ) : (
                      <ul className="admin-scroll max-h-36 overflow-y-auto p-1">
                        {items.map((product) => {
                          const active =
                            selection?.kind === "product" && selection.id === product.id;
                          const cover = productPhotos(product)[0];
                          return (
                            <li key={product.id}>
                              <button
                                type="button"
                                onClick={() => onSelectProduct(product.id)}
                                className={[
                                  "admin-collection-piece",
                                  active ? "admin-collection-piece-active" : "",
                                ].join(" ")}
                              >
                                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-admin-input">
                                  {cover ? (
                                    <Image
                                      src={cover}
                                      alt=""
                                      fill
                                      unoptimized={isDataImageUrl(cover)}
                                      className="object-cover"
                                    />
                                  ) : null}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[11px] font-medium text-admin-heading">
                                    {product.title || "Untitled"}
                                  </p>
                                  <p className="truncate font-mono text-[9px] text-admin-dim">
                                    {product.sku}
                                  </p>
                                </div>
                                <span
                                  className={[
                                    "admin-piece-pill shrink-0",
                                    product.status === "available" ? "admin-piece-pill-open" : "",
                                  ].join(" ")}
                                >
                                  {statusLabel(product)}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {(productsByCollection.get("__uncategorized__")?.length ?? 0) > 0 ? (
          <div className="mt-2 rounded-xl border border-dashed border-admin-input px-3 py-2">
            <p className="text-[10px] font-semibold text-admin-label">Uncategorized</p>
            <ul className="mt-1 space-y-0.5">
              {productsByCollection.get("__uncategorized__")?.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product.id)}
                    className="admin-group-item w-full py-1.5 text-[11px]"
                  >
                    {product.sku} · {product.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <form
        className="flex gap-2 border-t border-admin px-3 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!collectionDraft.trim()) return;
          onAddCollection(collectionDraft.trim());
          setCollectionDraft("");
        }}
      >
        <input
          value={collectionDraft}
          onChange={(e) => setCollectionDraft(e.target.value)}
          placeholder="New collection…"
          className="admin-input min-w-0 flex-1 rounded-xl px-3 py-2 text-[13px]"
        />
        <button type="submit" className="admin-btn admin-btn-primary px-3 py-2">
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </form>
    </section>
  );
}
