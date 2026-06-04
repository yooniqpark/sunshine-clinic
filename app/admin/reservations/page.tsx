import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUSES = [
  { key: "ALL", label: "전체" },
  { key: "NEW", label: "신규" },
  { key: "CONTACTED", label: "연락함" },
  { key: "CONFIRMED", label: "확정" },
  { key: "COMPLETED", label: "완료" },
  { key: "CANCELED", label: "취소" },
];

const STATUS_BADGE: Record<string, string> = {
  NEW: "bg-brand text-white",
  CONTACTED: "bg-blush text-brand-dark",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-ink/10 text-ink-soft",
  CANCELED: "bg-red-50 text-red-600",
};

const LOCALE_LABEL: Record<string, string> = {
  ko: "🇰🇷 한국어",
  en: "🇺🇸 English",
  ja: "🇯🇵 日本語",
  zh: "🇨🇳 中文",
};

export default async function AdminReservationsList({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status && STATUSES.some((s) => s.key === sp.status) ? sp.status : "ALL";

  const reservations = await prisma.reservation.findMany({
    where: status === "ALL" ? {} : { status },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const counts = Object.fromEntries(
    (
      await prisma.reservation.groupBy({
        by: ["status"],
        _count: { _all: true },
      })
    ).map((r) => [r.status, r._count._all])
  );
  const totalNew = counts["NEW"] ?? 0;

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">RESERVATIONS</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">예약 신청</h1>
          <p className="mt-2 text-sm text-ink-soft">
            챗봇/웹폼으로 들어온 예약 요청을 응대합니다. 신규 {totalNew}건 대기.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream">
            리스트 뷰
          </span>
          <Link
            href="/admin/reservations/calendar"
            className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
          >
            캘린더 뷰
          </Link>
        </div>
      </header>

      <nav className="mt-6 flex flex-wrap gap-1.5">
        {STATUSES.map((s) => {
          const active = status === s.key;
          const count =
            s.key === "ALL"
              ? Object.values(counts).reduce((a, b) => a + b, 0)
              : counts[s.key] ?? 0;
          return (
            <Link
              key={s.key}
              href={`/admin/reservations${s.key === "ALL" ? "" : `?status=${s.key}`}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-ink text-cream"
                  : "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
              }`}
            >
              {s.label} <span className="opacity-70">({count})</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {reservations.length === 0 ? (
          <div className="grid place-items-center bg-white p-16 text-sm text-ink-soft">
            해당 상태의 예약이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-line/60 bg-white">
            {reservations.map((r) => (
              <li key={r.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start gap-3">
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      STATUS_BADGE[r.status] ?? "bg-ink/10 text-ink-soft"
                    }`}
                  >
                    {r.status}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {r.name}{" "}
                      <span className="ml-1 text-xs font-normal text-ink-soft">
                        / {r.contactType} · {r.contact}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {r.interest ? `${r.interest} · ` : ""}
                      {r.preferredAt
                        ? `희망 ${r.preferredAt.toLocaleString("ko-KR")}`
                        : "희망일 미지정"}
                      {" · "}
                      {LOCALE_LABEL[r.locale] ?? r.locale}
                    </p>
                    {r.message && (
                      <p className="mt-1 line-clamp-2 text-xs text-ink-soft/80">{r.message}</p>
                    )}
                    <p className="mt-1 text-[10px] text-ink-soft/70">
                      신청 {r.createdAt.toLocaleString("ko-KR")} · {r.source}
                    </p>
                  </div>
                  <Link
                    href={`/admin/reservations/${r.id}`}
                    className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
                  >
                    상세 →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
