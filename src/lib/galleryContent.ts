import type { Language } from "@/types";
import { images } from "@/lib/images";

export type GalleryModeId = "lookbook" | "catalog";

export type ItemStatus = "available" | "sold" | "made-to-order";
export type ItemCategory = "matte-ash" | "tide-line" | "slow-morning" | "wabi-forms";

export type CatalogFilter = "all" | "in-stock" | "matte-ash" | "tide-line" | "slow-morning" | "wabi-forms" | "archive";

export const galleryModes: { id: GalleryModeId; label: string; kanji: string }[] = [
  { id: "lookbook", label: "Editorial Lookbook", kanji: "覧" },
  { id: "catalog", label: "Filtered Catalog", kanji: "録" },
];

export const galleryHeader = {
  eyebrow: { en: "Atelier Gallery & Shop", pl: "Galeria i sklep pracowni" },
  title: { en: "Vessels for quiet living", pl: "Naczynia do cichego życia" },
  subtitle: {
    en: "Small-batch stoneware — wheel-thrown, cone 10, each piece numbered by hand.",
    pl: "Małe serie kamioniny — toczone na kole, cone 10, każda praca numerowana ręcznie.",
  },
};

export const catalogFilters: { id: CatalogFilter; label: Record<Language, string> }[] = [
  { id: "all", label: { en: "All", pl: "Wszystkie" } },
  { id: "in-stock", label: { en: "In Stock", pl: "Dostępne" } },
  { id: "matte-ash", label: { en: "Matte Ash", pl: "Matowy popiół" } },
  { id: "tide-line", label: { en: "Tide Line", pl: "Linia brzegu" } },
  { id: "slow-morning", label: { en: "Slow Morning", pl: "Powolny poranek" } },
  { id: "wabi-forms", label: { en: "Wabi Forms", pl: "Formy wabi" } },
  { id: "archive", label: { en: "Archive", pl: "Archiwum" } },
];

export const statusLabels: Record<
  ItemStatus,
  { en: string; pl: string; dot?: string }
> = {
  available: { en: "Available", pl: "Dostępne", dot: "#7a9a7e" },
  sold: { en: "Sold / Archive", pl: "Sprzedane" },
  "made-to-order": { en: "Made to Order", pl: "Na zamówienie" },
};

export interface GalleryItem {
  id: string;
  sku: string;
  name: Record<Language, string>;
  category: ItemCategory;
  status: ItemStatus;
  image: string;
  images?: string[];
  description?: Record<Language, string>;
  lookbookSpan: string;
  specs: {
    clayBody: Record<Language, string>;
    glaze: Record<Language, string>;
    firing: Record<Language, string>;
    dimensions: Record<Language, string>;
  };
  pricePln?: number;
  priceUsd?: number;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "001",
    sku: "PALI-001",
    name: { en: "Morning Bowl — Matte Ash", pl: "Poranna miska — matowy popiół" },
    category: "matte-ash",
    status: "available",
    image: images.accentBowl,
    images: [images.accentBowl, images.heroCeramics, images.whiteLavaCup],
    description: {
      en: "A shallow morning bowl with a soft matte ash glaze — quiet enough for everyday rice, deep enough for soup. Each piece is wheel-thrown and fired to cone 10 for a durable, satin surface.",
      pl: "Płytka miska poranna z miękkim matowym szkliwem popiołowym — na co dzień i na rosół. Toczona na kole, wypalana cone 10 — trwała, satynowa powierzchnia.",
    },
    lookbookSpan: "col-span-2 row-span-2",
    specs: {
      clayBody: { en: "Stoneware", pl: "Kamionina" },
      glaze: { en: "Matte shino ash", pl: "Matowy shino popiół" },
      firing: { en: "Cone 10 · 1,285°C", pl: "Cone 10 · 1 285°C" },
      dimensions: { en: "Ø 14 cm · H 6 cm", pl: "Ø 14 cm · W 6 cm" },
    },
    pricePln: 320,
    priceUsd: 82,
  },
  {
    id: "002",
    sku: "PALI-002",
    name: { en: "Quiet Vessel — Indigo Foot", pl: "Ciche naczynie — indygo stopa" },
    category: "wabi-forms",
    status: "sold",
    image: images.heroPlate,
    images: [images.heroPlate, images.heroVase, images.accentBowl],
    description: {
      en: "A slender vessel with an indigo foot — made to order from this existing glaze line. The silhouette is calm and vertical, suited to a single stem or an empty shelf.",
      pl: "Smukłe naczynie z indygo stopą — na zamówienie z istniejącej serii szkliw. Spokojna, pionowa forma — na gałązkę lub pustą półkę.",
    },
    lookbookSpan: "col-span-1 row-span-2",
    specs: {
      clayBody: { en: "Stoneware", pl: "Kamionina" },
      glaze: { en: "Indigo gosu matte", pl: "Indygo gosu mat" },
      firing: { en: "Cone 10 · 1,285°C", pl: "Cone 10 · 1 285°C" },
      dimensions: { en: "Ø 11 cm · H 18 cm", pl: "Ø 11 cm · W 18 cm" },
    },
    pricePln: 480,
    priceUsd: 124,
  },
  {
    id: "003",
    sku: "PALI-003",
    name: { en: "Tea Cup Pair — Slip Trail", pl: "Para filiżanek — slip trail" },
    category: "tide-line",
    status: "sold",
    image: images.accentTableware,
    images: [images.accentTableware, images.whiteLavaCup, images.accentBowl],
    description: {
      en: "A pair of cups with slip-trail lines — sold as a set, archived after the last firing. The trail follows the rim like a tide mark.",
      pl: "Para filiżanek ze slip trail — sprzedawane w komplecie, dziś w archiwum. Linia wzdłuż brzegu jak ślad przypływu.",
    },
    lookbookSpan: "col-span-1 row-span-1",
    specs: {
      clayBody: { en: "Stoneware", pl: "Kamionina" },
      glaze: { en: "White matte + trail", pl: "Biały mat + trail" },
      firing: { en: "Cone 10 · 1,285°C", pl: "Cone 10 · 1 285°C" },
      dimensions: { en: "Ø 8 cm · H 7 cm (×2)", pl: "Ø 8 cm · W 7 cm (×2)" },
    },
  },
  {
    id: "004",
    sku: "PALI-004",
    name: { en: "Tall Vase — Wabi Rim", pl: "Wysoka waza — wabi brzeg" },
    category: "wabi-forms",
    status: "available",
    image: images.heroPlate,
    images: [images.heroPlate, images.heroCeramics, images.heroVase],
    description: {
      en: "Tall vase with an intentionally uneven wabi rim — natural ash matte catches light along the shoulder. One of a small batch from the winter kiln.",
      pl: "Wysoka waza z celowo nierównym brzegiem wabi — matowy popiół zbiera światło na ramieniu. Z niewielkiej zimowej serii.",
    },
    lookbookSpan: "col-span-2 row-span-1",
    specs: {
      clayBody: { en: "Stoneware", pl: "Kamionina" },
      glaze: { en: "Natural ash matte", pl: "Naturalny popiół mat" },
      firing: { en: "Cone 10 · 1,285°C", pl: "Cone 10 · 1 285°C" },
      dimensions: { en: "Ø 9 cm · H 24 cm", pl: "Ø 9 cm · W 24 cm" },
    },
    pricePln: 560,
    priceUsd: 145,
  },
  {
    id: "005",
    sku: "PALI-005",
    name: { en: "Rice Bowl Set — Hakeme", pl: "Zestaw misek ryżowych — hakeme" },
    category: "matte-ash",
    status: "available",
    image: images.accentBowl,
    images: [images.accentBowl, images.accentTableware, images.heroCeramics],
    description: {
      en: "Four rice bowls brushed with hakeme white — meant to stack and share at a slow table. Slightly varied foot rings show the hand of the wheel.",
      pl: "Cztery miski ryżowe z hakeme — do wspólnego stołu. Nieco różne stópki, ślad ręki przy kole.",
    },
    lookbookSpan: "col-span-1 row-span-1",
    specs: {
      clayBody: { en: "Stoneware", pl: "Kamionina" },
      glaze: { en: "Hakeme white brush", pl: "Hakeme biały pędzel" },
      firing: { en: "Cone 10 · 1,285°C", pl: "Cone 10 · 1 285°C" },
      dimensions: { en: "Ø 12 cm · H 5 cm (×4)", pl: "Ø 12 cm · W 5 cm (×4)" },
    },
    pricePln: 890,
    priceUsd: 230,
  },
  {
    id: "006",
    sku: "PALI-006",
    name: { en: "Archive Vessel — No. 12", pl: "Archiwum — naczynie nr 12" },
    category: "slow-morning",
    status: "sold",
    image: images.accentTableware,
    images: [images.accentTableware, images.heroPlate, images.whiteLavaCup],
    description: {
      en: "Archive vessel no. 12 — tenmoku matte with a low, resting profile. Kept in the studio collection as a reference glaze.",
      pl: "Naczynie archiwalne nr 12 — tenmoku mat, niska, spokojna forma. W pracowni jako odniesienie do szkliwa.",
    },
    lookbookSpan: "col-span-1 row-span-2",
    specs: {
      clayBody: { en: "Stoneware", pl: "Kamionina" },
      glaze: { en: "Tenmoku matte", pl: "Tenmoku mat" },
      firing: { en: "Cone 10 · 1,285°C", pl: "Cone 10 · 1 285°C" },
      dimensions: { en: "Ø 10 cm · H 15 cm", pl: "Ø 10 cm · W 15 cm" },
    },
  },
];

export const productCareNote: Record<Language, string> = {
  en: "Hand-wash gently. Food-safe. Avoid microwave, oven & sudden heat.",
  pl: "Myć ręcznie. Bezpieczne do żywności. Bez mikrofalówki, piekarnika i gwałtownego grzania.",
};

export function t<T extends Record<Language, string>>(map: T, lang: Language) {
  return map[lang];
}

export function filterCatalogItems(items: GalleryItem[], filter: CatalogFilter) {
  switch (filter) {
    case "in-stock":
      return items.filter((i) => i.status === "available");
    case "matte-ash":
      return items.filter((i) => i.category === "matte-ash");
    case "tide-line":
      return items.filter((i) => i.category === "tide-line");
    case "slow-morning":
      return items.filter((i) => i.category === "slow-morning");
    case "wabi-forms":
      return items.filter((i) => i.category === "wabi-forms");
    case "archive":
      return items.filter((i) => i.status === "sold");
    default:
      return items;
  }
}
