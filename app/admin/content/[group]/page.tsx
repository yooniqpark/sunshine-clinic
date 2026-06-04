import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const GROUP_LABELS: Record<string, string> = {
  device: "장비",
  concern: "고민",
  category: "카테고리",
  chatbot: "챗봇",
};

export default async function GroupListPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const { group } = await params;
  if (!(group in GROUP_LABELS)) notFound();

  // distinct slugs with the ko-locale "name"/"label"/"greeting" value for display
  const rows = await prisma.siteContent.findMany({
    where: { group, locale: "ko" },
    orderBy: { slug: "asc" },
  });
  const slugs = new Map<string, { name: string; fields: number }>();
  for (const r of rows) {
    if (!slugs.has(r.slug)) {
      slugs.set(r.slug, { name: "", fields: 0 });
    }
    const entry = slugs.get(r.slug)!;
    entry.fields++;
    // pick a sensible display: name / label / greeting / first available
    if (
      ["name", "label", "greeting"].includes(r.field) &&
      !entry.name &&
      typeof r.value === "string"
    ) {
      entry.name = r.value;
    }
  }

  return (
    <>
      <nav className="text-xs text-ink-soft">
        <Link href="/admin/content" className="hover:text-brand">
          콘텐츠
        </Link>
        <span className="mx-2">/</span>
        <span>{GROUP_LABELS[group]}</span>
      </nav>
      <header className="mt-3 border-b border-line pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{GROUP_LABELS[group]}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {slugs.size}개 항목. 항목을 선택해 4개 언어 텍스트를 편집합니다.
        </p>
      </header>

      <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {[...slugs.entries()].map(([slug, info]) => (
          <li key={slug}>
            <Link
              href={`/admin/content/${group}/${encodeURIComponent(slug)}`}
              className="block rounded-2xl border border-line bg-white p-4 transition hover:border-brand/40 hover:shadow"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                {slug}
              </p>
              <p className="mt-1 truncate text-base font-bold text-ink">
                {info.name || slug}
              </p>
              <p className="mt-1 text-[11px] text-ink-soft">{info.fields} 필드</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
