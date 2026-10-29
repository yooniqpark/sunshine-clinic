import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FixedContractPage } from "@/app/[locale]/(site)/preview/factory/_components/FixedContractPage";
import { routing, type AppLocale } from "@/i18n/routing";
import { getAllDeviceParams } from "@/lib/devices";
import {
  getFixedTreatmentDetail,
  type ContractProcessStep,
} from "@/lib/fixed-detail-contracts";

export function generateStaticParams() {
  return getAllDeviceParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; device: string }>;
}): Promise<Metadata> {
  const { locale, device } = await params;
  if (!routing.locales.includes(locale as AppLocale)) return {};
  const t = await getTranslations({ locale, namespace: "v2.device" });
  const process = t.raw("defaultProcess") as ContractProcessStep[];
  const detail = await getFixedTreatmentDetail(locale as AppLocale, device, process);
  return {
    title: detail ? `[Feedback] ${detail.name}` : "Factory feedback",
    robots: { index: false, follow: false },
  };
}

export default async function TreatmentContractPreview({
  params,
}: {
  params: Promise<{ locale: string; category: string; device: string }>;
}) {
  const { locale, category, device } = await params;
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("v2.device");
  const process = t.raw("defaultProcess") as ContractProcessStep[];
  const detail = await getFixedTreatmentDetail(locale as AppLocale, device, process);
  if (!detail || detail.category !== category) notFound();

  return <FixedContractPage locale={locale as AppLocale} data={detail} mode="feedback" />;
}
