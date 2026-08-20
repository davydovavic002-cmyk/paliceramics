"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { useSiteContent } from "@/hooks/useSiteContent";
import { MotionReveal } from "@/components/ui/MotionReveal";

const headerCopy = {
  eyebrow: { en: "Before you come", pl: "Przed wizytą" },
  subtitle: {
    en: "Stoneware travels carefully — essentials before you write or visit.",
    pl: "Kamionina podróżuje ostrożnie — najważniejsze przed kontaktem.",
  },
  deliveryTitle: { en: "Pickup & shipping", pl: "Odbiór i wysyłka" },
  deliveryLabel: { en: "How it reaches you", pl: "Jak trafia do ciebie" },
  faqTitle: { en: "Questions & answers", pl: "Pytania i odpowiedzi" },
  faqLabel: { en: "Common questions", pl: "Najczęstsze pytania" },
};

function BeigePanel({
  label,
  children,
  id,
}: {
  label: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="delivery-faq-panel flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--theme-border)_14%,transparent)] lg:min-h-[28rem]"
    >
      <div className="border-b border-[var(--delivery-faq-line)] px-6 py-4">
        <p className="delivery-faq-ink font-body text-[10px] uppercase tracking-[0.28em]">{label}</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function DeliveryRow({
  num,
  title,
  body,
  bordered,
}: {
  num: string;
  title: string;
  body: string;
  bordered?: boolean;
}) {
  return (
    <div className={bordered ? "delivery-faq-split-b" : undefined}>
      <div className="px-6 py-6 sm:px-7 sm:py-7">
        <p className="delivery-faq-muted font-body text-[10px] uppercase tracking-[0.28em]">{num}</p>
        <h3 className="delivery-faq-ink mt-3 font-display text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug tracking-[0.04em]">
          {title}
        </h3>
        <p className="delivery-faq-muted mt-3 font-body text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function FaqPanel({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; title: string; body: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] sm:grid-rows-1 sm:grid-cols-[minmax(0,38%)_minmax(0,1fr)]">
      <div
        className="delivery-faq-split-r delivery-faq-split-b border-[var(--delivery-faq-line)] sm:border-b-0"
        role="tablist"
        aria-label="FAQ"
      >
        {items.map((item, index) => {
          const selected = item.id === activeId;
          const tabId = `faq-tab-${item.id}`;
          const panelId = `faq-panel-${item.id}`;
          return (
            <button
              key={item.id}
              type="button"
              id={tabId}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(item.id)}
              className={[
                "delivery-faq-split-b flex w-full gap-3 px-6 py-4 text-left transition-colors sm:px-5 sm:py-[1.125rem]",
                selected ? "delivery-faq-active bg-white/70" : "hover:bg-white/35",
              ].join(" ")}
            >
              <span
                className={[
                  "delivery-faq-muted shrink-0 font-body text-[10px] uppercase tracking-[0.24em]",
                  selected ? "delivery-faq-ink" : "",
                ].join(" ")}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={[
                  "font-display text-sm leading-snug tracking-[0.03em]",
                  selected ? "delivery-faq-ink" : "delivery-faq-muted",
                ].join(" ")}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`faq-panel-${activeItem.id}`}
        className="flex min-h-0 flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7"
        role="tabpanel"
        aria-labelledby={`faq-tab-${activeItem.id}`}
      >
        <div className="grid flex-1">
          {items.map((item, index) => {
            const selected = item.id === activeId;
            return (
              <motion.div
                key={item.id}
                className={[
                  "col-start-1 row-start-1",
                  selected ? "relative z-10" : "pointer-events-none z-0",
                ].join(" ")}
                initial={false}
                animate={{ opacity: selected ? 1 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden={!selected}
              >
                <p className="delivery-faq-muted font-body text-[10px] uppercase tracking-[0.24em]">
                  {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </p>
                <h3 className="delivery-faq-ink mt-3 font-display text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug tracking-[0.04em]">
                  {item.title}
                </h3>
                <p className="delivery-faq-muted mt-3 whitespace-pre-line font-body text-sm leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DeliverySection() {
  const { language } = useLanguage();
  const content = useSiteContent();
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  if (!content) return null;

  const { delivery, faq } = content;
  const header = {
    eyebrow: pickBilingual(undefined, headerCopy.eyebrow, language),
    subtitle: pickBilingual(undefined, headerCopy.subtitle, language),
    deliveryTitle: pickBilingual(undefined, headerCopy.deliveryTitle, language),
    deliveryLabel: pickBilingual(undefined, headerCopy.deliveryLabel, language),
    faqTitle: pickBilingual(undefined, headerCopy.faqTitle, language),
    faqLabel: pickBilingual(undefined, headerCopy.faqLabel, language),
  };

  const faqItems = faq.map((item) => ({
    id: item.id,
    title: pickBilingual(item.question, item.question, language),
    body: pickBilingual(item.answer, item.answer, language),
  }));

  const activeFaq = activeFaqId ?? faqItems[0]?.id ?? "";

  return (
    <section
      id="delivery"
      className="relative isolate scroll-mt-[var(--header-offset,5.5rem)] bg-theme-surface text-theme transition-colors duration-700"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-border)]/20 to-transparent"
        aria-hidden
      />

      <div className="section-inner-wide">
        <header className="mx-auto max-w-2xl text-center">
          <MotionReveal>
            <p className="font-body text-[11px] uppercase tracking-[0.32em] text-theme-muted">
              {header.eyebrow}
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed tracking-[0.04em] text-theme-muted sm:text-[15px]">
              {header.subtitle}
            </p>
          </MotionReveal>
        </header>

        <MotionReveal className="delivery-split-grid mt-10 lg:mt-12">
          <h2 className="delivery-split-grid__title delivery-split-grid__title--delivery min-h-[2.75rem] font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-tight tracking-[0.06em] text-theme">
            {header.deliveryTitle}
          </h2>
          {faqItems.length > 0 ? (
            <h2 className="delivery-split-grid__title delivery-split-grid__title--faq min-h-[2.75rem] font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-tight tracking-[0.06em] text-theme">
              {header.faqTitle}
            </h2>
          ) : null}

          <div className="delivery-split-grid__panel delivery-split-grid__panel--delivery flex min-w-0 flex-col">
            <BeigePanel label={header.deliveryLabel}>
              <DeliveryRow
                num="01"
                title={pickBilingual(delivery.pickupTitle, delivery.pickupTitle, language)}
                body={pickBilingual(delivery.pickupBody, delivery.pickupBody, language)}
                bordered
              />
              <DeliveryRow
                num="02"
                title={pickBilingual(delivery.shippingTitle, delivery.shippingTitle, language)}
                body={pickBilingual(delivery.shippingBody, delivery.shippingBody, language)}
                bordered
              />
              <DeliveryRow
                num="03"
                title={pickBilingual(
                  delivery.internationalTitle,
                  delivery.internationalTitle,
                  language
                )}
                body={pickBilingual(
                  delivery.internationalBody,
                  delivery.internationalBody,
                  language
                )}
              />
            </BeigePanel>
          </div>

          {faqItems.length > 0 ? (
            <div className="delivery-split-grid__panel delivery-split-grid__panel--faq flex min-w-0 flex-col" id="faq">
              <BeigePanel label={header.faqLabel}>
                <FaqPanel items={faqItems} activeId={activeFaq} onSelect={setActiveFaqId} />
              </BeigePanel>
            </div>
          ) : null}
        </MotionReveal>
      </div>
    </section>
  );
}
