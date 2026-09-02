import dynamic from "next/dynamic";

const ShopCatalogView = dynamic(
  () => import("@/components/shop/ShopCatalogView").then((m) => m.ShopCatalogView),
  {
    loading: () => (
      <div className="lookbook-section min-h-[70vh] animate-pulse bg-[var(--lookbook-bg,#faf7f0)]" aria-hidden />
    ),
  }
);

export default function ShopPage() {
  return <ShopCatalogView />;
}
