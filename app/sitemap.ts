import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localeUrl } from "@/lib/seo";
import { getConcernsByCategory } from "@/lib/concerns";
import koDevices from "@/content/devices-ko.json";
import type { DeviceDetail } from "@/lib/devices";

const CATEGORIES = ["lifting", "anti-aging", "whitening", "acne", "skin-disease"];

const STATIC_PATHS: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/home", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/community/events", changeFrequency: "weekly", priority: 0.6 },
  { path: "/community/notices", changeFrequency: "weekly", priority: 0.5 },
  { path: "/community/prices", changeFrequency: "monthly", priority: 0.5 },
];

function treatmentPaths(): { path: string; changeFrequency: "monthly"; priority: number }[] {
  const paths: { path: string; changeFrequency: "monthly"; priority: number }[] = [];
  for (const category of CATEGORIES) {
    paths.push({ path: `/treatments/${category}`, changeFrequency: "monthly", priority: 0.8 });
    const seen = new Set<string>();
    for (const d of Object.values(koDevices as Record<string, DeviceDetail>)) {
      if (d.category === category) seen.add(d.slug);
    }
    for (const c of getConcernsByCategory("ko", category)) seen.add(c.slug);
    for (const slug of seen) {
      paths.push({
        path: `/treatments/${category}/${slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }
  return paths;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, changeFrequency, priority } of [...STATIC_PATHS, ...treatmentPaths()]) {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[l] = localeUrl(l, path);
    languages["x-default"] = localeUrl(routing.defaultLocale, path);

    entries.push({
      url: localeUrl(routing.defaultLocale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    });
  }

  return entries;
}
