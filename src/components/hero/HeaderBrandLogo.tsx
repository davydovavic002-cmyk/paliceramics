"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";

export function HeaderBrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={["header-brand-logo relative inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center", className].join(" ")}
      aria-label="Pali ceramics"
    >
      <span className="relative block h-11 w-11">
        <Image
          src={images.brandLogoCircle}
          alt=""
          fill
          priority
          sizes="44px"
          className="object-contain"
        />
      </span>
    </Link>
  );
}
