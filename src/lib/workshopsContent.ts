import type { Language } from "@/types";

export type WorkshopConceptId = "mood-cards" | "calendar" | "builder";

export const workshopConcepts: {
  id: WorkshopConceptId;
  label: string;
  kanji: string;
}[] = [
  { id: "mood-cards", label: "Mood Cards", kanji: "卡" },
  { id: "calendar", label: "Calendar", kanji: "历" },
  { id: "builder", label: "Date Builder", kanji: "作" },
];

export const workshopsHeader = {
  eyebrow: { en: "Workshops & Booking", pl: "Warsztaty i rezerwacja" },
  title: { en: "Slow sessions at the wheel", pl: "Niespieszne sesje przy kole" },
  subtitle: {
    en: "One-time wheel sessions or a three-part course — small groups in Żoliborz.",
    pl: "Jednorazowy warsztat albo cykl trzech spotkań — kameralnie na Żoliborzu.",
  },
};

export const bookingContact = {
  hostName: "Palina",
  email: "palipali.ceramic@gmail.com",
  instagram: "https://www.instagram.com/pali.ceramics/",
  facebook: "https://www.facebook.com/profile.php?id=61576840871788",
  whatsapp: "",
};

export const workshopFormats = [
  {
    id: "one-time",
    kanji: "一",
    title: { en: "One-time pottery workshop", pl: "Warsztat jednorazowy" },
    subtitle: { en: "2.5 h · max. 2 people", pl: "2,5 h · max. 2 osoby" },
    duration: { en: "2.5 hours", pl: "2,5 godziny" },
    features: {
      en: ["Żoliborz studio", "Up to 2 participants", "Finished & glazed for you"],
      pl: ["Pracownia na Żoliborzu", "Do 2 uczestników", "Dokończenie i szkliwienie w cenie"],
    },
    pricePln: 350,
    messageKey: { en: "a one-time pottery workshop", pl: "jednorazowy warsztat garncarski" },
    intro: {
      en: "2.5 hours at the wheel in a small Żoliborz studio — max. two participants.",
      pl: "2,5 godziny przy kole w kameralnej pracowni na Żoliborzu — max. dwie osoby.",
    },
  },
  {
    id: "three-session",
    kanji: "三",
    title: { en: "3-session pottery course", pl: "Cykl 3 zajęć po 2 godziny" },
    subtitle: { en: "3 × 2 h · full process", pl: "3 × 2 h · pełny proces" },
    duration: { en: "3 × 2 hours", pl: "3 × 2 godziny" },
    features: {
      en: ["Throwing, trimming & glazing", "Max. 2 per session", "6–6.5 hours total"],
      pl: ["Toczenie, trymowanie i szkliwienie", "Max. 2 os. na spotkanie", "Łącznie 6–6,5 godz."],
    },
    pricePln: 850,
    messageKey: { en: "a 3-session pottery course", pl: "cykl trzech zajęć garncarskich" },
    intro: {
      en: "Three sessions covering the full process from clay to glaze.",
      pl: "Trzy spotkania — pełny proces od gliny po szkliwienie.",
    },
  },
] as const;

export const calendarSlots = [
  { id: "wed-18", day: { en: "Wed", pl: "Śr" }, date: "Aug 13", time: "18:00", spots: 1 },
  { id: "thu-11", day: { en: "Thu", pl: "Cz" }, date: "Aug 14", time: "11:00", spots: 2 },
  { id: "fri-18", day: { en: "Fri", pl: "Pt" }, date: "Aug 15", time: "18:00", spots: 1 },
  { id: "sat-10", day: { en: "Sat", pl: "Sb" }, date: "Aug 16", time: "10:00", spots: 0 },
  { id: "sat-15", day: { en: "Sat", pl: "Sb" }, date: "Aug 16", time: "15:00", spots: 2 },
  { id: "sun-12", day: { en: "Sun", pl: "Nd" }, date: "Aug 17", time: "12:00", spots: 1 },
] as const;

export const builderFormats = [
  {
    id: "date" as const,
    kanji: "双",
    label: { en: "Pottery Date", pl: "Randka przy glinie" },
    desc: { en: "Two wheels, one shared table", pl: "Dwa koła, jeden wspólny stół" },
  },
  {
    id: "solo" as const,
    kanji: "一",
    label: { en: "Solo Session", pl: "Sesja solo" },
    desc: { en: "Private wheel & full focus", pl: "Prywatne koło i pełna uwaga" },
  },
];

export const builderAtmospheres = [
  {
    id: "latte" as const,
    kanji: "音",
    label: { en: "Oat Latte & Music", pl: "Oat latte i muzyka" },
    desc: { en: "Warm playlist, soft conversation", pl: "Ciepła playlista, miękka rozmowa" },
  },
  {
    id: "quiet" as const,
    kanji: "静",
    label: { en: "Quiet Focus", pl: "Cicha koncentracja" },
    desc: { en: "Minimal talk, meditative wheel", pl: "Minimum słów, medytacyjne koło" },
  },
];

export function t<T extends Record<Language, string>>(map: T, lang: Language) {
  return map[lang];
}

export function getWorkshopFormat(id: string) {
  return workshopFormats.find((format) => format.id === id);
}

export function tList(
  map: { readonly [K in Language]: readonly string[] },
  lang: Language
) {
  return map[lang];
}
