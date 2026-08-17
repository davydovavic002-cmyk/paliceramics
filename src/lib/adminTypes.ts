import type { ItemStatus } from "@/lib/galleryContent";
import { galleryItems } from "@/lib/galleryContent";
import { calendarSlots, workshopFormats } from "@/lib/workshopsContent";
import { siteContent } from "@/lib/content";
import { galleryHeader } from "@/lib/galleryContent";
import { workshopsHeader } from "@/lib/workshopsContent";
import { aboutHeader, hotspots } from "@/lib/aboutContent";
import { bookingContact } from "@/lib/workshopsContent";
import {
  dedupeCollections,
  dedupePieceTypes,
  migrateLegacyCategories,
  normalizeCollection,
  normalizePieceType,
  resolveCollections,
  resolvePieceTypes,
  seedCollections,
  seedPieceTypes,
  sortCollections,
  slugifyCatalogId,
  canonicalCollectionId,
} from "@/lib/catalogConfig";
import { productCollectionById, productPieceTypeById, LEGACY_CATEGORY_IDS } from "@/lib/lookbookCollections";
import { syncWorkshopsWithInbox, createWorkshopSlot as buildWorkshopSlot } from "@/lib/workshopCalendar";

export type Bilingual = { en: string; pl: string };

export type AdminCategoryItem = {
  id: string;
  label: string;
};

/** Shop collection — editable in admin, shown in catalog & lookbook. */
export type AdminCollection = {
  id: string;
  name: Bilingual;
  subtitle: Bilingual;
  coverImageUrl?: string;
  coverImageLabel?: string;
  /** When true, tile appears in the homepage lookbook grid (max 4). */
  showInLookbook?: boolean;
};

/** Ceramic piece type filter — editable in admin. */
export type AdminPieceType = {
  id: string;
  name: Bilingual;
};

export type AdminProductSpecs = {
  clayBody: Bilingual;
  glaze: Bilingual;
  firing: Bilingual;
  dimensions: Bilingual;
};

export type AdminProduct = {
  id: string;
  sku: string;
  title: string;
  pricePln: number;
  stock: number;
  categoryId: string;
  pieceTypeId: string;
  status: ItemStatus;
  imageLabel: string;
  /** Uploaded photo — data URL locally or /uploads/… on server. */
  imageUrl?: string;
  /** Gallery photos — first item is the cover image. */
  imageUrls?: string[];
  description: Bilingual;
  specs: AdminProductSpecs;
};

export function normalizeProductSku(value: string): string {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) return "";
  if (/^PALI-\d+$/.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/^PALI-?/i, "").replace(/\D/g, "");
  if (digits) return `PALI-${digits.padStart(3, "0")}`;
  return trimmed.startsWith("PALI-") ? trimmed : `PALI-${trimmed}`;
}

export function productPhotos(product: Pick<AdminProduct, "imageUrl" | "imageUrls">): string[] {
  if (product.imageUrls?.length) return product.imageUrls;
  return product.imageUrl ? [product.imageUrl] : [];
}

export const defaultProductDescription: Bilingual = {
  en: "Wheel-thrown stoneware from the Pali studio — cone 10 fired, small batch.",
  pl: "Kamionina toczone na kole w pracowni Pali — wypał cone 10, mała seria.",
};

export function defaultAdminProductSpecs(): AdminProductSpecs {
  return {
    clayBody: { en: "Stoneware", pl: "Kamionina" },
    glaze: { en: "Matte glaze", pl: "Matowe szkliwo" },
    firing: { en: "Cone 10 · 1,285°C", pl: "Cone 10 · 1 285°C" },
    dimensions: { en: "—", pl: "—" },
  };
}

function mergeBilingual(override: Bilingual | undefined, fallback: Bilingual): Bilingual {
  if (!override) return fallback;
  return {
    en: override.en?.trim() ? override.en : fallback.en,
    pl: override.pl?.trim() ? override.pl : fallback.pl,
  };
}

function galleryItemForProduct(product: Pick<AdminProduct, "id" | "sku">) {
  return galleryItems.find((item) => item.id === product.id || item.sku === product.sku);
}

export function normalizeProductDetails(product: AdminProduct): AdminProduct {
  const gallery = galleryItemForProduct(product);
  const specFallback = gallery?.specs ?? defaultAdminProductSpecs();
  const descriptionFallback = gallery?.description ?? defaultProductDescription;

  return {
    ...product,
    description: mergeBilingual(product.description, descriptionFallback),
    specs: {
      clayBody: mergeBilingual(product.specs?.clayBody, specFallback.clayBody),
      glaze: mergeBilingual(product.specs?.glaze, specFallback.glaze),
      firing: mergeBilingual(product.specs?.firing, specFallback.firing),
      dimensions: mergeBilingual(product.specs?.dimensions, specFallback.dimensions),
    },
  };
}

export type InboxMessageType = "waitlist" | "booking" | "certificate" | "contact";

export type AdminInboxMessage = {
  id: string;
  type: InboxMessageType;
  createdAt: string;
  read: boolean;
  payload: Record<string, string>;
};

export type AdminWorkshopSlot = {
  id: string;
  /** YYYY-MM-DD for calendar sorting */
  isoDate: string;
  day: string;
  date: string;
  time: string;
  workshopTypeId: string;
  /** Total places in this slot */
  capacity: number;
  /** Remaining open places (synced from inbox + manual edits) */
  spots: number;
  /** Manual close — blocks booking even if spots remain */
  closed?: boolean;
  /** @deprecated use closed — kept for public site compat */
  available: boolean;
};

export type AdminWorkshopType = {
  id: string;
  label: Bilingual;
  description: Bilingual;
  pricePln: number;
  duration: Bilingual;
  enabled: boolean;
};

export type AdminAnnouncement = {
  enabled: boolean;
  title: Bilingual;
  message: Bilingual;
  cta: Bilingual;
  href: string;
  showUntil: string;
};

export type AdminSpotlight = {
  enabled: boolean;
  badge: Bilingual;
  title: Bilingual;
  body: Bilingual;
  href: string;
};

export type AdminSectionCopy = {
  eyebrow: Bilingual;
  title: Bilingual;
  subtitle: Bilingual;
};

export type AdminSiteCopy = {
  announcement: AdminAnnouncement;
  spotlight: AdminSpotlight;
  heroTag: Bilingual;
  gallery: AdminSectionCopy;
  workshops: AdminSectionCopy;
  about: AdminSectionCopy;
};

export type AdminFaqItem = {
  id: string;
  question: Bilingual;
  answer: Bilingual;
};

export type AdminReview = {
  id: string;
  author: string;
  text: Bilingual;
  visible: boolean;
};

export type AdminContacts = {
  address: Bilingual;
  hours: Bilingual;
  email: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  mapEmbedUrl: string;
};

export type AdminDelivery = {
  pickupTitle: Bilingual;
  pickupBody: Bilingual;
  shippingTitle: Bilingual;
  shippingBody: Bilingual;
};

export type AdminAboutBlock = {
  id: string;
  title: Bilingual;
  body: Bilingual;
};

export type AdminPersistedData = {
  /** @deprecated migrated to collections */
  categories?: AdminCategoryItem[];
  collections: AdminCollection[];
  pieceTypes: AdminPieceType[];
  products: AdminProduct[];
  workshopTypes: AdminWorkshopType[];
  workshops: AdminWorkshopSlot[];
  siteCopy: AdminSiteCopy;
  inbox: AdminInboxMessage[];
  faq: AdminFaqItem[];
  reviews: AdminReview[];
  contacts: AdminContacts;
  delivery: AdminDelivery;
  aboutBlocks: AdminAboutBlock[];
};

export const ADMIN_DEMO_PASSWORD = "pali";
export const ADMIN_DATA_KEY = "pali-admin-data";
export const ADMIN_UPDATE_EVENT = "pali-admin-update";

export const adminCatalogStatuses: { value: "available" | "sold"; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
];

/** @deprecated Use adminCatalogStatuses — made-to-order is a separate shop card, not catalog stock. */
export const adminStatuses: { value: ItemStatus; label: string }[] = [
  ...adminCatalogStatuses,
];

export const ADMIN_IDEA_SUGGESTIONS = [
  {
    title: "Inquiry inbox",
    detail: "See WhatsApp / Telegram booking messages in one calm feed.",
  },
  {
    title: "Waitlist for sold pieces",
    detail: "Collect emails when a bowl sells out; notify when a similar glaze returns.",
  },
  {
    title: "Shipping & pickup notes",
    detail: "Studio pickup vs courier zones — shown at checkout and in booking modal.",
  },
  {
    title: "Seasonal presets",
    detail: "One-click switch to “Holiday Market” or “Open Studio” copy + banner.",
  },
  {
    title: "Simple analytics",
    detail: "Weekly views, top pieces, workshop fill rate — no Google Analytics stress.",
  },
];

export function slugifyCategory(label: string): string {
  const base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `category-${Date.now()}`;
}

export function seedCategories(): AdminCategoryItem[] {
  return seedCollections().map((collection) => ({
    id: collection.id,
    label: collection.name.en,
  }));
}

export function seedProducts(collections: AdminCollection[]): AdminProduct[] {
  const stockById: Record<string, number> = {
    "001": 1,
    "002": 0,
    "003": 0,
    "004": 1,
    "005": 4,
    "006": 0,
  };

  return galleryItems.map((item) => ({
    id: item.id,
    sku: item.sku,
    title: item.name.en,
    pricePln: item.pricePln ?? 0,
    stock: stockById[item.id] ?? (item.status === "available" ? 1 : 0),
    categoryId:
      productCollectionById[item.id] ??
      collections.find((c) => c.id === item.category)?.id ??
      collections[0]?.id ??
      "matte-ash",
    pieceTypeId: productPieceTypeById[item.id] ?? "bowls",
    status: item.status === "made-to-order" ? "sold" : item.status,
    imageLabel: item.image.split("/").pop() ?? "photo.png",
    imageUrl: item.image,
    imageUrls: item.images?.length ? item.images : [item.image],
    description: item.description ?? defaultProductDescription,
    specs: item.specs,
  }));
}

export function seedWorkshopTypes(): AdminWorkshopType[] {
  return workshopFormats.map((format) => ({
    id: format.id,
    label: format.title,
    description: format.subtitle,
    pricePln: format.pricePln,
    duration: format.duration,
    enabled: true,
  }));
}

export function seedWorkshops(): AdminWorkshopSlot[] {
  const defaultTypeId = workshopFormats[0]?.id ?? "one-time";
  const year = new Date().getFullYear();

  return calendarSlots.map((slot, index) => {
    const isoDate = `${year}-08-${String(13 + (index % 5)).padStart(2, "0")}`;
    const capacity = Math.max(slot.spots, 2);
    return buildWorkshopSlot({
      isoDate,
      time: slot.time,
      workshopTypeId: index % 2 === 0 ? "one-time" : "three-session",
      capacity,
    });
  }).map((slot, index) => ({
    ...slot,
    id: calendarSlots[index]?.id ?? slot.id,
    day: calendarSlots[index]?.day.en ?? slot.day,
    date: calendarSlots[index]?.date ?? slot.date,
    spots: calendarSlots[index]?.spots ?? slot.spots,
    closed: (calendarSlots[index]?.spots ?? 0) <= 0,
    available: (calendarSlots[index]?.spots ?? 0) > 0,
  }));
}

export function seedFaq(): AdminFaqItem[] {
  return [
    {
      id: "faq-1",
      question: {
        en: "Shipping and order collection",
        pl: "Wysyłka i odbiór zamówień",
      },
      answer: {
        en: "Free local pickup is available in Warsaw after arranging a time via email, Instagram, or Facebook.\n\nI also offer shipping to InPost parcel lockers — the delivery cost is covered by the buyer.\n\nInternational shipping is available as well. If you would like to place an international order, please contact me via email — we will arrange the most suitable shipping method and calculate the delivery cost individually.",
        pl: "Dostępny jest darmowy odbiór osobisty w Warszawie po wcześniejszym kontakcie mailowym, przez Instagram lub Facebook.\n\nMożliwa jest również wysyłka do paczkomatu InPost — koszt dostawy pokrywa kupujący.\n\nWysyłka za granicę jest również możliwa. Jeśli chcesz złożyć zamówienie zagraniczne, skontaktuj się ze mną mailowo — wspólnie ustalimy najdogodniejszy sposób wysyłki oraz indywidualnie wyliczymy koszt dostawy.",
      },
    },
    {
      id: "faq-2",
      question: {
        en: "Returns",
        pl: "Zwroty",
      },
      answer: {
        en: "I accept returns within 14 days of receiving the package. Please note that the cost of return shipping is covered by the buyer.\n\nPlease carefully review the product photos before purchasing. Each piece is handmade, which means that small variations and imperfections may occur. These details are part of the unique character of each piece. I always do my best to show and describe them clearly. They do not affect the functionality of the product unless stated otherwise in the description.\n\nOrders are shipped within a maximum of 7 days after the payment has been received.",
        pl: "Akceptuję zwroty w ciągu 14 dni od otrzymania przesyłki. Proszę jednak pamiętać, że koszt przesyłki zwrotnej pokrywa kupujący.\n\nPrzed zakupem proszę dokładnie obejrzeć zdjęcia produktu. Każdy przedmiot jest wykonywany ręcznie, dlatego mogą występować drobne różnice i niedoskonałości, które są częścią jego unikalnego charakteru. Staram się zawsze pokazywać je na zdjęciach i opisywać w szczegółach. Nie wpływają one na funkcjonalność produktu, chyba że zostało to zaznaczone w opisie.\n\nZamówienia wysyłam w ciągu maksymalnie 7 dni od zaksięgowania płatności.",
      },
    },
    {
      id: "faq-3",
      question: {
        en: "None of the workshop dates listed on the website work for me. What can I do?",
        pl: "Nie pasuje mi żaden termin warsztatów podany na stronie. Co dalej?",
      },
      answer: {
        en: "No problem! If none of the available dates suit you, feel free to contact me — whenever possible, I can adjust the time or add an additional workshop date.\n\nSend me a message via email, Instagram, or Facebook with the days and times that would work best for you. I will check availability and we will find a suitable date together. :)",
        pl: "Nic straconego! Jeśli żaden z dostępnych terminów nie pasuje, napisz do mnie — w miarę możliwości mogę zmienić godzinę lub dodać dodatkowy termin.\n\nWyślij wiadomość mailowo, przez Instagram lub Facebook, podając, jakie dni i godziny byłyby dla Ciebie najwygodniejsze. Sprawdzę dostępność i wspólnie wybierzemy najlepszy termin. :)",
      },
    },
    {
      id: "faq-4",
      question: {
        en: "Can I buy a workshop voucher?",
        pl: "Czy można kupić voucher na warsztaty?",
      },
      answer: {
        en: "Yes, it is possible to purchase a workshop voucher. It can be a great gift for someone who would like to try ceramics or spend time creating something by hand.\n\nThe voucher is valid for 3 months from the date of purchase.",
        pl: "Tak, istnieje możliwość zakupu vouchera na warsztaty. Jest to dobry pomysł na prezent dla osoby, która chciałaby spróbować swoich sił w ceramice lub spędzić kreatywnie czas.\n\nVoucher można wykorzystać w ciągu 3 miesięcy od daty zakupu.",
      },
    },
  ];
}

function isLegacyFaq(faq: AdminFaqItem[]): boolean {
  return faq.some(
    (item) =>
      item.id === "faq-1" && item.question.en === "How do I book a workshop?"
  );
}

export function seedReviews(): AdminReview[] {
  return [
    {
      id: "rev-1",
      author: "Marta K.",
      text: {
        en: "The quietest, most focused afternoon I've had in years. Left with two bowls and zero stress.",
        pl: "Najspokojniejsze popołudnie od lat. Wyszłam z dwiema miskami i bez stresu.",
      },
      visible: true,
    },
    {
      id: "rev-2",
      author: "Tom & Ania",
      text: {
        en: "Pottery date felt intimate — not a class, a shared rhythm at the wheel.",
        pl: "Randka przy glinie była intymna — nie kurs, wspólny rytm koła.",
      },
      visible: true,
    },
    {
      id: "rev-3",
      author: "Elena",
      text: {
        en: "Matte ash glaze on my cup still makes every morning slower, in the best way.",
        pl: "Matowe szkliwo na kubku nadal spowalnia każdy poranek — w najlepszy sposób.",
      },
      visible: true,
    },
  ];
}

export function seedContacts(): AdminContacts {
  return {
    address: {
      pl: "Miejsce prowadzenia warsztatów: aleja Wojska Polskiego 29, 01-515 Warszawa, pracownia STRUM",
      en: "Workshops address: aleja Wojska Polskiego 29, 01-515 Warszawa, pracownia STRUM",
    },
    hours: {
      en: "",
      pl: "",
    },
    email: bookingContact.email,
    instagram: bookingContact.instagram,
    facebook: bookingContact.facebook,
    whatsapp: bookingContact.whatsapp,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=aleja+Wojska+Polskiego+29,+01-515+Warszawa&output=embed",
  };
}

function isLegacyContacts(contacts: AdminContacts): boolean {
  return (
    contacts.email === "hello@paliceramics.com" ||
    contacts.address.en.includes("Praga district") ||
    contacts.address.pl.includes("Praga, Warszawa")
  );
}

function normalizeContacts(contacts: AdminContacts | undefined): AdminContacts {
  const seed = seedContacts();
  if (!contacts?.email) return seed;
  if (isLegacyContacts(contacts)) return seed;
  return {
    ...seed,
    ...contacts,
    facebook: contacts.facebook ?? seed.facebook,
    address: contacts.address?.en ? contacts.address : seed.address,
    hours: contacts.hours ?? seed.hours,
  };
}

export function seedDelivery(): AdminDelivery {
  return {
    pickupTitle: {
      en: "Studio pickup",
      pl: "Odbiór w pracowni",
    },
    pickupBody: {
      en: "Collect your fired pieces at the Warsaw atelier — we'll agree a time slot after firing. Free of charge.",
      pl: "Odbierz wypalone prace w warszawskiej pracowni — ustalimy termin po wypale. Bez opłat.",
    },
    shippingTitle: {
      en: "Shipping across Poland",
      pl: "Wysyłka w Polsce",
    },
    shippingBody: {
      en: "Careful packaging for stoneware — courier rates depend on size. Quote on request via email.",
      pl: "Bezpieczne pakowanie kamioniny — koszt kuriera zależy od rozmiaru. Wycena na email.",
    },
  };
}

export function seedAboutBlocks(): AdminAboutBlock[] {
  return hotspots.map((spot) => ({
    id: spot.id,
    title: spot.label,
    body: spot.body,
  }));
}

export function seedSiteCopy(): AdminSiteCopy {
  return {
    announcement: {
      enabled: false,
      title: { en: "Open Studio Weekend", pl: "Weekend otwartego studia" },
      message: {
        en: "Aug 16–17 — visit the wheel, meet Palina, browse fresh glaze tests.",
        pl: "16–17 sie — odwiedź pracownię, poznaj Palinę, zobacz nowe próby szkliw.",
      },
      cta: { en: "Reserve a spot", pl: "Zarezerwuj miejsce" },
      href: "#workshops",
      showUntil: "",
    },
    spotlight: {
      enabled: false,
      badge: { en: "Special event", pl: "Wydarzenie" },
      title: { en: "Summer glaze firing open day", pl: "Letni dzień otwarty wypału" },
      body: {
        en: "Watch cone-10 unload, sip tea, take home a small cup — limited seats.",
        pl: "Zobacz rozładunek cone 10, herbata, mały kubek na wynos — ograniczona liczba miejsc.",
      },
      href: "#workshops",
    },
    heroTag: siteContent.hero.heroTag,
    gallery: galleryHeader,
    workshops: workshopsHeader,
    about: aboutHeader,
  };
}

export function seedAdminData(): AdminPersistedData {
  const collections = seedCollections();
  const pieceTypes = seedPieceTypes();
  return {
    collections,
    pieceTypes,
    products: seedProducts(collections),
    workshopTypes: seedWorkshopTypes(),
    workshops: seedWorkshops(),
    siteCopy: seedSiteCopy(),
    inbox: [],
    faq: seedFaq(),
    reviews: seedReviews(),
    contacts: seedContacts(),
    delivery: seedDelivery(),
    aboutBlocks: seedAboutBlocks(),
  };
}

export function normalizeAdminData(data: AdminPersistedData): AdminPersistedData {
  const rawWorkshopTypes =
    Array.isArray(data.workshopTypes) && data.workshopTypes.length > 0
      ? data.workshopTypes
      : seedWorkshopTypes();
  const hasLegacyWorkshopTypes = rawWorkshopTypes.some((type) =>
    ["pottery-date", "solo-session"].includes(type.id)
  );
  const workshopTypes = hasLegacyWorkshopTypes ? seedWorkshopTypes() : rawWorkshopTypes;
  const defaultWorkshopTypeId = workshopTypes[0]?.id ?? "one-time";
  const inbox = Array.isArray(data.inbox) ? data.inbox : [];
  const workshops = syncWorkshopsWithInbox(
    Array.isArray(data.workshops) && data.workshops.length > 0 ? data.workshops : seedWorkshops(),
    inbox,
    defaultWorkshopTypeId
  );

  const faq =
    Array.isArray(data.faq) && data.faq.length > 0
      ? isLegacyFaq(data.faq)
        ? seedFaq()
        : data.faq
      : seedFaq();
  const reviews =
    Array.isArray(data.reviews) && data.reviews.length > 0 ? data.reviews : seedReviews();
  const contacts = normalizeContacts(data.contacts);
  const delivery = data.delivery?.pickupTitle ? data.delivery : seedDelivery();
  const aboutBlocks =
    Array.isArray(data.aboutBlocks) && data.aboutBlocks.length > 0
      ? data.aboutBlocks
      : seedAboutBlocks();

  const hasLegacyCatalog =
    !Array.isArray(data.collections) ||
    data.collections.length === 0 ||
    (Array.isArray(data.categories) &&
      (data.categories.length === 0 ||
        data.categories.some((category) => LEGACY_CATEGORY_IDS.has(category.id))));

  const collections = sortCollections(
    dedupeCollections(
      (hasLegacyCatalog
        ? Array.isArray(data.categories) && data.categories.length > 0
          ? migrateLegacyCategories(data.categories).map((collection) =>
              normalizeCollection(collection)
            )
          : seedCollections()
        : resolveCollections(data)
      ).map((collection) => normalizeCollection(collection))
    )
  );

  const pieceTypes = dedupePieceTypes(
    resolvePieceTypes(data).map((pieceType) => normalizePieceType(pieceType))
  );

  const products = data.products.map((product) => {
    const { priceUsd: _removed, ...rest } = product as AdminProduct & {
      priceUsd?: number;
    };
    const migratedCategoryId = hasLegacyCatalog
      ? (productCollectionById[rest.id] ??
        collections.find((c) => c.id === rest.categoryId)?.id ??
        collections[0]?.id ??
        "matte-ash")
      : (() => {
          const canonical = canonicalCollectionId(rest.categoryId);
          if (collections.some((c) => c.id === rest.categoryId)) return rest.categoryId;
          if (collections.some((c) => c.id === canonical)) return canonical;
          return collections[0]?.id ?? "matte-ash";
        })();

    const pieceTypeId =
      rest.pieceTypeId && pieceTypes.some((type) => type.id === rest.pieceTypeId)
        ? rest.pieceTypeId
        : (productPieceTypeById[rest.id] ?? pieceTypes[0]?.id ?? "bowls");

    return normalizeProductDetails({
      ...rest,
      categoryId: migratedCategoryId,
      pieceTypeId,
      status: rest.status === "made-to-order" ? "sold" : rest.status,
      imageUrls:
        rest.imageUrls?.length
          ? rest.imageUrls
          : rest.imageUrl
            ? [rest.imageUrl]
            : undefined,
      imageUrl: rest.imageUrls?.[0] ?? rest.imageUrl,
      stock:
        typeof rest.stock === "number" && Number.isFinite(rest.stock)
          ? Math.max(0, Math.round(rest.stock))
          : rest.status === "available"
            ? 1
            : 0,
      description: rest.description ?? { en: "", pl: "" },
      specs: rest.specs ?? defaultAdminProductSpecs(),
    });
  });

  const { categories: _legacyCategories, ...rest } = data;

  return {
    ...rest,
    collections,
    pieceTypes,
    inbox,
    workshopTypes,
    workshops,
    faq,
    reviews,
    contacts,
    delivery,
    aboutBlocks,
    products,
  };
}

export function loadAdminData(): AdminPersistedData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_DATA_KEY);
    if (!raw) return null;
    return normalizeAdminData(JSON.parse(raw) as AdminPersistedData);
  } catch {
    return null;
  }
}

export function addInboxMessage(
  type: InboxMessageType,
  payload: Record<string, string>
) {
  const data = loadAdminData() ?? seedAdminData();
  const entry: AdminInboxMessage = {
    id: `msg-${Date.now().toString(36)}`,
    type,
    createdAt: new Date().toISOString(),
    read: false,
    payload,
  };
  const inbox = [entry, ...data.inbox];
  const defaultWorkshopTypeId = data.workshopTypes[0]?.id ?? "one-time";
  const workshops =
    type === "booking" && payload.slotId
      ? syncWorkshopsWithInbox(data.workshops, inbox, defaultWorkshopTypeId)
      : data.workshops;

  saveAdminData({ ...data, inbox, workshops });
  return entry;
}

export function saveAdminData(data: AdminPersistedData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(ADMIN_UPDATE_EVENT));
}

export function pickBilingual(
  override: Bilingual | undefined,
  fallback: Bilingual,
  lang: "en" | "pl"
): string {
  const custom = override?.[lang]?.trim();
  return custom || fallback[lang];
}

export function pickSectionCopy(
  override: AdminSectionCopy | undefined,
  fallback: AdminSectionCopy,
  lang: "en" | "pl"
) {
  return {
    eyebrow: pickBilingual(override?.eyebrow, fallback.eyebrow, lang),
    title: pickBilingual(override?.title, fallback.title, lang),
    subtitle: pickBilingual(override?.subtitle, fallback.subtitle, lang),
  };
}
