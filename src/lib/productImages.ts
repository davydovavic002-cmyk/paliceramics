import { images } from "@/lib/images";
import { preferOptimizedImage } from "@/lib/catalogImages";

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
  "/images/hero/ceramics-collage-cutout.png": images.heroPlate,
  "/images/hero/ceramics-cluster.png": images.heroVase,
  "/images/hero/ceramics-collage.png": images.accentTableware,
  "/images/workshops/bowl-outline.png": images.accentBowl,
  "/images/workshops/cups-pair.png": images.whiteLavaCup,
  "/images/about/palina-glaze.png": "/images/about/palina-glaze.webp",
  "/images/about/palina-japan.png": "/images/about/palina-japan.webp",
  "/images/about/palina-studio.png": "/images/about/palina-studio.webp",
  "/images/about/palina-wheel.png": "/images/about/palina-wheel.webp",
};

const BASE_KNOWN_PUBLIC_IMAGES = [
  ...Object.values(images),
  ...Object.values(LEGACY_PUBLIC_IMAGE_ALIASES),
  "/images/about/palina-glaze.webp",
  "/images/about/palina-japan.webp",
  "/images/about/palina-studio.webp",
  "/images/about/palina-wheel.webp",
  "/images/workshops/cup-silhouette.webp",
  "/images/cutout/hero-plate.webp",
  "/images/strokes/stroke-0.webp",
  "/images/strokes/stroke-1.webp",
  "/images/strokes/stroke-2.webp",
  "/images/strokes/stroke-3.webp",
  "/images/vouchers/templates/workshop-once-template.png",
  "/images/vouchers/templates/pottery-course-template.png",
];

/** Public assets shipped with the site — PNG and WebP variants. */
const KNOWN_PUBLIC_IMAGES = new Set<string>(
  BASE_KNOWN_PUBLIC_IMAGES.flatMap((src) => {
    const entries = [src];
    if (src.endsWith(".webp")) {
      entries.push(src.replace(/\.webp$/i, ".png"));
    } else if (src.endsWith(".png")) {
      entries.push(src.replace(/\.png$/i, ".webp"));
    }
    return entries;
  })
);

function isKnownPublicImage(src: string): boolean {
  return KNOWN_PUBLIC_IMAGES.has(src);
}

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

  const optimized = preferOptimizedImage(remapped);
  if (isKnownPublicImage(optimized) || isKnownPublicImage(remapped)) {
    return isKnownPublicImage(optimized) ? optimized : preferOptimizedImage(remapped);
  }

  return undefined;
}

export function filterProjectImages(urls: string[]): string[] {
  return urls
    .map((url) => resolvePublicImageUrl(url))
    .filter((url): url is string => Boolean(url));
}
