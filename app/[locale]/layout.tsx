import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { getSiteContent, type Locale } from "@/lib/site-content";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_LOCALE: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

const KEYWORDS_BY_LOCALE: Record<Locale, string[]> = {
  ko: ["피부과", "리프팅", "울쎄라", "써마지", "기미", "여드름"],
  en: ["dermatology", "lifting", "Ulthera", "Thermage", "pigmentation", "acne"],
  ja: ["皮膚科", "リフティング", "Ulthera", "Thermage", "シミ", "ニキビ"],
  zh: ["皮肤科", "提升", "Ulthera", "Thermage", "色斑", "痘痘"],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const content = getSiteContent(locale as Locale);
  const brand = `${content.clinic.name}`;
  const description = content.about.brandDescription;
  return {
    title: { default: brand, template: `%s | ${brand}` },
    description,
    keywords: [...KEYWORDS_BY_LOCALE[locale as Locale], brand],
    openGraph: {
      title: brand,
      description,
      type: "website",
      locale: OG_LOCALE[locale as Locale],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <div data-theme={locale} className={`theme-${locale} contents`}>
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </div>
  );
}
