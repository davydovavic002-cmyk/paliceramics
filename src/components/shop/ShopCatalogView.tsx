"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import { t } from "@/lib/galleryContent";
import {
  collectionToLookbook,
  getCollectionLabelFromList,
} from "@/lib/catalogConfig";
import { pickBilingual } from "@/lib/adminTypes";
import { madeToOrderCollection } from "@/lib/lookbookCollections";
import { sortProductsByCollectionName } from "@/lib/lookbookCollections";
import { MADE_TO_ORDER_CATEGORY_ID } from "@/lib/customOrderContent";
import { CatalogProductCard } from "./CatalogProductCard";
import { CustomOrderCatalogCard } from "./CustomOrderCatalogCard";
import { isOutOfStock, type ShopProduct } from "@/lib/shopCatalog";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import { useShopCatalogScrollRestore } from "@/hooks/useShopCatalogScrollRestore";
import { staggerStep } from "@/lib/motionUtils";

type SortKey = "collection" | "price-asc" | "price-desc" | "name";
type AvailabilityFilter = "all" | "available" | "sold";

const line = "border-[var(--lookbook-line)]";

function skuSortNumber(sku: string): number {
  const digits = sku.replace(/^PALI-?/i, "").replace(/\D/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

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
      return list.sort((a, b) => {
        const diff = skuSortNumber(a.sku) - skuSortNumber(b.sku);
        return diff !== 0 ? diff : a.sku.localeCompare(b.sku);
      });
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

function parseSort(value: string | null): SortKey {
  if (value === "price-asc" || value === "price-desc" || value === "name" || value === "collection") {
    return value;
  }
  return "collection";
}

function filterSectionIdForMode(
  mode: "none" | "collection" | "piece" | "availability"
): string | null {
  if (mode === "collection") return "collections";
  if (mode === "piece") return "pieceType";
  if (mode === "availability") return "availability";
  return null;
}

function ShopCatalogContent() {
  const { language } = useLanguage();
  const { products, collections, pieceTypes } = useShopCatalog();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const shopCollections = useMemo(
    () =>
      collections
        .filter((collection) => collection.id !== MADE_TO_ORDER_CATEGORY_ID)
        .map((collection) => collectionToLookbook(collection)),
    [collections]
  );
  const categoryParam = searchParams.get("category");
  const availabilityParam = searchParams.get("availability");
  const pieceParam = searchParams.get("piece");
  const activeCollectionId = categoryParam;
  const isMadeToOrderFilter = activeCollectionId === MADE_TO_ORDER_CATEGORY_ID;
  const activeProductCollectionId = isMadeToOrderFilter ? null : activeCollectionId;
  const activeAvailability = parseAvailability(availabilityParam);
  const pieceTypeIds = useMemo(() => pieceTypes.map((type) => type.id), [pieceTypes]);
  const activePieceType = parsePieceType(pieceParam, pieceTypeIds);
  const sort = parseSort(searchParams.get("sort"));

  const filterMode: "none" | "collection" | "piece" | "availability" =
    isMadeToOrderFilter || activeProductCollectionId
      ? "collection"
      : activePieceType
        ? "piece"
        : activeAvailability !== "all"
          ? "availability"
          : "none";

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const sectionId = filterSectionIdForMode(filterMode);
    return sectionId ? new Set([sectionId]) : new Set();
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useShopCatalogScrollRestore();

  useEffect(() => {
    const sectionId = filterSectionIdForMode(filterMode);
    if (!sectionId) return;
    setOpenSections(new Set([sectionId]));
  }, [filterMode]);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateShop = useCallback(
    (href: string) => {
      const current =
        searchParams.toString().length > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
      if (href === current) return;
      router.push(href, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (searchParams.get("view") !== "detail" || !isMadeToOrderFilter) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    params.delete("category");
    const qs = params.toString();
    router.replace(qs ? `/shop/made-to-order?${qs}` : "/shop/made-to-order", { scroll: false });
  }, [isMadeToOrderFilter, router, searchParams]);

  const buildShopHref = useCallback(
    (patch: {
      category?: string | null;
      availability?: AvailabilityFilter | null;
      piece?: string | null;
      sort?: SortKey | null;
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

      if (patch.sort === null || patch.sort === "collection") {
        params.delete("sort");
      } else if (patch.sort) {
        params.set("sort", patch.sort);
      }

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  useEffect(() => {
    const hasCategory = Boolean(categoryParam);
    const hasPiece = Boolean(pieceParam);
    const hasAvailability = availabilityParam === "available" || availabilityParam === "sold";
    const activeCount = [hasCategory, hasPiece, hasAvailability].filter(Boolean).length;
    if (activeCount <= 1) return;

    if (hasCategory) {
      navigateShop(buildShopHref({ category: categoryParam, piece: null, availability: null }));
      return;
    }
    if (hasPiece) {
      navigateShop(buildShopHref({ category: null, piece: pieceParam, availability: null }));
      return;
    }
    navigateShop(
      buildShopHref({
        category: null,
        piece: null,
        availability: availabilityParam as AvailabilityFilter,
      })
    );
  }, [availabilityParam, buildShopHref, categoryParam, navigateShop, pieceParam]);

  const selectCollection = useCallback(
    (id: string | null) => {
      const nextId = id !== null && id === activeCollectionId ? null : id;
      navigateShop(
        buildShopHref({
          category: nextId,
          piece: null,
          availability: null,
        })
      );
    },
    [activeCollectionId, buildShopHref, navigateShop]
  );

  const selectAvailability = useCallback(
    (filter: AvailabilityFilter) => {
      const next =
        filter === "all" || filter === activeAvailability
          ? null
          : filter;
      navigateShop(
        buildShopHref({
          category: null,
          piece: null,
          availability: next,
        })
      );
    },
    [activeAvailability, buildShopHref, navigateShop]
  );

  const selectPieceType = useCallback(
    (pieceType: string | null) => {
      const next = pieceType !== null && pieceType === activePieceType ? null : pieceType;
      navigateShop(
        buildShopHref({
          category: null,
          piece: next,
          availability: null,
        })
      );
    },
    [activePieceType, buildShopHref, navigateShop]
  );

  const selectSort = useCallback(
    (nextSort: SortKey) => {
      navigateShop(buildShopHref({ sort: nextSort }));
    },
    [buildShopHref, navigateShop]
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      if (prev.has(id)) return new Set();
      return new Set([id]);
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
          sortName: "Nr rosnąco",
          sortCollection: "Kolekcja",
          filters: "Filtry",
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
          sortName: "No. low to high",
          sortCollection: "Collection",
          filters: "Filters",
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
    if (isMadeToOrderFilter) return [];

    let next = products;

    if (filterMode === "collection" && activeProductCollectionId) {
      next = products.filter((product) => product.categoryId === activeProductCollectionId);
    } else if (filterMode === "piece" && activePieceType) {
      next = products.filter((product) => product.pieceTypeId === activePieceType);
    } else if (filterMode === "availability") {
      next = products.filter((product) => matchesAvailability(product, activeAvailability));
    }

    if (sort === "collection") {
      return sortProductsByCollectionName(next, language);
    }

    return sortProducts(next, sort, language);
  }, [
    products,
    activeProductCollectionId,
    isMadeToOrderFilter,
    activePieceType,
    activeAvailability,
    filterMode,
    sort,
    language,
  ]);

  const productGroups = useMemo(() => {
    if (isMadeToOrderFilter || !filtered.length) return [];

    return [
      {
        collectionId: activeProductCollectionId ?? "__all__",
        products: filtered,
        showHeading: false,
      },
    ];
  }, [filtered, isMadeToOrderFilter, activeProductCollectionId]);

  const showCustomOrderCard = isMadeToOrderFilter;

  const hasActiveFilters = filterMode !== "none";

  const activeCollectionLabel = useMemo(() => {
    if (filterMode !== "collection" || !activeCollectionId) return null;
    if (isMadeToOrderFilter) {
      return pickBilingual(madeToOrderCollection.name, madeToOrderCollection.name, language);
    }
    return getCollectionLabelFromList(collections, activeCollectionId, language);
  }, [activeCollectionId, collections, filterMode, isMadeToOrderFilter, language]);

  const sortLabels: Record<SortKey, string> = {
    collection: copy.sortCollection,
    "price-asc": copy.sortPriceAsc,
    "price-desc": copy.sortPriceDesc,
    name: copy.sortName,
  };

  const sortOptions: SortKey[] = ["collection", "price-asc", "price-desc", "name"];

  const clearAllFilters = () => {
    setOpenSections(new Set());
    navigateShop(pathname);
  };

  const productGridKey = `${filterMode}-${activeCollectionId ?? ""}-${activePieceType ?? ""}-${activeAvailability}-${sort}`;

  const productCountLabel = useMemo(() => {
    if (isMadeToOrderFilter) {
      return language === "pl" ? "1 produkt" : "1 product";
    }
    const count = filtered.length;
    const total = products.length;
    const unit =
      language === "pl"
        ? count === 1
          ? "produkt"
          : count >= 2 && count <= 4
            ? "produkty"
            : "produktów"
        : count === 1
          ? "product"
          : "products";
    if (hasActiveFilters || sort !== "collection") {
      return `${count} ${unit}`;
    }
    return `${count} ${copy.of} ${total} ${language === "pl" ? "produktów" : "products"}`;
  }, [
    copy.of,
    filtered.length,
    hasActiveFilters,
    isMadeToOrderFilter,
    language,
    products.length,
    sort,
  ]);

  return (
    <div className="shop-catalog-page min-h-[100dvh] pt-[var(--header-offset,5.5rem)] transition-colors duration-700">
      {showStickyBar ? (
        <div className="fixed inset-x-0 top-[var(--header-offset,5.5rem)] z-[55] border-b border-[var(--lookbook-line)] bg-[color-mix(in_srgb,#faf7f0_94%,transparent)] px-4 py-2 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="font-body text-[10px] uppercase tracking-[0.16em] lookbook-ink"
            >
              {copy.filters}
            </button>
            <p className="truncate font-body text-[11px] shop-catalog-muted">
              {productCountLabel}
            </p>
          </div>
        </div>
      ) : null}
      <BackToTopButton threshold={640} />
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
          className={`w-full shrink-0 border-b px-5 py-3 sm:px-8 lg:w-[240px] lg:border-b-0 lg:border-r lg:px-8 lg:py-8 xl:w-[260px] ${line}`}
        >
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((value) => !value)}
            className="lookbook-ink mb-1 flex w-full items-center justify-between rounded-md px-1 py-2 font-body text-[10px] uppercase tracking-[0.2em] lg:hidden"
            aria-expanded={mobileFiltersOpen}
          >
            {copy.filters}
            <ChevronDown
              className={[
                "h-4 w-4 shop-catalog-muted transition-transform",
                mobileFiltersOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          <div className={mobileFiltersOpen ? "block lg:block" : "hidden lg:block"}>
          <div className="mb-4 h-5">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-body text-[10px] uppercase tracking-[0.16em] shop-catalog-muted underline underline-offset-4 transition-opacity hover:opacity-75"
              >
                {copy.removeAll}
              </button>
            ) : null}
          </div>

          <FilterSection
            title={copy.collections}
            open={openSections.has("collections")}
            onToggle={() => toggleSection("collections")}
          >
            <FilterOption
              active={filterMode === "none"}
              onClick={() => selectCollection(null)}
              label={copy.allCollections}
              count={products.length}
            />
            {shopCollections.map((collection) => {
              const label = pickBilingual(collection.name, collection.name, language);
              const count = collectionCounts.get(collection.id) ?? 0;

              return (
                <FilterOption
                  key={collection.id}
                  active={filterMode === "collection" && activeCollectionId === collection.id}
                  onClick={() => selectCollection(collection.id)}
                  label={label}
                  count={count}
                />
              );
            })}
            <FilterOption
              active={filterMode === "collection" && isMadeToOrderFilter}
              onClick={() => selectCollection(MADE_TO_ORDER_CATEGORY_ID)}
              label={pickBilingual(
                madeToOrderCollection.name,
                madeToOrderCollection.name,
                language
              )}
              count={1}
            />
          </FilterSection>

          <FilterSection
            title={copy.pieceType}
            open={openSections.has("pieceType")}
            onToggle={() => toggleSection("pieceType")}
          >
            <FilterOption
              active={filterMode === "none"}
              onClick={() => selectPieceType(null)}
              label={copy.allPieceTypes}
              count={products.length}
            />
            {pieceTypes.map((pieceType) => (
              <FilterOption
                key={pieceType.id}
                active={filterMode === "piece" && activePieceType === pieceType.id}
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
              active={filterMode === "none"}
              onClick={() => selectAvailability("all")}
              label={copy.allAvailability}
              count={availabilityCounts.all}
            />
            <FilterOption
              active={filterMode === "availability" && activeAvailability === "available"}
              onClick={() => selectAvailability("available")}
              label={copy.available}
              count={availabilityCounts.available}
            />
            <FilterOption
              active={filterMode === "availability" && activeAvailability === "sold"}
              onClick={() => selectAvailability("sold")}
              label={copy.sold}
              count={availabilityCounts.sold}
            />
          </FilterSection>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-sm shop-catalog-muted">{productCountLabel}</p>
            <label className="flex items-center gap-2 font-body text-sm shop-catalog-muted">
                <span className="text-[10px] uppercase tracking-[0.16em]">{copy.sortBy}</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => selectSort(e.target.value as SortKey)}
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

          {productGroups.length === 0 && !showCustomOrderCard ? (
            <p className="py-16 text-center font-body text-sm shop-catalog-muted">{copy.empty}</p>
          ) : (
            <div className="space-y-10 sm:space-y-12">
              {productGroups.map((group) => {
                const collectionLabel = getCollectionLabelFromList(
                  collections,
                  group.collectionId,
                  language
                );

                return (
                  <section key={`${productGridKey}-${group.collectionId}`}>
                    {group.showHeading ? (
                      <header className={`mb-5 border-b pb-3 ${line}`}>
                        <h2 className="lookbook-ink font-display text-[clamp(1.05rem,2vw,1.35rem)] leading-snug tracking-[0.02em]">
                          {collectionLabel}
                        </h2>
                      </header>
                    ) : null}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 md:gap-x-5 xl:grid-cols-5 xl:gap-x-6">
                      {group.products.map((product, index) => (
                        <MotionReveal
                          key={`${productGridKey}-${product.sku}`}
                          delay={staggerStep(index)}
                          y={14}
                        >
                          <CatalogProductCard
                            product={product}
                            title={t(product.name, language)}
                            variant="shop"
                          />
                        </MotionReveal>
                      ))}
                    </div>
                  </section>
                );
              })}
              {showCustomOrderCard ? (
                <section>
                  <header className={`mb-5 border-b pb-3 ${line}`}>
                    <h2 className="lookbook-ink font-display text-[clamp(1.05rem,2vw,1.35rem)] leading-snug tracking-[0.02em]">
                      {pickBilingual(
                        madeToOrderCollection.name,
                        madeToOrderCollection.name,
                        language
                      )}
                    </h2>
                  </header>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 xl:grid-cols-5 xl:gap-x-6">
                    <MotionReveal key="custom-order" delay={0} y={14}>
                      <CustomOrderCatalogCard />
                    </MotionReveal>
                  </div>
                </section>
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
        <div className="shop-catalog-page flex min-h-[calc(100dvh-var(--header-offset,5.5rem))] items-center justify-center pt-[var(--header-offset,5.5rem)]">
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
        className="lookbook-ink flex w-full items-center justify-between rounded-md px-1 py-1 font-body text-[10px] uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lookbook-ink)] focus-visible:ring-offset-2"
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
        "flex w-full items-center justify-between rounded-md px-2 py-2 text-left font-body text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lookbook-ink)] focus-visible:ring-offset-2",
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
