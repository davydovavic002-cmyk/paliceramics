import type { GalleryItem } from "@/lib/galleryContent";
import { images } from "@/lib/images";

const extraPool = [
  images.accentBowl,
  images.heroPlate,
  images.accentTableware,
  images.whiteLavaCup,
  images.heroCeramics,
  images.heroVase,
];

export function getProductImages(item: Pick<GalleryItem, "image" | "images" | "id">): string[] {
  if (item.images?.length) {
    return item.images;
  }

  const seed = Number.parseInt(item.id, 10) || 0;
  const alternates = extraPool.filter((src) => src !== item.image);
  const pick = (offset: number) => alternates[(seed + offset) % alternates.length];

  return [item.image, pick(0), pick(1)].filter(
    (src, index, list) => list.indexOf(src) === index
  );
}
