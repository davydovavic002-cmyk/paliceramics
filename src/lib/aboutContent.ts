import type { Language } from "@/types";
import { images } from "@/lib/images";

export type AboutTabId = "timeline" | "scrapbook" | "hotspots" | "video";

export const aboutTabs: { id: AboutTabId; label: string; kanji: string }[] = [
  { id: "timeline", label: "Timeline", kanji: "史" },
  { id: "scrapbook", label: "Scrapbook", kanji: "帖" },
  { id: "hotspots", label: "Hotspots", kanji: "点" },
  { id: "video", label: "Video Meditation", kanji: "映" },
];

export const aboutHeader = {
  eyebrow: { en: "About & Philosophy", pl: "O nas i filozofia" },
  title: { en: "The quiet path to clay", pl: "Cicha droga do gliny" },
  subtitle: {
    en: "Earth, patience, and the quiet discipline of the wheel.",
    pl: "Ziemia, cierpliwość i cicha dyscyplina koła.",
  },
};

export const timelineEntries = [
  {
    year: "2018",
    title: { en: "Corporate Life", pl: "Życie korporacyjne" },
    body: {
      en: "Spreadsheets, deadlines, and a desk that never saw sunlight. Something in the rhythm felt hollow.",
      pl: "Arkusze, terminy i biurko, które nie widziało słońca. Coś w tym rytmie wydawało się puste.",
    },
    kanji: "市",
  },
  {
    year: "2020",
    title: { en: "Discovery of Clay", pl: "Odkrycie gliny" },
    body: {
      en: "A single evening class. Hands in wet earth. The wheel slowed time until nothing else existed.",
      pl: "Jeden wieczorny kurs. Dłonie w mokrej glinie. Koło zwalniało czas, aż nie istniało nic innego.",
    },
    kanji: "土",
  },
  {
    year: "2023",
    title: { en: "Warsaw Atelier", pl: "Warszawska pracownia" },
    body: {
      en: "A small room in Praga. First shelves of bisque, first guests, first vessels leaving for quiet kitchens.",
      pl: "Małe studio na Pradze. Pierwsze półki z bisque, pierwsi goście, pierwsze naczynia w cichych kuchniach.",
    },
    kanji: "工",
  },
  {
    year: "2025",
    title: { en: "Chamber Studio", pl: "Studio komnatowe" },
    body: {
      en: "Two wheels, two seats, cone-10 firings. Pali becomes a place for unhurried making — not production.",
      pl: "Dwa koła, dwa miejsca, wypały cone 10. Pali staje się miejscem niespiesznej pracy — nie produkcji.",
    },
    kanji: "室",
  },
] as const;

export const scrapbookItems = [
  {
    id: "hands",
    type: "image" as const,
    src: images.accentBowl,
    alt: "Hands shaping clay on the wheel",
    span: "col-span-2 row-span-2",
    quote: {
      en: "The hand remembers what the mind forgets.",
      pl: "Dłoń pamięta to, czego umysł zapomina.",
    },
    meta: { en: "Wheel session · 2024", pl: "Sesja na kole · 2024" },
    rotate: -1.5,
  },
  {
    id: "glaze",
    type: "texture" as const,
    texture: "glaze",
    span: "col-span-1 row-span-1",
    quote: {
      en: "Matte ash — like morning fog on stone.",
      pl: "Matowy popiół — jak poranna mgła na kamieniu.",
    },
    meta: { en: "Glaze test · shino", pl: "Test szkliwa · shino" },
    rotate: 2,
  },
  {
    id: "sketch",
    type: "texture" as const,
    texture: "sketch",
    span: "col-span-1 row-span-2",
    quote: {
      en: "Draw the foot before you throw the wall.",
      pl: "Narysuj stopę, zanim wyrzucisz ściankę.",
    },
    meta: { en: "Studio notebook", pl: "Notatnik pracowni" },
    rotate: -2.5,
  },
  {
    id: "tableware",
    type: "image" as const,
    src: images.accentTableware,
    alt: "Glazed tableware on linen",
    span: "col-span-2 row-span-1",
    quote: {
      en: "Vessels for unhurried mornings.",
      pl: "Naczynia na niespieszne poranki.",
    },
    meta: { en: "Morning set · cone 10", pl: "Poranny zestaw · cone 10" },
    rotate: 1,
  },
  {
    id: "quote",
    type: "quote" as const,
    span: "col-span-1 row-span-1",
    quote: {
      en: "Quiet forms leave room for tea.",
      pl: "Ciche formy zostawiają miejsce na herbatę.",
    },
    meta: { en: "Studio motto", pl: "Motto pracowni" },
    rotate: 0,
  },
] as const;

export const hotspots = [
  {
    id: "imperfect",
    label: { en: "Imperfect Shapes", pl: "Niedoskonałe formy" },
    x: 38,
    y: 42,
    body: {
      en: "We leave the wobble. A rim that breathes, a foot that tells you a human was here — wabi-sabi as practice, not aesthetic.",
      pl: "Zostawiamy drganie. Brzeg, który oddycha, stopa, która mówi, że był tu człowiek — wabi-sabi jako praktyka, nie estetyka.",
    },
  },
  {
    id: "limit",
    label: { en: "2-Person Limit", pl: "Limit 2 osób" },
    x: 62,
    y: 58,
    body: {
      en: "The chamber fits two makers at most. Small batches, unhurried attention — quality measured in presence, not volume.",
      pl: "Komnata mieści maksymalnie dwóch twórców. Małe serie, niespieszna uwaga — jakość mierzona obecnością, nie wolumenem.",
    },
  },
  {
    id: "meditation",
    label: { en: "Meditation in Clay", pl: "Medytacja w glinie" },
    x: 48,
    y: 28,
    body: {
      en: "Centering the clay centers the maker. Each vessel is a record of breath, pressure, and the decision to stop before perfection.",
      pl: "Centrowanie gliny centruje twórcę. Każde naczynie to zapis oddechu, nacisku i decyzji, by zatrzymać się przed perfekcją.",
    },
  },
] as const;

export const videoMeditation = {
  title: { en: "Meditation in motion", pl: "Medytacja w ruchu" },
  lines: [
    {
      en: "The wheel turns.",
      pl: "Koło się kręci.",
    },
    {
      en: "The room falls silent.",
      pl: "Pracownia cichnie.",
    },
    {
      en: "Only clay remains.",
      pl: "Zostaje tylko glina.",
    },
  ],
  caption: {
    en: "Chamber studio · Warsaw · cone 10 stoneware",
    pl: "Studio komnatowe · Warszawa · kamionina cone 10",
  },
};

export function t<T extends Record<Language, string>>(map: T, lang: Language) {
  return map[lang];
}
