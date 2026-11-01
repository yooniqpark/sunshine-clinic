export const HOME_CLOSING_EVENT = "sunshine:closing-phase";

export const HOME_CLOSING_COLORS = {
  paper: "#fbf8f3",
  care: "#74604f",
  contact: "#24211e",
  light: "#f7f1e8",
} as const;

export type HomeClosingPhase = "paper" | "care" | "contact";

/** Viewport-relative thresholds also work when entering from an anchor or scrolling back. */
export function homeClosingPhase({
  sectionTop,
  contactTop,
  viewportHeight,
}: {
  sectionTop: number;
  contactTop: number;
  viewportHeight: number;
}): HomeClosingPhase {
  if (sectionTop > viewportHeight * 0.65) return "paper";
  return contactTop <= viewportHeight * 0.55 ? "contact" : "care";
}

/** Pin the rail above its footer slot, then let both columns leave the viewport together. */
export function homeClosingRailShift({
  phase,
  contactFrameTop,
  headerHeight,
  viewportWidth,
  viewportHeight,
}: {
  phase: HomeClosingPhase;
  contactFrameTop: number;
  headerHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}) {
  if (phase === "paper" || viewportWidth <= 1100 || viewportHeight < 640) return 0;
  return Math.min(0, headerHeight + 24 - contactFrameTop);
}
