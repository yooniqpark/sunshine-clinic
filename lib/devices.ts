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
  "gold-ptt": {
    englishName: "GOLD PTT",
    featureKeywords: ["SELECTIVE", "DUAL", "MINIMAL", "SAFE"],
  },
  curajet: {
    englishName: "CUREJET",
    featureKeywords: ["STERILE", "JET", "INSTANT", "GENTLE"],
  },
};

export function getDeviceMarketing(slug: string): DeviceMarketingMeta | null {
  return DEVICE_MARKETING[slug] ?? null;
}

const DEVICE_IMAGES: Record<string, string> = {
  "ulthera-prime": "/devices/ulthera-prime.png",
  "thermage-flx": "/devices/thermage-flx.png",
  "shurink-universe": "/devices/shurink-universe.png",
  inmode: "/devices/inmode.png",
  "clarity-ii": "/devices/clarity-ii.png",
  "fotona-starwalker": "/devices/fotona-starwalker.png",
  vbeam: "/devices/vbeam.png",
  "secret-rf": "/devices/secret-rf.png",
  "carpri-co2": "/devices/carpri-co2.png",
  curajet: "/devices/curajet.png",
};

export function getDeviceImage(slug: string): string | null {
  return DEVICE_IMAGES[slug] ?? null;
}

const BY_LOCALE: Record<Locale, Record<string, DeviceDetail>> = {
  ko: koData as Record<string, DeviceDetail>,
  en: enData as Record<string, DeviceDetail>,
  ja: jaData as Record<string, DeviceDetail>,
  zh: zhData as Record<string, DeviceDetail>,
};

const ORDER_BY_CATEGORY: Record<string, string[]> = {
  lifting: ["ulthera-prime", "thermage-flx", "shurink-universe", "inmode", "ellanse"],
  whitening: ["clarity-ii", "fotona-starwalker", "vbeam", "secret-rf"],
  acne: ["carpri-co2", "gold-ptt", "curajet", "secret-rf"],
};

export function getDevicesByCategory(
  locale: Locale,
  category: string
): DeviceDetail[] {
  const all = BY_LOCALE[locale] ?? BY_LOCALE.ko;
  const order = ORDER_BY_CATEGORY[category] ?? [];
  return order.map((slug) => all[slug]).filter(Boolean);
}
