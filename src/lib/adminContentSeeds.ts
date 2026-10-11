import type { CertificateType } from "@/lib/certificate";
import { certificateTypeMeta } from "@/lib/certificate";
import { palinaStoryCopy, palinaStoryImages } from "@/lib/palinaStoryContent";
import { workshopMkFormats, type WorkshopMkFormatId } from "@/lib/workshopMkCopy";
import type { Bilingual } from "@/lib/adminTypes";

export type AdminPalinaStoryImageId = "japan" | "wheel" | "glaze" | "studio";

export type AdminPalinaStoryImage = {
  id: AdminPalinaStoryImageId;
  src: string;
  alt: Bilingual;
};

export type AdminPalinaStory = {
  sectionLabel: Bilingual;
  lead: Bilingual;
  origin: Bilingual;
  brand: Bilingual;
  workshops: Bilingual;
  craft: Bilingual;
  closing: Bilingual;
  images: AdminPalinaStoryImage[];
};

export type AdminWorkshopFormatCopy = {
  id: WorkshopMkFormatId;
  title: Bilingual;
  teaser: Bilingual;
  paragraphs: { en: string[]; pl: string[] };
  priceLine: Bilingual;
};

export type AdminVoucherTypeSettings = {
  id: CertificateType;
  label: Bilingual;
  detail: Bilingual;
  pricePln: number;
  pricePlnForTwo: number;
};

export type AdminVoucherSectionCopy = {
  eyebrow: Bilingual;
  title: Bilingual;
  subtitle: Bilingual;
  recipient: Bilingual;
  buyerEmail: Bilingual;
  typeLabel: Bilingual;
  participants: Bilingual;
  participantsHint: Bilingual;
  onePerson: Bilingual;
  twoPeople: Bilingual;
  submit: Bilingual;
  flowNote: Bilingual;
  success: Bilingual;
  errRecipient: Bilingual;
  errEmail: Bilingual;
  errConsent: Bilingual;
};

export type AdminWorkshopBookingCopy = {
  sent: Bilingual;
  hasVoucher: Bilingual;
  voucherNumber: Bilingual;
  voucherBring: Bilingual;
  errVoucherNumber: Bilingual;
};

export type AdminVoucherContent = {
  types: AdminVoucherTypeSettings[];
  section: AdminVoucherSectionCopy;
};

export function seedPalinaStory(): AdminPalinaStory {
  return {
    sectionLabel: { en: "About me", pl: "O mnie" },
    lead: { en: palinaStoryCopy.en.lead, pl: palinaStoryCopy.pl.lead },
    origin: { en: palinaStoryCopy.en.origin, pl: palinaStoryCopy.pl.origin },
    brand: { en: palinaStoryCopy.en.brand, pl: palinaStoryCopy.pl.brand },
    workshops: { en: palinaStoryCopy.en.workshops, pl: palinaStoryCopy.pl.workshops },
    craft: { en: palinaStoryCopy.en.craft, pl: palinaStoryCopy.pl.craft },
    closing: { en: palinaStoryCopy.en.closing, pl: palinaStoryCopy.pl.closing },
    images: (
      Object.entries(palinaStoryImages) as [
        AdminPalinaStoryImageId,
        (typeof palinaStoryImages)[keyof typeof palinaStoryImages],
      ][]
    ).map(([id, img]) => ({
      id,
      src: img.src,
      alt: { en: img.alt.en, pl: img.alt.pl },
    })),
  };
}

export function seedWorkshopFormatCopy(): AdminWorkshopFormatCopy[] {
  return workshopMkFormats.map((format) => ({
    id: format.id,
    title: { en: format.title.en, pl: format.title.pl },
    teaser: { en: format.teaser.en, pl: format.teaser.pl },
    paragraphs: {
      en: [...format.paragraphs.en],
      pl: [...format.paragraphs.pl],
    },
    priceLine: { en: format.priceLine.en, pl: format.priceLine.pl },
  }));
}

export function seedVoucherContent(): AdminVoucherContent {
  return {
    types: (["workshop-once", "pottery-course"] as CertificateType[]).map((id) => {
      const meta = certificateTypeMeta[id];
      return {
        id,
        label: { en: meta.label.en, pl: meta.label.pl },
        detail: { en: meta.detailEn, pl: meta.detailPl },
        pricePln: meta.pricePln,
        pricePlnForTwo: meta.pricePlnForTwo ?? meta.pricePln * 2,
      };
    }),
    section: {
      eyebrow: { en: "Gift card", pl: "Voucher" },
      title: { en: "Give a pottery workshop", pl: "Podaruj warsztat ceramiczny" },
      subtitle: {
        en: "Pick a voucher type and enter details — the preview updates live. After submitting, we'll reply by email.",
        pl: "Wybierz format vouchera i wpisz dane — podgląd aktualizuje się na żywo. Po wysłaniu odpiszemy mailowo.",
      },
      recipient: { en: "Recipient name", pl: "Imię odbiorcy" },
      buyerEmail: { en: "Your email", pl: "Twój email" },
      typeLabel: { en: "Voucher type", pl: "Rodzaj vouchera" },
      participants: { en: "Number of people", pl: "Liczba osób" },
      participantsHint: {
        en: "With 2 people, the card shows “for 2 people”.",
        pl: "Przy 2 osobach na voucherze pojawi się „dla 2 osób”.",
      },
      onePerson: { en: "1 person", pl: "1 osoba" },
      twoPeople: { en: "2 people", pl: "2 osoby" },
      submit: { en: "Send voucher request", pl: "Wyślij zapytanie o voucher" },
      flowNote: {
        en: "This is a request, not an instant purchase. We'll reply within 24–48 hours with next steps and your voucher.",
        pl: "To zapytanie, nie automatyczny zakup. Odpiszemy mailowo w ciągu 24–48 godzin z dalszymi krokami i voucherem.",
      },
      success: {
        en: "Thank you! Your request is in. We'll reply within 24–48 hours.",
        pl: "Dziękujemy! Zapytanie zostało wysłane. Odpiszemy w ciągu 24–48 godzin.",
      },
      errRecipient: { en: "Please enter the recipient name.", pl: "Podaj imię odbiorcy." },
      errEmail: { en: "Please enter a valid email.", pl: "Podaj poprawny email." },
      errConsent: { en: "Please accept the consent to continue.", pl: "Zaznacz zgodę, aby kontynuować." },
    },
  };
}

export function seedWorkshopBookingCopy(): AdminWorkshopBookingCopy {
  return {
    sent: {
      en: "Thank you! Your request is in. We'll reply within 24–48 hours.",
      pl: "Dziękujemy! Zapytanie zostało przyjęte. Odpiszemy w ciągu 24–48 godzin.",
    },
    hasVoucher: { en: "I have a voucher", pl: "Mam voucher" },
    voucherNumber: { en: "Voucher number", pl: "Numer vouchera" },
    voucherBring: {
      en: "Don't forget to bring your voucher (printed or digital) to the session.",
      pl: "Nie zapomnij zabrać ze sobą vouchera (papierowego lub cyfrowego) na zajęcia.",
    },
    errVoucherNumber: {
      en: "Please enter your voucher number.",
      pl: "Podaj numer vouchera.",
    },
  };
}

function mergeBilingualField(stored: Bilingual | undefined, fallback: Bilingual): Bilingual {
  if (!stored) return fallback;
  return {
    en: stored.en?.trim() ? stored.en : fallback.en,
    pl: stored.pl?.trim() ? stored.pl : fallback.pl,
  };
}

function migratePalinaSectionLabel(
  stored: AdminPalinaStory["sectionLabel"],
  seed: AdminPalinaStory["sectionLabel"]
): AdminPalinaStory["sectionLabel"] {
  const merged = mergeBilingualField(stored, seed);
  if (stored.pl?.trim() === "Historia") merged.pl = seed.pl;
  if (stored.en?.trim() === "Story") merged.en = seed.en;
  return merged;
}

/**
 * Previous default texts of the "About me" bento (the shortened version).
 * A stored value that still equals one of these was never edited by hand,
 * so it is upgraded to the current seed; manual edits are left alone.
 */
const LEGACY_PALINA_STORY: Record<
  "origin" | "brand" | "workshops" | "craft" | "closing",
  Bilingual
> = {
  origin: {
    pl: "Ceramika zaczęła się w 2021 — szukałam chwili spokoju i oderwania od pośpiechu. Przy kole odkryłam skupienie, uważność i radość tworzenia własnymi rękami.",
    en: "Ceramics began in 2021 — I was looking for calm away from the rush. At the wheel I found focus, mindfulness, and the joy of making with my hands.",
  },
  brand: {
    pl: "W 2023 glina stała się częścią życia, w 2025 odeszłam z korporacji i stworzyłam markę. Wierzę, że kreatywność jest w każdym z nas — czasem trzeba tylko przestrzeni.",
    en: "By 2023 clay was part of my life; in 2025 I left corporate work and built the brand. I believe creativity lives in all of us — we only need space.",
  },
  workshops: {
    pl: "Przez warsztaty daję innym miejsce na eksperyment, zwolnienie tempa i radość z tworzenia.",
    en: "Through workshops I offer room to experiment, slow down, and reconnect with the joy of making.",
  },
  craft: {
    pl: "Każdy przedmiot powstaje ręcznie na kole. Inspiruję się prostotą, naturą i japońską estetyką — rzeczami, które kształtują codzienne rytuały.",
    en: "Every piece is wheel-thrown by me, inspired by simplicity, nature, and Japanese aesthetics — objects that shape everyday rituals.",
  },
  closing: {
    pl: "Tworzę naczynia, które zachęcają do zatrzymania się i zauważenia piękna w prostych chwilach.",
    en: "I make vessels that invite us to pause and notice beauty in simple things.",
  },
};

function migratePalinaStoryText(
  stored: Bilingual | undefined,
  seed: Bilingual,
  legacy: Bilingual
): Bilingual {
  const merged = { ...mergeBilingualField(stored, seed) };
  if (merged.pl.trim() === legacy.pl) merged.pl = seed.pl;
  if (merged.en.trim() === legacy.en) merged.en = seed.en;
  return merged;
}

export function normalizePalinaStory(stored: AdminPalinaStory | undefined): AdminPalinaStory {
  const seed = seedPalinaStory();
  if (!stored?.lead?.en) return seed;
  return {
    sectionLabel: migratePalinaSectionLabel(stored.sectionLabel, seed.sectionLabel),
    lead: mergeBilingualField(stored.lead, seed.lead),
    origin: migratePalinaStoryText(stored.origin, seed.origin, LEGACY_PALINA_STORY.origin),
    brand: migratePalinaStoryText(stored.brand, seed.brand, LEGACY_PALINA_STORY.brand),
    workshops: migratePalinaStoryText(stored.workshops, seed.workshops, LEGACY_PALINA_STORY.workshops),
    craft: migratePalinaStoryText(stored.craft, seed.craft, LEGACY_PALINA_STORY.craft),
    closing: migratePalinaStoryText(stored.closing, seed.closing, LEGACY_PALINA_STORY.closing),
    images: seed.images.map((fallback) => {
      const hit = stored.images?.find((img) => img.id === fallback.id);
      return {
        id: fallback.id,
        src:
          hit?.src?.trim() && !/\/images\/about\/palina-[a-z]+\.webp$/.test(hit.src)
            ? hit.src
            : fallback.src,
        alt: mergeBilingualField(hit?.alt, fallback.alt),
      };
    }),
  };
}

export function normalizeWorkshopFormatCopy(
  stored: AdminWorkshopFormatCopy[] | undefined
): AdminWorkshopFormatCopy[] {
  const seed = seedWorkshopFormatCopy();
  if (!stored?.length) return seed;
  return seed.map((fallback) => {
    const hit = stored.find((item) => item.id === fallback.id);
    if (!hit) return fallback;
    return {
      id: fallback.id,
      title: mergeBilingualField(hit.title, fallback.title),
      teaser: mergeBilingualField(hit.teaser, fallback.teaser),
      priceLine: mergeBilingualField(hit.priceLine, fallback.priceLine),
      paragraphs: {
        en: hit.paragraphs?.en?.length ? hit.paragraphs.en : fallback.paragraphs.en,
        pl: hit.paragraphs?.pl?.length ? hit.paragraphs.pl : fallback.paragraphs.pl,
      },
    };
  });
}

export function normalizeVoucherContent(stored: AdminVoucherContent | undefined): AdminVoucherContent {
  const seed = seedVoucherContent();
  if (!stored?.section?.title?.en) return seed;
  return {
    types: seed.types.map((fallback) => {
      const hit = stored.types?.find((item) => item.id === fallback.id);
      if (!hit) return fallback;
      return {
        id: fallback.id,
        label: mergeBilingualField(hit.label, fallback.label),
        detail: mergeBilingualField(hit.detail, fallback.detail),
        pricePln: hit.pricePln > 0 ? hit.pricePln : fallback.pricePln,
        pricePlnForTwo: hit.pricePlnForTwo > 0 ? hit.pricePlnForTwo : fallback.pricePlnForTwo,
      };
    }),
    section: Object.fromEntries(
      (Object.keys(seed.section) as (keyof AdminVoucherSectionCopy)[]).map((key) => [
        key,
        mergeBilingualField(stored.section?.[key], seed.section[key]),
      ])
    ) as AdminVoucherSectionCopy,
  };
}

export function normalizeWorkshopBookingCopy(
  stored: AdminWorkshopBookingCopy | undefined
): AdminWorkshopBookingCopy {
  const seed = seedWorkshopBookingCopy();
  if (!stored?.sent?.en) return seed;
  return {
    sent: mergeBilingualField(stored.sent, seed.sent),
    hasVoucher: mergeBilingualField(stored.hasVoucher, seed.hasVoucher),
    voucherNumber: mergeBilingualField(stored.voucherNumber, seed.voucherNumber),
    voucherBring: mergeBilingualField(stored.voucherBring, seed.voucherBring),
    errVoucherNumber: mergeBilingualField(stored.errVoucherNumber, seed.errVoucherNumber),
  };
}
