"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { MouseEvent } from "react";

interface LegalBackLinkProps {
  label: string;
  className?: string;
}

/**
 * Returns to the page the visitor actually came from (a voucher, a product, a form…)
 * instead of always throwing them onto the home hero. Falls back to "/" when the legal
 * page was opened directly (no history to go back to).
 */
export function LegalBackLink({ label, className }: LegalBackLinkProps) {
  const router = useRouter();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    if (window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  };

  return (
    <Link href="/" onClick={onClick} className={className}>
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
      {label}
    </Link>
  );
}
