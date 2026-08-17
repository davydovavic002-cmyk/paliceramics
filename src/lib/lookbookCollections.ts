import type { Bilingual } from "@/lib/adminTypes";
import type { Language } from "@/types";
import { MADE_TO_ORDER_CATEGORY_ID } from "@/lib/customOrderContent";
import { images } from "@/lib/images";

export type LookbookCollection = {
  id: string;
  name: Bilingual;
  subtitle: Bilingual;
  image: string;
  href?: string;
};

/** Product collections (shop filter + lookbook tiles) */
export const productCollections: LookbookCollection[] = [
  {
    id: "matte-ash",
    name: { pl: "Matowy popiół", en: "Matte Ash" },
    subtitle: { pl: "Miski i misy", en: "Bowls & dishes" },
    image: images.accentBowl,
  },
  {
    id: "tide-line",
    name: { pl: "Linia brzegu", en: "Tide Line" },
    subtitle: { pl: "Kubki i filiżanki", en: "Cups & mugs" },
    image: images.whiteLavaCup,
  },
  {
    id: "slow-morning",
    name: { pl: "Powolny poranek", en: "Slow Morning" },
    subtitle: { pl: "Zestawy na stół", en: "Table sets" },
    image: images.accentTableware,
  },
  {
    id: "wabi-forms",
    name: { pl: "Formy wabi", en: "Wabi Forms" },
    subtitle: { pl: "Wazy i naczynia", en: "Vases & vessels" },
    image: images.heroPlate,
  },
];

export const madeToOrderCollection: LookbookCollection = {
  id: MADE_TO_ORDER_CATEGORY_ID,
  name: { pl: "Na zamówienie", en: "Made to order" },
  subtitle: {
    pl: "Forma, rozmiar i szkliwo — ustalamy wspólnie",
    en: "Shape, size & glaze — arranged together",
  },
  image: images.heroVase,
  href: "/shop/made-to-order",
};

/** All lookbook entries: 4 product collections + made to order */
export const lookbookCollections: LookbookCollection[] = [
  ...productCollections,
  madeToOrderCollection,
];

export const shopCollectionFilters: LookbookCollection[] = [...productCollections];

const collectionById = new Map(lookbookCollections.map((c) => [c.id, c]));

export function shopCollectionHref(id: string): string {
  const collection = collectionById.get(id);
  return collection?.href ?? `/shop?category=${id}`;
}

export function pickCollectionLabel(
  collection: LookbookCollection,
  language: Language
): string {
  return collection.name[language];
}

export function getCollectionById(id: string): LookbookCollection | undefined {
  return collectionById.get(id);
}

export function getCollectionLabel(id: string, language: Language): string {
  const collection = collectionById.get(id);
  if (!collection) return id;
  return pickCollectionLabel(collection, language);
}

export function sortProductsByCollectionName<T extends { categoryId: string }>(
  items: T[],
  language: Language
): T[] {
  return [...items].sort((a, b) =>
    getCollectionLabel(a.categoryId, language).localeCompare(
      getCollectionLabel(b.categoryId, language),
      language
    )
  );
}

/** Demo / seed: product id → collection id */
export const productCollectionById: Record<string, string> = {
  "001": "matte-ash",
  "002": "wabi-forms",
  "003": "tide-line",
  "004": "wabi-forms",
  "005": "matte-ash",
  "006": "slow-morning",
};

export const LEGACY_CATEGORY_IDS = new Set(["vases", "bowls", "cups"]);

export type ProductPieceTypeId = "bowls" | "cups" | "vases" | "sets";

export type ProductPieceType = {
  id: ProductPieceTypeId;
  name: Bilingual;
};

/** Form / piece type — separate from glaze collection */
export const productPieceTypes: ProductPieceType[] = [
  {
    id: "bowls",
    name: { pl: "Miski i misy", en: "Bowls & dishes" },
  },
  {
    id: "cups",
    name: { pl: "Kubki i filiżanki", en: "Cups & mugs" },
  },
  {
    id: "vases",
    name: { pl: "Wazy i naczynia", en: "Vases & vessels" },
  },
  {
    id: "sets",
    name: { pl: "Zestawy na stół", en: "Table sets" },
  },
];

export const productPieceTypeById: Record<string, ProductPieceTypeId> = {
  "001": "bowls",
  "002": "vases",
  "003": "cups",
  "004": "vases",
  "005": "sets",
  "006": "vases",
};

const pieceTypeById = new Map(productPieceTypes.map((type) => [type.id, type]));

export function getProductPieceTypeId(productId: string): ProductPieceTypeId {
  return productPieceTypeById[productId] ?? "bowls";
}

export function getPieceTypeLabel(id: string, language: Language): string {
  const pieceType = pieceTypeById.get(id as ProductPieceTypeId);
  if (!pieceType) return id;
  return pieceType.name[language];
}

export function pickPieceTypeLabel(type: ProductPieceType, language: Language): string {
  return type.name[language];
}
