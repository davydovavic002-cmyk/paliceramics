"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAdminContent } from "@/hooks/useAdminContent";
import { palinaStoryForLanguage } from "@/lib/contentResolve";
import {
  PhotoCaption,
  PhotoOverlayCaption,
  StoryEditorialPhoto,
  StoryHeroPhoto,
} from "./AboutStoryBlocks";

function aboutCellClass(index: number) {
  if (index === 0) return "lookbook-split-r lookbook-split-b";
  if (index === 1) return "lookbook-split-b";
  return "";
}

type StoryTileProps = {
  className?: string;
  children: React.ReactNode;
};

function StoryTile({ className = "", children }: StoryTileProps) {
  return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
}

export function PalinaStoryGallery() {
  const { language } = useLanguage();
  const { palinaStory } = useAdminContent();
  const copy = palinaStoryForLanguage(palinaStory, language);
  const imgs = copy.images;

  return (
    <div className="relative mt-6 sm:mt-10 lg:mt-10">
      <div className="about-editorial-band relative z-10">
        <div className="lookbook-grid grid grid-cols-2 gap-0 lg:grid-cols-4 lg:grid-rows-2 lg:items-stretch">
          <StoryTile className="col-span-2 aspect-[4/5] lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full lookbook-split-r lookbook-split-b lg:lookbook-split-b-0">
            <StoryHeroPhoto
              src={imgs.japan.src}
              alt={imgs.japan.alt}
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="absolute inset-0 h-full"
              caption={<PhotoCaption lead={copy.lead} body={copy.origin} />}
            />
          </StoryTile>

          <StoryTile className={`aspect-square ${aboutCellClass(0)}`}>
            <StoryEditorialPhoto
              src={imgs.wheel.src}
              alt={imgs.wheel.alt}
              className="absolute inset-0 h-full"
              sizes="(max-width:1024px) 50vw, 25vw"
              delay={0.05}
              objectPosition="50% 30%"
            />
          </StoryTile>

          <StoryTile className={`aspect-square ${aboutCellClass(1)}`}>
            <StoryEditorialPhoto
              src={imgs.glaze.src}
              alt={imgs.glaze.alt}
              className="absolute inset-0 h-full"
              sizes="(max-width:1024px) 50vw, 25vw"
              delay={0.1}
              objectPosition="50% 42%"
              caption={
                <PhotoOverlayCaption>
                  {copy.brand}
                </PhotoOverlayCaption>
              }
            />
          </StoryTile>

          <StoryTile className={`col-span-2 aspect-[5/3] sm:aspect-[16/10] lg:aspect-[2/1] ${aboutCellClass(2)}`}>
            <StoryEditorialPhoto
              src={imgs.studio.src}
              alt={imgs.studio.alt}
              className="absolute inset-0 h-full"
              sizes="(max-width:1024px) 100vw, 50vw"
              delay={0.16}
              objectPosition="50% 35%"
              caption={
                <PhotoOverlayCaption>
                  {copy.workshops} {copy.craft} {copy.closing}
                </PhotoOverlayCaption>
              }
            />
          </StoryTile>
        </div>
      </div>
    </div>
  );
}
