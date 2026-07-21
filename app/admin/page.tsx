import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getStats } from "@/lib/analytics";

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

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
  ]);

  // monthUsage/settings are kept for future budget UI; currently unused after usage page removal.
  void monthUsage;
  void settings;

  return (
    <>
      <header className="border-b border-line pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">DASHBOARD</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">관리자 홈</h1>
        <p className="mt-2 text-sm text-ink-soft">
          예약·콘텐츠·운영 비용을 한눈에 봅니다.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/reservations?status=NEW"
          className="rounded-2xl border-2 border-brand bg-white p-6 transition hover:bg-brand/5"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-brand">NEW RESERVATIONS</p>
          <p className="mt-2 text-3xl font-bold text-brand-dark">{newReservations}</p>
          <p className="mt-1 text-[11px] text-ink-soft">대기 / 전체 {totalReservations}</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-2xl border border-line bg-white p-6 transition hover:border-brand/40"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-ink-soft">TODAY · VISITORS</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {analyticsStats.pv.today.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-ink-soft">
            유니크 {analyticsStats.uv.today}명 · 이번달 {analyticsStats.pv.month.toLocaleString()}회
          </p>
        </Link>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-ink-soft">EVENTS</p>
          <p className="mt-2 text-3xl font-bold">
            {publishedCount}
            <span className="text-base font-normal text-ink-soft">/{eventCount}</span>
          </p>
          <p className="mt-1 text-[11px] text-ink-soft">게시 중 / 전체</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-ink-soft">CONTENT FIELDS</p>
          <p className="mt-2 text-3xl font-bold">{contentCount}</p>
          <p className="mt-1 text-[11px] text-ink-soft">DB 관리 텍스트 (4 locale)</p>
        </div>
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/reservations"
          className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand/40"
        >
          <p className="text-sm font-bold">예약 관리</p>
          <p className="mt-1 text-[12px] text-ink-soft">접수된 예약 목록·캘린더</p>
        </Link>
        <Link
          href="/admin/content"
          className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand/40"
        >
          <p className="text-sm font-bold">콘텐츠 편집</p>
          <p className="mt-1 text-[12px] text-ink-soft">시술·장비·챗봇 텍스트</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand/40"
        >
          <p className="text-sm font-bold">방문 통계</p>
          <p className="mt-1 text-[12px] text-ink-soft">일·주·월 방문 · 유입 경로</p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand/40"
        >
          <p className="text-sm font-bold">사이트 설정</p>
          <p className="mt-1 text-[12px] text-ink-soft">전화·카카오·네이버·진료시간</p>
        </Link>
        <Link
          href="/admin/events"
          className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand/40"
        >
          <p className="text-sm font-bold">이벤트</p>
          <p className="mt-1 text-[12px] text-ink-soft">홈·이벤트 페이지에 표시</p>
        </Link>
        <Link
          href="/admin/manual"
          className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand/40"
        >
          <p className="text-sm font-bold">챗봇 매뉴얼</p>
          <p className="mt-1 text-[12px] text-ink-soft">
            {manualLiveCount}/{manualCount} 활성
          </p>
        </Link>
      </section>
    </>
  );
}
