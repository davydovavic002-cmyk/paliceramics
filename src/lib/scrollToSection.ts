import type { MouseEvent } from "react";

const MAX_ATTEMPTS = 12;
const RETRY_MS = 80;

function getTarget(hash: string) {
  const id = hash.replace(/^#/, "").trim();
  return id ? document.getElementById(id) : null;
}

/** Smooth-scroll to an in-page section; respects Tailwind scroll-mt on targets. */
export function scrollToSection(hash: string, attempt = 0) {
  if (!hash.startsWith("#")) return false;

  const id = hash.slice(1);
  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
    return true;
  }

  const target = getTarget(hash);
  if (!target) {
    if (attempt < MAX_ATTEMPTS) {
      window.setTimeout(() => scrollToSection(hash, attempt + 1), RETRY_MS);
    }
    return false;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
  return true;
}

export function scrollToHashFromLocation() {
  const hash = window.location.hash;
  if (!hash) return;
  scrollToSection(hash);
}

export function handleSectionClick(
  e: MouseEvent<HTMLAnchorElement>,
  href: string,
  onDone?: () => void
) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  scrollToSection(href);
  onDone?.();
}
