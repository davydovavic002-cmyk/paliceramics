import type { Bilingual } from "@/lib/adminTypes";
import { bookingContact } from "@/lib/workshopsContent";
import { images } from "@/lib/images";

export const MADE_TO_ORDER_CATEGORY_ID = "made-to-order";

export const MADE_TO_ORDER_SHOP_HREF = "/shop";

export const MADE_TO_ORDER_DETAIL_HREF = "/shop/made-to-order";

export const madeToOrderCategoryLabel: Bilingual = {
  pl: "Na zamówienie",
  en: "Made to order",
};

export const customOrderCatalogCard = {
  title: madeToOrderCategoryLabel,
  subtitle: {
    pl: "Zamówienia indywidualne i hurtowe",
    en: "Custom & wholesale orders",
  } satisfies Bilingual,
  image: images.heroVase,
  galleryImages: [
    images.heroVase,
    images.heroPlate,
    images.accentBowl,
    images.whiteLavaCup,
    images.accentTableware,
  ],
};

export const customOrderContent = {
  eyebrow: madeToOrderCategoryLabel,
  title: {
    pl: "Zamówienia indywidualne",
    en: "Custom orders",
  },
  subtitle: {
    pl: "Współpraca i zamówienia hurtowe",
    en: "Wholesale and collaboration",
  },
  minOrder: {
    pl: "Minimalna wartość zamówienia indywidualnego wynosi 400 zł.",
    en: "The minimum order value for custom orders is 400 PLN.",
  },
  body: {
    pl: [
      "Realizuję zamówienia wyłącznie na podstawie istniejących wzorów — zarówno tych dostępnych obecnie, jak i tych, które były wcześniej w sprzedaży.",
      "Aby sprawdzić, czy będę w stanie podjąć się realizacji zamówienia, oraz otrzymać wycenę i informację o przewidywanym czasie oczekiwania, skontaktuj się ze mną przez e-mail, Messenger lub Instagram. W wiadomości prześlij zdjęcie lub link do interesującego Cię przedmiotu oraz podaj liczbę potrzebnych sztuk.",
      "Postaram się jak najszybciej wrócić z odpowiedzią i szczegółami dotyczącymi realizacji.",
    ],
    en: [
      "I accept custom orders only for existing designs — both currently available pieces and designs that have been previously sold.",
      "To check whether I am able to take on your order and receive a quote along with the estimated production time, please contact me via email, Messenger, or Instagram. In your message, please include a photo or link to the piece you are interested in and the quantity you would like to order.",
      "I will get back to you as soon as possible with the details and further information about the process.",
    ],
  },
  contactHeading: {
    pl: "Kontakt",
    en: "Contact",
  },
  email: bookingContact.email,
  facebook: bookingContact.facebook,
  instagram: bookingContact.instagram,
};

export function isMadeToOrderCategory(categoryId: string | null): boolean {
  return categoryId === MADE_TO_ORDER_CATEGORY_ID;
}
