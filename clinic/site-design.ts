import type { CSSProperties } from "react";

export const siteDesign = {
  id: "sunshine-warm-editorial-v2",
  baseline: {
    status: "active",
    sourcePageId: "home",
    establishedBy: "Sunshine factory baseline",
    establishedAt: "2026-10-29T00:00:00+09:00",
  },
  tokens: {
    colors: {
      canvas: "#fbf8f3",
      surface: "#f3ece2",
      text: "#211c17",
      mutedText: "#5b524a",
      primary: "#c49074",
      accent: "#9a6e54",
      line: "#e8ddd0",
    },
    typography: {
      bodyFont: "SUIT Variable",
      displayFont: "Cormorant Garamond",
      headingScale: "editorial",
      bodyScale: "comfortable",
    },
    layout: {
      contentMaxWidth: 1280,
      readingMaxWidth: 760,
      sectionGapDesktop: 112,
      sectionGapMobile: 64,
    },
    shape: { cardRadius: 24, controlRadius: 999 },
    media: {
      cropStyle: "mixed",
      defaultObjectPosition: "50% 50%",
      treatment: "warm",
    },
    motion: { level: "medium", reveal: "fade-rise", durationMs: 700 },
  },
  components: {
    header: "overlay",
    hero: "cinematic",
    button: "text-arrow",
    card: "image-led",
    cta: "soft-panel",
  },
} as const;

export const siteDesignCssVariables = {
  "--color-cream": siteDesign.tokens.colors.canvas,
  "--color-sand": siteDesign.tokens.colors.surface,
  "--color-ink": siteDesign.tokens.colors.text,
  "--color-ink-soft": siteDesign.tokens.colors.mutedText,
  "--color-brand": siteDesign.tokens.colors.primary,
  "--color-brand-dark": siteDesign.tokens.colors.accent,
  "--color-line": siteDesign.tokens.colors.line,
  "--site-content-max-width": `${siteDesign.tokens.layout.contentMaxWidth}px`,
  "--site-reading-max-width": `${siteDesign.tokens.layout.readingMaxWidth}px`,
  "--site-section-gap-desktop": `${siteDesign.tokens.layout.sectionGapDesktop}px`,
  "--site-section-gap-mobile": `${siteDesign.tokens.layout.sectionGapMobile}px`,
  "--site-card-radius": `${siteDesign.tokens.shape.cardRadius}px`,
  "--site-control-radius": `${siteDesign.tokens.shape.controlRadius}px`,
  "--site-motion-duration": `${siteDesign.tokens.motion.durationMs}ms`,
} as CSSProperties;
