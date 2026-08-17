import { ProductDetailView } from "@/components/shop/ProductDetailView";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  return <ProductDetailView sku={decodeURIComponent(sku)} />;
}
