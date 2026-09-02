export function CatalogCardSkeleton() {
  return (
    <div className="shop-catalog-skeleton animate-pulse" aria-hidden>
      <div className="shop-card-image aspect-[4/5] w-full rounded-sm bg-[color-mix(in_srgb,var(--lookbook-ink)_8%,var(--lookbook-bg))] sm:aspect-square" />
      <div className="mt-2 space-y-2 pt-2">
        <div className="h-2.5 w-2/3 rounded-full bg-[color-mix(in_srgb,var(--lookbook-ink)_10%,var(--lookbook-bg))]" />
        <div className="h-2.5 w-1/2 rounded-full bg-[color-mix(in_srgb,var(--lookbook-ink)_7%,var(--lookbook-bg))]" />
        <div className="h-3 w-1/3 rounded-full bg-[color-mix(in_srgb,var(--lookbook-ink)_6%,var(--lookbook-bg))]" />
      </div>
    </div>
  );
}

export function CatalogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 md:gap-x-5 xl:grid-cols-5 xl:gap-x-6"
      aria-busy="true"
      aria-label="Loading catalog"
    >
      {Array.from({ length: count }, (_, index) => (
        <CatalogCardSkeleton key={index} />
      ))}
    </div>
  );
}
