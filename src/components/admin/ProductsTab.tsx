"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import type { AdminProduct, AdminProductSpecs, Bilingual } from "@/lib/adminTypes";
import {
  adminCatalogStatuses,
  defaultAdminProductSpecs,
  defaultProductDescription,
  normalizeProductSku,
} from "@/lib/adminTypes";
import { getCollectionLabelFromList, getPieceTypeLabelFromList } from "@/lib/catalogConfig";
import { CollectionEditor } from "./CollectionEditor";
import { PieceTypesPanel } from "./PieceTypesPanel";
import {
  ProductsInventoryPanel,
  type InventorySelection,
} from "./ProductsInventoryPanel";
import {
  ProductPhotoUpload,
  photosFromProduct,
  productPatchFromPhotos,
} from "./ProductPhotoUpload";
import { ProductCatalogFields } from "./ProductCatalogFields";
import { BilingualField } from "./BilingualField";

const SPEC_FIELDS: {
  key: keyof AdminProductSpecs;
  label: string;
}[] = [
  { key: "clayBody", label: "Clay body / Masa" },
  { key: "glaze", label: "Glaze / Szkliwo" },
  { key: "firing", label: "Firing / Wypał" },
  { key: "dimensions", label: "Dimensions / Wymiary" },
];

const emptyForm = {
  sku: "",
  title: "",
  pricePln: "",
  stock: "1",
  categoryId: "matte-ash",
  pieceTypeId: "bowls",
  status: "available" as AdminProduct["status"],
  photos: [] as ReturnType<typeof photosFromProduct>,
  descriptionEn: "",
  descriptionPl: "",
};

type StatusFilter = "all" | "available" | "sold";

export function ProductsTab() {
  const {
    products,
    setProducts,
    collections,
    pieceTypes,
    addCollection,
    updateCollection,
    removeCollection,
    addPieceType,
    updatePieceType,
    removePieceType,
  } = useAdminData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selection, setSelection] = useState<InventorySelection | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [skuError, setSkuError] = useState("");
  const [pieceTypeEditorId, setPieceTypeEditorId] = useState<string | null>(null);
  const [expandedCollectionIds, setExpandedCollectionIds] = useState<Set<string>>(
    () => new Set()
  );

  const catalogProducts = useMemo(
    () => products.filter((product) => product.status !== "made-to-order"),
    [products]
  );

  const nextSku = useMemo(() => {
    const nums = catalogProducts.map((p) => parseInt(p.id, 10)).filter(Boolean);
    const next = (Math.max(0, ...nums) + 1).toString().padStart(3, "0");
    return `PALI-${next}`;
  }, [catalogProducts]);

  const categoryLabel = (categoryId: string) =>
    getCollectionLabelFromList(collections, categoryId, "en");

  const pieceTypeLabel = (pieceTypeId: string) =>
    getPieceTypeLabelFromList(pieceTypes, pieceTypeId, "en");

  const productStatusLabel = (product: AdminProduct) =>
    product.status === "available" ? "available" : "sold";

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogProducts.filter((product) => {
      if (statusFilter !== "all" && product.status !== statusFilter) return false;
      if (!q) return true;
      return (
        product.title.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        categoryLabel(product.categoryId).toLowerCase().includes(q) ||
        pieceTypeLabel(product.pieceTypeId).toLowerCase().includes(q)
      );
    });
  }, [catalogProducts, query, statusFilter, collections, pieceTypes]);

  const selectedProduct =
    selection?.kind === "product"
      ? (catalogProducts.find((product) => product.id === selection.id) ?? null)
      : null;

  const selectedCollection =
    selection?.kind === "collection"
      ? (collections.find((collection) => collection.id === selection.id) ?? null)
      : null;

  const updateProduct = (id: string, patch: Partial<AdminProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const updateDescription = (id: string, patch: Partial<Bilingual>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, description: { ...p.description, ...patch } } : p
      )
    );
  };

  const updateSpec = (
    id: string,
    key: keyof AdminProductSpecs,
    patch: Partial<Bilingual>
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, specs: { ...p.specs, [key]: { ...p.specs[key], ...patch } } }
          : p
      )
    );
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selection?.kind === "product" && selection.id === id) setSelection(null);
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const photoPatch = productPatchFromPhotos(form.photos);
    const sku = normalizeProductSku(form.sku || nextSku);
    if (!form.title.trim() || !form.categoryId || !photoPatch.imageUrl) return;
    if (isSkuTaken(sku)) {
      setSkuError("This SKU is already used by another piece.");
      return;
    }
    setSkuError("");

    const description: Bilingual = {
      en: form.descriptionEn.trim() || defaultProductDescription.en,
      pl: form.descriptionPl.trim() || defaultProductDescription.pl,
    };

    const skuDigits = sku.match(/(\d+)$/)?.[1] ?? nextSku.replace("PALI-", "");

    const item: AdminProduct = {
      id: skuDigits.padStart(3, "0"),
      sku,
      title: form.title.trim(),
      pricePln: Number(form.pricePln) || 0,
      stock: Math.max(0, Number(form.stock) || 0),
      categoryId: form.categoryId,
      pieceTypeId: form.pieceTypeId,
      status: form.status === "made-to-order" ? "sold" : form.status,
      imageLabel: photoPatch.imageLabel,
      imageUrl: photoPatch.imageUrl,
      imageUrls: photoPatch.imageUrls,
      description,
      specs: defaultAdminProductSpecs(),
    };

    setProducts((prev) => [item, ...prev]);
    setForm(emptyForm);
    setAdding(false);
    setSelection({ kind: "product", id: item.id });
    setExpandedCollectionIds((prev) => new Set(prev).add(item.categoryId));
  };

  const isSkuTaken = (sku: string, exceptId?: string) =>
    catalogProducts.some(
      (product) =>
        product.id !== exceptId && product.sku.toUpperCase() === sku.toUpperCase()
    );

  const toggleCollection = (id: string) => {
    setExpandedCollectionIds((prev) => {
      if (prev.has(id)) return new Set();
      return new Set([id]);
    });
  };

  const openAdd = (collectionId?: string) => {
    setAdding(true);
    setSelection(null);
    setSkuError("");
    setForm({
      ...emptyForm,
      sku: nextSku,
      categoryId: collectionId ?? collections[0]?.id ?? "matte-ash",
      pieceTypeId: pieceTypes[0]?.id ?? "bowls",
    });
    if (collectionId) {
      setExpandedCollectionIds((prev) => new Set(prev).add(collectionId));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-dim" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="admin-input w-full rounded-xl py-2.5 pl-10 pr-3.5 text-[13px]"
          />
        </div>
        <button
          type="button"
          onClick={() => openAdd()}
          className="admin-btn admin-btn-primary shrink-0 px-4 py-2.5"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add piece
        </button>
      </div>

      <div className="admin-segmented flex flex-wrap">
        {(["all", ...adminCatalogStatuses.map((s) => s.value)] as StatusFilter[]).map((value) => {
          const label =
            value === "all"
              ? "All"
              : adminCatalogStatuses.find((s) => s.value === value)?.label ?? value;
          const count =
            value === "all"
              ? catalogProducts.length
              : catalogProducts.filter((p) => p.status === value).length;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={[
                "admin-segmented-btn",
                statusFilter === value ? "admin-segmented-btn-active" : "",
              ].join(" ")}
            >
              {label} {count}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,22.5rem)_minmax(0,1fr)] xl:items-start">
        <div className="space-y-3">
          <ProductsInventoryPanel
            collections={collections}
            products={visibleProducts}
            expandedCollectionIds={expandedCollectionIds}
            selection={adding ? null : selection}
            onToggleCollection={toggleCollection}
            onSelectCollection={(id) => {
              setAdding(false);
              setSelection({ kind: "collection", id });
            }}
            onSelectProduct={(id) => {
              setAdding(false);
              setSelection({ kind: "product", id });
            }}
            onAddCollection={(name) => {
              const id = addCollection(name);
              if (id) {
                setExpandedCollectionIds((prev) => new Set(prev).add(id));
                setSelection({ kind: "collection", id });
              }
            }}
            onAddProductToCollection={(collectionId) => openAdd(collectionId)}
            statusLabel={productStatusLabel}
          />
          <PieceTypesPanel
            pieceTypes={pieceTypes}
            selectedId={pieceTypeEditorId}
            onSelect={setPieceTypeEditorId}
            onUpdate={updatePieceType}
            onAdd={(name) => {
              const id = addPieceType(name);
              if (id) setPieceTypeEditorId(id);
            }}
            onRemove={(id) => {
              removePieceType(id);
              if (pieceTypeEditorId === id) setPieceTypeEditorId(null);
            }}
          />
        </div>

        <section className="admin-panel admin-scroll p-3 sm:p-4 xl:sticky xl:top-0 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto">
          {adding ? (
            <ProductAddForm
              form={form}
              setForm={setForm}
              skuError={skuError}
              setSkuError={setSkuError}
              isSkuTaken={isSkuTaken}
              onCancel={() => setAdding(false)}
              onSubmit={addProduct}
            />
          ) : selectedCollection ? (
            <CollectionEditor
              collection={selectedCollection}
              productCount={
                catalogProducts.filter((product) => product.categoryId === selectedCollection.id)
                  .length
              }
              canRemove={collections.length > 1}
              onUpdate={(patch) => updateCollection(selectedCollection.id, patch)}
              onDelete={() => {
                removeCollection(selectedCollection.id);
                setSelection(null);
              }}
            />
          ) : selectedProduct ? (
            <ProductEditor
              product={selectedProduct}
              skuError={skuError}
              setSkuError={setSkuError}
              isSkuTaken={(sku) => isSkuTaken(sku, selectedProduct.id)}
              onUpdate={(patch) => updateProduct(selectedProduct.id, patch)}
              onUpdateDescription={(patch) => updateDescription(selectedProduct.id, patch)}
              onUpdateSpec={(key, patch) => updateSpec(selectedProduct.id, key, patch)}
              onDelete={() => removeProduct(selectedProduct.id)}
            />
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-admin-heading">Select a collection or piece</p>
              <p className="mt-1 max-w-xs text-sm text-admin-muted">
                Open a collection tile to see its pieces, or click the title to edit cover and
                names.
              </p>
              <button
                type="button"
                onClick={() => openAdd()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-admin-input px-4 py-2 text-sm text-admin-label hover:border-admin-accent"
              >
                <Plus className="h-4 w-4" />
                Add piece
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ProductAddForm({
  form,
  setForm,
  skuError,
  setSkuError,
  isSkuTaken,
  onCancel,
  onSubmit,
}: {
  form: typeof emptyForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  skuError: string;
  setSkuError: (value: string) => void;
  isSkuTaken: (sku: string) => boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const commitSku = () => {
    const sku = normalizeProductSku(form.sku);
    if (!sku) return;
    if (isSkuTaken(sku)) {
      setSkuError("This SKU is already used by another piece.");
      return;
    }
    setSkuError("");
    setForm((f) => ({ ...f, sku }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-admin-heading">New piece</h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-admin-muted hover:text-admin-label"
        >
          Cancel
        </button>
      </div>

      <Field label="SKU">
        <input
          value={form.sku}
          onChange={(e) => {
            setSkuError("");
            setForm((f) => ({ ...f, sku: e.target.value.toUpperCase() }));
          }}
          onBlur={commitSku}
          placeholder="PALI-007"
          className="admin-input w-full rounded-lg px-3.5 py-2.5 font-mono text-sm"
        />
        {skuError ? <p className="mt-1 text-xs text-admin-danger">{skuError}</p> : null}
      </Field>

      <Field label="Title">
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Morning Bowl — Matte Ash"
          className="admin-input w-full rounded-lg px-3.5 py-2.5 text-sm"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (PLN)">
          <input
            type="number"
            min={0}
            value={form.pricePln}
            onChange={(e) => setForm((f) => ({ ...f, pricePln: e.target.value }))}
            className="admin-input w-full rounded-lg px-3.5 py-2.5 text-sm"
          />
        </Field>
        <Field label="Stock">
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="admin-input w-full rounded-lg px-3.5 py-2.5 text-sm"
          />
        </Field>
      </div>

      <ProductCatalogFields
        categoryId={form.categoryId}
        pieceTypeId={form.pieceTypeId}
        onCategoryId={(id) => setForm((f) => ({ ...f, categoryId: id }))}
        onPieceTypeId={(id) => setForm((f) => ({ ...f, pieceTypeId: id }))}
      />

      <Field label="Status">
        <div className="flex flex-wrap gap-2">
          {adminCatalogStatuses.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, status: s.value }))}
              className={[
                "rounded-md border px-2.5 py-1.5 text-xs font-medium",
                form.status === s.value
                  ? "border-admin-accent bg-admin-accent-soft text-admin"
                  : "border-admin-input text-admin-muted",
              ].join(" ")}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Field>

      <BilingualField
        label="Description / Opis"
        en={form.descriptionEn}
        pl={form.descriptionPl}
        onEn={(value) => setForm((f) => ({ ...f, descriptionEn: value }))}
        onPl={(value) => setForm((f) => ({ ...f, descriptionPl: value }))}
        multiline
        rows={3}
      />

      <Field label="Photos">
        <ProductPhotoUpload
          photos={form.photos}
          onChange={(photos) => setForm((f) => ({ ...f, photos }))}
        />
      </Field>

      <button
        type="submit"
        disabled={!form.photos.length || !form.categoryId}
        className="admin-btn admin-btn-primary disabled:opacity-50"
      >
        Save piece
      </button>
    </form>
  );
}

function ProductEditor({
  product,
  skuError,
  setSkuError,
  isSkuTaken,
  onUpdate,
  onUpdateDescription,
  onUpdateSpec,
  onDelete,
}: {
  product: AdminProduct;
  skuError: string;
  setSkuError: (value: string) => void;
  isSkuTaken: (sku: string) => boolean;
  onUpdate: (patch: Partial<AdminProduct>) => void;
  onUpdateDescription: (patch: Partial<Bilingual>) => void;
  onUpdateSpec: (key: keyof AdminProductSpecs, patch: Partial<Bilingual>) => void;
  onDelete: () => void;
}) {
  const commitSku = (raw: string) => {
    const sku = normalizeProductSku(raw);
    if (!sku || sku === product.sku) return;
    if (isSkuTaken(sku)) {
      setSkuError("This SKU is already used by another piece.");
      return;
    }
    setSkuError("");
    onUpdate({ sku });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-admin-heading">Edit piece</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Remove this piece from the catalog?")) {
              onDelete();
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-admin-input px-3 py-1.5 text-xs text-admin-danger hover:border-red-400/40"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>

      <Field label="SKU">
        <input
          defaultValue={product.sku}
          key={product.sku}
          onBlur={(e) => commitSku(e.target.value)}
          onChange={() => setSkuError("")}
          className="admin-input w-full rounded-lg px-3.5 py-2.5 font-mono text-sm"
        />
        {skuError ? <p className="mt-1 text-xs text-admin-danger">{skuError}</p> : null}
      </Field>

      <Field label="Title">
        <input
          value={product.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="admin-input w-full rounded-lg px-3.5 py-2.5 text-sm"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Price (PLN)">
          <input
            type="number"
            min={0}
            value={product.pricePln}
            onChange={(e) => onUpdate({ pricePln: Number(e.target.value) })}
            className="admin-input w-full rounded-lg px-3 py-2 text-sm font-mono"
          />
        </Field>
        <Field label="Stock">
          <input
            type="number"
            min={0}
            value={product.stock}
            onChange={(e) => onUpdate({ stock: Math.max(0, Number(e.target.value) || 0) })}
            className="admin-input w-full rounded-lg px-3 py-2 text-sm font-mono"
          />
        </Field>
        <Field label="Status">
          <select
            value={product.status === "made-to-order" ? "sold" : product.status}
            onChange={(e) =>
              onUpdate({ status: e.target.value as AdminProduct["status"] })
            }
            className="admin-input w-full rounded-lg px-3 py-2 text-sm"
          >
            {adminCatalogStatuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <ProductCatalogFields
        categoryId={product.categoryId}
        pieceTypeId={product.pieceTypeId}
        onCategoryId={(id) => onUpdate({ categoryId: id })}
        onPieceTypeId={(id) => onUpdate({ pieceTypeId: id })}
      />

      <Field label="Photos">
        <ProductPhotoUpload
          photos={photosFromProduct(product)}
          onChange={(photos) => onUpdate(productPatchFromPhotos(photos))}
        />
      </Field>

      <BilingualField
        label="Description / Opis"
        en={product.description.en}
        pl={product.description.pl}
        onEn={(value) => onUpdateDescription({ en: value })}
        onPl={(value) => onUpdateDescription({ pl: value })}
        multiline
        rows={4}
      />

      <div className="space-y-4 rounded-lg border border-admin-input bg-admin-card-muted p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-admin-dim">
          Technical details
        </p>
        {SPEC_FIELDS.map(({ key, label }) => (
          <BilingualField
            key={key}
            label={label}
            en={product.specs[key].en}
            pl={product.specs[key].pl}
            onEn={(value) => onUpdateSpec(key, { en: value })}
            onPl={(value) => onUpdateSpec(key, { pl: value })}
          />
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-admin-label">{label}</span>
      {children}
    </label>
  );
}
