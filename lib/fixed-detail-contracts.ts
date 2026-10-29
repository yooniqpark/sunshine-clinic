import type { AppLocale } from "@/i18n/routing";
import {
  getDeviceDetailImage,
  getDeviceDetailMobileImage,
  getDeviceHeroImage,
  getDeviceHeroMobileImage,
  getDevicesByCategory,
} from "@/lib/devices";
import {
  getEditableDeviceContent,
  type EditableDeviceContent,
} from "@/lib/device-content";

export type EditableFact = {
  status: "pending" | "ready" | "not-applicable";
  value: string | null;
};

export type ContractProcessStep = {
  step: string;
  title: string;
  body: string;
};

type ContractBase = {
  slug: string;
  name: string;
  summary: string;
  hero: { desktop: string | null; mobile: string | null };
  detail: { desktop: string | null; mobile: string | null };
  principle: string;
  features: { title: string; body: string }[];
  precautions: string[];
  faq: { q: string; a: string }[];
  contentState: {
    status: "feedback" | "ready";
    source: "existing-structured-content";
    openItems: string[];
  };
};

export type FixedTreatmentDetail = ContractBase & {
  kind: "treatment";
  category: string;
  suitableFor: string[];
  procedure: {
    duration: EditableFact;
    anesthesia: EditableFact;
    downtime: EditableFact;
    recommendedSessions: EditableFact;
  };
  process: ContractProcessStep[];
  related: { slug: string; category: string; name: string }[];
};

export type FixedEquipmentDetail = ContractBase & {
  kind: "equipment";
  manufacturer: string;
  model: string | null;
  treatmentApplications: { slug: string; category: string; name: string }[];
  certifications: { name: string; issuer: string; reference: string | null }[];
};

const pendingFact = (): EditableFact => ({ status: "pending", value: null });

const factFromValue = (value: string | null): EditableFact => value
  ? { status: "ready", value }
  : pendingFact();

function baseFromDevice(device: EditableDeviceContent): ContractBase {
  return {
    slug: device.slug,
    name: device.name,
    summary: device.tagline || device.intro,
    hero: {
      desktop: device.heroImage ?? getDeviceHeroImage(device.slug),
      mobile: device.heroImageMobile ?? getDeviceHeroMobileImage(device.slug),
    },
    detail: {
      desktop: device.detailImage ?? getDeviceDetailImage(device.slug),
      mobile: device.detailImageMobile ?? getDeviceDetailMobileImage(device.slug),
    },
    principle: device.howItWorks,
    features: device.features,
    precautions: device.precautions,
    faq: device.faq,
    contentState: {
      status: "feedback",
      source: "existing-structured-content",
      openItems: ["precautions"],
    },
  };
}

export async function getFixedTreatmentDetail(
  locale: AppLocale,
  slug: string,
  process: ContractProcessStep[],
): Promise<FixedTreatmentDetail | null> {
  const device = await getEditableDeviceContent(locale, slug);
  if (!device) return null;
  const candidates = device.relatedDeviceSlugs.length
    ? device.relatedDeviceSlugs
        .map((relatedSlug) => getDevicesByCategory(locale, device.category).find((item) => item.slug === relatedSlug))
        .filter((item): item is NonNullable<typeof item> => !!item)
    : getDevicesByCategory(locale, device.category).filter((item) => item.slug !== slug);
  const related = candidates
    .slice(0, 3)
    .map((item) => ({ slug: item.slug, category: item.category, name: item.name }));

  return {
    ...baseFromDevice(device),
    kind: "treatment",
    category: device.category,
    suitableFor: device.recommendedFor,
    procedure: {
      duration: factFromValue(device.procedure.duration),
      anesthesia: factFromValue(device.procedure.anesthesia),
      downtime: factFromValue(device.procedure.downtime),
      recommendedSessions: factFromValue(device.procedure.recommendedSessions),
    },
    process: device.process.length ? device.process : process,
    related,
    contentState: {
      status: "feedback",
      source: "existing-structured-content",
      openItems: [
        ...Object.entries(device.procedure)
          .filter(([, value]) => !value)
          .map(([key]) => `procedure.${key}`),
        ...(device.precautions.length ? [] : ["precautions"]),
      ],
    },
  };
}

export async function getFixedEquipmentDetail(
  locale: AppLocale,
  slug: string,
): Promise<FixedEquipmentDetail | null> {
  const device = await getEditableDeviceContent(locale, slug);
  if (!device) return null;

  return {
    ...baseFromDevice(device),
    kind: "equipment",
    manufacturer: device.manufacturer,
    model: device.model,
    treatmentApplications: [
      { slug: device.slug, category: device.category, name: device.name },
    ],
    certifications: device.certifications,
    contentState: {
      status: "feedback",
      source: "existing-structured-content",
      openItems: [
        ...(device.model ? [] : ["model"]),
        ...(device.certifications.length ? [] : ["certifications"]),
        ...(device.precautions.length ? [] : ["precautions"]),
      ],
    },
  };
}
