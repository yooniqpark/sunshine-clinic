import koData from "@/content/concerns-ko.json";
import enData from "@/content/concerns-en.json";
import jaData from "@/content/concerns-ja.json";
import zhData from "@/content/concerns-zh.json";
import type { Locale } from "@/lib/site-content";

export type Concern = {
  slug: string;
  category: "lifting" | "whitening" | "acne" | "skin-disease" | "anti-aging";
  name: string;
  tagline: string;
  intro: string;
  approach: string;
  deviceSlugs: string[];
  recommendedFor: string[];
  faq: { q: string; a: string }[];
  manufacturer?: string;
  image?: string;
};

const BY_LOCALE: Record<Locale, Record<string, Concern>> = {
  ko: koData as Record<string, Concern>,
  en: enData as Record<string, Concern>,
  ja: jaData as Record<string, Concern>,
  zh: zhData as Record<string, Concern>,
};

// concern ordering per category — tab/section order
const ORDER_BY_CATEGORY: Record<string, string[]> = {
  whitening: ["melasma", "freckles", "resistant-pigment", "redness"],
  acne: ["acne-active", "acne-pigment", "acne-scar", "pores", "general-scar"],
  "skin-disease": ["athletes-foot", "psoriasis", "herpes", "burns"],
  "anti-aging": [
    "rejuran",
    "rejuran-i",
    "juvelook",
    "elravie-re20",
    "cellredm",
    "skinvive",
    "mulgwang",
    "radiesse",
    "botox",
    "filler",
  ],
};

export function getConcernsByCategory(
  locale: Locale,
  category: string
): Concern[] {
  const all = BY_LOCALE[locale] ?? BY_LOCALE.ko;
  const order = ORDER_BY_CATEGORY[category] ?? [];
  // fall back to KO when a concern has not been translated yet, so the
  // section still renders instead of silently disappearing.
  return order.map((slug) => all[slug] ?? BY_LOCALE.ko[slug]).filter(Boolean);
}

export function getConcern(locale: Locale, slug: string): Concern | null {
  const all = BY_LOCALE[locale] ?? BY_LOCALE.ko;
  return all[slug] ?? BY_LOCALE.ko[slug] ?? null;
}

// collect all device slugs referenced by a category's concerns (deduped, order-preserved)
export function getCategoryDeviceSlugs(
  locale: Locale,
  category: string
): string[] {
  const concerns = getConcernsByCategory(locale, category);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of concerns) {
    for (const slug of c.deviceSlugs) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push(slug);
    }
  }
  return out;
}
