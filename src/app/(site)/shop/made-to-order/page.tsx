import { Suspense } from "react";
import { CustomOrderDetailView } from "@/components/shop/CustomOrderDetailView";

export default function MadeToOrderPage() {
  return (
    <Suspense fallback={<div className="shop-catalog-page min-h-[40vh] pt-24" />}>
      <CustomOrderDetailView />
    </Suspense>
  );
}
