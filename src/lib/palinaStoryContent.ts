import type { Language } from "@/types";

/**
 * Text fields support **bold** inline (rendered by PalinaStoryGallery).
 * Block 1: lead (heading) + origin
 * Block 2: brand + workshops (workshops opens with a bold sentence)
 * Block 3: craft (opens with a bold sentence) + closing
 */
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
      "Moja przygoda z ceramiką zaczęła się w 2021 roku, kiedy szukałam w swoim życiu chwili spokoju i sposobu na oderwanie się od codziennego pośpiechu. Wtedy po raz pierwszy usiadłam przy kole garncarskim i odkryłam, ile daje mi praca z gliną — skupienie, uważność i radość tworzenia własnymi rękami.",
    brand:
      "W 2023 roku ceramika stała się nieodłączną częścią mojego życia, a w 2025 roku podjęłam decyzję o odejściu z wieloletniej pracy w korporacji i stworzeniu własnej marki.",
    workshops:
      "**Głęboko wierzę, że kreatywność jest częścią każdego z nas.** Czasem potrzebujemy tylko odpowiedniej przestrzeni i chwili, żeby ją odkryć. Dlatego poprzez moje warsztaty chcę dawać innym przestrzeń do eksperymentowania, zwolnienia tempa i odkrycia na nowo radości płynącej z tworzenia.",
    craft:
      "**Każdy przedmiot, który tworzę, powstaje ręcznie na kole garncarskim.** Inspiruję się prostotą, naturą i japońską estetyką. Wierzę, że rzeczy, którymi otaczamy się każdego dnia, mają znaczenie — wpływają na nasze rytuały, nastrój i sposób, w jaki przeżywamy zwyczajne chwile.",
    closing:
      "Staram się tworzyć przedmioty, które towarzyszą codzienności i zachęcają do zatrzymania się — do zauważania piękna w prostych rzeczach.",
  },
  // EN: working translation of the PL text — to be confirmed with the client.
  en: {
    lead: "My name is Palina, and I am the maker behind Pali Pali.",
    origin:
      "My adventure with ceramics began in 2021, when I was looking for a moment of calm and a way to step away from the daily rush. That was when I first sat down at the pottery wheel and discovered what working with clay gives me — focus, mindfulness, and the joy of making with my own hands.",
    brand:
      "In 2023 ceramics became an inseparable part of my life, and in 2025 I decided to leave many years of corporate work and create a brand of my own.",
    workshops:
      "**I deeply believe that creativity is part of each of us.** Sometimes we only need the right space and a moment to discover it. That is why, through my workshops, I want to give others room to experiment, slow down, and rediscover the joy of making.",
    craft:
      "**Every piece I make is wheel-thrown by hand.** I am inspired by simplicity, nature, and Japanese aesthetics. I believe the things we surround ourselves with every day matter — they shape our rituals, our mood, and the way we live ordinary moments.",
    closing:
      "I try to make pieces that accompany everyday life and invite us to pause — to notice beauty in simple things.",
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
  return language === "pl" ? "O mnie" : "About me";
}
