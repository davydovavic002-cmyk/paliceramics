"use client";

import { useMemo } from "react";
import { Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import {
  buildContactChannels,
  openContactChannel,
  type ContactChannel,
} from "@/lib/contactChannels";

const iconMap = {
  email: Mail,
  whatsapp: MessageCircle,
  instagram: Instagram,
  facebook: Facebook,
} as const;

type ContactChannelPanelProps = {
  message: string;
  subject: string;
  emailOnly?: boolean;
  tone?: "theme" | "light";
  className?: string;
};

export function ContactChannelPanel({
  message,
  subject,
  emailOnly = false,
  tone = "theme",
  className = "",
}: ContactChannelPanelProps) {
  const { language } = useLanguage();
  const content = useSiteContent();

  const copy =
    language === "pl"
      ? {
          title: "Napisz do Paliny",
          hint: emailOnly
            ? "Wyślij wiadomość mailem — zgłoszenie jest już zapisane w panelu studia."
            : "Zgłoszenie zapisane. Wybierz sposób kontaktu i dołącz voucher, jeśli pobrano PNG.",
          messenger: "Messenger",
        }
      : {
          title: "Message Palina",
          hint: emailOnly
            ? "Send an email — your request is already saved in the studio panel."
            : "Request saved. Choose how to reach out and attach the voucher PNG if you downloaded it.",
          messenger: "Messenger",
        };

  const channels = useMemo(
    () =>
      buildContactChannels({
        message,
        subject,
        contacts: content?.contacts,
        emailOnly,
        messengerLabel: copy.messenger,
      }),
    [content?.contacts, copy.messenger, emailOnly, message, subject]
  );

  const btnClass =
    tone === "light"
      ? "inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,#010a8b_18%,transparent)] bg-white px-4 py-3 font-body text-[10px] uppercase tracking-[0.18em] text-[#010a8b] transition-colors hover:border-[#010a8b]/35"
      : "inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--theme-accent)_40%,transparent)] bg-[var(--theme-btn-primary)] px-4 py-3 font-body text-[10px] uppercase tracking-[0.18em] text-theme-btn transition-colors hover:bg-[var(--theme-accent-hover)]";

  const secondaryClass =
    tone === "light"
      ? "inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,#010a8b_14%,transparent)] bg-[color-mix(in_srgb,#ffffff_80%,transparent)] px-4 py-3 font-body text-[10px] uppercase tracking-[0.18em] text-[#010a8b]/80 transition-colors hover:border-[#010a8b]/28"
      : "inline-flex w-full items-center justify-center gap-2 rounded-full border border-theme/25 bg-theme-elevated/40 px-4 py-3 font-body text-[10px] uppercase tracking-[0.18em] text-theme-muted transition-colors hover:border-theme/40 hover:text-theme";

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">{copy.title}</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-theme-muted">{copy.hint}</p>
      </div>
      <div className="flex flex-col gap-2">
        {channels.map((channel, index) => (
          <ChannelButton
            key={channel.id}
            channel={channel}
            message={message}
            primary={index === 0}
            btnClass={btnClass}
            secondaryClass={secondaryClass}
          />
        ))}
      </div>
    </div>
  );
}

function ChannelButton({
  channel,
  message,
  primary,
  btnClass,
  secondaryClass,
}: {
  channel: ContactChannel;
  message: string;
  primary: boolean;
  btnClass: string;
  secondaryClass: string;
}) {
  const Icon = iconMap[channel.id as keyof typeof iconMap] ?? Mail;

  return (
    <button
      type="button"
      onClick={() => void openContactChannel(channel, message)}
      className={primary ? btnClass : secondaryClass}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
      {channel.label}
    </button>
  );
}
