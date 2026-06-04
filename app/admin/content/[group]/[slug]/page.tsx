import Link from "next/link";
import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { upsertField } from "@/lib/content-db";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

const LOCALES = ["ko", "en", "ja", "zh"] as const;
const GROUP_LABELS: Record<string, string> = {
  device: "장비",
  concern: "고민",
  category: "카테고리",
  chatbot: "챗봇",
};

async function saveAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const group = String(formData.get("__group"));
  const slug = String(formData.get("__slug"));

  for (const [key, raw] of formData.entries()) {
    if (key.startsWith("__")) continue;
    const sep = key.indexOf("__");
    if (sep < 0) continue;
    const locale = key.slice(0, sep);
    const field = key.slice(sep + 2);
    if (!LOCALES.includes(locale as (typeof LOCALES)[number])) continue;
    const value = typeof raw === "string" ? raw : "";
    await upsertField({
      group,
      slug,
      locale,
      field,
      value,
      userId: session.user.id,
    });
  }
  revalidateTag("site-content", "max");
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ group: string; slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const { group, slug } = await params;
  const slugDec = decodeURIComponent(slug);
  if (!(group in GROUP_LABELS)) notFound();

  const rows = await prisma.siteContent.findMany({
    where: { group, slug: slugDec },
    orderBy: [{ field: "asc" }, { locale: "asc" }],
  });
  if (rows.length === 0) notFound();

  const byField = new Map<string, Map<string, string>>();
  for (const r of rows) {
    if (!byField.has(r.field)) byField.set(r.field, new Map());
    byField.get(r.field)!.set(r.locale, r.value);
  }

  const PREFERRED_ORDER = [
    "name", "label", "tagline", "intro", "description",
    "eyebrow", "headlineL1", "headlineL2",
    "manufacturer", "tech", "highlightStat",
    "features", "howItWorks", "recommendedFor", "faq",
    "approach", "deviceSlugs",
    "greeting", "fallback", "disclaimer", "headerTitle", "headerSubtitle", "inputPlaceholder",
  ];
  const allFields = [...byField.keys()];
  const fields = [
    ...PREFERRED_ORDER.filter((f) => allFields.includes(f)),
    ...allFields.filter((f) => !PREFERRED_ORDER.includes(f)),
  ];

  const fieldsData = fields.map((field) => {
    const perLocale: Record<"ko" | "en" | "ja" | "zh", string> = {
      ko: byField.get(field)?.get("ko") ?? "",
      en: byField.get(field)?.get("en") ?? "",
      ja: byField.get(field)?.get("ja") ?? "",
      zh: byField.get(field)?.get("zh") ?? "",
    };
    return { field, perLocale };
  });

  const title =
    byField.get("name")?.get("ko") ||
    byField.get("label")?.get("ko") ||
    byField.get("greeting")?.get("ko")?.slice(0, 60) ||
    slugDec;

  return (
    <>
      <nav className="text-xs text-ink-soft">
        <Link href="/admin/content" className="hover:text-brand">
          콘텐츠
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/content/${group}`} className="hover:text-brand">
          {GROUP_LABELS[group]}
        </Link>
        <span className="mx-2">/</span>
        <span>{slugDec}</span>
      </nav>
      <header className="mt-3 border-b border-line pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">
          {GROUP_LABELS[group].toUpperCase()} · {slugDec}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {fields.length} 필드 × 4 언어. JSON으로 저장된 목록도 행/열로 편집할 수 있습니다.
        </p>
      </header>

      <div className="mt-10">
        <ContentEditor
          group={group}
          slug={slugDec}
          fieldsData={fieldsData}
          saveAction={saveAction}
        />
      </div>
    </>
  );
}
