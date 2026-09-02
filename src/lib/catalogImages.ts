import { resolvePublicImageUrl } from "@/lib/productImages";

/** Prefer pre-generated WebP assets under public/images for faster catalog loads. */
export function preferOptimizedImage(src: string): string {
  if (!src.startsWith("/images/")) return src;
  if (/\.(avif|webp)$/i.test(src)) return src;
  if (/\.(png|jpe?g)$/i.test(src)) {
    return src.replace(/\.(png|jpe?g)$/i, ".webp");
  }
  return src;
}

export function optimizeCatalogImages(urls: string[]): string[] {
  const optimized: string[] = [];

  for (const url of urls) {
    if (url.startsWith("data:")) continue;
    if (url.startsWith("/uploads/")) {
      optimized.push(url);
      continue;
    }
    const resolved = resolvePublicImageUrl(url);
    if (!resolved) continue;
    optimized.push(preferOptimizedImage(resolved));
  }

  return optimized;
}

export function resolveCatalogImageUrls(
  storedUrls: string[],
  seedUrls: string[]
): string[] {
  const hasDataUrls = storedUrls.some((url) => url.startsWith("data:"));
  if (hasDataUrls && seedUrls.length) {
    return optimizeCatalogImages(seedUrls);
  }

  const fromStored = optimizeCatalogImages(storedUrls);
  if (fromStored.length) return fromStored;
  return optimizeCatalogImages(seedUrls);
}
