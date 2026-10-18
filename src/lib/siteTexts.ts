import { customOrderContent, madeToOrderCategoryLabel, customOrderCatalogCard } from "@/lib/customOrderContent";
import { galleryHeader } from "@/lib/galleryContent";
import { workshopsHeader } from "@/lib/workshopsContent";
import { privacyMeta, privacySections } from "@/lib/privacyContent";
import { termsMeta, termsSections } from "@/lib/termsContent";

export type SiteTextBilingual = { en: string; pl: string };
export type AdminSiteTexts = Record<string, SiteTextBilingual>;

export type SiteTextGroup = "collections" | "madeToOrder" | "workshops" | "faq" | "menuFooter";

export type SiteTextDef = {
  key: string;
  group: SiteTextGroup;
  label: string;
  multiline?: boolean;
  pl: string;
  en: string;
};

export const SITE_TEXT_GROUPS: { id: SiteTextGroup; title: string; detail: string }[] = [
  {
    id: "collections",
    title: "Collections — headings",
    detail: "Title, line and button above the collection tiles on the homepage.",
  },
  {
    id: "madeToOrder",
    title: "Made to order",
    detail: "The “Na zamówienie” strip under the collections and the made-to-order page. Blank line = new paragraph.",
  },
  {
    id: "workshops",
    title: "Workshops — headings",
    detail: "Title and short lines above the booking block on the homepage.",
  },
  {
    id: "faq",
    title: "Questions & answers — headings",
    detail: "Title and small label above the FAQ.",
  },
  {
    id: "menuFooter",
    title: "Menu & footer",
    detail: "Menu labels (header, menu overlay, footer) and footer texts.",
  },
];

const mtoBody = {
  pl: customOrderContent.body.pl.join("\n\n"),
  en: customOrderContent.body.en.join("\n\n"),
};

export const SITE_TEXT_DEFS: SiteTextDef[] = [
  /* ── Section headings ─────────────────────────────── */
  { key: "collections.title", group: "collections", label: "Collections — title", pl: "Kolekcje", en: "Collections" },
  {
    key: "collections.headline",
    group: "collections",
    label: "Collections — line next to the button",
    pl: "Nie tylko talerz, nie tylko filiżanka",
    en: "Not just a plate, not just a cup",
  },
  {
    key: "collections.subtitle",
    group: "collections",
    label: "Collections — paragraph under the line",
    multiline: true,
    ...galleryHeader.subtitle,
  },
  { key: "collections.cta", group: "collections", label: "Collections — catalog button", pl: "Zobacz katalog", en: "View catalog" },
  { key: "workshops.eyebrow", group: "workshops", label: "Workshops — small label", ...workshopsHeader.eyebrow },
  { key: "workshops.title", group: "workshops", label: "Workshops — title", ...workshopsHeader.title },
  {
    key: "workshops.subtitle",
    group: "workshops",
    label: "Workshops — subtitle",
    multiline: true,
    ...workshopsHeader.subtitle,
  },
  { key: "workshops.giftLabel", group: "workshops", label: "Workshops — voucher link", pl: "Voucher na warsztat", en: "Workshop gift card" },
  { key: "workshops.giftHint", group: "workshops", label: "Workshops — voucher link hint", pl: "Podaruj sesję", en: "Give a session" },
  { key: "faq.label", group: "faq", label: "FAQ — small label", pl: "Najczęstsze pytania", en: "Common questions" },
  { key: "faq.title", group: "faq", label: "FAQ — title", pl: "Pytania i odpowiedzi", en: "Questions & answers" },

  /* ── Made to order ────────────────────────────────── */
  { key: "mto.label", group: "madeToOrder", label: "Name (strip, menu, filters)", ...madeToOrderCategoryLabel },
  { key: "mto.cardSubtitle", group: "madeToOrder", label: "Strip — small line", ...customOrderCatalogCard.subtitle },
  {
    key: "mto.stripDetail",
    group: "madeToOrder",
    label: "Strip — description",
    multiline: true,
    pl: "Forma, rozmiar i szkliwo — ustalamy wspólnie",
    en: "Shape, size & glaze — arranged together",
  },
  { key: "mto.stripPrice", group: "madeToOrder", label: "Price note (strip and page)", pl: "od 400 zł", en: "from 400 PLN" },
  { key: "mto.stripCta", group: "madeToOrder", label: "Strip — button", pl: "Szczegóły", en: "Details" },
  { key: "mto.title", group: "madeToOrder", label: "Page — title", ...customOrderContent.title },
  { key: "mto.subtitle", group: "madeToOrder", label: "Page — subtitle", ...customOrderContent.subtitle },
  { key: "mto.about", group: "madeToOrder", label: "Page — “about” heading", pl: "O zamówieniach", en: "About custom orders" },
  { key: "mto.body", group: "madeToOrder", label: "Page — main text", multiline: true, ...mtoBody },
  { key: "mto.contactHeading", group: "madeToOrder", label: "Page — contact heading", ...customOrderContent.contactHeading },

  /* ── Menu & footer ────────────────────────────────── */
  { key: "menu.groupShop", group: "menuFooter", label: "Menu group — shop", pl: "Sklep", en: "Shop" },
  { key: "menu.groupStudio", group: "menuFooter", label: "Menu group — studio", pl: "Pracownia", en: "Studio" },
  { key: "menu.groupInfo", group: "menuFooter", label: "Menu group — info", pl: "Informacje", en: "Info" },
  { key: "menu.collection", group: "menuFooter", label: "Menu — collection", pl: "Kolekcja", en: "Collection" },
  { key: "menu.shop", group: "menuFooter", label: "Menu — shop", pl: "Sklep", en: "Shop" },
  { key: "menu.customOrder", group: "menuFooter", label: "Menu — custom order (top bar)", pl: "Na zamówienie", en: "Custom order" },
  { key: "menu.workshops", group: "menuFooter", label: "Menu — workshops", pl: "Warsztaty", en: "Workshops" },
  { key: "menu.certificates", group: "menuFooter", label: "Menu — voucher", pl: "Voucher", en: "Gift card" },
  { key: "menu.about", group: "menuFooter", label: "Menu — about me", pl: "O mnie", en: "About me" },
  { key: "menu.delivery", group: "menuFooter", label: "Menu — delivery / FAQ", pl: "Dostawa", en: "Delivery" },
  { key: "menu.contact", group: "menuFooter", label: "Menu — contact", pl: "Kontakt", en: "Contact" },
  { key: "footer.studioTitle", group: "menuFooter", label: "Footer — studio title", pl: "Z pracowni", en: "From the studio" },
  {
    key: "footer.studioTagline",
    group: "menuFooter",
    label: "Footer — studio line",
    multiline: true,
    pl: "Powoli, jak w piecu — nowe prace, otwarte studio i notatki prosto z koła.",
    en: "Slow as the kiln — new pieces, open-studio dates, and wheel-side notes.",
  },
  { key: "footer.studioCta", group: "menuFooter", label: "Footer — Instagram link", pl: "Śledź na Instagramie", en: "Follow on Instagram" },
  {
    key: "footer.mission",
    group: "menuFooter",
    label: "Footer — brand line",
    multiline: true,
    pl: "Kamionina toczone na kole dla niespiesznych kuchni. Ceny z VAT, bez kosztów wysyłki.",
    en: "Small-batch wheel stoneware for unhurried kitchens. All prices incl. VAT excl. shipping.",
  },
  { key: "footer.menu", group: "menuFooter", label: "Footer — menu column title", pl: "Menu", en: "Menu" },
  { key: "footer.info", group: "menuFooter", label: "Footer — info column title", pl: "Informacje", en: "Information" },
  { key: "footer.catalog", group: "menuFooter", label: "Footer — catalog link", pl: "Katalog", en: "Catalog" },
  { key: "footer.privacy", group: "menuFooter", label: "Footer — privacy link", pl: "Polityka prywatności", en: "Privacy policy" },
  { key: "footer.terms", group: "menuFooter", label: "Footer — terms link", pl: "Regulamin sklepu", en: "Shop terms" },
  { key: "footer.workshopTerms", group: "menuFooter", label: "Footer — workshop terms link", pl: "Regulamin warsztatów", en: "Workshop terms" },
  { key: "footer.rights", group: "menuFooter", label: "Footer — copyright line", pl: "© Pali Ceramics · Warszawa", en: "© Pali Ceramics · Warsaw" },
];

const DEF_BY_KEY = new Map(SITE_TEXT_DEFS.map((def) => [def.key, def]));

export function hasSiteText(key: string): boolean {
  return DEF_BY_KEY.has(key);
}

export function siteTextDefault(key: string, lang: "pl" | "en"): string {
  return DEF_BY_KEY.get(key)?.[lang] ?? "";
}

export function resolveSiteText(overrides: AdminSiteTexts | undefined, key: string, lang: "pl" | "en"): string {
  const hit = overrides?.[key]?.[lang];
  if (typeof hit === "string" && hit.trim() !== "") return hit;
  return siteTextDefault(key, lang);
}

export function normalizeSiteTexts(raw: unknown): AdminSiteTexts {
  const out: AdminSiteTexts = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!DEF_BY_KEY.has(key) || !value || typeof value !== "object") continue;
    const v = value as Partial<SiteTextBilingual>;
    if (typeof v.pl === "string" && typeof v.en === "string") out[key] = { pl: v.pl, en: v.en };
  }
  return out;
}

/* ── Legal documents (privacy policy + shop terms) ───────────────── */

export type LegalSection = {
  title: SiteTextBilingual;
  body: { pl: string[]; en: string[] };
};

export type LegalDoc = {
  title: SiteTextBilingual;
  updated: SiteTextBilingual;
  intro: SiteTextBilingual;
  sections: LegalSection[];
};

export type AdminLegal = { privacy: LegalDoc; terms: LegalDoc; workshopTerms: LegalDoc };

function cloneSections(
  sections: { title: { pl: string; en: string }; body: { pl: string[]; en: string[] } }[]
): LegalSection[] {
  return sections.map((s) => ({
    title: { pl: s.title.pl, en: s.title.en },
    body: { pl: [...s.body.pl], en: [...s.body.en] },
  }));
}

export function seedLegal(): AdminLegal {
  return {
    privacy: {
      title: { ...privacyMeta.title },
      updated: { ...privacyMeta.updated },
      intro: { ...privacyMeta.intro },
      sections: cloneSections(privacySections),
    },
    terms: {
      title: { ...termsMeta.title },
      updated: { ...termsMeta.updated },
      intro: { ...termsMeta.intro },
      sections: cloneSections(termsSections),
    },
    workshopTerms: {
      title: { pl: "Regulamin warsztatów", en: "Workshop terms" },
      updated: { pl: "", en: "" },
      intro: { pl: "", en: "" },
      sections: [],
    },
  };
}

function isStr(v: unknown): v is string {
  return typeof v === "string";
}

function normalizeBilingual(v: unknown, fallback: SiteTextBilingual): SiteTextBilingual {
  const o = (v ?? {}) as Partial<SiteTextBilingual>;
  return { pl: isStr(o.pl) ? o.pl : fallback.pl, en: isStr(o.en) ? o.en : fallback.en };
}

function normalizeLegalDoc(raw: unknown, seed: LegalDoc): LegalDoc {
  const o = (raw ?? {}) as Partial<LegalDoc>;
  const sections = Array.isArray(o.sections)
    ? o.sections.map((s, i) => {
        const base = seed.sections[i] ?? { title: { pl: "", en: "" }, body: { pl: [], en: [] } };
        const body = (s?.body ?? {}) as Partial<LegalSection["body"]>;
        return {
          title: normalizeBilingual(s?.title, base.title),
          body: {
            pl: Array.isArray(body.pl) ? body.pl.filter(isStr) : base.body.pl,
            en: Array.isArray(body.en) ? body.en.filter(isStr) : base.body.en,
          },
        };
      })
    : seed.sections;
  return {
    title: normalizeBilingual(o.title, seed.title),
    updated: normalizeBilingual(o.updated, seed.updated),
    intro: normalizeBilingual(o.intro, seed.intro),
    sections,
  };
}

export function normalizeLegal(raw: unknown): AdminLegal {
  const seed = seedLegal();
  const o = (raw ?? {}) as Partial<AdminLegal>;
  return {
    privacy: normalizeLegalDoc(o.privacy, seed.privacy),
    terms: normalizeLegalDoc(o.terms, seed.terms),
    workshopTerms: normalizeLegalDoc(o.workshopTerms, seed.workshopTerms),
  };
}
