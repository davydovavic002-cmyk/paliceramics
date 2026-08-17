import type {
  AdminCollection,
  AdminPersistedData,
  AdminPieceType,
  Bilingual,
} from "@/lib/adminTypes";
import { pickBilingual } from "@/lib/adminTypes";
import {
  productCollections,
  productPieceTypes,
  type LookbookCollection,
} from "@/lib/lookbookCollections";
import type { Language } from "@/types";
import { images } from "@/lib/images";

const SEED_COLLECTION_IDS = new Set(productCollections.map((collection) => collection.id));
export const HOMEPAGE_LOOKBOOK_COLLECTION_LIMIT = 4;

export function seedCollections(): AdminCollection[] {
  return productCollections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    subtitle: collection.subtitle,
    coverImageUrl: collection.image,
    coverImageLabel: "cover.jpg",
    showInLookbook: true,
  }));
}

export function seedPieceTypes(): AdminPieceType[] {
  return productPieceTypes.map((pieceType) => ({
    id: pieceType.id,
    name: pieceType.name,
  }));
}

export function migrateLegacyCategories(
  categories: { id: string; label: string }[]
): AdminCollection[] {
  const map = new Map(seedCollections().map((collection) => [collection.id, collection]));

  for (const category of categories) {
    const existing = map.get(category.id);
    if (existing) {
      map.set(category.id, {
        ...existing,
        name: { ...existing.name, en: category.label || existing.name.en },
      });
      continue;
    }
    map.set(category.id, {
      id: category.id,
      name: { en: category.label, pl: category.label },
      subtitle: { en: "", pl: "" },
      showInLookbook: false,
    });
  }

  return Array.from(map.values());
}

export function normalizeCollection(
  collection: AdminCollection,
  fallback?: AdminCollection
): AdminCollection {
  const defaults =
    fallback ?? seedCollections().find((item) => item.id === collection.id);

  const rawName = collection.name ?? { en: "", pl: "" };
  const name = defaults
    ? {
        en: rawName.en?.trim() && !looksLikeSlug(rawName.en, collection.id)
          ? rawName.en
          : defaults.name.en,
        pl: rawName.pl?.trim() && !looksLikeSlug(rawName.pl, collection.id)
          ? rawName.pl
          : defaults.name.pl,
      }
    : mergeBilingual(rawName, { en: collection.id, pl: collection.id });

  return {
    id: collection.id,
    name,
    subtitle: mergeBilingual(
      collection.subtitle,
      defaults?.subtitle ?? { en: "", pl: "" }
    ),
    coverImageUrl: collection.coverImageUrl ?? defaults?.coverImageUrl ?? images.accentBowl,
    coverImageLabel: collection.coverImageLabel ?? defaults?.coverImageLabel ?? "cover.jpg",
    showInLookbook:
      collection.showInLookbook ??
      defaults?.showInLookbook ??
      SEED_COLLECTION_IDS.has(collection.id),
  };
}

export function normalizePieceType(
  pieceType: AdminPieceType,
  fallback?: AdminPieceType
): AdminPieceType {
  const defaults =
    fallback ?? seedPieceTypes().find((item) => item.id === pieceType.id);

  const rawName = pieceType.name ?? { en: "", pl: "" };
  const name = defaults
    ? {
        en: rawName.en?.trim() && !looksLikeSlug(rawName.en, pieceType.id)
          ? rawName.en
          : defaults.name.en,
        pl: rawName.pl?.trim() && !looksLikeSlug(rawName.pl, pieceType.id)
          ? rawName.pl
          : defaults.name.pl,
      }
    : mergeBilingual(rawName, { en: pieceType.id, pl: pieceType.id });

  return {
    id: pieceType.id,
    name,
  };
}

function mergeBilingual(value: Bilingual | undefined, fallback: Bilingual): Bilingual {
  return {
    en: value?.en?.trim() ? value.en : fallback.en,
    pl: value?.pl?.trim() ? value.pl : fallback.pl,
  };
}

function looksLikeSlug(value: string, id: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return trimmed === id.toLowerCase() || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed);
}

function collectionScore(collection: AdminCollection): number {
  let score = 0;
  if (collection.coverImageUrl) score += 4;
  if (collection.name.en && !looksLikeSlug(collection.name.en, collection.id)) score += 2;
  if (collection.name.pl && !looksLikeSlug(collection.name.pl, collection.id)) score += 1;
  if (collection.subtitle.en?.trim()) score += 1;
  return score;
}

/** Map duplicate ids like `matte-ash-x7k2` → seed id `matte-ash`. */
export function canonicalCollectionId(id: string): string {
  const normalized = id.toLowerCase().trim();
  for (const seedId of SEED_COLLECTION_ORDER) {
    if (normalized === seedId || normalized.startsWith(`${seedId}-`)) {
      return seedId;
    }
  }
  return id;
}

/** Keep one entry per collection — merges slug duplicates and variant ids. */
export function dedupeCollections(collections: AdminCollection[]): AdminCollection[] {
  const map = new Map<string, AdminCollection>();

  for (const raw of collections) {
    const id = canonicalCollectionId(raw.id);
    const candidate = normalizeCollection({ ...raw, id });
    const existing = map.get(id);
    if (!existing || collectionScore(candidate) > collectionScore(existing)) {
      map.set(id, candidate);
    }
  }

  return Array.from(map.values());
}

export function dedupePieceTypes(pieceTypes: AdminPieceType[]): AdminPieceType[] {
  const map = new Map<string, AdminPieceType>();

  for (const pieceType of pieceTypes) {
    const existing = map.get(pieceType.id);
    if (!existing) {
      map.set(pieceType.id, pieceType);
      continue;
    }
    const preferNew =
      pieceType.name.en &&
      !looksLikeSlug(pieceType.name.en, pieceType.id) &&
      looksLikeSlug(existing.name.en, existing.id);
    if (preferNew) map.set(pieceType.id, pieceType);
  }

  return Array.from(map.values());
}

const SEED_COLLECTION_ORDER = productCollections.map((collection) => collection.id);

export function sortCollections(collections: AdminCollection[]): AdminCollection[] {
  return [...collections].sort((a, b) => {
    const aIndex = SEED_COLLECTION_ORDER.indexOf(a.id);
    const bIndex = SEED_COLLECTION_ORDER.indexOf(b.id);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.en.localeCompare(b.name.en, "en");
  });
}

export function resolveCollections(data: Partial<AdminPersistedData>): AdminCollection[] {
  let collections: AdminCollection[];

  if (Array.isArray(data.collections) && data.collections.length > 0) {
    collections = data.collections.map((collection) => normalizeCollection(collection));
  } else if (Array.isArray(data.categories) && data.categories.length > 0) {
    collections = migrateLegacyCategories(data.categories).map((collection) =>
      normalizeCollection(collection)
    );
  } else {
    collections = seedCollections();
  }

  return sortCollections(dedupeCollections(collections));
}

export function resolvePieceTypes(data: Partial<AdminPersistedData>): AdminPieceType[] {
  let pieceTypes: AdminPieceType[];

  if (Array.isArray(data.pieceTypes) && data.pieceTypes.length > 0) {
    pieceTypes = data.pieceTypes.map((pieceType) => normalizePieceType(pieceType));
  } else {
    pieceTypes = seedPieceTypes();
  }

  return dedupePieceTypes(pieceTypes);
}

export function collectionToLookbook(collection: AdminCollection): LookbookCollection {
  return {
    id: collection.id,
    name: collection.name,
    subtitle: collection.subtitle,
    image: collection.coverImageUrl ?? images.accentBowl,
  };
}

export function getCollectionLabelFromList(
  collections: AdminCollection[],
  id: string,
  language: Language
): string {
  const collection = collections.find((item) => item.id === id);
  if (!collection) return id;
  return pickBilingual(collection.name, collection.name, language);
}

export function getPieceTypeLabelFromList(
  pieceTypes: AdminPieceType[],
  id: string,
  language: Language
): string {
  const pieceType = pieceTypes.find((item) => item.id === id);
  if (!pieceType) return id;
  return pickBilingual(pieceType.name, pieceType.name, language);
}

export function getLookbookCollections(collections: AdminCollection[]): AdminCollection[] {
  return sortCollections(collections)
    .filter((collection) => collection.showInLookbook)
    .slice(0, HOMEPAGE_LOOKBOOK_COLLECTION_LIMIT);
}

export function slugifyCatalogId(label: string, prefix: string): string {
  const base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `${prefix}-${Date.now().toString(36).slice(-4)}`;
}
