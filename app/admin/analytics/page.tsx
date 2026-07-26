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

      {/* Top-line totals — 방문자(UV)만 노출: 페이지 이동해도 늘어나지 않음 */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="오늘 방문자" value={stats.uv.today} unit="명" accent />
        <StatCard label="이번 주 방문자" value={stats.uv.week} unit="명" />
        <StatCard label="이번 달 방문자" value={stats.uv.month} unit="명" />
        <StatCard label="누적 방문자" value={stats.uv.total} unit="명" />
      </section>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-soft/70">
        · <strong className="text-ink">방문자</strong> = 실제 사람 수(중복 제거). 같은 방문자가 여러 페이지를 열어도 하루 1명으로 카운트됩니다.
      </p>

      {/* Page view — 참고용으로 하단에만 소형 표시 */}
      <section className="mt-6 rounded-2xl border border-line bg-sand/30 p-5">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-ink-soft">
          PAGE VIEWS · 참고용
        </p>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-ink-soft sm:grid-cols-4">
          <PVLine label="오늘" value={stats.pv.today} />
          <PVLine label="이번 주" value={stats.pv.week} />
          <PVLine label="이번 달" value={stats.pv.month} />
          <PVLine label="누적" value={stats.pv.total} />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-soft/70">
          한 방문자가 여러 페이지를 볼 때마다 누적되므로 <strong className="text-ink">방문자 수와는 별개</strong>의 지표입니다.
        </p>
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

      {/* Locale + device breakdown */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
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
        </div>

        <div>
          <h2 className="text-lg font-bold">기기별 방문 (이번 달)</h2>
          <div className="mt-4 rounded-2xl border border-line bg-white p-6">
            {stats.byDevice.length === 0 ? (
              <p className="py-4 text-sm text-ink-soft">데이터 없음</p>
            ) : (
              <DeviceBreakdown items={stats.byDevice} />
            )}
          </div>
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

function PVLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-[0.2em] text-ink-soft/70">{label}</p>
      <p className="mt-1 font-serif text-lg tabular-nums text-ink">
        {value.toLocaleString()}
        <span className="ml-1 text-[10px] font-medium text-ink-soft/60">회</span>
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  sub,
  accent = false,
}: {
  label: string;
  value: number;
  unit?: string;
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
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${accent ? "text-brand-dark" : ""}`}>
        {value.toLocaleString()}
        {unit && <span className="ml-1 text-lg font-semibold text-ink-soft">{unit}</span>}
      </p>
      {sub && <p className="mt-1 text-[11px] text-ink-soft">{sub}</p>}
    </div>
  );
}

const DEVICE_META: Record<string, { label: string; icon: string }> = {
  mobile: { label: "모바일", icon: "📱" },
  tablet: { label: "태블릿", icon: "📲" },
  desktop: { label: "데스크탑", icon: "💻" },
};

function DeviceBreakdown({ items }: { items: { device: string; count: number }[] }) {
  const total = items.reduce((s, i) => s + i.count, 0);
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map((d) => {
        const meta = DEVICE_META[d.device] ?? { label: d.device, icon: "🖥" };
        const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
        return (
          <li key={d.device} className="rounded-xl border border-line bg-sand/30 p-4">
            <p className="text-xs font-semibold text-ink-soft">
              <span className="mr-1">{meta.icon}</span>
              {meta.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{d.count.toLocaleString()}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-ink-soft">{pct}%</p>
          </li>
        );
      })}
    </ul>
  );
}

function BarChart({ items }: { items: { day: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="flex h-48 items-end gap-2">
      {items.map((it) => {
        // Reserve minimum 3px for zero-count days so the axis feels populated.
        const h = it.count === 0 ? 3 : Math.max(6, (it.count / max) * 176);
        const empty = it.count === 0;
        return (
          <div key={it.day} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end justify-center">
              {it.count > 0 && (
                <span className="absolute -top-5 hidden text-[10px] font-semibold text-ink group-hover:block">
                  {it.count}
                </span>
              )}
              <div
                className={`w-full rounded-t transition ${
                  empty ? "bg-line" : "bg-brand/80 group-hover:bg-brand"
                }`}
                style={{ height: `${h}px` }}
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
