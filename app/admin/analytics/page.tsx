import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStats } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export const metadata = { title: "방문 통계 — Sunshine Admin" };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = await getStats();

  return (
    <>
      <header className="border-b border-line pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">ANALYTICS</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">방문 통계</h1>
        <p className="mt-2 text-sm text-ink-soft">
          홈페이지 방문 지표 (익명 · 쿠키 없음 · 개인 식별 정보 미저장).
        </p>
      </header>

      {/* Top-line totals */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="오늘" value={stats.pv.today} sub={`유니크 ${stats.uv.today}명`} accent />
        <StatCard label="이번 주" value={stats.pv.week} sub={`유니크 ${stats.uv.week}명`} />
        <StatCard label="이번 달" value={stats.pv.month} sub={`유니크 ${stats.uv.month}명`} />
        <StatCard label="누적" value={stats.pv.total} sub={`유니크 ${stats.uv.total}명`} />
      </section>

      {/* Daily trend */}
      <section className="mt-10">
        <h2 className="text-lg font-bold">최근 14일 방문 추이</h2>
        <div className="mt-4 rounded-2xl border border-line bg-white p-6">
          {stats.daily14.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-soft">
              아직 데이터가 없습니다.
            </p>
          ) : (
            <BarChart items={stats.daily14} />
          )}
        </div>
      </section>

      {/* Two-column: top pages + top referrers */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">인기 페이지 (이번 달)</h2>
          {stats.topPaths.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">데이터 없음</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {stats.topPaths.map((p, i) => (
                <li key={p.path} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 text-sm">
                  <span className="text-xs font-semibold text-ink-soft">{i + 1}</span>
                  <span className="truncate text-ink">{p.path || "/"}</span>
                  <span className="tabular-nums font-semibold">{p.count}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">유입 경로 (이번 달)</h2>
          {stats.topReferrers.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">데이터 없음</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {stats.topReferrers.map((r, i) => (
                <li key={r.referrer} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 text-sm">
                  <span className="text-xs font-semibold text-ink-soft">{i + 1}</span>
                  <span className="truncate text-ink">{r.referrer}</span>
                  <span className="tabular-nums font-semibold">{r.count}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Locale breakdown */}
      <section className="mt-10">
        <h2 className="text-lg font-bold">언어별 방문 (이번 달)</h2>
        <div className="mt-4 rounded-2xl border border-line bg-white p-6">
          {stats.byLocale.length === 0 ? (
            <p className="py-4 text-sm text-ink-soft">데이터 없음</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-4">
              {stats.byLocale.map((l) => (
                <li key={l.locale} className="rounded-xl border border-line bg-sand/30 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    {l.locale}
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">{l.count}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <p className="mt-10 text-[11px] leading-relaxed text-ink-soft/70">
        · 모든 지표는 <strong className="font-semibold text-ink">쿠키 없이</strong> 서버 로그에서 집계됩니다.
        <br />
        · 유니크 방문자는 해시 기반 (IP + User-Agent + 일 단위 rotating salt) — 개인 식별 불가.
        <br />
        · 어드민 · API · 봇 트래픽 제외.
      </p>

    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl border-2 border-brand bg-white p-6"
          : "rounded-2xl border border-line bg-white p-6"
      }
    >
      <p
        className={
          accent
            ? "text-xs font-semibold tracking-[0.18em] text-brand"
            : "text-xs font-semibold tracking-[0.18em] text-ink-soft"
        }
      >
        {label.toUpperCase()}
      </p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${accent ? "text-brand-dark" : ""}`}>
        {value.toLocaleString()}
      </p>
      {sub && <p className="mt-1 text-[11px] text-ink-soft">{sub}</p>}
    </div>
  );
}

function BarChart({ items }: { items: { day: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="flex h-40 items-end gap-1.5">
      {items.map((it) => {
        const h = (it.count / max) * 100;
        return (
          <div key={it.day} className="flex flex-1 flex-col items-center gap-1">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t bg-brand/70 transition"
                style={{ height: `${Math.max(2, h)}%` }}
                title={`${it.day}: ${it.count}회`}
              />
            </div>
            <span className="text-[10px] text-ink-soft">{it.day.slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
}
