import { setRequestLocale } from "next-intl/server";
import { EntrySplash } from "./_components/EntrySplash";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EntrySplash locale={locale} />;
}
