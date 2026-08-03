import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PER_PAGE = 30;

const LOCALE_LABEL: Record<string, string> = {
  ko: "🇰🇷 한국어",
  en: "🇺🇸 English",
  ja: "🇯🇵 日本語",
  zh: "🇨🇳 中文",
};

const STATUS_LABEL: Record<string, { label: string; badge: string }> = {
  ok: { label: "정상 답변", badge: "bg-emerald-100 text-emerald-700" },
  fallback: { label: "안내 문구", badge: "bg-amber-100 text-amber-700" },
  error: { label: "오류", badge: "bg-red-50 text-red-600" },
};

export default async function AdminChatLogs({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const status =
    sp.status && ["ok", "fallback", "error"].includes(sp.status) ? sp.status : "ALL";
  const where = status === "ALL" ? {} : { status };

  const total = await prisma.chatLog.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(pageCount, Math.max(1, Number(sp.page) || 1));

  const logs = await prisma.chatLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PER_PAGE,
    take: PER_PAGE,
  });

  const filterHref = (s: string) =>
    s === "ALL" ? "/admin/chats" : `/admin/chats?status=${s}`;
  const pageHref = (p: number) =>
    status === "ALL"
      ? `/admin/chats?page=${p}`
      : `/admin/chats?status=${status}&page=${p}`;

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">CHAT LOGS</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">챗봇 대화 기록</h1>
          <p className="mt-2 text-sm text-ink-soft">
            방문자와 챗봇이 주고받은 대화가 자동으로 누적됩니다. 총{" "}
            {total.toLocaleString()}건.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "ALL", label: "전체" },
            { key: "ok", label: "정상 답변" },
            { key: "fallback", label: "안내 문구" },
            { key: "error", label: "오류" },
          ].map((f) => (
            <Link
              key={f.key}
              href={filterHref(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                status === f.key
                  ? "bg-ink text-cream"
                  : "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {logs.length === 0 ? (
          <div className="grid place-items-center bg-white p-16 text-sm text-ink-soft">
            아직 기록된 대화가 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-line/60 bg-white">
            {logs.map((log) => {
              const st = STATUS_LABEL[log.status] ?? STATUS_LABEL.ok;
              return (
                <li key={log.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-soft">
                    <span>{log.createdAt.toLocaleString("ko-KR")}</span>
                    <span className="rounded-full bg-sand/70 px-2 py-0.5 font-medium">
                      {LOCALE_LABEL[log.locale] ?? log.locale}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${st.badge}`}
                    >
                      {st.label}
                    </span>
                    {log.model ? (
                      <span className="text-ink-soft/60">{log.model}</span>
                    ) : null}
                  </div>
                  <div className="mt-2.5 space-y-2 text-sm leading-relaxed">
                    <p className="rounded-xl bg-brand/10 px-3.5 py-2.5 text-ink">
                      <span className="mr-1.5 text-[11px] font-bold text-brand-dark">
                        방문자
                      </span>
                      {log.question}
                    </p>
                    <p className="whitespace-pre-line rounded-xl bg-sand/50 px-3.5 py-2.5 text-ink/90">
                      <span className="mr-1.5 text-[11px] font-bold text-ink-soft">
                        챗봇
                      </span>
                      {log.answer}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
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
