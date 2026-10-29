import "server-only";

import { prisma } from "@yooniqpark/clinic-core/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { getDevice, type DeviceDetail } from "@/lib/devices";

export type DeviceProcessStep = {
  step: string;
  title: string;
  body: string;
};

export type DeviceCertification = {
  name: string;
  issuer: string;
  reference: string | null;
};

export type EditableDeviceContent = DeviceDetail & {
  procedure: {
    duration: string | null;
    anesthesia: string | null;
    downtime: string | null;
    recommendedSessions: string | null;
  };
  process: DeviceProcessStep[];
  precautions: string[];
  relatedDeviceSlugs: string[];
  heroImage: string | null;
  heroImageMobile: string | null;
  detailImage: string | null;
  detailImageMobile: string | null;
  model: string | null;
  certifications: DeviceCertification[];
};

function hasField(fields: Record<string, string>, key: string) {
  return Object.prototype.hasOwnProperty.call(fields, key);
}

function stringField(fields: Record<string, string>, key: string, fallback: string) {
  return hasField(fields, key) ? fields[key] : fallback;
}

function optionalStringField(fields: Record<string, string>, key: string) {
  if (!hasField(fields, key)) return null;
  const value = fields[key].trim();
  return value || null;
}

function parseJson<T>(fields: Record<string, string>, key: string, fallback: T): T {
  if (!hasField(fields, key)) return fallback;
  const value = fields[key].trim();
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function stringArray(fields: Record<string, string>, key: string, fallback: string[]) {
  const value = parseJson<unknown>(fields, key, fallback);
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : fallback;
}

function objectArray<T extends Record<string, unknown>>(fields: Record<string, string>, key: string, fallback: T[]) {
  const value = parseJson<unknown>(fields, key, fallback);
  return Array.isArray(value) ? value.filter((item): item is T => !!item && typeof item === "object" && !Array.isArray(item)) : fallback;
}

/**
 * Merge Core-managed SiteContent over the checked-in locale JSON.
 * The static record keeps builds and local previews usable before a clinic DB exists.
 */
export async function getEditableDeviceContent(
  locale: AppLocale,
  slug: string,
): Promise<EditableDeviceContent | null> {
  const base = getDevice(locale, slug);
  if (!base) return null;

  let fields: Record<string, string> = {};
  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.siteContent.findMany({
        where: { group: "device", slug, locale },
        select: { field: true, value: true },
      });
      fields = Object.fromEntries(rows.map((row) => [row.field, row.value]));
    } catch {
      fields = {};
    }
  }

  const procedure = parseJson<Record<string, unknown>>(fields, "procedure", {});
  const processSteps = objectArray<DeviceProcessStep>(fields, "process", []);
  const certifications = objectArray<Record<string, unknown>>(fields, "certifications", [])
    .map((item) => ({
      name: typeof item.name === "string" ? item.name.trim() : "",
      issuer: typeof item.issuer === "string" ? item.issuer.trim() : "",
      reference: typeof item.reference === "string" && item.reference.trim() ? item.reference.trim() : null,
    }))
    .filter((item) => item.name && item.issuer);

  return {
    ...base,
    name: stringField(fields, "name", base.name),
    tagline: stringField(fields, "tagline", base.tagline),
    intro: stringField(fields, "intro", base.intro),
    introBody: stringField(fields, "introBody", base.introBody ?? "") || undefined,
    manufacturer: stringField(fields, "manufacturer", base.manufacturer),
    tech: stringArray(fields, "tech", base.tech),
    highlightStat: parseJson(fields, "highlightStat", base.highlightStat),
    features: objectArray(fields, "features", base.features),
    howItWorks: stringField(fields, "howItWorks", base.howItWorks),
    recommendedFor: stringArray(fields, "recommendedFor", base.recommendedFor),
    faq: objectArray(fields, "faq", base.faq),
    procedure: {
      duration: typeof procedure.duration === "string" && procedure.duration.trim() ? procedure.duration.trim() : null,
      anesthesia: typeof procedure.anesthesia === "string" && procedure.anesthesia.trim() ? procedure.anesthesia.trim() : null,
      downtime: typeof procedure.downtime === "string" && procedure.downtime.trim() ? procedure.downtime.trim() : null,
      recommendedSessions: typeof procedure.recommendedSessions === "string" && procedure.recommendedSessions.trim() ? procedure.recommendedSessions.trim() : null,
    },
    process: processSteps,
    precautions: stringArray(fields, "precautions", []),
    relatedDeviceSlugs: stringArray(fields, "relatedDeviceSlugs", []),
    heroImage: optionalStringField(fields, "heroImage"),
    heroImageMobile: optionalStringField(fields, "heroImageMobile"),
    detailImage: optionalStringField(fields, "detailImage"),
    detailImageMobile: optionalStringField(fields, "detailImageMobile"),
    model: optionalStringField(fields, "model"),
    certifications,
  };
}
