"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { useSiteContent } from "@/hooks/useSiteContent";
import { MotionReveal } from "@/components/ui/MotionReveal";

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
                "delivery-faq-tab delivery-faq-split-b flex w-full min-h-[44px] gap-3 px-4 py-4 text-left transition-colors sm:px-5 sm:py-[1.125rem]",
                selected ? "delivery-faq-active bg-white/70" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "delivery-faq-muted shrink-0 font-body text-[11px] uppercase tracking-[0.24em]",
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
                <p className="delivery-faq-muted font-body text-[11px] uppercase tracking-[0.24em]">
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
  const { t } = useSiteTexts();
  const content = useSiteContent();
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  const { faq } = content;
  const header = {
    faqTitle: t("faq.title"),
    faqLabel: t("faq.label"),
  };

  const faqItems = faq.map((item) => ({
    id: item.id,
    title: pickBilingual(item.question, item.question, language),
    body: pickBilingual(item.answer, item.answer, language),
  }));

  const activeFaq = activeFaqId ?? faqItems[0]?.id ?? "";

  return (
    <section
      id="faq"
      className="relative isolate scroll-mt-[var(--header-offset,5.5rem)] bg-transparent text-theme transition-colors duration-700"
    >
      <div
        id="delivery"
        className="pointer-events-none absolute inset-x-0 top-0 h-px scroll-mt-[var(--header-offset,5.5rem)]"
        aria-hidden
      />

      <div className="section-inner">
        <MotionReveal>
          <header className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-center font-sans text-xs uppercase tracking-[0.25em] text-[#78716c] opacity-80 dark:text-stone-500 sm:text-sm">
              {header.faqLabel}
            </p>
            <h2 className="mb-6 break-words text-center font-display text-4xl font-normal text-[#292524] sm:mb-8 sm:text-5xl">
              {header.faqTitle}
            </h2>
          </header>
        </MotionReveal>

        {faqItems.length > 0 ? (
          <MotionReveal>
            <div className="delivery-faq-panel flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--theme-border)_14%,transparent)]">
              <FaqPanel items={faqItems} activeId={activeFaq} onSelect={setActiveFaqId} />
            </div>
          </MotionReveal>
        ) : null}
      </div>
    </section>
  );
}
