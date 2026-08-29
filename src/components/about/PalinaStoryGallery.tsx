"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAdminContent } from "@/hooks/useAdminContent";
import { palinaStoryForLanguage } from "@/lib/contentResolve";
import {
  PhotoCaption,
  StoryEditorialPhoto,
  StoryHeroPhoto,
  StoryPanelText,
} from "./AboutStoryBlocks";

function aboutCellClass(index: number) {
  if (index === 0) return "lookbook-split-r lookbook-split-b";
  if (index === 1) return "lookbook-split-b";
  if (index === 2) return "lookbook-split-r lookbook-split-b";
  return "lookbook-split-b";
}

export function PalinaStoryGallery() {
  const { language } = useLanguage();
  const { palinaStory } = useAdminContent();
  const copy = palinaStoryForLanguage(palinaStory, language);
  const imgs = copy.images;

  return (
    <div className="relative mt-10 sm:mt-12 lg:mt-10">
      <p className="relative z-10 mb-5 text-center font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted lg:mb-4">
        {copy.sectionLabel}
      </p>

      <div className="about-editorial-band lookbook-full-bleed relative z-10">
        <div className="lookbook-grid grid grid-cols-2 gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-2">
          <div className="col-span-2 min-h-[min(72vw,420px)] lg:col-span-1 lg:row-span-2 lg:min-h-[420px] lookbook-split-r lookbook-split-b lg:lookbook-split-b-0">
            <StoryHeroPhoto
              src={imgs.japan.src}
              alt={imgs.japan.alt}
              priority
              sizes="(max-width:1024px) 100vw, 42vw"
              className="h-full min-h-[inherit]"
              caption={<PhotoCaption lead={copy.lead} body={copy.origin} />}
            />
          </div>

          <div className={`min-h-[200px] lg:min-h-[210px] ${aboutCellClass(0)}`}>
            <StoryEditorialPhoto
              src={imgs.wheel.src}
              alt={imgs.wheel.alt}
              className="h-full min-h-[inherit]"
              sizes="(max-width:1024px) 50vw, 28vw"
              delay={0.05}
              objectPosition="50% 18%"
            />
          </div>

          <div className={`min-h-[200px] lg:min-h-[210px] ${aboutCellClass(1)}`}>
            <StoryEditorialPhoto
              src={imgs.glaze.src}
              alt={imgs.glaze.alt}
              className="h-full min-h-[inherit]"
              sizes="(max-width:1024px) 50vw, 28vw"
              delay={0.1}
            />
          </div>

          <div
            className={`flex min-h-[200px] items-center p-4 sm:p-5 lg:min-h-[210px] ${aboutCellClass(2)}`}
          >
            <StoryPanelText delay={0.12} className="w-full">
              {copy.brand} {copy.workshops}
            </StoryPanelText>
          </div>

          <div className={`min-h-[200px] lg:min-h-[210px] ${aboutCellClass(3)}`}>
            <StoryEditorialPhoto
              src={imgs.studio.src}
              alt={imgs.studio.alt}
              className="h-full min-h-[inherit]"
              sizes="(max-width:1024px) 50vw, 28vw"
              delay={0.16}
              objectPosition="50% 35%"
            />
          </div>
        </div>

        <div className="border-x border-b border-[var(--lookbook-line)] bg-[#faf7f0] px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
          <StoryPanelText delay={0.2} className="max-w-3xl">
            {copy.craft} {copy.closing}
          </StoryPanelText>
        </div>
      </div>
    </div>
  );
}
