import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PER_PAGE = 12; // 대화방 단위 페이지네이션

const LOCALE_LABEL: Record<string, string> = {
  ko: "🇰🇷 한국어",
  en: "🇺🇸 English",
  ja: "🇯🇵 日本語",
  zh: "🇨🇳 中文",
};

const STATUS_LABEL: Record<string, { label: string; badge: string }> = {
  ok: { label: "정상", badge: "bg-emerald-100 text-emerald-700" },
  fallback: { label: "안내 문구", badge: "bg-amber-100 text-amber-700" },
  error: { label: "오류", badge: "bg-red-50 text-red-600" },
};

export default async function AdminChatSessions({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;

  // 대화방(세션) 목록 — 최근 활동순
  const grouped = await prisma.chatLog.groupBy({
    by: ["sessionId"],
    _max: { createdAt: true },
    _count: { _all: true },
    orderBy: { _max: { createdAt: "desc" } },
  });
  const totalSessions = grouped.length;
  const totalLogs = grouped.reduce((s, g) => s + g._count._all, 0);
  const pageCount = Math.max(1, Math.ceil(totalSessions / PER_PAGE));
  const page = Math.min(pageCount, Math.max(1, Number(sp.page) || 1));
  const pageGroups = grouped.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // 이번 페이지 대화방들의 전체 대화 내용
  const ids = pageGroups.map((g) => g.sessionId);
  const logs = await prisma.chatLog.findMany({
    where: { sessionId: { in: ids.filter((v): v is string => v !== null) } },
    orderBy: { createdAt: "asc" },
  });
  const nullLogs = ids.includes(null)
    ? await prisma.chatLog.findMany({
        where: { sessionId: null },
        orderBy: { createdAt: "desc" },
        take: 30,
      })
    : [];
  const bySession = new Map<string, typeof logs>();
  for (const log of logs) {
    const key = log.sessionId as string;
    if (!bySession.has(key)) bySession.set(key, []);
    bySession.get(key)!.push(log);
  }

  const pageHref = (p: number) => `/admin/chats?page=${p}`;

  return (
    <>
      <header className="border-b border-line pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">CHAT LOGS</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">챗봇 상담 기록</h1>
        <p className="mt-2 text-sm text-ink-soft">
          방문자와 AI 실장이 나눈 대화가 대화방 단위로 저장됩니다. 총{" "}
          {totalSessions.toLocaleString()}개 대화방 · {totalLogs.toLocaleString()}건의
          문답.
        </p>
      </header>

      <div className="mt-8 space-y-5">
        {pageGroups.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-line bg-white p-16 text-sm text-ink-soft">
            아직 기록된 대화가 없습니다.
          </div>
        ) : (
          pageGroups.map((g) => {
            const items =
              g.sessionId === null ? nullLogs : bySession.get(g.sessionId) ?? [];
            const first = items[0];
            const errorCount = items.filter((l) => l.status === "error").length;
            return (
              <details
                key={g.sessionId ?? "no-session"}
                className="group overflow-hidden rounded-2xl border border-line bg-white"
              >
                <summary className="flex cursor-pointer flex-wrap items-center gap-2 bg-sand/40 px-5 py-3 transition hover:bg-sand/70 [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden
                    className="text-[10px] text-ink-soft transition-transform group-open:rotate-90"
                  >
                    ▶
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {g.sessionId === null
                      ? "이전 기록 (대화방 구분 없음)"
                      : `대화방 ${g.sessionId.slice(0, 8)}`}
                  </span>
                  <span className="text-[11px] text-ink-soft">
                    {g._max.createdAt?.toLocaleString("ko-KR")} · 문답{" "}
                    {g._count._all.toLocaleString()}건
                  </span>
                  {first ? (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-ink-soft">
                      {LOCALE_LABEL[first.locale] ?? first.locale}
                    </span>
                  ) : null}
                  {errorCount > 0 ? (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                      오류 {errorCount}
                    </span>
                  ) : null}
                  {first ? (
                    <span className="w-full truncate pl-5 text-[11px] text-ink-soft/80 sm:w-auto sm:flex-1 sm:pl-2">
                      “{first.question.slice(0, 40)}
                      {first.question.length > 40 ? "…" : ""}”
                    </span>
                  ) : null}
                </summary>
                <div className="space-y-3 border-t border-line/70 px-5 py-4">
                  {items.map((log) => {
                    const st = STATUS_LABEL[log.status] ?? STATUS_LABEL.ok;
                    return (
                      <div key={log.id} className="space-y-1.5">
                        <div className="flex justify-end">
                          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand/10 px-3.5 py-2 text-sm leading-relaxed text-ink">
                            {log.question}
                          </p>
                        </div>
                        <div className="flex items-end gap-2">
                          <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md bg-sand/60 px-3.5 py-2 text-sm leading-relaxed text-ink/90">
                            {log.answer}
                          </p>
                          {log.status !== "ok" ? (
                            <span
                              className={`mb-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.badge}`}
                            >
                              {st.label}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-right text-[10px] text-ink-soft/60">
                          {log.createdAt.toLocaleTimeString("ko-KR")}
                        </p>
                      </div>
                    );
                  })}
                  {g.sessionId === null && g._count._all > nullLogs.length ? (
                    <p className="text-center text-[11px] text-ink-soft/70">
                      최근 30건만 표시 중 (전체 {g._count._all.toLocaleString()}건)
                    </p>
                  ) : null}
                </div>
              </details>
            );
          })
        )}
      </div>

      {pageCount > 1 ? (
        <nav className="mt-6 flex items-center justify-center gap-2 text-sm">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="rounded-full border border-line bg-white px-4 py-2 font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
            >
              ← 이전
            </Link>
          ) : null}
          <span className="px-2 text-ink-soft">
            {page} / {pageCount} 페이지
          </span>
          {page < pageCount ? (
            <Link
              href={pageHref(page + 1)}
              className="rounded-full border border-line bg-white px-4 py-2 font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
            >
              다음 →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
