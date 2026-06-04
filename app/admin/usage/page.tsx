import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

function fmtUsd(n: number) {
  return `$${n.toFixed(4)}`;
}
function fmtUsdShort(n: number) {
  return `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`;
}
function fmtNum(n: number) {
  return n.toLocaleString();
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfDay(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function UsagePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const settings = await getSettings();

  const since30 = startOfDay(29);
  const monthStart = startOfMonth();

  const [recent, monthAgg, daySeries, bySource] = await Promise.all([
    prisma.tokenUsage.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.tokenUsage.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { totalTokens: true, costUsd: true, promptTokens: true, completionTokens: true },
      _count: { _all: true },
    }),
    prisma.tokenUsage.findMany({
      where: { createdAt: { gte: since30 } },
      select: { createdAt: true, costUsd: true, totalTokens: true, source: true },
    }),
    prisma.tokenUsage.groupBy({
      by: ["source"],
      where: { createdAt: { gte: monthStart } },
      _sum: { totalTokens: true, costUsd: true },
      _count: { _all: true },
    }),
  ]);

  const totalsByDay: { date: string; usd: number; tokens: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dayStr = d.toISOString().slice(0, 10);
    totalsByDay.push({ date: dayStr, usd: 0, tokens: 0 });
  }
  for (const r of daySeries) {
    const dayStr = new Date(r.createdAt).toISOString().slice(0, 10);
    const target = totalsByDay.find((t) => t.date === dayStr);
    if (!target) continue;
    target.usd += r.costUsd;
    target.tokens += r.totalTokens;
  }
  const maxUsd = Math.max(0.0001, ...totalsByDay.map((t) => t.usd));

  const budget = settings.monthlyTokenBudgetUsd;
  const monthSpent = monthAgg._sum.costUsd ?? 0;
  const monthPct = budget > 0 ? Math.min(100, (monthSpent / budget) * 100) : 0;

  return (
    <>
      <header className="border-b border-line pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">USAGE</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">OpenAI 토큰 사용량</h1>
        <p className="mt-2 text-sm text-ink-soft">
          챗봇 응답 · 자동 번역에 사용된 OpenAI 토큰과 추정 비용.
        </p>
      </header>

      {/* KPI row */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border-2 border-brand bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand">이번 달 비용</p>
          <p className="mt-2 text-3xl font-bold text-brand-dark">
            {fmtUsdShort(monthSpent)}
          </p>
          <p className="mt-1 text-[11px] text-ink-soft">
            {budget > 0
              ? `예산 ${fmtUsdShort(budget)} · ${monthPct.toFixed(0)}%`
              : "월 예산 미설정"}
          </p>
          {budget > 0 && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className={`h-full ${monthPct > 80 ? "bg-red-500" : "bg-brand"}`}
                style={{ width: `${monthPct}%` }}
              />
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-ink-soft">호출 수</p>
          <p className="mt-2 text-3xl font-bold">{monthAgg._count._all}</p>
          <p className="mt-1 text-[11px] text-ink-soft">이번 달</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-ink-soft">입력 토큰</p>
          <p className="mt-2 text-3xl font-bold">
            {fmtNum(monthAgg._sum.promptTokens ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-ink-soft">출력 토큰</p>
          <p className="mt-2 text-3xl font-bold">
            {fmtNum(monthAgg._sum.completionTokens ?? 0)}
          </p>
        </div>
      </section>

      {/* Source breakdown */}
      <section className="mt-10 rounded-3xl border border-line bg-white p-6 lg:p-8">
        <h2 className="text-base font-bold">소스별 (이번 달)</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {["chat", "translate", "other"].map((s) => {
            const row = bySource.find((b) => b.source === s);
            const cost = row?._sum.costUsd ?? 0;
            const tokens = row?._sum.totalTokens ?? 0;
            const count = row?._count._all ?? 0;
            const label =
              s === "chat" ? "챗봇 응답" : s === "translate" ? "자동 번역" : "기타";
            return (
              <div key={s} className="rounded-2xl border border-line/70 bg-cream/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  {label}
                </p>
                <p className="mt-2 text-xl font-bold">{fmtUsdShort(cost)}</p>
                <p className="mt-1 text-[11px] text-ink-soft">
                  {fmtNum(tokens)} tokens · {count} calls
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily chart */}
      <section className="mt-10 rounded-3xl border border-line bg-white p-6 lg:p-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-bold">최근 30일 일별 비용 (USD)</h2>
          <p className="text-[11px] text-ink-soft">
            최대 {fmtUsdShort(maxUsd)}
          </p>
        </div>
        <div className="mt-6 flex h-32 items-end gap-[3px]">
          {totalsByDay.map((d) => {
            const h = (d.usd / maxUsd) * 100;
            return (
              <div
                key={d.date}
                title={`${d.date} · ${fmtUsd(d.usd)} (${fmtNum(d.tokens)} tokens)`}
                className="group relative flex-1"
              >
                <div
                  className="w-full rounded-sm bg-brand/80 transition group-hover:bg-brand"
                  style={{ height: `${Math.max(2, h)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-ink-soft/70">
          <span>{totalsByDay[0]?.date}</span>
          <span>{totalsByDay[totalsByDay.length - 1]?.date}</span>
        </div>
      </section>

      {/* Recent calls */}
      <section className="mt-10 rounded-3xl border border-line bg-white">
        <div className="border-b border-line px-6 py-4 lg:px-8">
          <h2 className="text-base font-bold">최근 호출 (50개)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-cream/50 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                <th className="px-6 py-3 lg:px-8">시각</th>
                <th className="px-4 py-3">소스</th>
                <th className="px-4 py-3">모델</th>
                <th className="px-4 py-3 text-right">입력</th>
                <th className="px-4 py-3 text-right">출력</th>
                <th className="px-4 py-3 text-right">비용</th>
                <th className="px-4 py-3">메타</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-line/40 last:border-0">
                  <td className="px-6 py-2.5 text-[12px] text-ink-soft lg:px-8">
                    {new Date(r.createdAt).toLocaleString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        r.source === "chat"
                          ? "bg-brand/15 text-brand-dark"
                          : r.source === "translate"
                            ? "bg-blush text-ink"
                            : "bg-sand text-ink-soft"
                      }`}
                    >
                      {r.source}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-soft">{r.model}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmtNum(r.promptTokens)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmtNum(r.completionTokens)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                    {fmtUsd(r.costUsd)}
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-2.5 text-[11px] text-ink-soft">
                    {r.meta ?? "—"}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-ink-soft">
                    아직 호출 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
