import { images } from "@/lib/images";

/** Legacy paths removed during asset cleanup → current public files. */
const LEGACY_PUBLIC_IMAGE_ALIASES: Record<string, string> = {
  "/images/accent-bowl.png": images.accentBowl,
  "/images/accent-tableware.png": images.accentTableware,
  "/images/hero-vase.png": images.heroVase,
  "/images/white-lava-cup.png": images.whiteLavaCup,
  "/images/hero/white-lava-cup.png": images.whiteLavaCup,
  "/images/cutout/accent-bowl.png": images.accentBowl,
  "/images/cutout/accent-tableware.png": images.accentTableware,
  "/images/cutout/hero-vase.png": images.heroVase,
  "/images/cutout/hero-plate.png": images.heroPlate,
};

/** Files that still ship under public/images (Sep 2026). */
const KNOWN_PUBLIC_IMAGES = new Set<string>([
  ...Object.values(images),
  ...Object.values(LEGACY_PUBLIC_IMAGE_ALIASES),
  "/images/about/palina-glaze.png",
  "/images/about/palina-japan.png",
  "/images/about/palina-studio.png",
  "/images/about/palina-wheel.png",
  "/images/workshops/cup-silhouette.png",
  "/images/cutout/hero-plate.png",
  "/images/strokes/stroke-0.png",
  "/images/strokes/stroke-1.png",
  "/images/strokes/stroke-2.png",
  "/images/strokes/stroke-3.png",
  "/images/vouchers/templates/workshop-once-template.png",
  "/images/vouchers/templates/pottery-course-template.png",
]);

/** Public assets shipped with the site — no ad-hoc placeholder swatches. */
export function isProjectProductImage(src: string | undefined | null): src is string {
  return Boolean(src?.startsWith("/images/"));
}

/** Remap deleted /images paths and drop URLs that no longer exist in public/. */
export function resolvePublicImageUrl(src: string | undefined | null): string | undefined {
  if (!src?.trim()) return undefined;

  const trimmed = src.trim();
  const remapped = LEGACY_PUBLIC_IMAGE_ALIASES[trimmed] ?? trimmed;

  if (remapped.startsWith("data:")) return remapped;
  if (remapped.startsWith("/uploads/")) return remapped;
  if (!remapped.startsWith("/images/")) return undefined;

  return KNOWN_PUBLIC_IMAGES.has(remapped) ? remapped : undefined;
}

export function filterProjectImages(urls: string[]): string[] {
  return urls
    .map((url) => resolvePublicImageUrl(url))
    .filter((url): url is string => Boolean(url));
}
