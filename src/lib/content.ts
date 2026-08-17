import type { SiteContent } from "@/types";

export const siteContent: SiteContent = {
  logo: {
    kanji: "陶",
    wordmark: { en: "Pali", pl: "Pali" },
    descriptor: "ceramics",
    subtitle: "手作り陶芸",
  },
  nav: [
    { id: "collection", href: "#collection", label: { en: "Collection", pl: "Kolekcja" } },
    { id: "shop", href: "/shop", label: { en: "Shop", pl: "Sklep" } },
    { id: "workshops", href: "#workshops", label: { en: "Workshops", pl: "Warsztaty" } },
    { id: "about", href: "#about", label: { en: "About", pl: "O nas" } },
  ],
  mobileNavExtra: [
    { id: "certificates", href: "#certificates", label: { en: "Gift card", pl: "Voucher" } },
  ],
  headerSections: [
    { id: "collection", href: "#collection", label: { en: "Collection", pl: "Kolekcja" } },
    { id: "workshops", href: "#workshops", label: { en: "Workshops", pl: "Warsztaty" } },
    { id: "certificates", href: "#certificates", label: { en: "Gift card", pl: "Voucher" } },
    { id: "about", href: "#about", label: { en: "About", pl: "O nas" } },
    { id: "delivery", href: "#delivery", label: { en: "Delivery", pl: "Dostawa" } },
    { id: "contact", href: "#contact", label: { en: "Contact", pl: "Kontakt" } },
  ],
  hero: {
    triadKanji: ["土", "火", "器"] as const,
    arcCaption: {
      en: "earth · fire · vessel",
      pl: "ziemia · ogień · naczynie",
    },
    ctaPrimary: { en: "Discover", pl: "Odkryj" },
    ctaSecondary: { en: "Contact", pl: "Kontakt" },
    ctaPrimaryKanji: "見",
    ctaSecondaryKanji: "問",
    heroTag: {
      en: "wheel stoneware · small-batch atelier · Warsaw",
      pl: "kamionina · mała pracownia · Warszawa",
    },
    verticalKanji: "静",
    brandTagline: {
      en: "wheel stoneware · small-batch atelier",
      pl: "kamionina ręcznie toczone · mała pracownia",
    },
    brandKatakana: "パリセラミックス",
    lightScript: { en: "a small atelier in a quiet prefecture", pl: "mała pracownia w cichej prefekturze" },
    lightStatement: {
      en: [
        { text: "We make ceramics for unhurried mornings — bowls, cups, and vessels " },
        { text: "", image: "bowl" },
        { text: " shaped slowly by hand, the way they have been for generations " },
        { text: "", image: "tableware" },
        { text: " in old houses like this one." },
      ],
      pl: [
        { text: "Tworzymy ceramikę na niespieszne poranki — miski, filiżanki i naczynia " },
        { text: "", image: "bowl" },
        { text: " formowane powoli ręką, tak jak przez pokolenia " },
        { text: "", image: "tableware" },
        { text: " w starych domach." },
      ],
    },
  },
  specs: [
    { label: { en: "clay body", pl: "masa gliniany" }, value: "stoneware" },
    { label: { en: "technique", pl: "technika" }, value: "wheel" },
    { label: { en: "glaze", pl: "szkliwo" }, value: "matte" },
    { label: { en: "firing", pl: "wypał" }, value: "cone 10" },
  ],
  pillars: [
    {
      kanji: "手",
      title: { en: "By hand", pl: "Ręcznie" },
      text: {
        en: "Every rim, every foot — shaped on the wheel, not in a mould.",
        pl: "Każde naczynie toczone na kole, nie z formy.",
      },
    },
    {
      kanji: "寂",
      title: { en: "Wabi-sabi", pl: "Wabi-sabi" },
      text: {
        en: "Unglazed patches, ash marks, the beauty of imperfection.",
        pl: "Nieszkliwione fragmenty, ślady popiołu, piękno niedoskonałości.",
      },
    },
    {
      kanji: "間",
      title: { en: "Ma — space", pl: "Ma — przestrzeń" },
      text: {
        en: "Quiet forms that leave room for tea, rice, morning light.",
        pl: "Ciche formy zostawiające miejsce na herbatę i poranek.",
      },
    },
  ],
  collectionLabel: {
    en: "001 — morning vessels",
    pl: "001 — poranne naczynia",
  },
};
