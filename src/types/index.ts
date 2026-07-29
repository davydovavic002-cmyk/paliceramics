export type Language = "en" | "pl";

export interface NavItem {
  id: string;
  href: string;
  kanji: string;
  label: Record<Language, string>;
}

export interface HeroContent {
  triadKanji: [string, string, string];
  arcCaption: Record<Language, string>;
  ctaPrimary: Record<Language, string>;
  ctaSecondary: Record<Language, string>;
  ctaPrimaryKanji: string;
  ctaSecondaryKanji: string;
  heroTag: Record<Language, string>;
  verticalKanji: string;
  brandTagline: Record<Language, string>;
  brandKatakana: string;
  lightScript: Record<Language, string>;
  lightStatement: Record<Language, { text: string; image?: "bowl" | "tableware" }[]>;
}

export interface BrandPillar {
  kanji: string;
  title: Record<Language, string>;
  text: Record<Language, string>;
}

export interface SiteContent {
  logo: {
    kanji: string;
    wordmark: Record<Language, string>;
    descriptor: string;
    subtitle: string;
  };
  nav: NavItem[];
  hero: HeroContent;
  specs: { label: Record<Language, string>; value: string }[];
  pillars: BrandPillar[];
  collectionLabel: Record<Language, string>;
}
