"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminContent } from "@/hooks/useAdminContent";
import { palinaStoryForLanguage } from "@/lib/contentResolve";
import { MotionReveal } from "@/components/ui/MotionReveal";

/** Renders **bold** segments inline. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const BENTO_P =
  "text-[length:var(--bento-fs,13px)] leading-[1.25] text-[#010a8b]";

function BentoText({
  number,
  areaClass,
  children,
}: {
  number: "1." | "2." | "3.";
  areaClass: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`about-bento-text ${areaClass} relative flex min-w-0 flex-col justify-center border border-[#010a8b] bg-theme-surface p-4 font-sans text-[#010a8b]`}
    >
      <span
        className="about-bento-num pointer-events-none select-none text-[length:var(--bento-num,56px)] leading-none text-[#010a8b]"
        aria-hidden
      >
        {number}
      </span>
      <div className="about-bento-body relative z-[1] min-w-0 text-left">{children}</div>
    </article>
  );
}

function BentoPhoto({
  src,
  alt,
  sizes,
  areaClass,
  priority = false,
  objectPosition = "center center",
}: {
  src: string;
  alt: string;
  sizes: string;
  areaClass: string;
  priority?: boolean;
  objectPosition?: string;
}) {
  const isPortrait = objectPosition === "center 20%";

  return (
    <div
      className={`about-bento-photo ${areaClass} relative h-full min-h-0 min-w-0 w-full overflow-hidden`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={
          isPortrait
            ? "h-full w-full object-cover object-[center_20%]"
            : "h-full w-full object-cover"
        }
        style={{ objectPosition }}
      />
    </div>
  );
}

type Slide = { n: "1." | "2." | "3."; img: { src: string; alt: string }; objectPosition: string; body: React.ReactNode };

function AboutCarousel({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const go = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(slides.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="about-carousel mx-auto w-full max-w-[860px]" aria-roledescription="carousel">
      <div ref={trackRef} className="about-carousel-track">
        {slides.map((s, i) => (
          <div key={s.n} className="about-carousel-slide" aria-label={`${i + 1} / ${slides.length}`}>
            <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[360px]">
              <Image
                src={s.img.src}
                alt={s.img.alt}
                fill
                priority={i === 0}
                sizes="(max-width:767px) 100vw, 430px"
                className="object-cover"
                style={{ objectPosition: s.objectPosition }}
              />
            </div>
            <article className="relative flex flex-col justify-center bg-theme-surface px-5 pb-6 pt-5 font-sans text-[#010a8b] md:px-6">
              <span
                className="pointer-events-none about-carousel-num mb-2 block select-none text-[48px] font-light leading-none text-[#010a8b]"
                aria-hidden
              >
                {s.n}
              </span>
              <div className="text-[15px] leading-[1.45] text-[#010a8b] [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:font-normal [&_h3]:leading-[1.25] [&_p+p]:mt-3">
                {s.body}
              </div>
            </article>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label="Previous"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#010a8b]/20 text-sm text-[#010a8b]/55 disabled:opacity-25"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.n}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1}`}
              aria-current={i === active}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={`block h-2.5 rounded-full bg-[#010a8b] transition-all ${i === active ? "w-6" : "w-2.5 opacity-30"}`} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={active === slides.length - 1}
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#010a8b]/20 text-sm text-[#010a8b]/55 disabled:opacity-25"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function PalinaStoryGallery() {
  const { language } = useLanguage();
  const { palinaStory } = useAdminContent();
  const copy = palinaStoryForLanguage(palinaStory, language);
  const imgs = copy.images;

  const slides: Slide[] = [
    {
      n: "1.",
      img: imgs.glaze,
      objectPosition: "center center",
      body: (
        <>
          <h3>{copy.lead}</h3>
          <p>{copy.origin}</p>
        </>
      ),
    },
    {
      n: "2.",
      img: imgs.japan,
      objectPosition: "center 20%",
      body: (
        <>
          <p>{copy.brand}</p>
          <p>
            <Rich text={copy.workshops} />
          </p>
        </>
      ),
    },
    {
      n: "3.",
      img: imgs.wheel,
      objectPosition: "center center",
      body: (
        <>
          <p>
            <Rich text={copy.craft} />
          </p>
          <p>{copy.closing}</p>
        </>
      ),
    },
  ];

  return (
    <MotionReveal className="w-full">
      <AboutCarousel slides={slides} />
      <div className="about-bento">
        <BentoText number="1." areaClass="about-bento-text1">
          <h3 className="text-[length:var(--bento-lead,16px)] font-normal leading-[1.25] text-[#010a8b]">
            {copy.lead}
          </h3>
          <p className={`mt-[1.4em] ${BENTO_P}`}>{copy.origin}</p>
        </BentoText>

        <BentoPhoto
          src={imgs.glaze.src}
          alt={imgs.glaze.alt}
          areaClass="about-bento-ceramics"
          priority
          sizes="(max-width:767px) 100vw, (max-width:1099px) 50vw, 44vw"
          objectPosition="center center"
        />

        <BentoText number="2." areaClass="about-bento-text2">
          <p className={BENTO_P}>{copy.brand}</p>
          <p className={`mt-[1.4em] ${BENTO_P}`}>
            <Rich text={copy.workshops} />
          </p>
        </BentoText>

        <BentoPhoto
          src={imgs.japan.src}
          alt={imgs.japan.alt}
          areaClass="about-bento-portrait"
          priority
          sizes="(max-width:767px) 100vw, (max-width:1099px) 50vw, 44vw"
          objectPosition="center 20%"
        />

        <BentoText number="3." areaClass="about-bento-text3">
          <p className={BENTO_P}>
            <Rich text={copy.craft} />
          </p>
          <p className={`mt-[1.4em] ${BENTO_P}`}>{copy.closing}</p>
        </BentoText>

        <BentoPhoto
          src={imgs.wheel.src}
          alt={imgs.wheel.alt}
          areaClass="about-bento-wheel"
          sizes="(max-width:767px) 100vw, (max-width:1099px) 50vw, 44vw"
          objectPosition="center center"
        />
      </div>
    </MotionReveal>
  );
}
