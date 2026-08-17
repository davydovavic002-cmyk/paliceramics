"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import { t } from "@/lib/galleryContent";
import {
  collectionToLookbook,
  getCollectionLabelFromList,
  getPieceTypeLabelFromList,
} from "@/lib/catalogConfig";
import { pickBilingual } from "@/lib/adminTypes";
import { sortProductsByCollectionName } from "@/lib/lookbookCollections";
import { MADE_TO_ORDER_CATEGORY_ID } from "@/lib/customOrderContent";
import { CatalogProductCard } from "./CatalogProductCard";
import { CustomOrderCatalogCard } from "./CustomOrderCatalogCard";
import { isOutOfStock, type ShopProduct } from "@/lib/shopCatalog";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { staggerStep } from "@/lib/motionUtils";

type SortKey = "collection" | "price-asc" | "price-desc" | "name";
type AvailabilityFilter = "all" | "available" | "sold";

const line = "border-[var(--lookbook-line)]";

function matchesAvailability(product: ShopProduct, filter: AvailabilityFilter): boolean {
  if (filter === "all") return true;

  const out = isOutOfStock(product);
  if (filter === "available") return product.status === "available" && !out;
  if (filter === "sold") return product.status === "sold" || out;
  return true;
}

function sortProducts(
  products: ShopProduct[],
  sort: SortKey,
  language: "en" | "pl"
) {
  const list = [...products];
  switch (sort) {
    case "collection":
      return sortProductsByCollectionName(list, language);
    case "price-asc":
      return list.sort((a, b) => a.pricePln - b.pricePln);
    case "price-desc":
      return list.sort((a, b) => b.pricePln - a.pricePln);
    case "name":
      return list.sort((a, b) =>
        t(a.name, language).localeCompare(t(b.name, language), language)
      );
    default:
      return list;
  }
}

function parseAvailability(value: string | null): AvailabilityFilter {
  if (value === "available" || value === "sold") {
    return value;
  }
  return "all";
}

function parsePieceType(value: string | null, validIds: string[]): string | null {
  if (!value) return null;
  return validIds.includes(value) ? value : null;
}

function ShopCatalogContent() {
  const { language } = useLanguage();
  const { products, collections, pieceTypes, ready } = useShopCatalog();
  const router = useRouter();
  const searchParams = useSearchParams();

  const shopCollections = useMemo(
    () => collections.map((collection) => collectionToLookbook(collection)),
    [collections]
  );
  const categoryParam = searchParams.get("category");
  const availabilityParam = searchParams.get("availability");
  const pieceParam = searchParams.get("piece");
  const activeCollectionId =
    categoryParam && categoryParam !== MADE_TO_ORDER_CATEGORY_ID ? categoryParam : null;
  const activeAvailability = parseAvailability(availabilityParam);
  const pieceTypeIds = useMemo(() => pieceTypes.map((type) => type.id), [pieceTypes]);
  const activePieceType = parsePieceType(pieceParam, pieceTypeIds);

  const [sort, setSort] = useState<SortKey>("name");
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["collections"])
  );

  const navigateShop = useCallback(
    (href: string) => {
      router.replace(href, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    if (categoryParam === MADE_TO_ORDER_CATEGORY_ID) {
      router.replace("/shop");
    }
  }, [categoryParam, router]);

  useEffect(() => {
    if (searchParams.get("view") === "detail" && categoryParam === MADE_TO_ORDER_CATEGORY_ID) {
      router.replace("/shop/made-to-order");
    }
  }, [categoryParam, router, searchParams]);

  const buildShopHref = useCallback(
    (patch: {
      category?: string | null;
      availability?: AvailabilityFilter | null;
      piece?: string | null;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (patch.category === null) {
        params.delete("category");
        params.delete("view");
      } else if (patch.category) {
        params.set("category", patch.category);
        params.delete("view");
      }

      if (patch.availability === null || patch.availability === "all") {
        params.delete("availability");
      } else if (patch.availability) {
        params.set("availability", patch.availability);
      }

      if (patch.piece === null) {
        params.delete("piece");
      } else if (patch.piece) {
        params.set("piece", patch.piece);
      }

      const qs = params.toString();
      return qs ? `/shop?${qs}` : "/shop";
    },
    [searchParams]
  );

  const selectCollection = useCallback(
    (id: string | null) => {
      if (id) navigateShop(buildShopHref({ category: id }));
      else navigateShop(buildShopHref({ category: null }));
    },
    [buildShopHref, navigateShop]
  );

  const selectAvailability = useCallback(
    (filter: AvailabilityFilter) => {
      navigateShop(buildShopHref({ availability: filter === "all" ? null : filter }));
    },
    [buildShopHref, navigateShop]
  );

  const selectPieceType = useCallback(
    (pieceType: string | null) => {
      navigateShop(buildShopHref({ piece: pieceType }));
    },
    [buildShopHref, navigateShop]
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copy =
    language === "pl"
      ? {
          home: "Strona główna",
          products: "Produkty",
          removeAll: "Wyczyść filtry",
          collections: "Kolekcje",
          pieceType: "Rodzaj ceramiki",
          availability: "Dostępność",
          allCollections: "Wszystkie",
          allPieceTypes: "Wszystkie",
          allAvailability: "Wszystkie",
          available: "Dostępne",
          sold: "Wyprzedane",
          sortBy: "Sortuj:",
          sortPriceAsc: "Cena rosnąco",
          sortPriceDesc: "Cena malejąco",
          sortName: "Nazwa A–Z",
          of: "z",
          productsLabel: "produktów",
          empty: "Brak prac w tej kolekcji.",
        }
      : {
          home: "Home",
          products: "Products",
          removeAll: "Remove all",
          collections: "Collections",
          pieceType: "Ceramic type",
          availability: "Availability",
          allCollections: "All",
          allPieceTypes: "All",
          allAvailability: "All",
          available: "Available",
          sold: "Sold out",
          sortBy: "Sort by:",
          sortPriceAsc: "Price: low to high",
          sortPriceDesc: "Price: high to low",
          sortName: "Name A–Z",
          of: "of",
          productsLabel: "products",
          empty: "No pieces in this collection.",
        };

  const collectionCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of products) {
      map.set(product.categoryId, (map.get(product.categoryId) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const availabilityCounts = useMemo(() => {
    let available = 0;
    let sold = 0;

    for (const product of products) {
      if (matchesAvailability(product, "available")) available += 1;
      if (matchesAvailability(product, "sold")) sold += 1;
    }

    return { all: products.length, available, sold };
  }, [products]);

  const pieceTypeCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of products) {
      map.set(product.pieceTypeId, (map.get(product.pieceTypeId) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    let next = activeCollectionId
      ? products.filter((product) => product.categoryId === activeCollectionId)
      : products;

    if (activePieceType) {
      next = next.filter((product) => product.pieceTypeId === activePieceType);
    }

    if (activeAvailability !== "all") {
      next = next.filter((product) => matchesAvailability(product, activeAvailability));
    }

    return sortProducts(next, sort, language);
  }, [products, activeCollectionId, activePieceType, activeAvailability, sort, language]);

  const showCustomOrderCard =
    !activeCollectionId && !activePieceType && activeAvailability === "all";

  const hasActiveFilters =
    Boolean(activeCollectionId) ||
    activeAvailability !== "all" ||
    Boolean(activePieceType);

  const activeCollectionLabel = useMemo(() => {
    if (!activeCollectionId) return null;
    return getCollectionLabelFromList(collections, activeCollectionId, language);
  }, [activeCollectionId, collections, language]);

  const activeAvailabilityLabel = useMemo(() => {
    if (activeAvailability === "all") return null;
    const labels: Record<Exclude<AvailabilityFilter, "all">, string> = {
      available: copy.available,
      sold: copy.sold,
    };
    return labels[activeAvailability];
  }, [activeAvailability, copy.available, copy.sold]);

  const activePieceTypeLabel = useMemo(() => {
    if (!activePieceType) return null;
    return getPieceTypeLabelFromList(pieceTypes, activePieceType, language);
  }, [activePieceType, language, pieceTypes]);

  const sortLabels: Record<Exclude<SortKey, "collection">, string> = {
    "price-asc": copy.sortPriceAsc,
    "price-desc": copy.sortPriceDesc,
    name: copy.sortName,
  };

  const sortOptions: Exclude<SortKey, "collection">[] = ["price-asc", "price-desc", "name"];

  const clearAllFilters = () => {
    navigateShop("/shop");
  };

  return (
    <div className="shop-catalog-page min-h-[100dvh] pt-[var(--header-offset,5.5rem)] transition-colors duration-700">
      <div className={`border-b ${line} px-5 py-3 sm:px-8 lg:px-10`}>
        <nav className="font-body text-[10px] uppercase tracking-[0.18em] shop-catalog-muted">
          <Link href="/" className="transition-opacity hover:opacity-75">
            {copy.home}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="lookbook-ink">{copy.products}</span>
          {activeCollectionLabel ? (
            <>
              <span className="mx-2 opacity-40">/</span>
              <span className="lookbook-ink">{activeCollectionLabel}</span>
            </>
          ) : null}
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row">
        <aside
          className={`w-full shrink-0 border-b px-5 py-5 sm:px-8 lg:w-[240px] lg:border-b-0 lg:border-r lg:px-8 lg:py-8 xl:w-[260px] ${line}`}
        >
          {hasActiveFilters ? (
            <div className="mb-5">
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-body text-[10px] uppercase tracking-[0.16em] shop-catalog-muted underline underline-offset-4 transition-opacity hover:opacity-75"
              >
                {copy.removeAll}
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeCollectionLabel ? (
                  <span className="lookbook-ink rounded-full border border-[var(--lookbook-line)] px-3 py-1 font-body text-[10px]">
                    {activeCollectionLabel}
                  </span>
                ) : null}
                {activeAvailabilityLabel ? (
                  <span className="lookbook-ink rounded-full border border-[var(--lookbook-line)] px-3 py-1 font-body text-[10px]">
                    {activeAvailabilityLabel}
                  </span>
                ) : null}
                {activePieceTypeLabel ? (
                  <span className="lookbook-ink rounded-full border border-[var(--lookbook-line)] px-3 py-1 font-body text-[10px]">
                    {activePieceTypeLabel}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          <FilterSection
            title={copy.collections}
            open={openSections.has("collections")}
            onToggle={() => toggleSection("collections")}
          >
            <FilterOption
              active={!activeCollectionId}
              onClick={() => selectCollection(null)}
              label={copy.allCollections}
              count={products.length + (showCustomOrderCard ? 1 : 0)}
            />
            {shopCollections.map((collection) => {
              const label = pickBilingual(collection.name, collection.name, language);
              const count = collectionCounts.get(collection.id) ?? 0;
              const active = activeCollectionId === collection.id;

              return (
                <FilterOption
                  key={collection.id}
                  active={active}
                  onClick={() => selectCollection(collection.id)}
                  label={label}
                  count={count}
                />
              );
            })}
          </FilterSection>

          <FilterSection
            title={copy.pieceType}
            open={openSections.has("pieceType")}
            onToggle={() => toggleSection("pieceType")}
          >
            <FilterOption
              active={!activePieceType}
              onClick={() => selectPieceType(null)}
              label={copy.allPieceTypes}
              count={products.length}
            />
            {pieceTypes.map((pieceType) => (
              <FilterOption
                key={pieceType.id}
                active={activePieceType === pieceType.id}
                onClick={() => selectPieceType(pieceType.id)}
                label={pickBilingual(pieceType.name, pieceType.name, language)}
                count={pieceTypeCounts.get(pieceType.id) ?? 0}
              />
            ))}
          </FilterSection>

          <FilterSection
            title={copy.availability}
            open={openSections.has("availability")}
            onToggle={() => toggleSection("availability")}
          >
            <FilterOption
              active={activeAvailability === "all"}
              onClick={() => selectAvailability("all")}
              label={copy.allAvailability}
              count={availabilityCounts.all}
            />
            <FilterOption
              active={activeAvailability === "available"}
              onClick={() => selectAvailability("available")}
              label={copy.available}
              count={availabilityCounts.available}
            />
            <FilterOption
              active={activeAvailability === "sold"}
              onClick={() => selectAvailability("sold")}
              label={copy.sold}
              count={availabilityCounts.sold}
            />
          </FilterSection>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-sm shop-catalog-muted">
              {activeCollectionId || activeAvailability !== "all" || activePieceType
                ? `${filtered.length} ${copy.productsLabel}`
                : `${filtered.length + (showCustomOrderCard ? 1 : 0)} ${copy.of} ${products.length + 1} ${copy.productsLabel}`}
            </p>
            <label className="flex items-center gap-2 font-body text-sm shop-catalog-muted">
                <span className="text-[10px] uppercase tracking-[0.16em]">{copy.sortBy}</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className={`lookbook-ink appearance-none rounded-full border bg-[color-mix(in_srgb,var(--lookbook-bg-well)_75%,transparent)] py-2 pl-4 pr-9 font-body text-sm outline-none ${line}`}
                  >
                    {sortOptions.map((key) => (
                      <option key={key} value={key}>
                        {sortLabels[key]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 shop-catalog-muted" />
                </div>
              </label>
          </div>

          {!ready ? (
            <p className="py-20 text-center font-body text-sm shop-catalog-muted">…</p>
          ) : filtered.length === 0 && !showCustomOrderCard ? (
            <p className="py-16 text-center font-body text-sm shop-catalog-muted">{copy.empty}</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:gap-x-8">
              {filtered.map((product, index) => (
                <MotionReveal key={product.sku} delay={staggerStep(index)} y={14}>
                  <CatalogProductCard
                    product={product}
                    title={t(product.name, language)}
                    categoryLabel={getCollectionLabelFromList(
                      collections,
                      product.categoryId,
                      language
                    )}
                    variant="shop"
                  />
                </MotionReveal>
              ))}
              {showCustomOrderCard ? (
                <MotionReveal
                  key="custom-order"
                  delay={staggerStep(filtered.length)}
                  y={14}
                >
                  <CustomOrderCatalogCard />
                </MotionReveal>
              ) : null}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function ShopCatalogView() {
  return (
    <Suspense
      fallback={
        <div className="shop-catalog-page flex min-h-[50vh] items-center justify-center pt-28">
          <p className="font-body text-sm shop-catalog-muted">…</p>
        </div>
      }
    >
      <ShopCatalogContent />
    </Suspense>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`border-b py-4 last:border-b-0 ${line}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="lookbook-ink flex w-full items-center justify-between font-body text-[10px] uppercase tracking-[0.2em]"
      >
        {title}
        <ChevronDown
          className={["h-4 w-4 shop-catalog-muted transition-transform", open ? "rotate-180" : ""].join(
            " "
          )}
        />
      </button>
      {open ? <div className="mt-3 space-y-1">{children}</div> : null}
    </div>
  );
}

function FilterOption({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-md px-2 py-2 text-left font-body text-sm transition-colors",
        active
          ? "lookbook-ink bg-[color-mix(in_srgb,var(--lookbook-ink)_10%,var(--lookbook-bg))]"
          : "shop-catalog-muted hover:text-[var(--lookbook-ink)]",
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="text-xs opacity-70">({count})</span>
    </button>
  );
}
