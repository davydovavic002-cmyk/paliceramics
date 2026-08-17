"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";

export function HeaderBrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={["header-brand-logo relative inline-flex shrink-0 -translate-y-0.5 items-center", className].join(" ")}
      aria-label="Pali ceramics"
    >
      <span className="relative block h-7 w-7 sm:h-8 sm:w-8">
        <Image
          src={images.brandLogoCircle}
          alt=""
          fill
          priority
          unoptimized
          sizes="48px"
          className="object-contain"
        />
      </span>
    </Link>
  );
}
