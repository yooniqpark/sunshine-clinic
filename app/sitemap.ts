import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = "https://mysunshineclinic.com";

const PATHS = [
  "",
  "/about",
  "/about#devices",
  "/treatments/lifting",
  "/treatments/anti-aging",
  "/treatments/whitening",
  "/treatments/acne",
  "/treatments/skin-disease",
  "/community/events",
  "/community/prices",
];

function urlFor(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-07-02");
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PATHS) {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[l] = urlFor(l, path);
    languages["x-default"] = urlFor(routing.defaultLocale, path);

    entries.push({
      url: urlFor(routing.defaultLocale, path),
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: { languages },
    });
  }

  return entries;
}
