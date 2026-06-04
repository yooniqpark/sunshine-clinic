import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/site-content";

/* ────────────────────────────────────────────────────────────
   Admin-editable text content.
   Lookup: getContent(group, slug, locale).field → with KO fallback.
   ──────────────────────────────────────────────────────────── */

export type ContentGroup = "device" | "concern" | "category" | "chatbot";

type Row = { group: string; slug: string; locale: string; field: string; value: string };

async function loadAll(): Promise<Row[]> {
  return prisma.siteContent.findMany();
}
const cachedLoadAll = unstable_cache(loadAll, ["site-content-all"], {
  revalidate: 60,
  tags: ["site-content"],
});

export async function getContent(
  group: ContentGroup,
  slug: string,
  locale: Locale
): Promise<Record<string, string>> {
  const rows = await cachedLoadAll();
  const koMap: Record<string, string> = {};
  const localeMap: Record<string, string> = {};
  for (const r of rows) {
    if (r.group !== group || r.slug !== slug) continue;
    if (r.locale === "ko") koMap[r.field] = r.value;
    if (r.locale === locale) localeMap[r.field] = r.value;
  }
  return { ...koMap, ...localeMap };
}

export async function listSlugs(group: ContentGroup): Promise<string[]> {
  const rows = await cachedLoadAll();
  const set = new Set<string>();
  for (const r of rows) if (r.group === group) set.add(r.slug);
  return [...set].sort();
}

export async function getRowsForSlug(group: ContentGroup, slug: string) {
  return prisma.siteContent.findMany({
    where: { group, slug },
    orderBy: [{ locale: "asc" }, { field: "asc" }],
  });
}

export async function upsertField(args: {
  group: string;
  slug: string;
  locale: string;
  field: string;
  value: string;
  userId?: string;
}) {
  return prisma.siteContent.upsert({
    where: {
      group_slug_locale_field: {
        group: args.group,
        slug: args.slug,
        locale: args.locale,
        field: args.field,
      },
    },
    update: { value: args.value, updatedBy: args.userId ?? null },
    create: {
      group: args.group,
      slug: args.slug,
      locale: args.locale,
      field: args.field,
      value: args.value,
      updatedBy: args.userId ?? null,
    },
  });
}
