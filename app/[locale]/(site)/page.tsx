import { setRequestLocale } from "next-intl/server";
import { EntrySplash } from "./_components/EntrySplash";
import { homeMetadata } from "@/lib/home-seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return homeMetadata(locale);
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EntrySplash locale={locale} />;
}
