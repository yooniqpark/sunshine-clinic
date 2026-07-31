import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = "https://mysunshineclinic.com";

// hreflang code per app locale
const HREFLANG: Record<string, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-CN",
};

const OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

/** Absolute URL for a path in a given locale. ko(기본)는 prefix 없음: "/" = ko. */
export function localeUrl(locale: string, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

/** canonical + hreflang alternates (ko = prefix 없는 URL, x-default = ko). */
export function seoAlternates(locale: string, path = "") {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[HREFLANG[l] ?? l] = localeUrl(l, path);
  }
  languages["x-default"] = localeUrl(routing.defaultLocale, path);
  return { canonical: localeUrl(locale, path), languages };
}

/**
 * 페이지 공통 SEO 메타데이터. Next 메타데이터 병합은 top-level 필드 단위라
 * openGraph는 여기서 통째로 채운다 (레이아웃 값에 기대지 않음).
 */
export function pageSeo({
  locale,
  path,
  title,
  description,
  ogImage = "/og.jpg",
  noindex = false,
}: {
  locale: string;
  path: string;
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
}): Metadata {
  const images = [{ url: ogImage, width: 1200, height: 630 }];
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: seoAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "Sunshine Clinic",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: localeUrl(locale, path),
      locale: OG_LOCALE[locale] ?? "ko_KR",
      images,
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** description용 텍스트 다듬기 — 개행 제거 후 155자 컷. */
export function truncateDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}
