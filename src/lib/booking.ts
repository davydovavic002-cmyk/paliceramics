import type { Language } from "@/types";
import { bookingContact } from "./workshopsContent";

export function buildBookingMessage(details: string, language: Language) {
  const name = bookingContact.hostName;
  if (language === "pl") {
    return `Cześć ${name}! Chciałbym/chciałabym zarezerwować ${details}. Proszę o potwierdzenie terminu. Dziękuję!`;
  }
  return `Hi ${name}! I'd like to book ${details}. Please confirm availability. Thank you!`;
}

export function whatsappUrl(message: string) {
  const digits = bookingContact.whatsapp.replace(/\D/g, "");
  if (!digits) return "#";
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export function normalizeEmailAddress(raw: string): string {
  return raw.trim().replace(/^mailto:/i, "");
}

export function mailtoHref(email: string, subject: string, body: string): string {
  const address = normalizeEmailAddress(email);
  if (!address) return "";
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function gmailComposeHref(email: string, subject: string, body: string): string {
  const address = normalizeEmailAddress(email);
  if (!address) return "";

  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: address,
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** Prefer Gmail web compose for @gmail addresses — works without a desktop mail client. */
export function emailComposeHref(email: string, subject: string, body: string): string {
  const address = normalizeEmailAddress(email);
  if (!address) return "";

  const domain = address.split("@")[1]?.toLowerCase() ?? "";
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return gmailComposeHref(address, subject, body);
  }

  return mailtoHref(address, subject, body);
}

export function openEmailCompose(href: string) {
  if (!href || typeof window === "undefined") return;

  if (href.startsWith("http")) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function mailtoUrl(subject: string, body: string) {
  return mailtoHref(bookingContact.email, subject, body);
}

export function buildProductPurchaseMessage(
  productTitle: string,
  sku: string,
  pricePln: number,
  language: Language,
  productUrl?: string
) {
  const pricePart = pricePln > 0 ? `, ${pricePln} PLN` : "";
  const linkPart = productUrl
    ? language === "pl"
      ? `\n\nLink: ${productUrl}`
      : `\n\nLink: ${productUrl}`
    : "";

  if (language === "pl") {
    return `Cześć ${bookingContact.hostName}! Chciałbym/chciałabym kupić „${productTitle}” (${sku}${pricePart}). Dziękuję!${linkPart}`;
  }
  return `Hi ${bookingContact.hostName}! I'd like to purchase "${productTitle}" (${sku}${pricePart}). Thank you!${linkPart}`;
}

export function productMailtoUrl(subject: string, body: string) {
  return mailtoUrl(subject, body);
}

export function instagramUrl() {
  return bookingContact.instagram;
}

export function facebookUrl() {
  return bookingContact.facebook;
}

/** @deprecated Telegram removed from booking flow — kept for legacy demos */
export function telegramUrl(message: string) {
  const text = encodeURIComponent(message);
  return `https://t.me/paliceramics?text=${text}`;
}
