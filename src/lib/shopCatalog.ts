import type { AdminCollection, AdminPersistedData, AdminProduct } from "@/lib/adminTypes";
import {
  defaultProductDescription,
  loadAdminData,
  pickBilingual,
  seedAdminData,
} from "@/lib/adminTypes";
import {
  galleryItems,
  type GalleryItem,
  type ItemStatus,
} from "@/lib/galleryContent";
import { getProductImages } from "@/lib/productGallery";
import { getProductPieceTypeId } from "@/lib/lookbookCollections";
import { productPhotos } from "@/lib/adminTypes";
import type { ProductPieceTypeId } from "@/lib/lookbookCollections";
import { images } from "@/lib/images";

export type ShopCatalogFilter = "all" | "in-stock" | string;

export type ShopProduct = {
  id: string;
  sku: string;
  name: { en: string; pl: string };
  categoryId: string;
  pieceTypeId: string;
  status: ItemStatus;
  stock: number;
  pricePln: number;
  image: string;
  images: string[];
  description: { en: string; pl: string };
  lookbookSpan: string;
  specs: GalleryItem["specs"];
};

const imageByFilename: Record<string, string> = {
  "accent-bowl.png": images.accentBowl,
  "hero-plate.png": images.heroPlate,
  "accent-tableware.png": images.accentTableware,
};

const defaultSpecs: GalleryItem["specs"] = {
  clayBody: { en: "Stoneware", pl: "Kamionina" },
  glaze: { en: "Matte glaze", pl: "Matowe szkliwo" },
  firing: { en: "Cone 10 · 1,285°C", pl: "Cone 10 · 1 285°C" },
  dimensions: { en: "—", pl: "—" },
};

const galleryBySku = new Map(galleryItems.map((item) => [item.sku, item]));
const galleryById = new Map(galleryItems.map((item) => [item.id, item]));

export function buildShopCatalog(
  products: AdminProduct[],
  _collections: AdminCollection[]
): ShopProduct[] {
  return products
    .filter((product) => product.status !== "made-to-order")
    .map((product) => {
      const gallery = galleryBySku.get(product.sku) ?? galleryById.get(product.id);
      const uploadedPhotos = productPhotos(product);
      const image =
        uploadedPhotos[0] ??
        gallery?.image ??
        imageByFilename[product.imageLabel] ??
        images.accentBowl;
      const galleryImages = uploadedPhotos.length
        ? uploadedPhotos
        : gallery
          ? getProductImages(gallery)
          : [image];
      const description = {
        en: pickBilingual(
          product.description,
          gallery?.description ?? defaultProductDescription,
          "en"
        ),
        pl: pickBilingual(
          product.description,
          gallery?.description ?? defaultProductDescription,
          "pl"
        ),
      };

      const gallerySpecs = gallery?.specs ?? defaultSpecs;

      return {
        id: product.id,
        sku: product.sku,
        name: gallery?.name ?? { en: product.title, pl: product.title },
        categoryId: product.categoryId,
        pieceTypeId: product.pieceTypeId ?? getProductPieceTypeId(product.id),
        status: product.status,
        stock: product.stock,
        pricePln: product.pricePln,
        image,
        images: galleryImages,
        description,
        lookbookSpan: gallery?.lookbookSpan ?? "col-span-1 row-span-1",
        specs: {
          clayBody: {
            en: pickBilingual(product.specs.clayBody, gallerySpecs.clayBody, "en"),
            pl: pickBilingual(product.specs.clayBody, gallerySpecs.clayBody, "pl"),
          },
          glaze: {
            en: pickBilingual(product.specs.glaze, gallerySpecs.glaze, "en"),
            pl: pickBilingual(product.specs.glaze, gallerySpecs.glaze, "pl"),
          },
          firing: {
            en: pickBilingual(product.specs.firing, gallerySpecs.firing, "en"),
            pl: pickBilingual(product.specs.firing, gallerySpecs.firing, "pl"),
          },
          dimensions: {
            en: pickBilingual(product.specs.dimensions, gallerySpecs.dimensions, "en"),
            pl: pickBilingual(product.specs.dimensions, gallerySpecs.dimensions, "pl"),
          },
        },
      };
    });
}

export function getShopCatalogFromData(data: AdminPersistedData): ShopProduct[] {
  return buildShopCatalog(data.products, data.collections);
}

export function getShopCatalogSnapshot(): ShopProduct[] {
  const data = loadAdminData() ?? seedAdminData();
  return getShopCatalogFromData(data);
}

export function findShopProductBySku(
  products: ShopProduct[],
  sku: string
): ShopProduct | undefined {
  const normalized = sku.toUpperCase();
  return products.find((p) => p.sku.toUpperCase() === normalized);
}

export function filterShopProducts(
  products: ShopProduct[],
  filter: ShopCatalogFilter
): ShopProduct[] {
  if (filter === "all") return products;
  if (filter === "in-stock") {
    return products.filter((p) => p.stock > 0 && p.status === "available");
  }
  return products.filter((p) => p.categoryId === filter);
}

export function getRelatedProducts(
  products: ShopProduct[],
  current: ShopProduct,
  limit = 4
): ShopProduct[] {
  return products
    .filter((p) => p.sku !== current.sku && p.categoryId === current.categoryId)
    .slice(0, limit);
}

export function isOutOfStock(product: ShopProduct): boolean {
  return product.stock <= 0;
}
