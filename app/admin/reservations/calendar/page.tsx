import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CalendarView, type CalendarReservation } from "./CalendarView";

export const dynamic = "force-dynamic";

const ACTIVE_STATUSES = ["NEW", "CONTACTED", "CONFIRMED"] as const;

function parseMonth(input: string | undefined): { year: number; month: number } {
  if (input) {
    const m = /^(\d{4})-(\d{1,2})$/.exec(input);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]);
      if (mo >= 1 && mo <= 12) return { year: y, month: mo };
    }
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function fmtMonthParam(y: number, m: number) {
  return `${y}-${String(m).padStart(2, "0")}`;
}

export default async function ReservationsCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonth(sp.month);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const [scheduled, undated, totalNew] = await Promise.all([
    prisma.reservation.findMany({
      where: { preferredAt: { gte: start, lt: end } },
      orderBy: { preferredAt: "asc" },
    }),
    prisma.reservation.findMany({
      where: { preferredAt: null, status: { in: [...ACTIVE_STATUSES] } },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.reservation.count({ where: { status: "NEW" } }),
  ]);

  const reservations: CalendarReservation[] = scheduled.map((r) => ({
    id: r.id,
    name: r.name,
    contact: r.contact,
    contactType: r.contactType,
    preferredAt: r.preferredAt!.toISOString(),
    interest: r.interest,
    locale: r.locale,
    status: r.status,
  }));

  const undatedView = undated.map((r) => ({
    id: r.id,
    name: r.name,
    contact: r.contact,
    contactType: r.contactType,
    interest: r.interest,
    locale: r.locale,
    status: r.status,
    createdAt: r.createdAt.toLocaleString("ko-KR"),
  }));

  const prev = new Date(year, month - 2, 1);
  const next = new Date(year, month, 1);
  const prevHref = `/admin/reservations/calendar?month=${fmtMonthParam(prev.getFullYear(), prev.getMonth() + 1)}`;
  const nextHref = `/admin/reservations/calendar?month=${fmtMonthParam(next.getFullYear(), next.getMonth() + 1)}`;
  const todayHref = `/admin/reservations/calendar`;

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">RESERVATIONS</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">예약 캘린더</h1>
          <p className="mt-2 text-sm text-ink-soft">
            희망 일자 기준으로 한 달치 예약을 보여줍니다. 신규 {totalNew}건 대기.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/reservations"
            className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
          >
            리스트 뷰
          </Link>
          <span className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream">
            캘린더 뷰
          </span>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={prevHref}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-brand hover:text-brand-dark"
            aria-label="이전 달"
          >
            ‹
          </Link>
          <h2 className="px-2 text-xl font-bold tracking-tight">
            {year}년 {month}월
          </h2>
          <Link
            href={nextHref}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-brand hover:text-brand-dark"
            aria-label="다음 달"
          >
            ›
          </Link>
          <Link
            href={todayHref}
            className="ml-2 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-brand hover:text-brand-dark"
          >
            오늘로
          </Link>
        </div>
        <p className="text-xs text-ink-soft">
          한 달 예약 {reservations.length}건 · 희망일 미지정 {undatedView.length}건
        </p>
      </div>

      <CalendarView
        year={year}
        month={month}
        reservations={reservations}
        undated={undatedView}
      />
    </>
  );
}
