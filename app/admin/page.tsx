import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getStats } from "@/lib/analytics";

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const monthStart = startOfMonth();
  const [
    eventCount,
    publishedCount,
    manualCount,
    manualLiveCount,
    newReservations,
    totalReservations,
    contentCount,
    monthUsage,
    settings,
    analyticsStats,
    recentReservations,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { published: true } }),
    prisma.manualSection.count(),
    prisma.manualSection.count({ where: { published: true } }),
    prisma.reservation.count({ where: { status: "NEW" } }),
    prisma.reservation.count(),
    prisma.siteContent.count(),
    prisma.tokenUsage.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { costUsd: true },
      _count: { _all: true },
    }),
    getSettings(),
    getStats(),
    prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        contact: true,
        preferredAt: true,
        interest: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  void monthUsage;
  void settings;

  const now = new Date();
  const greetHour = now.getHours();
  const greet =
    greetHour < 6 ? "좋은 새벽입니다"
    : greetHour < 12 ? "좋은 아침입니다"
    : greetHour < 18 ? "좋은 오후입니다"
    : "좋은 저녁입니다";

  const dateFmt = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  }).format(now);

  return (
    <>
      {/* Greeting header */}
      <header className="rounded-3xl bg-gradient-to-br from-ink via-ink to-brand-dark p-8 text-cream lg:p-10">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-soft">DASHBOARD</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">
          {greet}, 관리자님
        </h1>
        <p className="mt-3 text-sm text-cream/70 lg:text-base">{dateFmt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {newReservations > 0 ? (
            <Link
              href="/admin/reservations?status=NEW"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25 text-[11px] font-bold">
                {newReservations}
              </span>
              신규 예약 확인
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm text-cream/70">
              ✓ 대기 중인 예약 없음
            </span>
          )}
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-cream transition hover:bg-white/10"
          >
            방문 통계 자세히 →
          </Link>
        </div>
      </header>

      {/* KPI cards */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          eyebrow="TODAY · VISITORS"
          value={analyticsStats.pv.today.toLocaleString()}
          sub={`유니크 ${analyticsStats.uv.today}명`}
          trend={`이번 달 ${analyticsStats.pv.month.toLocaleString()}회`}
          href="/admin/analytics"
          accent="brand"
        />
        <KpiCard
          eyebrow="NEW RESERVATIONS"
          value={newReservations.toLocaleString()}
          sub={`대기 · 전체 ${totalReservations.toLocaleString()}`}
          href="/admin/reservations?status=NEW"
        />
        <KpiCard
          eyebrow="EVENTS"
          value={`${publishedCount}/${eventCount}`}
          sub="게시 중 / 전체"
          href="/admin/events"
        />
        <KpiCard
          eyebrow="CONTENT FIELDS"
          value={contentCount.toLocaleString()}
          sub="DB 관리 텍스트 (4 locale)"
          href="/admin/content"
        />
      </section>

      {/* Two-column layout: recent reservations + quick actions */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Recent reservations */}
        <div className="rounded-3xl border border-line bg-white p-6 lg:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand">RECENT</p>
              <h2 className="mt-1 text-lg font-bold">최근 예약</h2>
            </div>
            <Link
              href="/admin/reservations"
              className="text-xs font-semibold text-brand hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="mt-5 space-y-2">
            {recentReservations.length === 0 ? (
              <p className="rounded-2xl bg-sand/30 py-8 text-center text-sm text-ink-soft">
                아직 예약이 없습니다.
              </p>
            ) : (
              recentReservations.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/reservations`}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-line px-4 py-3 transition hover:border-brand/40 hover:bg-sand/20"
                >
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.status === "NEW"
                        ? "bg-brand/15 text-brand-dark"
                        : "bg-line text-ink-soft"
                    }`}
                  >
                    {r.status === "NEW" ? "신규" : r.status}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{r.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-ink-soft">
                      {r.contact}
                      {r.interest && ` · ${r.interest}`}
                    </p>
                  </div>
                  <span className="text-[11px] tabular-nums text-ink-soft">
                    {formatRelative(r.createdAt)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-3xl border border-line bg-white p-6 lg:p-7">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand">QUICK ACTIONS</p>
          <h2 className="mt-1 text-lg font-bold">바로가기</h2>
          <div className="mt-5 grid gap-2">
            <QuickLink href="/admin/reservations" label="예약 관리" desc="접수·처리·캘린더" icon="📅" />
            <QuickLink href="/admin/analytics" label="방문 통계" desc="일·주·달 트래픽" icon="📊" />
            <QuickLink href="/admin/events" label="이벤트" desc={`${manualLiveCount}/${manualCount} 활성`} icon="🎉" />
            <QuickLink href="/admin/content" label="콘텐츠 편집" desc="시술·장비·챗봇" icon="✏️" />
            <QuickLink href="/admin/settings" label="사이트 설정" desc="전화·URL·시간" icon="⚙️" />
          </div>
        </div>
      </section>
    </>
  );
}

function KpiCard({
  eyebrow,
  value,
  sub,
  trend,
  href,
  accent,
}: {
  eyebrow: string;
  value: string;
  sub: string;
  trend?: string;
  href: string;
  accent?: "brand";
}) {
  const cls =
    accent === "brand"
      ? "group relative overflow-hidden rounded-3xl border-2 border-brand bg-gradient-to-br from-brand/5 to-blush/40 p-6 transition hover:shadow-lg hover:shadow-brand/10"
      : "group relative overflow-hidden rounded-3xl border border-line bg-white p-6 transition hover:border-brand/40 hover:shadow-md";
  return (
    <Link href={href} className={cls}>
      <p
        className={
          accent === "brand"
            ? "text-[10px] font-bold tracking-[0.22em] text-brand"
            : "text-[10px] font-bold tracking-[0.22em] text-ink-soft"
        }
      >
        {eyebrow}
      </p>
      <p
        className={`mt-3 text-4xl font-bold tabular-nums leading-none ${
          accent === "brand" ? "text-brand-dark" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-[11px] text-ink-soft">{sub}</p>
      {trend && (
        <p className="mt-3 border-t border-line/60 pt-2 text-[10px] text-ink-soft/80">{trend}</p>
      )}
      <span className="absolute right-4 top-4 text-ink-soft opacity-0 transition group-hover:opacity-100">
        →
      </span>
    </Link>
  );
}

function QuickLink({
  href,
  label,
  desc,
  icon,
}: {
  href: string;
  label: string;
  desc: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-line bg-sand/20 px-4 py-3 transition hover:border-brand/40 hover:bg-sand/50"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-lg">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-[11px] text-ink-soft">{desc}</p>
      </div>
      <span className="text-ink-soft">→</span>
    </Link>
  );
}

function formatRelative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}
