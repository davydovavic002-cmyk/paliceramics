import type { Language } from "@/types";

export type PalinaStoryCopy = {
  lead: string;
  origin: string;
  brand: string;
  workshops: string;
  craft: string;
  closing: string;
};

export const palinaStoryCopy: Record<Language, PalinaStoryCopy> = {
  pl: {
    lead: "Mam na imię Palina i jestem twórczynią marki Pali Pali.",
    origin:
      "Ceramika zaczęła się w 2021 — szukałam chwili spokoju i oderwania od pośpiechu. Przy kole odkryłam skupienie, uważność i radość tworzenia własnymi rękami.",
    brand:
      "W 2023 glina stała się częścią życia, w 2025 odeszłam z korporacji i stworzyłam markę. Wierzę, że kreatywność jest w każdym z nas — czasem trzeba tylko przestrzeni.",
    workshops:
      "Przez warsztaty daję innym miejsce na eksperyment, zwolnienie tempa i radość z tworzenia.",
    craft:
      "Każdy przedmiot powstaje ręcznie na kole. Inspiruję się prostotą, naturą i japońską estetyką — rzeczami, które kształtują codzienne rytuały.",
    closing:
      "Tworzę naczynia, które zachęcają do zatrzymania się i zauważenia piękna w prostych chwilach.",
  },
  en: {
    lead: "My name is Palina, and I am the maker behind Pali Pali.",
    origin:
      "Ceramics began in 2021 — I was looking for calm away from the rush. At the wheel I found focus, mindfulness, and the joy of making with my hands.",
    brand:
      "By 2023 clay was part of my life; in 2025 I left corporate work and built the brand. I believe creativity lives in all of us — we only need space.",
    workshops:
      "Through workshops I offer room to experiment, slow down, and reconnect with the joy of making.",
    craft:
      "Every piece is wheel-thrown by me, inspired by simplicity, nature, and Japanese aesthetics — objects that shape everyday rituals.",
    closing:
      "I make vessels that invite us to pause and notice beauty in simple things.",
  },
};

export const palinaStoryImages = {
  japan: {
    src: "/images/about/palina-japan.png",
    alt: { pl: "Palina w japońskim ogrodzie", en: "Palina in a Japanese courtyard" },
  },
  wheel: {
    src: "/images/about/palina-wheel.png",
    alt: { pl: "Palina przy kole garncarskim", en: "Palina at the pottery wheel" },
  },
  glaze: {
    src: "/images/about/palina-glaze.png",
    alt: { pl: "Szkliwione naczynia", en: "Glazed ceramics" },
  },
  studio: {
    src: "/images/about/palina-studio.png",
    alt: { pl: "Pracownia — koło garncarskie", en: "Studio pottery wheel" },
  },
} as const;

export function palinaStoryLabel(language: Language) {
  return language === "pl" ? "Historia" : "Story";
}
