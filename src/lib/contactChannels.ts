import type { Language } from "@/types";
import { bookingContact } from "./workshopsContent";
import {
  emailComposeHref,
  facebookUrl,
  instagramUrl,
  mailtoHref,
  normalizeEmailAddress,
  openEmailCompose,
  whatsappUrl,
} from "./booking";

export type ContactChannel = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  external?: boolean;
  emailCompose?: boolean;
  copyBeforeOpen?: boolean;
};

type ContactSource = {
  email?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
};

function contactHref(
  kind: "instagram" | "facebook" | "whatsapp",
  value: string,
  message?: string
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (kind === "instagram") {
    return trimmed.startsWith("http") ? trimmed : `https://instagram.com/${trimmed.replace(/^@/, "")}`;
  }
  if (kind === "facebook") {
    return trimmed.startsWith("http") ? trimmed : `https://facebook.com/${trimmed.replace(/^@/, "")}`;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed.startsWith("http") ? trimmed : null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function buildContactChannels(options: {
  message: string;
  subject: string;
  contacts?: ContactSource;
  emailOnly?: boolean;
  messengerLabel?: string;
}): ContactChannel[] {
  const { message, subject, contacts, emailOnly = false, messengerLabel = "Messenger" } = options;
  const list: ContactChannel[] = [];

  const email = normalizeEmailAddress(contacts?.email || bookingContact.email);
  const mailHref = emailComposeHref(email, subject, message);
  if (mailHref) {
    list.push({
      id: "email",
      label: "Email",
      sublabel: email,
      href: mailHref,
      external: mailHref.startsWith("http"),
      emailCompose: true,
    });
  }

  if (emailOnly) return list;

  const whatsapp = contacts?.whatsapp?.trim() || bookingContact.whatsapp;
  const waHref = whatsapp ? contactHref("whatsapp", whatsapp, message) : whatsappUrl(message);
  if (waHref && waHref !== "#") {
    list.push({
      id: "whatsapp",
      label: "WhatsApp",
      href: waHref,
      external: true,
    });
  }

  const instagram = contacts?.instagram?.trim() || instagramUrl();
  if (instagram) {
    list.push({
      id: "instagram",
      label: "Instagram",
      href: contactHref("instagram", instagram) ?? instagram,
      external: true,
      copyBeforeOpen: true,
    });
  }

  const facebook = contacts?.facebook?.trim() || facebookUrl();
  if (facebook) {
    list.push({
      id: "facebook",
      label: messengerLabel,
      href: contactHref("facebook", facebook) ?? facebook,
      external: true,
      copyBeforeOpen: true,
    });
  }

  return list;
}

export function buildVoucherMessage(
  details: {
    voucherLabel: string;
    nominal: string;
    recipient: string;
    voucherCode?: string | null;
  },
  language: Language
): string {
  const name = bookingContact.hostName;
  const codeLine = details.voucherCode
    ? language === "pl"
      ? ` Kod: ${details.voucherCode}.`
      : ` Code: ${details.voucherCode}.`
    : "";
  if (language === "pl") {
    return `Cześć ${name}! Chciałbym/chciałabym zamówić voucher: ${details.voucherLabel} (${details.nominal}) dla ${details.recipient}.${codeLine} Załączam kartę voucher w wiadomości. Dziękuję!`;
  }
  return `Hi ${name}! I'd like to order a gift voucher: ${details.voucherLabel} (${details.nominal}) for ${details.recipient}.${codeLine} I'm attaching the voucher card. Thank you!`;
}

export function buildWaitlistMessage(
  productTitle: string,
  sku: string,
  email: string,
  language: Language
): string {
  const name = bookingContact.hostName;
  if (language === "pl") {
    return `Cześć ${name}! Proszę o powiadomienie, gdy ${productTitle} (${sku}) wróci do sklepu. Mój email: ${email}. Dziękuję!`;
  }
  return `Hi ${name}! Please notify me when ${productTitle} (${sku}) is back in stock. My email: ${email}. Thank you!`;
}

export async function openContactChannel(
  channel: ContactChannel,
  message: string
): Promise<void> {
  if (channel.emailCompose) {
    openEmailCompose(channel.href);
    return;
  }

  if (channel.copyBeforeOpen) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(message);
      } catch {
        /* optional */
      }
    }
    window.open(channel.href, "_blank", "noopener,noreferrer");
    return;
  }

  window.open(channel.href, channel.external ? "_blank" : "_self", "noopener,noreferrer");
}
