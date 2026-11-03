import type { HomeClosingPhase } from "./home-closing";

/** A section owns the header tone only while it crosses the header's lower edge. */
export function conciergeIntersectsHeader({
  sectionTop,
  sectionBottom,
  headerBottom,
}: {
  sectionTop: number;
  sectionBottom: number;
  headerBottom: number;
}) {
  if (![sectionTop, sectionBottom, headerBottom].every(Number.isFinite)) return false;
  return headerBottom > 0 && sectionBottom > sectionTop &&
    sectionTop <= headerBottom && sectionBottom > headerBottom;
}

/** Keep mobile menus and non-home routes independent of scroll scene state. */
export function resolveHomeHeaderSurface({
  pathname,
  menuOpen,
  conciergeAtHeader,
  closingPhase,
}: {
  pathname: string;
  menuOpen: boolean;
  conciergeAtHeader: boolean;
  closingPhase: HomeClosingPhase;
}): "default" | "concierge" | "care" | "contact" {
  if (menuOpen || !/^\/(?:(?:ko|en|ja|zh)\/)?home\/?$/.test(pathname)) return "default";
  if (conciergeAtHeader) return "concierge";
  return closingPhase === "paper" ? "default" : closingPhase;
}
