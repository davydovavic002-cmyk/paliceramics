"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAdminContent } from "@/hooks/useAdminContent";
import { palinaStoryForLanguage } from "@/lib/contentResolve";
import { PalinaStoryGallery } from "./PalinaStoryGallery";

export function AboutStudioSection() {
  const { language } = useLanguage();
  const { palinaStory } = useAdminContent();
  const label = palinaStoryForLanguage(palinaStory, language).sectionLabel;
  const eyebrow = language === "en" ? "About me and the brand" : "O mnie i marce";
  const heading = language === "en" ? "About me" : "O mnie";

  return (
    <section
      id="about"
      aria-label={label}
      className="about-editorial-band relative isolate w-full scroll-mt-28 overflow-x-clip bg-transparent font-sans"
    >
      <div className="relative z-10 mt-8 flex w-full flex-col items-center justify-center px-4 text-center sm:px-6">
        <p className="mb-3 text-center font-sans text-xs uppercase tracking-[0.25em] text-[#78716c] opacity-80 dark:text-stone-500 sm:text-sm">
          {eyebrow}
        </p>
        <h2 className="mb-8 break-words text-center font-serif font-display text-4xl font-normal text-[#292524] sm:text-5xl">
          {heading}
        </h2>
      </div>
      <div className="about-bento-bleed relative z-10 w-full bg-transparent">
        <PalinaStoryGallery />
      </div>
    </section>
  );
}
