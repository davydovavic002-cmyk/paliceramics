import type { MouseEvent } from "react";

const MAX_ATTEMPTS = 12;
const RETRY_MS = 80;
const SCROLL_GUTTER = 10;

function getTarget(hash: string) {
  const id = hash.replace(/^#/, "").trim();
  return id ? document.getElementById(id) : null;
}

function getFixedHeaderOffset() {
  if (typeof window === "undefined") return 88;

  const offsetRaw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-offset")
    .trim();
  if (offsetRaw) {
    const root = document.documentElement;
    const probe = document.createElement("div");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.height = offsetRaw;
    root.appendChild(probe);
    const parsed = probe.getBoundingClientRect().height;
    probe.remove();
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 64;

  return headerHeight + SCROLL_GUTTER;
}

/** Smooth-scroll to an in-page section, offset for fixed header + announcement bar. */
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

  const offset = getFixedHeaderOffset();
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

  window.scrollTo({ top, behavior: "smooth" });
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
