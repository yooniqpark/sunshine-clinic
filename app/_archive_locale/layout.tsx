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

const SITE_URL = "https://mysunshineclinic.com";

function localeUrl(locale: string) {
  return locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;
}

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
  const canonical = localeUrl(locale);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localeUrl(l);
  languages["x-default"] = localeUrl(routing.defaultLocale);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: brand, template: `%s | ${brand}` },
    description,
    keywords: [...KEYWORDS_BY_LOCALE[locale as Locale], brand],
    alternates: { canonical, languages },
    openGraph: {
      title: brand,
      description,
      type: "website",
      url: canonical,
      siteName: brand,
      locale: OG_LOCALE[locale as Locale],
      alternateLocale: Object.values(OG_LOCALE).filter(
        (v) => v !== OG_LOCALE[locale as Locale]
      ),
      images: [
        {
          url: "/hero-clinic.png",
          width: 1478,
          height: 766,
          alt: brand,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brand,
      description,
      images: ["/hero-clinic.png"],
    },
    robots: { index: true, follow: true },
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
