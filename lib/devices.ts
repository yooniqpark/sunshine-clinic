import koData from "@/content/devices-ko.json";
import enData from "@/content/devices-en.json";
import jaData from "@/content/devices-ja.json";
import zhData from "@/content/devices-zh.json";
import type { Locale } from "@/lib/site-content";

export type DeviceDetail = {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  intro: string;
  introBody?: string;
  manufacturer: string;
  tech: string[];
  highlightStat: { value: string; label: string };
  features: { title: string; body: string }[];
  howItWorks: string;
  recommendedFor: string[];
  faq: { q: string; a: string }[];
};

export type DeviceMarketingMeta = {
  englishName: string;
  featureKeywords: [string, string, string, string];
};

const DEVICE_MARKETING: Record<string, DeviceMarketingMeta> = {
  "ulthera-prime": {
    englishName: "ULTHERA PRIME",
    featureKeywords: ["UPGRADE", "PRECISE", "POWERFUL", "COMFORTABLE"],
  },
  "thermage-flx": {
    englishName: "THERMAGE FLX",
    featureKeywords: ["LIFTING", "TIGHTENING", "CONTOURING", "COMFORT"],
  },
  "shurink-universe": {
    englishName: "SHRINK UNIVERSE",
    featureKeywords: ["EFFECTIVE", "COMFORT", "PRECISION", "LONG-LASTING"],
  },
  inmode: {
    englishName: "INMODE FORMA MINI",
    featureKeywords: ["TIGHTEN", "CONTOUR", "FAT-CARE", "HPV"],
  },
  ellanse: {
    englishName: "ELLANSÉ",
    featureKeywords: ["VOLUME", "COLLAGEN", "LONG-LASTING", "NATURAL"],
  },
  "clarity-ii": {
    englishName: "CLARITY II",
    featureKeywords: ["DUAL", "INTELLI", "MULTI", "SAFE"],
  },
  "fotona-starwalker": {
    englishName: "STARWALKER MAQX",
    featureKeywords: ["MULTI", "PRECISE", "UNIFORM", "PREMIUM"],
  },
  vbeam: {
    englishName: "VBEAM",
    featureKeywords: ["SELECT", "COOLING", "MULTI", "GENTLE"],
  },
  "secret-rf": {
    englishName: "SECRET RF",
    featureKeywords: ["PRECISE", "DEPTH", "BIPOLAR", "SYNERGY"],
  },
  "carpri-co2": {
    englishName: "CARPRI CO2",
    featureKeywords: ["FRACTIONAL", "DEPTH", "RENEW", "REFINE"],
  },
  "mirajet-forte": {
    englishName: "MIRAJET FORTE",
    featureKeywords: ["STERILE", "JET", "INSTANT", "GENTLE"],
  },
  "inmode-morpheus": {
    englishName: "INMODE MORPHEUS",
    featureKeywords: ["MICRONEEDLE", "RF", "FRACTIONAL", "RESURFACE"],
  },
  "markview-co2": {
    englishName: "CO2",
    featureKeywords: ["FRACTIONAL", "CO2", "PRECISE", "RENEW"],
  },
  markview: {
    englishName: "MARK-VU",
    featureKeywords: ["AI", "ANALYSIS", "MULTI-WAVE", "REPORT"],
  },
  "aqua-peel": {
    englishName: "AQUA PEEL",
    featureKeywords: ["HYDRO", "PEEL", "GENTLE", "GLOW"],
  },
  ldm: {
    englishName: "LDM SMART 1S",
    featureKeywords: ["ULTRASOUND", "DUAL-FREQ", "BARRIER", "CALM"],
  },
  bellalux: {
    englishName: "BELLALUX LED",
    featureKeywords: ["LED", "RED · BLUE", "PHOTOTHERAPY", "CALM"],
  },
  juvederm: {
    englishName: "JUVÉDERM VOLIFT",
    featureKeywords: ["HA FILLER", "VYCROSS", "NATURAL", "LASTING"],
  },
  belotero: {
    englishName: "BELOTERO",
    featureKeywords: ["HA FILLER", "CPM", "SOFT", "NATURAL"],
  },
  rejuran: {
    englishName: "REJURAN",
    featureKeywords: ["PN", "SKIN-BOOSTER", "REGEN", "TEXTURE"],
  },
  "rejuran-i": {
    englishName: "REJURAN i",
    featureKeywords: ["EYE", "PN", "FINE-LINES", "GENTLE"],
  },
  juvelook: {
    englishName: "JUVELOOK",
    featureKeywords: ["PDLLA", "COLLAGEN", "TEXTURE", "LASTING"],
  },
  "elravie-re20": {
    englishName: "ELRAVIE RE20",
    featureKeywords: ["HA", "BOOSTER", "HYDRATION", "GLOW"],
  },
  cellredm: {
    englishName: "CELLREDM",
    featureKeywords: ["COLLAGEN", "AMINO", "BOOSTER", "CALM"],
  },
  skinvive: {
    englishName: "SKINVIVE",
    featureKeywords: ["HA", "MICRODROP", "GLOW", "CHEEK"],
  },
  radiesse: {
    englishName: "RADIESSE",
    featureKeywords: ["CaHA", "COLLAGEN", "LIFT", "LASTING"],
  },
};

export function getDeviceMarketing(slug: string): DeviceMarketingMeta | null {
  return DEVICE_MARKETING[slug] ?? null;
}

const DEVICE_IMAGES: Record<string, string> = {
  "ulthera-prime": "/devices/ulthera-prime.png?v=4",
  "thermage-flx": "/devices/thermage-flx.png?v=3",
  "shurink-universe": "/devices/shurink-universe.png",
  inmode: "/devices/inmode.png",
  "clarity-ii": "/devices/clarity-ii.png",
  "fotona-starwalker": "/devices/fotona-starwalker.png",
  vbeam: "/devices/vbeam.png",
  "secret-rf": "/devices/secret-rf.png",
  "carpri-co2": "/devices/carpri-co2.png",
  "mirajet-forte": "/devices/mirajet-forte.png?v=3",
  "inmode-morpheus": "/devices/inmode-morpheus.png",
  "markview-co2": "/devices/markview-co2.png",
  markview: "/devices/markview.png",
  "aqua-peel": "/devices/aqua-peel.png?v=3",
  ldm: "/devices/ldm.png",
  bellalux: "/devices/bellalux.png",
  juvederm: "/devices/juvederm.png",
  belotero: "/devices/belotero.png",
  ellanse: "/devices/ellanse.jpg",
  rejuran: "/devices/rejuran.jpg",
  "rejuran-i": "/devices/rejuran-i.jpg",
  juvelook: "/devices/juvelook.jpg",
  "elravie-re20": "/devices/elravie-re20.jpg",
  cellredm: "/devices/cellredm.jpg",
  skinvive: "/devices/skinvive.jpg",
  radiesse: "/devices/radiesse.jpg",
};

export function getDeviceImage(slug: string): string | null {
  return DEVICE_IMAGES[slug] ?? null;
}

// 히어로(매거진 커버) 전용 울트라와이드 컷 — 없으면 기본 이미지 사용
const DEVICE_HERO_IMAGES: Record<string, string> = {
  "ulthera-prime": "/devices/ulthera-prime-hero.png",
  "thermage-flx": "/devices/thermage-flx-hero.png",
  "shurink-universe": "/devices/shurink-universe-hero.png",
  inmode: "/devices/inmode-hero.png",
  ellanse: "/devices/ellanse-hero.png",
  rejuran: "/devices/rejuran-hero.png?v=2",
  juvelook: "/devices/juvelook-hero.png?v=2",
  "elravie-re20": "/devices/elravie-re20-hero.png?v=3",
  cellredm: "/devices/cellredm-hero.png?v=2",
  skinvive: "/devices/skinvive-hero.png?v=3",
  radiesse: "/devices/radiesse-hero.png?v=3",
};

export function getDeviceHeroImage(slug: string): string | null {
  return DEVICE_HERO_IMAGES[slug] ?? getDeviceImage(slug);
}

const BY_LOCALE: Record<Locale, Record<string, DeviceDetail>> = {
  ko: koData as Record<string, DeviceDetail>,
  en: enData as Record<string, DeviceDetail>,
  ja: jaData as Record<string, DeviceDetail>,
  zh: zhData as Record<string, DeviceDetail>,
};

const ORDER_BY_CATEGORY: Record<string, string[]> = {
  lifting: ["ulthera-prime", "thermage-flx", "shurink-universe", "inmode"],
  whitening: ["clarity-ii", "fotona-starwalker", "vbeam"],
  acne: ["carpri-co2", "mirajet-forte", "aqua-peel", "secret-rf", "inmode-morpheus", "markview-co2", "ldm", "bellalux", "markview"],
  "anti-aging": ["rejuran", "rejuran-i", "juvelook", "elravie-re20", "cellredm", "skinvive", "radiesse", "juvederm", "belotero", "ellanse"],
};

export function getDevicesByCategory(
  locale: Locale,
  category: string
): DeviceDetail[] {
  const all = BY_LOCALE[locale] ?? BY_LOCALE.ko;
  const order = ORDER_BY_CATEGORY[category] ?? [];
  return order.map((slug) => all[slug]).filter(Boolean);
}
