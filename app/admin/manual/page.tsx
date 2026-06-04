import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moveSection, togglePublished } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminManualList() {
  const sections = await prisma.manualSection.findMany({
    orderBy: [{ sortIndex: "asc" }, { createdAt: "asc" }],
  });

  const published = sections.filter((s) => s.published);
  const totalChars = published.reduce((sum, s) => sum + s.body.length, 0);

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">MANUAL</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">챗봇 매뉴얼</h1>
          <p className="mt-2 text-sm text-ink-soft">
            챗봇이 답변할 때 근거로 삼는 운영 매뉴얼입니다. 총 {sections.length}개 섹션 ·
            게시 중 {published.length}개 · 챗봇 컨텍스트 {totalChars.toLocaleString()}자.
          </p>
        </div>
        <Link
          href="/admin/manual/new"
          className="inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-brand-dark sm:self-auto"
        >
          + 새 섹션
        </Link>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {sections.length === 0 ? (
          <div className="grid place-items-center bg-white p-16 text-sm text-ink-soft">
            아직 등록된 섹션이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-line/60 bg-white">
            {sections.map((s, i) => (
              <li key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className="w-8 text-sm font-bold text-ink-soft">{i + 1}.</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{s.title}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">
                    {s.body.replace(/\s+/g, " ").slice(0, 120)}
                    {s.body.length > 120 ? "…" : ""}
                  </p>
                  <p className="mt-1 text-[10px] text-ink-soft/70">
                    {s.body.length.toLocaleString()}자 · 수정 {s.updatedAt.toLocaleString("ko-KR")}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    s.published
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-ink/10 text-ink-soft"
                  }`}
                >
                  {s.published ? "사용 중" : "비활성"}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <form
                    action={async () => {
                      "use server";
                      await moveSection(s.id, "up");
                    }}
                  >
                    <button
                      type="submit"
                      disabled={i === 0}
                      className="grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-xs text-ink transition hover:border-brand hover:text-brand-dark disabled:opacity-30"
                      aria-label="위로"
                    >
                      ↑
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await moveSection(s.id, "down");
                    }}
                  >
                    <button
                      type="submit"
                      disabled={i === sections.length - 1}
                      className="grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-xs text-ink transition hover:border-brand hover:text-brand-dark disabled:opacity-30"
                      aria-label="아래로"
                    >
                      ↓
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await togglePublished(s.id, !s.published);
                    }}
                  >
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                        s.published
                          ? "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
                          : "bg-brand text-white hover:bg-brand-dark"
                      }`}
                    >
                      {s.published ? "사용 중지" : "사용"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/manual/${s.id}`}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
                  >
                    수정
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 rounded-2xl bg-sand/60 px-5 py-4 text-xs leading-relaxed text-ink-soft">
        ※ "사용 중"으로 표시된 섹션만 챗봇에 주입됩니다. 비활성으로 두면 즉시 챗봇 컨텍스트에서
        빠집니다. 너무 길어지면 응답 품질·비용이 떨어질 수 있어, 한 섹션은 가능한 한 8~15줄 이내로
        간결하게 유지해 주세요.
      </p>
    </>
  );
}
