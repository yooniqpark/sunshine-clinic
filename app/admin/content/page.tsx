import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const GROUPS: { key: string; label: string; desc: string }[] = [
  { key: "device", label: "장비", desc: "11개 장비 마케팅 카드 (이름·태그라인·기능·FAQ)" },
  { key: "concern", label: "고민(Concern)", desc: "14개 고민별 시술 콘텐츠" },
  { key: "category", label: "카테고리", desc: "리프팅/화이트닝/여드름/피부질환 페이지 헤더" },
  { key: "chatbot", label: "챗봇", desc: "인사말·FAQ·플레이스홀더 등" },
];

export default async function ContentIndexPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = await prisma.siteContent.groupBy({
    by: ["group"],
    _count: { _all: true },
  });
  const countByGroup: Record<string, number> = {};
  for (const s of stats) countByGroup[s.group] = s._count._all;

  // recently updated
  const recent = await prisma.siteContent.findMany({
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <>
      <header className="border-b border-line pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">CONTENT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">콘텐츠 편집</h1>
        <p className="mt-2 text-sm text-ink-soft">
          시술 페이지·장비·챗봇에 사용되는 텍스트를 직접 편집합니다. 4개 언어 동시 관리.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {GROUPS.map((g) => (
          <Link
            key={g.key}
            href={`/admin/content/${g.key}`}
            className="group rounded-2xl border border-line bg-white p-6 transition hover:border-brand/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-ink-soft">
                  {g.label.toUpperCase()}
                </p>
                <p className="mt-2 text-xl font-bold">{g.label}</p>
                <p className="mt-1 text-[12px] text-ink-soft">{g.desc}</p>
              </div>
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand-dark">
                {countByGroup[g.key] ?? 0} fields
              </span>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark transition group-hover:gap-2">
              편집하기 →
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-line bg-white">
        <div className="border-b border-line px-6 py-4 lg:px-8">
          <h2 className="text-base font-bold">최근 수정</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-cream/50 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-6 py-3 lg:px-8">그룹 · 항목 · 필드</th>
              <th className="px-4 py-3">언어</th>
              <th className="px-4 py-3">수정 시각</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id} className="border-b border-line/40 last:border-0">
                <td className="px-6 py-2.5 lg:px-8">
                  <Link
                    href={`/admin/content/${r.group}/${encodeURIComponent(r.slug)}`}
                    className="font-medium text-ink hover:text-brand-dark"
                  >
                    {r.group} / {r.slug} / <span className="text-ink-soft">{r.field}</span>
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-[12px] uppercase text-ink-soft">{r.locale}</td>
                <td className="px-4 py-2.5 text-[12px] text-ink-soft">
                  {new Date(r.updatedAt).toLocaleString("ko-KR")}
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-ink-soft">
                  아직 수정 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}
