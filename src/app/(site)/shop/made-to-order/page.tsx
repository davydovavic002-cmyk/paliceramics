import { Suspense } from "react";
import { CustomOrderDetailView } from "@/components/shop/CustomOrderDetailView";

export default function MadeToOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="shop-catalog-page shop-made-to-order-page min-h-0 overflow-x-clip pb-10 pt-[var(--header-offset,5.5rem)]">
          <div className="mx-auto max-w-[1024px] px-4 sm:px-6">
            <div className="mb-3 h-11 border-b border-[var(--lookbook-line)] sm:hidden" aria-hidden />
            <div className="delivery-faq-panel shop-product-sheet mt-4 min-h-[min(72vh,520px)] animate-pulse rounded-2xl sm:mt-6 sm:rounded-[1.75rem]" />
          </div>
        </div>
      }
    >
      <CustomOrderDetailView />
    </Suspense>
  );
}
