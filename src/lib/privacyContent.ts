import type { Language } from "@/types";

export type PrivacySection = {
  title: Record<Language, string>;
  body: Record<Language, string[]>;
};

export const privacyMeta = {
  title: {
    pl: "Polityka prywatności",
    en: "Privacy policy",
  },
  updated: {
    pl: "Ostatnia aktualizacja: lipiec 2026",
    en: "Last updated: July 2026",
  },
  intro: {
    pl: "Niniejsza polityka opisuje, jak Pali Ceramics (dalej: „Studio”) przetwarza dane osobowe w związku ze stroną paliceramics.com, rezerwacjami warsztatów, listą oczekujących oraz voucherami upominkowymi.",
    en: "This policy describes how Pali Ceramics (“the Studio”) processes personal data in connection with paliceramics.com, workshop bookings, waitlists, and gift vouchers.",
  },
};

export const privacySections: PrivacySection[] = [
  {
    title: {
      pl: "Administrator danych",
      en: "Data controller",
    },
    body: {
      pl: [
        "Administratorem danych jest Pali Ceramics, pracownia ceramiczna w Warszawie.",
        "W sprawach RODO można pisać na adres email podany w sekcji Kontakt na stronie.",
      ],
      en: [
        "The data controller is Pali Ceramics, a ceramic studio in Warsaw.",
        "For GDPR matters, contact us at the email address listed in the Contact section.",
      ],
    },
  },
  {
    title: {
      pl: "Jakie dane zbieramy",
      en: "What data we collect",
    },
    body: {
      pl: [
        "Rezerwacja warsztatu: imię, email, wybrany termin i format zajęć.",
        "Lista oczekujących: email, SKU produktu, język strony.",
        "Voucher upominkowy: imię odbiorcy, email kupującego, wybrany nominał.",
        "Nie zbieramy danych więcej niż potrzeba do obsługi zapytania.",
      ],
      en: [
        "Workshop booking: name, email, chosen date and session type.",
        "Waitlist: email, product SKU, site language.",
        "Gift voucher: recipient name, buyer email, chosen nominal.",
        "We collect only what is needed to handle your request.",
      ],
    },
  },
  {
    title: {
      pl: "Cele i podstawy prawne",
      en: "Purposes and legal bases",
    },
    body: {
      pl: [
        "Kontakt w sprawie rezerwacji lub dostępności produktu — art. 6 ust. 1 lit. b RODO (działania przed umową) lub lit. a (zgoda).",
        "Obsługa vouchera — art. 6 ust. 1 lit. b RODO.",
        "Marketing bezpośredni — wyłącznie po osobnej, dobrowolnej zgodzie.",
      ],
      en: [
        "Contact about bookings or product availability — GDPR Art. 6(1)(b) (pre-contract) or (a) (consent).",
        "Gift voucher handling — GDPR Art. 6(1)(b).",
        "Direct marketing — only with separate, voluntary consent.",
      ],
    },
  },
  {
    title: {
      pl: "Okres przechowywania",
      en: "Retention",
    },
    body: {
      pl: [
        "Zgłoszenia rezerwacji i voucherów: do 24 miesięcy od ostatniego kontaktu, chyba że przepisy wymagają dłużej.",
        "Lista oczekujących: do momentu wysłania powiadomienia lub wycofania zgody — maks. 12 miesięcy.",
        "Po upływie okresu dane są usuwane lub anonimizowane.",
      ],
      en: [
        "Booking and voucher requests: up to 24 months from last contact, unless law requires longer.",
        "Waitlist: until notification is sent or consent is withdrawn — max. 12 months.",
        "After retention expires, data is deleted or anonymised.",
      ],
    },
  },
  {
    title: {
      pl: "Twoje prawa",
      en: "Your rights",
    },
    body: {
      pl: [
        "Masz prawo dostępu, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu.",
        "Możesz wycofać zgodę w dowolnym momencie — bez wpływu na zgodność z prawem przetwarzania sprzed wycofania.",
        "Skarga do Prezesa UODO: uodo.gov.pl",
      ],
      en: [
        "You have the right of access, rectification, erasure, restriction, portability, and to object.",
        "You may withdraw consent at any time — without affecting lawfulness of processing before withdrawal.",
        "Complaint to the Polish DPA (UODO): uodo.gov.pl",
      ],
    },
  },
  {
    title: {
      pl: "Cookies i mapa",
      en: "Cookies & map",
    },
    body: {
      pl: [
        "Strona używa niezbędnych cookies (np. zapis języka, motywu, zgody na cookies).",
        "Embed mapy Google ładuje się dopiero po wyrażeniu zgody — mapa może ustawiać własne cookies Google.",
        "Szczegóły: polityka cookies Google Maps.",
      ],
      en: [
        "The site uses essential cookies (e.g. language, theme, cookie consent).",
        "Google Maps embed loads only after you consent — the map may set Google cookies.",
        "See Google Maps cookie policy for details.",
      ],
    },
  },
  {
    title: {
      pl: "Tryb demo (development)",
      en: "Demo mode (development)",
    },
    body: {
      pl: [
        "W wersji demonstracyjnej dane formularzy mogą być zapisywane lokalnie w przeglądarce (localStorage), a nie na serwerze produkcyjnym.",
        "Przed uruchomieniem produkcyjnym Studio wdroży backend, szyfrowane połączenie HTTPS i właściwe procedury backup.",
      ],
      en: [
        "In the demo build, form data may be stored locally in the browser (localStorage), not on a production server.",
        "Before go-live, the Studio will enable a backend, HTTPS, and proper backup procedures.",
      ],
    },
  },
];

export const cookieBannerCopy = {
  title: {
    pl: "Cookies i prywatność",
    en: "Cookies & privacy",
  },
  body: {
    pl: "Używamy niezbędnych cookies (język, motyw). Mapa Google ładuje się tylko po Twojej zgodzie. Więcej w polityce prywatności.",
    en: "We use essential cookies (language, theme). Google Maps loads only with your consent. See our privacy policy.",
  },
  accept: {
    pl: "Akceptuję mapę",
    en: "Accept map",
  },
  essential: {
    pl: "Tylko niezbędne",
    en: "Essential only",
  },
  policy: {
    pl: "Polityka prywatności",
    en: "Privacy policy",
  },
};

export const COOKIE_CONSENT_KEY = "pali-cookie-consent";
export type CookieConsent = "essential" | "maps";
