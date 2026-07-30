import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PreviewHeader } from "./(site)/_components/PreviewHeader";
import { PreviewFooter } from "./(site)/_components/PreviewFooter";
import { ChatWidget } from "@/components/ChatWidget";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Analytics } from "@/components/Analytics";
import { NoDownloadGuard } from "@/components/NoDownloadGuard";

const SITE_URL = "https://mysunshineclinic.com";

const SEO_BY_LOCALE: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  ko: {
    title: "선샤인 클리닉",
    description:
      "선샤인 클리닉은 대학병원 임상 경험을 바탕으로 진료하는 로컬 클리닉입니다. 울쎄라·써마지·슈링크·인모드 등 프리미엄 장비로 리프팅·안티에이징·색소·여드름을 정직하게 케어합니다.",
    keywords: [
      "선샤인 클리닉",
      "울쎄라 프라임",
      "써마지 FLX",
      "슈링크 유니버스",
      "인모드",
      "리프팅",
      "안티에이징",
      "리쥬란",
      "쥬베룩",
    ],
  },
  en: {
    title: "Sunshine Clinic",
    description:
      "Sunshine Clinic is a local skin clinic led by a practitioner with extensive university-hospital experience. Ulthera, Thermage, Shurink, and InMode for lifting, anti-aging, pigmentation, and acne care.",
    keywords: ["Sunshine Clinic", "Ulthera", "Thermage", "Shurink", "InMode", "lifting", "anti-aging"],
  },
  ja: {
    title: "Sunshine Clinic",
    description:
      "Sunshine Clinicは大学病院での豊富な臨床経験をもとに診療する地域クリニックです。ウルセラ・サーマジ・シュリンク・InModeなどプレミアム機器でリフティング・アンチエイジング・色素・ニキビをケアします。",
    keywords: ["Sunshine Clinic", "ウルセラ", "サーマジ", "シュリンク", "リフティング"],
  },
  zh: {
    title: "Sunshine Clinic",
    description:
      "Sunshine Clinic 是基于大学医院丰富临床经验开设的本地诊所。使用 Ulthera、Thermage、Shurink、InMode 等高端设备,提供提升、抗衰老、色素及痤疮护理。",
    keywords: ["Sunshine Clinic", "Ulthera", "Thermage", "提升", "抗衰老"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_BY_LOCALE[locale] ?? SEO_BY_LOCALE.ko;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: "%s | Sunshine Clinic",
    },
    description: seo.description,
    keywords: seo.keywords,
    applicationName: "Sunshine Clinic",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ko: "/ko",
        en: "/en",
        ja: "/ja",
        "zh-CN": "/zh",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Sunshine Clinic",
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/${locale}`,
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div data-theme={locale} className={`theme-${locale} min-h-screen bg-cream text-ink antialiased`}>
        <PreviewHeader />
        <main>{children}</main>
        <PreviewFooter />

        <ChatWidget />
        <ScrollToTop />
        <Analytics />
        <NoDownloadGuard />
      </div>
    </NextIntlClientProvider>
  );
}
