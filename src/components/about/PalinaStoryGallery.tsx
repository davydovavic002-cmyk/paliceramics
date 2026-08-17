"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  palinaStoryCopy,
  palinaStoryImages,
  palinaStoryLabel,
} from "@/lib/palinaStoryContent";
import {
  PhotoCaption,
  StoryEditorialPhoto,
  StoryHeroPhoto,
  StoryPanelText,
} from "./AboutStoryBlocks";

export function PalinaStoryGallery() {
  const { language } = useLanguage();
  const copy = palinaStoryCopy[language];
  const imgs = palinaStoryImages;

  return (
    <div className="relative mt-10 sm:mt-12 lg:mt-10">
      <p className="relative z-10 mb-5 text-center font-body text-[10px] uppercase tracking-[0.28em] text-theme-muted lg:mb-4">
        {palinaStoryLabel(language)}
      </p>

      <div className="relative z-10">
        {/* Mobile / tablet */}
        <div className="space-y-4 lg:hidden">
          <StoryHeroPhoto
            src={imgs.japan.src}
            alt={imgs.japan.alt[language]}
            priority
            sizes="90vw"
            className="aspect-[4/5]"
            caption={<PhotoCaption lead={copy.lead} body={copy.origin} />}
          />

          <div className="grid grid-cols-2 gap-3">
            <StoryEditorialPhoto
              src={imgs.wheel.src}
              alt={imgs.wheel.alt[language]}
              className="aspect-[5/4] sm:aspect-[4/3]"
              sizes="45vw"
              delay={0.05}
              objectPosition="50% 18%"
            />
            <StoryEditorialPhoto
              src={imgs.glaze.src}
              alt={imgs.glaze.alt[language]}
              className="aspect-[3/4]"
              sizes="45vw"
              delay={0.1}
            />
          </div>

          <StoryPanelText delay={0.12}>{copy.brand}</StoryPanelText>
          <StoryPanelText delay={0.16}>{copy.workshops}</StoryPanelText>

          <StoryEditorialPhoto
            src={imgs.studio.src}
            alt={imgs.studio.alt[language]}
            className="aspect-[16/10]"
            sizes="90vw"
            delay={0.18}
          />

          <StoryPanelText delay={0.2}>{copy.craft}</StoryPanelText>
          <StoryPanelText delay={0.24}>{copy.closing}</StoryPanelText>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-5 lg:min-h-[min(72vh,580px)]">
          <StoryHeroPhoto
            src={imgs.japan.src}
            alt={imgs.japan.alt[language]}
            priority
            sizes="50vw"
            className="min-h-[480px]"
            caption={<PhotoCaption lead={copy.lead} body={copy.origin} />}
          />

          <div className="flex min-h-0 flex-col gap-3.5">
            <StoryEditorialPhoto
              src={imgs.wheel.src}
              alt={imgs.wheel.alt[language]}
              className="aspect-[5/4] min-h-0 flex-[1.2]"
              rotate={-2}
              delay={0.08}
              objectPosition="50% 15%"
              sizes="28vw"
            />

            <StoryPanelText delay={0.12}>
              {copy.brand} {copy.workshops}
            </StoryPanelText>

            <div className="grid min-h-[7.5rem] flex-1 grid-cols-2 gap-3">
              <StoryEditorialPhoto
                src={imgs.glaze.src}
                alt={imgs.glaze.alt[language]}
                className="min-h-[7.5rem]"
                rotate={2.5}
                delay={0.14}
                objectPosition="50% 40%"
              />
              <StoryEditorialPhoto
                src={imgs.studio.src}
                alt={imgs.studio.alt[language]}
                className="min-h-[7.5rem]"
                rotate={-1.5}
                delay={0.18}
                objectPosition="50% 35%"
              />
            </div>

            <StoryPanelText delay={0.22}>
              {copy.craft} {copy.closing}
            </StoryPanelText>
          </div>
        </div>
      </div>
    </div>
  );
}
