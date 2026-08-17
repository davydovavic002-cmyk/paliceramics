import type { Language } from "@/types";

export type WorkshopMkFormatId = "one-time" | "three-session";

export type WorkshopMkCopyBlock = {
  id: WorkshopMkFormatId;
  title: { pl: string; en: string };
  teaser: { pl: string; en: string };
  paragraphs: { pl: readonly string[]; en: readonly string[] };
  priceLine: { pl: string; en: string };
  pricePln: number;
};

export const workshopMkFormats: WorkshopMkCopyBlock[] = [
  {
    id: "one-time",
    title: { pl: "Warsztat jednorazowy", en: "One-time pottery workshop" },
    teaser: {
      pl: "2,5 h · max. 2 osoby · Żoliborz",
      en: "2.5 h · max. 2 people · Żoliborz",
    },
    paragraphs: {
      pl: [
        "Jeśli szukasz kreatywnego sposobu na odpoczynek, pomysłu na randkę albo po prostu chcesz spróbować swoich sił w toczeniu na kole garncarskim i zanurzyć ręce w glinie — ta opcja jest dla Ciebie. :)",
        "Zajęcia trwają 2,5 godziny i odbywają się w kameralnej pracowni na Żoliborzu, w bardzo małym gronie — podczas jednego warsztatu mogą uczestniczyć maksymalnie dwie osoby. Dzięki temu mogę poświęcić wystarczająco dużo uwagi każdemu uczestnikowi.",
        "Podczas spotkania, z moją pomocą, stworzysz swoje pierwsze naczynia na kole garncarskim. Możesz wykonać tyle prac, ile zdążysz w czasie zajęć — wszystkie zostaną przeze mnie dokończone i przygotowane do odbioru po około 2–3 tygodniach. Wysuszę je, wypalę oraz pokryję przezroczystym szkliwem.",
        "Wszystkie naczynia są bezpieczne w użytkowaniu i można myć je w zmywarce.",
      ],
      en: [
        "If you are looking for a creative way to relax, a unique date idea, or simply want to try your hand at pottery and get your hands into clay — this workshop is for you. :)",
        "The workshop lasts 2.5 hours and takes place in our cozy studio in Żoliborz. Each session is limited to a maximum of two participants, which allows me to give everyone enough individual attention and guidance.",
        "During the workshop, I will guide you through creating your first pieces on the pottery wheel. You can make as many pieces as time allows — I will finish each one for you and prepare them for collection after approximately 2–3 weeks. I will dry, fire, and glaze them with a transparent glaze.",
        "The finished ceramics are food-safe, dishwasher-safe, and suitable for everyday use.",
      ],
    },
    priceLine: { pl: "Cena: 350 zł / 2,5 godz.", en: "Price: 350 PLN / 2.5 h" },
    pricePln: 350,
  },
  {
    id: "three-session",
    title: { pl: "Cykl 3 zajęć po 2 godziny", en: "3-session pottery course (2 hours each)" },
    teaser: {
      pl: "3 × 2 h · max. 2 osoby · pełny proces",
      en: "3 × 2 h · max. 2 people · full process",
    },
    paragraphs: {
      pl: [
        "Jeśli chcesz przejść przez cały proces powstawania naczyń na kole garncarskim i bardziej zagłębić się w temat, najlepszą opcją będzie dla Ciebie cykl trzech spotkań po 2 godziny. Podczas zajęć przejdziesz przez wszystkie etapy pracy — od przygotowania gliny aż po szkliwienie i finalny wypał. :)",
        "Podobnie jak zajęcia jednorazowe, cykl odbywa się w kameralnej pracowni na Żoliborzu, w bardzo małym gronie — podczas jednego spotkania mogą uczestniczyć maksymalnie dwie osoby. Dzięki temu mogę poświęcić każdemu uczestnikowi dużo uwagi i spokojnie przeprowadzić Cię przez cały proces.",
        "Na pierwszym spotkaniu poznasz podstawy pracy na kole garncarskim, przygotujesz glinę i stworzysz swoje pierwsze formy.",
        "Podczas drugich zajęć nadamy ostateczny kształt wcześniej wykonanym naczyniom poprzez etap trymowania (spoiler: to naprawdę bardzo satysfakcjonujący i wciągający proces!).",
        "Na trzecim spotkaniu dowiesz się, czym jest szkliwienie, a następnie wykorzystasz tę wiedzę w praktyce, szkliwiąc i dekorując swoje naczynia.",
      ],
      en: [
        "If you would like to experience the full process of creating pottery on the wheel and dive deeper into the craft, this three-session course is the perfect option for you. During the course, you will go through all stages of the process — from preparing the clay to glazing and the final firing. :)",
        "Just like the one-time workshops, this course takes place in my intimate studio in Żoliborz, with a maximum of two participants per session. This allows me to give each person plenty of attention and guide you through every stage of the process.",
        "During the first session, you will learn the basics of working on the pottery wheel, prepare the clay, and create your first forms.",
        "During the second session, you will refine and shape your previously made pieces during the trimming stage (spoiler: it is an incredibly satisfying and addictive part of the process!).",
        "During the third session, you will learn what glazing is, and then put this knowledge into practice by glazing and decorating your own ceramics.",
      ],
    },
    priceLine: { pl: "Cena: 850 zł / 6–6,5 godz.", en: "Price: 850 PLN / 6–6.5 h" },
    pricePln: 850,
  },
];

export function getWorkshopMkFormat(id: WorkshopMkFormatId) {
  return workshopMkFormats.find((format) => format.id === id);
}

export function workshopMkLabel(format: WorkshopMkCopyBlock, language: Language) {
  return format.title[language];
}
