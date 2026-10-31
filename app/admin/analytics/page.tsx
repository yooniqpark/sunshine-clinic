import { auth } from "@yooniqpark/clinic-core/auth";
import { redirect } from "next/navigation";
import clinic from "@clinic/app";
import { getStats } from "@/lib/clinic-analytics";
import { AI_SERVICES } from "@/lib/traffic-sources";
import AiAccessPanel from "./AiAccessPanel";

export const dynamic = "force-dynamic";

export const metadata = { title: `방문 통계 — ${clinic.config.adminBrand} Admin` };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = await getStats();
  const aiServices = AI_SERVICES.map((service) => ({
    ...service,
    today: 0,
    week: 0,
    month: 0,
    ...stats.aiReferrals.services.find((item) => item.id === service.id),
  }));

  return (
    <>
      <header className="border-b border-line pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand">ANALYTICS</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">방문 통계</h1>
            <p className="mt-2 text-sm text-ink-soft">
              홈페이지 방문 지표 (익명 · 개인 식별 정보 미저장).
            </p>
          </div>
        </div>
      </header>

      {/* Top-line totals — 방문자(UV)만 노출: 페이지 이동해도 늘어나지 않음 */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="오늘 방문자"
          value={stats.uv.today}
          unit="명"
          accent
          sub={`어제 ${stats.yesterday.uv.toLocaleString()}명 · ${
            stats.uv.today - stats.yesterday.uv >= 0 ? "+" : ""
          }${stats.uv.today - stats.yesterday.uv}명`}
        />
        <StatCard label="이번 주 방문자" value={stats.uv.week} unit="명" />
        <StatCard label="이번 달 방문자" value={stats.uv.month} unit="명" />
        <StatCard
          label="누적 방문자"
          value={stats.uv.total}
          unit="명"
          sub={`방문자당 평균 ${stats.pagesPerVisitor}페이지 열람 (이번 달)`}
        />
      </section>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-soft/70">
        · <strong className="text-ink">방문자</strong> = 익명 식별값으로 일별 중복을 제거한 추정치입니다. 날짜나 브라우저가 달라지면 다르게 집계될 수 있습니다.
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

      {/* Daily trend — 30일, 방문자(UV) 기준 */}
      <section className="mt-10">
        <h2 className="text-lg font-bold">최근 30일 방문자 추이</h2>
        <p className="mt-1 text-[11px] text-ink-soft">막대 = 방문자 수(명) · 마우스를 올리면 페이지뷰도 표시</p>
        <div className="mt-4 rounded-2xl border border-line bg-white p-6">
          <Daily30Chart items={stats.daily30} />
        </div>
      </section>

      {/* 시간대별 · 요일별 */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">시간대별 방문 (최근 7일)</h2>
          <p className="mt-1 text-[11px] text-ink-soft">한국시간 기준 · 어느 시간에 많이 들어오는지</p>
          <HourChart items={stats.hourly7} />
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">요일별 방문 (최근 4주)</h2>
          <p className="mt-1 text-[11px] text-ink-soft">어느 요일이 붐비는지</p>
          <WeekdayChart items={stats.weekday28} />
        </div>
      </section>

      {/* 유입 분류 · 시술 페이지 랭킹 */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">어디서 들어왔나 (이번 달)</h2>
          <p className="mt-1 text-[11px] text-ink-soft">네이버·구글·SNS·AI 서비스·직접 방문·출처 미확인으로 분류 · 페이지뷰 기준</p>
          {stats.sources.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">데이터 없음</p>
          ) : (
            <SourceList items={stats.sources} />
          )}
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">인기 시술 페이지 (이번 달)</h2>
          <p className="mt-1 text-[11px] text-ink-soft">방문자들이 가장 많이 본 시술</p>
          {stats.topTreatments.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">데이터 없음</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {stats.topTreatments.map((t, i) => (
                <li key={t.name} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 text-sm">
                  <span className={`text-xs font-semibold ${i < 3 ? "text-brand-dark" : "text-ink-soft"}`}>{i + 1}</span>
                  <span className="truncate text-ink">{t.name}</span>
                  <span className="tabular-nums font-semibold">{t.count.toLocaleString()}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <AiAccessPanel stats={stats.aiAccess} />

      <section className="mt-10 rounded-2xl border border-line bg-white p-6" aria-labelledby="ai-referrals-heading">
        <h2 id="ai-referrals-heading" className="text-lg font-bold">AI 서비스에서 넘어온 방문</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          출처 주소 또는 UTM 태그가 남은 방문 기록을 집계합니다. UTM 태그가 있으면 해당 출처를 우선 적용하며, 출처가 없는 방문은 AI 유입 여부를 알 수 없습니다.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <caption className="mb-3 text-left text-[11px] leading-relaxed text-ink-soft">
              페이지뷰 기준 · 같은 방문자가 여러 페이지를 열람하면 각각 집계됩니다.
            </caption>
            <thead className="border-b border-line text-ink-soft">
              <tr>
                <th scope="col" className="py-3 pr-4 text-left font-medium">서비스</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">오늘</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">최근 7일</th>
                <th scope="col" className="py-3 pl-3 text-right font-medium">최근 30일</th>
              </tr>
            </thead>
            <tbody>
              {aiServices.map((service) => (
                <tr key={service.id} className="border-b border-line last:border-0">
                  <th scope="row" className="py-4 pr-4 text-left font-semibold text-ink">{service.label}</th>
                  <td className="px-3 py-4 text-right tabular-nums">{service.today.toLocaleString()}<span className="ml-1 text-[11px] text-ink-soft">회</span></td>
                  <td className="px-3 py-4 text-right tabular-nums">{service.week.toLocaleString()}<span className="ml-1 text-[11px] text-ink-soft">회</span></td>
                  <td className="py-4 pl-3 text-right tabular-nums">{service.month.toLocaleString()}<span className="ml-1 text-[11px] text-ink-soft">회</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 border-t border-line pt-5">
          <h3 className="text-sm font-semibold">AI 유입으로 열람한 페이지 · 최근 30일</h3>
          {stats.aiReferrals.paths.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">최근 30일에 확인된 AI 서비스 유입 기록이 없습니다.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {stats.aiReferrals.paths.map((item) => (
                <li key={`${item.service}-${item.path}`} className="grid grid-cols-[1fr_auto] items-start gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-brand-dark">{AI_SERVICES.find((service) => service.id === item.service)?.label ?? item.service}</p>
                    <p className="mt-1 break-all text-ink">{item.path || "/"}</p>
                  </div>
                  <p className="whitespace-nowrap text-right font-semibold tabular-nums">
                    {item.count.toLocaleString()}<span className="ml-1 text-[11px] font-medium text-ink-soft">페이지뷰</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Today's traffic sources (referrer + UTM) */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">오늘 유입 경로 (referrer)</h2>
          <p className="mt-1 text-[11px] text-ink-soft">외부에서 우리 사이트로 들어온 주소</p>
          {stats.todayReferrers.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">오늘 아직 데이터 없음</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {stats.todayReferrers.map((r, i) => (
                <li key={r.referrer} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 text-sm">
                  <span className="text-xs font-semibold text-ink-soft">{i + 1}</span>
                  <span className="truncate text-ink">{r.referrer}</span>
                  <span className="tabular-nums font-semibold">{r.count}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">오늘 유입 캠페인 (UTM)</h2>
          <p className="mt-1 text-[11px] text-ink-soft">
            <code className="rounded bg-sand/50 px-1 text-[10px]">?utm_source=naver&utm_medium=cpc</code> 형태 링크 유입
          </p>
          {stats.todayUtm.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">오늘 UTM 유입 없음</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {stats.todayUtm.map((u, i) => (
                <li key={`${u.source}-${u.medium}`} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 text-sm">
                  <span className="text-xs font-semibold text-ink-soft">{i + 1}</span>
                  <span className="truncate text-ink">
                    {u.source}
                    {u.medium && <span className="ml-2 text-ink-soft">· {u.medium}</span>}
                  </span>
                  <span className="tabular-nums font-semibold">{u.count}</span>
                </li>
              ))}
            </ol>
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
        · 사이트에서 전송한 페이지 열람 기록을 집계하며 별도의 추적 쿠키를 추가하지 않습니다.
        <br />
        · 방문자 수는 매일 바뀌는 익명 식별값을 기준으로 추정합니다.
        <br />
        · 관리자·API 페이지와 ‘내 접속 제외’ 설정을 적용한 방문은 집계에서 제외합니다. AI 유입 수치는 AI 수집봇의 요청 횟수나 답변 노출 횟수를 뜻하지 않습니다.
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

function Daily30Chart({ items }: { items: { day: string; pv: number; uv: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.uv));
  return (
    <div className="flex h-48 items-end gap-[3px]">
      {items.map((it, idx) => {
        const h = it.uv === 0 ? 3 : Math.max(6, (it.uv / max) * 168);
        const dow = new Date(`${it.day}T00:00:00+09:00`).getDay();
        const weekend = dow === 0 || dow === 6;
        const showLabel = idx % 5 === 0 || idx === items.length - 1;
        return (
          <div key={it.day} className="group flex flex-1 flex-col items-center gap-1.5">
            <div className="relative flex w-full flex-1 items-end justify-center">
              <span className="absolute -top-6 z-10 hidden whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[9px] font-semibold text-cream group-hover:block">
                {it.day.slice(5)} · {it.uv}명 / {it.pv}뷰
              </span>
              <div
                className={`w-full rounded-t transition ${
                  it.uv === 0
                    ? "bg-line"
                    : weekend
                      ? "bg-brand-soft group-hover:bg-brand"
                      : "bg-brand/80 group-hover:bg-brand"
                }`}
                style={{ height: `${h}px` }}
              />
            </div>
            <span className="h-3 text-[9px] text-ink-soft">
              {showLabel ? it.day.slice(5).replace("-", "/") : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HourChart({ items }: { items: number[] }) {
  const max = Math.max(1, ...items);
  return (
    <div className="mt-4 flex h-36 items-end gap-[3px]">
      {items.map((c, hour) => {
        const h = c === 0 ? 3 : Math.max(5, (c / max) * 120);
        const showLabel = hour % 6 === 0 || hour === 23;
        return (
          <div key={hour} className="group flex flex-1 flex-col items-center gap-1.5">
            <div className="relative flex w-full flex-1 items-end justify-center">
              <span className="absolute -top-6 z-10 hidden whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[9px] font-semibold text-cream group-hover:block">
                {hour}시 · {c}뷰
              </span>
              <div
                className={`w-full rounded-t transition ${
                  c === 0 ? "bg-line" : "bg-brand/80 group-hover:bg-brand"
                }`}
                style={{ height: `${h}px` }}
              />
            </div>
            <span className="h-3 text-[9px] text-ink-soft">{showLabel ? `${hour}시` : ""}</span>
          </div>
        );
      })}
    </div>
  );
}

function WeekdayChart({ items }: { items: { label: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="mt-4 flex h-36 items-end gap-2">
      {items.map((it) => {
        const h = it.count === 0 ? 3 : Math.max(5, (it.count / max) * 110);
        const weekend = it.label === "일" || it.label === "토";
        return (
          <div key={it.label} className="group flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] font-semibold tabular-nums text-ink-soft">
              {it.count > 0 ? it.count.toLocaleString() : ""}
            </span>
            <div className="flex w-full flex-1 items-end justify-center">
              <div
                className={`w-full max-w-10 rounded-t transition ${
                  it.count === 0 ? "bg-line" : weekend ? "bg-brand-soft" : "bg-brand/80"
                }`}
                style={{ height: `${h}px` }}
              />
            </div>
            <span className={`text-[11px] font-medium ${weekend ? "text-brand-dark" : "text-ink-soft"}`}>
              {it.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const SOURCE_ICON: Record<string, string> = {
  "직접 방문": "🔗",
  "직접 방문·출처 미확인": "🔗",
  ChatGPT: "✳️",
  Gemini: "✨",
  Claude: "✴️",
  네이버: "🟢",
  구글: "🔵",
  "다음·카카오": "🟡",
  인스타그램: "📸",
  유튜브: "▶️",
  페이스북: "🔷",
  빙: "🔍",
  기타: "🌐",
};

function SourceList({ items }: { items: { label: string; count: number }[] }) {
  const total = items.reduce((s, i) => s + i.count, 0);
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((s) => {
        const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
        return (
          <li key={s.label} className="text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink">
                <span className="mr-1.5">{SOURCE_ICON[s.label] ?? "🌐"}</span>
                {s.label}
              </span>
              <span className="tabular-nums font-semibold">
                {s.count.toLocaleString()}
                <span className="ml-1.5 text-[11px] font-medium text-ink-soft">{pct}%</span>
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
