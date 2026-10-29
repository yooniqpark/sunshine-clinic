import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FixedContractPage } from "@/app/[locale]/(site)/preview/factory/_components/FixedContractPage";
import { routing, type AppLocale } from "@/i18n/routing";
import { getAllDeviceParams } from "@/lib/devices";
import { getFixedEquipmentDetail } from "@/lib/fixed-detail-contracts";

export function generateStaticParams() {
  return getAllDeviceParams().map(({ device }) => ({ device }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; device: string }>;
}): Promise<Metadata> {
  const { locale, device } = await params;
  if (!routing.locales.includes(locale as AppLocale)) return {};
  const detail = await getFixedEquipmentDetail(locale as AppLocale, device);
  return {
    title: detail ? `[Feedback] ${detail.name}` : "Factory feedback",
    robots: { index: false, follow: false },
  };
}

export default async function EquipmentContractPreview({
  params,
}: {
  params: Promise<{ locale: string; device: string }>;
}) {
  const { locale, device } = await params;
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale);
  const detail = await getFixedEquipmentDetail(locale as AppLocale, device);
  if (!detail) notFound();

  return <FixedContractPage locale={locale as AppLocale} data={detail} mode="feedback" />;
}
