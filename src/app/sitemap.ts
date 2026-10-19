import type { MetadataRoute } from "next";
import { readContent } from "@/lib/contentStore";
import { siteOrigin } from "@/lib/siteOrigin";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  const stored = await readContent();
  const modified = stored?.updatedAt ? new Date(stored.updatedAt) : new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, lastModified: modified, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/shop`, lastModified: modified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}/shop/made-to-order`, lastModified: modified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/regulamin`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${origin}/regulamin-warsztatow`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${origin}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const products = Array.isArray(stored?.data?.products)
    ? (stored.data.products as Array<{ sku?: string }>)
    : [];
  for (const product of products) {
    if (!product.sku) continue;
    pages.push({
      url: `${origin}/shop/${encodeURIComponent(product.sku)}`,
      lastModified: modified,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }
  return pages;
}
