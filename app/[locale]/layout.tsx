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

export const metadata: Metadata = {
  title: "Sunshine Dermatology Clinic",
};

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
      </div>
    </NextIntlClientProvider>
  );
}
