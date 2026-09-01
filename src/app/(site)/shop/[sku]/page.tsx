import { Suspense } from "react";
import { ProductDetailView } from "@/components/shop/ProductDetailView";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  return (
    <Suspense fallback={<div className="shop-catalog-page min-h-[40vh] pt-24" />}>
      <ProductDetailView sku={decodeURIComponent(sku)} />
    </Suspense>
  );
}
