"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { pickBilingual } from "@/lib/adminTypes";
import { useSiteContent } from "@/hooks/useSiteContent";

const headerCopy = {
  eyebrow: { en: "Reviews", pl: "Opinie" },
  title: { en: "Quiet words from guests", pl: "Ciche słowa gości" },
  subtitle: {
    en: "After workshops and tableware — unhurried feedback from the studio.",
    pl: "Po warsztatach i naczyniach — niespieszne głosy z pracowni.",
  },
};

export function ReviewsSection() {
  const { language } = useLanguage();
  const content = useSiteContent();

  if (!content) return null;

  const visible = content.reviews.filter((r) => r.visible);
  if (visible.length === 0) return null;

  const header = {
    eyebrow: pickBilingual(undefined, headerCopy.eyebrow, language),
    title: pickBilingual(undefined, headerCopy.title, language),
    subtitle: pickBilingual(undefined, headerCopy.subtitle, language),
  };

  return (
    <section
      id="reviews"
      className="relative isolate scroll-mt-28 bg-theme-surface text-theme transition-colors duration-700"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 45% 35% at 88% 22%, rgba(210,190,160,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 10% 80%, rgba(90,106,130,0.06) 0%, transparent 55%)
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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {visible.map((review, index) => (
            <motion.blockquote
              key={review.id}
              className="flex flex-col rounded-[2px] border border-[color-mix(in_srgb,var(--theme-border)_22%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface)_92%,transparent)] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <p className="flex-1 font-body text-sm leading-relaxed text-theme-muted sm:text-[15px]">
                “{pickBilingual(review.text, review.text, language)}”
              </p>
              <footer className="mt-5 font-body text-[10px] uppercase tracking-[0.22em] text-theme-muted">
                {review.author}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
