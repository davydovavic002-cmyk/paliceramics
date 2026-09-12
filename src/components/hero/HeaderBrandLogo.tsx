"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";

export function HeaderBrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={["header-brand-logo relative inline-flex shrink-0 items-center", className].join(" ")}
      aria-label="Pali ceramics"
    >
      <span className="relative block h-9 w-9 sm:h-10 sm:w-10">
        <Image
          src={images.brandLogoCircle}
          alt=""
          fill
          priority
          sizes="(max-width:639px) 36px, 40px"
          className="object-contain"
        />
      </span>
    </Link>
  );
}
