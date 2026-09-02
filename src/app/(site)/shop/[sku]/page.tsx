import { Suspense } from "react";
import { ProductDetailView } from "@/components/shop/ProductDetailView";

function ProductDetailSkeleton() {
  return (
    <div className="shop-catalog-page shop-product-page min-h-0 pb-10 pt-[var(--header-offset,5.5rem)] sm:pb-14">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-8">
        <div className="delivery-faq-panel shop-product-sheet relative mt-4 rounded-2xl sm:mt-6 sm:rounded-[1.75rem]">
          <div className="shop-product-sheet-inner grid rounded-2xl sm:rounded-[1.75rem] lg:grid-cols-2">
            <div className="shop-product-gallery-zone p-5">
              <div className="shop-product-gallery-well aspect-square w-full animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--lookbook-ink)_6%,var(--lookbook-bg))]" />
            </div>
            <div className="shop-product-info-zone px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <div className="h-3 w-24 animate-pulse rounded bg-[color-mix(in_srgb,var(--lookbook-ink)_8%,var(--lookbook-bg))]" />
              <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-[color-mix(in_srgb,var(--lookbook-ink)_8%,var(--lookbook-bg))]" />
              <div className="mt-6 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--lookbook-ink)_6%,var(--lookbook-bg))]" />
                <div className="h-3 w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--lookbook-ink)_6%,var(--lookbook-bg))]" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-[color-mix(in_srgb,var(--lookbook-ink)_6%,var(--lookbook-bg))]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailView sku={decodeURIComponent(sku)} />
    </Suspense>
  );
}
