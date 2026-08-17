"use client";

import Image from "next/image";
import { useMotionFlags } from "@/context/DemoControlsContext";
import { images } from "@/lib/images";

type HeroCeramicsIllustrationProps = {
  className?: string;
};

export function HeroCeramicsIllustration({ className = "" }: HeroCeramicsIllustrationProps) {
  const { showMicroAnimations } = useMotionFlags();

  return (
    <div className={`relative ${className}`}>
      <div
        className={[
          "relative mx-auto w-full max-w-[min(78vw,320px)] sm:max-w-[min(70vw,360px)] lg:max-w-[400px]",
          showMicroAnimations ? "hero-illustration-float" : "",
        ].join(" ")}
      >
        <Image
          src={images.heroCeramicsCollage}
          alt=""
          width={558}
          height={590}
          priority
          sizes="(max-width:640px) 78vw, (max-width:1024px) 62vw, 400px"
          className="h-auto w-full object-contain drop-shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  );
}
