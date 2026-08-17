"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDemoControls } from "@/context/DemoControlsContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { bookingContact } from "@/lib/workshopsContent";
import {
  buildProductPurchaseMessage,
  emailComposeHref,
  facebookUrl,
  instagramUrl,
  normalizeEmailAddress,
  openEmailCompose,
  whatsappUrl,
} from "@/lib/booking";
import { getMenuPanelProps } from "@/lib/motionUtils";

type Channel = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  external?: boolean;
  copyBeforeOpen?: boolean;
  emailCompose?: boolean;
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

interface ProductPurchaseMenuProps {
  productTitle: string;
  sku: string;
  pricePln: number;
  disabled?: boolean;
}

export function ProductPurchaseMenu({
  productTitle,
  sku,
  pricePln,
  disabled = false,
}: ProductPurchaseMenuProps) {
  const { language } = useLanguage();
  const { motionLevel } = useDemoControls();
  const content = useSiteContent();
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const copy =
    language === "pl"
      ? {
          buy: "Kup teraz",
          choose: "Wybierz sposób kontaktu",
          messenger: "Messenger",
        }
      : {
          buy: "Buy now",
          choose: "Choose how to reach us",
          messenger: "Messenger",
        };

  const message = buildProductPurchaseMessage(
    productTitle,
    sku,
    pricePln,
    language,
    pageUrl || undefined
  );
  const subject = `${productTitle} (${sku})`;
  const email = normalizeEmailAddress(content?.contacts?.email || bookingContact.email);

  const channels = useMemo(() => {
    const contacts = content?.contacts;
    const list: Channel[] = [];

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
        label: copy.messenger,
        href: contactHref("facebook", facebook) ?? facebook,
        external: true,
        copyBeforeOpen: true,
      });
    }

    return list;
  }, [content?.contacts, copy.messenger, email, message, subject]);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("click", onClickOutside);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClickOutside);
    };
  }, [open]);

  const handleChannelClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    channel: Channel
  ) => {
    if (channel.emailCompose) {
      event.preventDefault();
      openEmailCompose(channel.href);
      window.setTimeout(() => setOpen(false), 150);
      return;
    }

    if (channel.copyBeforeOpen) {
      event.preventDefault();
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(message);
        } catch {
          /* clipboard optional */
        }
      }
      window.open(channel.href, "_blank", "noopener,noreferrer");
      setOpen(false);
      return;
    }

    window.setTimeout(() => setOpen(false), 0);
  };

  if (disabled) return null;

  const menuMotion = getMenuPanelProps(motionLevel);

  return (
    <div ref={rootRef} className="shop-product-buy relative z-30 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="shop-buy-btn relative z-50 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.22em]"
      >
        {copy.buy}
        <ChevronDown
          className={["h-3.5 w-3.5 transition-transform duration-300", open ? "rotate-180" : ""].join(" ")}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            className="shop-buy-menu-panel delivery-faq-panel absolute right-0 top-[calc(100%+0.625rem)] z-40 w-[15.5rem] overflow-hidden rounded-xl"
            {...menuMotion}
          >
            <p className="delivery-faq-ink border-b border-[color-mix(in_srgb,#010a8b_10%,transparent)] px-3.5 py-2 font-body text-[9px] uppercase tracking-[0.18em]">
              {copy.choose}
            </p>
            <div className="p-1">
              {channels.map((channel) => (
                <a
                  key={channel.id}
                  role="menuitem"
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  onClick={(event) => handleChannelClick(event, channel)}
                  className="block rounded-md px-2.5 py-2 transition-colors hover:bg-[color-mix(in_srgb,#010a8b_6%,transparent)]"
                >
                  <span className="delivery-faq-ink font-body text-[13px]">{channel.label}</span>
                  {channel.sublabel ? (
                    <span className="delivery-faq-muted mt-0.5 block truncate font-body text-[10px] leading-snug">
                      {channel.sublabel}
                    </span>
                  ) : null}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
