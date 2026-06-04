import koData from "@/content/site-ko.json";
import enData from "@/content/site-en.json";
import jaData from "@/content/site-ja.json";
import zhData from "@/content/site-zh.json";

export type Locale = "ko" | "en" | "ja" | "zh";

export type SiteContent = typeof koData;
export type CategorySlug = keyof SiteContent["categories"];

const BY_LOCALE: Record<Locale, SiteContent> = {
  ko: koData as SiteContent,
  en: enData as SiteContent,
  ja: jaData as SiteContent,
  zh: zhData as SiteContent,
};

export function getSiteContent(locale: Locale): SiteContent {
  return BY_LOCALE[locale] ?? BY_LOCALE.ko;
}
