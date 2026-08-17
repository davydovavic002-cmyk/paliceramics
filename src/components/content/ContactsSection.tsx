"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useCookieConsent } from "@/context/CookieConsentContext";

const headerCopy = {
  eyebrow: { en: "Contact", pl: "Kontakt" },
  title: { en: "Visit or write", pl: "Odwiedź lub napisz" },
  subtitle: {
    en: "Studio visits by appointment — message before you come.",
    pl: "Wizyty w pracowni po umówieniu — napisz przed przyjazdem.",
  },
};

function contactHref(
  kind: "email" | "instagram" | "facebook" | "whatsapp",
  value: string
): string {
  const trimmed = value.trim();
  if (!trimmed) return "#";

  if (kind === "email") {
    return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`;
  }
  if (kind === "instagram") {
    if (trimmed.startsWith("http")) return trimmed;
    const handle = trimmed.replace(/^@/, "");
    return `https://instagram.com/${handle}`;
  }
  if (kind === "facebook") {
    return trimmed.startsWith("http") ? trimmed : `https://facebook.com/${trimmed.replace(/^@/, "")}`;
  }
  if (trimmed.startsWith("http")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : trimmed;
}

function contactLabel(kind: "instagram" | "facebook" | "whatsapp", value: string): string {
  if (kind === "instagram") {
    return value.startsWith("http") ? "Instagram · @pali.ceramics" : value.startsWith("@") ? value : `@${value}`;
  }
  if (kind === "facebook") {
    return "Facebook";
  }
  return value.startsWith("http") ? "WhatsApp" : value;
}

export function ContactsSection() {
  const { language } = useLanguage();
  const content = useSiteContent();
  const { mapsAllowed, acceptMaps, hydrated: cookieHydrated } = useCookieConsent();

  if (!content) return null;

  const { contacts } = content;
  const header = {
    eyebrow: pickBilingual(undefined, headerCopy.eyebrow, language),
    title: pickBilingual(undefined, headerCopy.title, language),
    subtitle: pickBilingual(undefined, headerCopy.subtitle, language),
  };

  const address = pickBilingual(contacts.address, contacts.address, language);
  const hours = pickBilingual(contacts.hours, contacts.hours, language);
  const hasHours = Boolean(hours.trim());

  const links = [
    contacts.email
      ? {
          label: contacts.email,
          href: contactHref("email", contacts.email),
          external: false,
        }
      : null,
    contacts.instagram
      ? {
          label: contactLabel("instagram", contacts.instagram),
          href: contactHref("instagram", contacts.instagram),
          external: true,
        }
      : null,
    contacts.facebook
      ? {
          label: contactLabel("facebook", contacts.facebook),
          href: contactHref("facebook", contacts.facebook),
          external: true,
        }
      : null,
    contacts.whatsapp
      ? {
          label: contactLabel("whatsapp", contacts.whatsapp),
          href: contactHref("whatsapp", contacts.whatsapp),
          external: true,
        }
      : null,
  ].filter(Boolean) as { label: string; href: string; external: boolean }[];

  return (
    <section
      id="contact"
      className="relative isolate scroll-mt-28 bg-theme-surface text-theme transition-colors duration-700"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 50% 40% at 15% 30%, rgba(90,106,130,0.07) 0%, transparent 55%)
          `,
        }}
        aria-hidden
      />

      <div className="section-inner">
        <header className="mx-auto max-w-2xl text-center">
          <motion.p
            className="font-body text-[11px] uppercase tracking-[0.32em] text-theme-muted"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
          >
            {header.eyebrow}
          </motion.p>
          <motion.h2
            className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-[0.06em] text-theme"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            {header.title}
          </motion.h2>
          <motion.p
            className="mt-4 font-body text-sm leading-relaxed tracking-[0.04em] text-theme-muted sm:text-[15px]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.14 }}
          >
            {header.subtitle}
          </motion.p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.55 }}
          >
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-theme-muted" strokeWidth={1.5} />
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                  {language === "pl" ? "Adres" : "Address"}
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-theme sm:text-[15px]">
                  {address}
                </p>
              </div>
            </div>

            {hasHours ? (
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-theme-muted" strokeWidth={1.5} />
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                    {language === "pl" ? "Godziny" : "Hours"}
                  </p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-theme sm:text-[15px]">
                    {hours}
                  </p>
                </div>
              </div>
            ) : null}

            {links.length > 0 ? (
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-theme-muted" strokeWidth={1.5} />
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                    {language === "pl" ? "Kontakt" : "Reach us"}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className="font-body text-sm text-theme underline decoration-[color-mix(in_srgb,var(--theme-border)_40%,transparent)] underline-offset-4 transition-colors hover:text-theme-muted"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </motion.div>

          {contacts.mapEmbedUrl ? (
            <motion.div
              className="overflow-hidden rounded-[2px] border border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface)_94%,transparent)]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              {mapsAllowed ? (
                <iframe
                  title={language === "pl" ? "Mapa pracowni" : "Studio map"}
                  src={contacts.mapEmbedUrl}
                  className="aspect-[4/3] min-h-[240px] w-full grayscale-[20%] contrast-[0.95]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex aspect-[4/3] min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="font-body text-sm leading-relaxed text-theme-muted">
                    {language === "pl"
                      ? "Mapa Google wymaga zgody na cookies mapy."
                      : "Google Maps requires map cookie consent."}
                  </p>
                  {cookieHydrated ? (
                    <button
                      type="button"
                      onClick={acceptMaps}
                      className="rounded-[2px] border border-[color-mix(in_srgb,var(--theme-accent)_45%,transparent)] bg-[var(--theme-btn-primary)] px-4 py-2 font-body text-[10px] uppercase tracking-[0.18em] text-theme-btn"
                    >
                      {language === "pl" ? "Pokaż mapę" : "Show map"}
                    </button>
                  ) : null}
                </div>
              )}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
