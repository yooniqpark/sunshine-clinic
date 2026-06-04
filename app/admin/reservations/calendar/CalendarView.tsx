"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type CalendarReservation = {
  id: string;
  name: string;
  contact: string;
  contactType: string;
  preferredAt: string; // ISO
  interest: string | null;
  locale: string;
  status: string;
};

export type UndatedReservation = {
  id: string;
  name: string;
  contact: string;
  contactType: string;
  interest: string | null;
  locale: string;
  status: string;
  createdAt: string;
};

const STATUS_DOT: Record<string, string> = {
  NEW: "bg-brand",
  CONTACTED: "bg-blush",
  CONFIRMED: "bg-emerald-500",
  COMPLETED: "bg-ink/40",
  CANCELED: "bg-red-400",
};

const STATUS_BADGE: Record<string, string> = {
  NEW: "bg-brand text-white",
  CONTACTED: "bg-blush text-brand-dark",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-ink/10 text-ink-soft",
  CANCELED: "bg-red-50 text-red-600",
};

const LOCALE_FLAG: Record<string, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
  zh: "🇨🇳",
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function localDayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function CalendarView({
  year,
  month,
  reservations,
  undated,
}: {
  year: number;
  month: number;
  reservations: CalendarReservation[];
  undated: UndatedReservation[];
}) {
  // group by yyyy-mm-dd
  const byDay = useMemo(() => {
    const m: Record<string, CalendarReservation[]> = {};
    for (const r of reservations) {
      const key = localDayKey(r.preferredAt);
      (m[key] ??= []).push(r);
    }
    return m;
  }, [reservations]);

  // default selected day = today if same month, otherwise first day of month with reservations, else 1st
  const todayKey = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }, []);
  const defaultKey = useMemo(() => {
    const sameMonth = todayKey.startsWith(
      `${year}-${String(month).padStart(2, "0")}`
    );
    if (sameMonth) return todayKey;
    const firstWithRes = Object.keys(byDay).sort()[0];
    if (firstWithRes) return firstWithRes;
    return `${year}-${String(month).padStart(2, "0")}-01`;
  }, [byDay, year, month, todayKey]);
  const [selected, setSelected] = useState<string>(defaultKey);

  // build cells for the calendar grid
  const cells = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const leading = firstDay.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();
    const arr: Array<{ key: string; day: number } | null> = [];
    for (let i = 0; i < leading; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      arr.push({ key, day: d });
    }
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  const selectedList = (byDay[selected] ?? []).slice().sort((a, b) =>
    a.preferredAt.localeCompare(b.preferredAt)
  );

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* calendar grid */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="grid grid-cols-7 border-b border-line bg-sand/50">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={`px-2 py-2 text-center text-[11px] font-semibold ${
                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-ink-soft"
              }`}
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            if (!cell) {
              return (
                <div
                  key={`empty-${i}`}
                  className="min-h-[96px] border-b border-r border-line/40 bg-sand/30 last:border-r-0"
                />
              );
            }
            const items = byDay[cell.key] ?? [];
            const isToday = cell.key === todayKey;
            const isSelected = cell.key === selected;
            const dow = i % 7;
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelected(cell.key)}
                className={`group flex min-h-[96px] flex-col gap-1 border-b border-r border-line/40 p-2 text-left transition last:border-r-0 ${
                  isSelected
                    ? "bg-brand/10 ring-1 ring-brand/40"
                    : "bg-white hover:bg-sand/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${
                      isToday
                        ? "bg-ink text-cream"
                        : dow === 0
                          ? "text-red-500"
                          : dow === 6
                            ? "text-blue-500"
                            : "text-ink"
                    }`}
                  >
                    {cell.day}
                  </span>
                  {items.length > 0 && (
                    <span className="text-[10px] font-semibold text-ink-soft">
                      {items.length}건
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  {items.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-1 truncate text-[10px] text-ink-soft"
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[r.status] ?? "bg-ink/40"}`} />
                      <span className="shrink-0 font-mono">{formatTime(r.preferredAt)}</span>
                      <span className="truncate">{r.name}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <span className="text-[10px] text-ink-soft/70">+ {items.length - 3} 더보기</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* side panel: selected day + undated */}
      <aside className="space-y-4">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <header className="border-b border-line px-4 py-3">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-brand">SELECTED</p>
            <h3 className="mt-1 text-sm font-bold">
              {selected.replace(/-/g, ".")} · {selectedList.length}건
            </h3>
          </header>
          {selectedList.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-ink-soft">
              이 날짜의 예약이 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-line/60">
              {selectedList.map((r) => (
                <li key={r.id} className="px-4 py-3">
                  <Link
                    href={`/admin/reservations/${r.id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink">
                          <span className="font-mono text-ink-soft">{formatTime(r.preferredAt)}</span>{" "}
                          {r.name}{" "}
                          <span className="text-[10px] text-ink-soft">
                            {LOCALE_FLAG[r.locale] ?? r.locale}
                          </span>
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-ink-soft">
                          {r.contactType} · {r.contact}
                          {r.interest ? ` · ${r.interest}` : ""}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          STATUS_BADGE[r.status] ?? "bg-ink/10 text-ink-soft"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <header className="border-b border-line px-4 py-3">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-brand">UNDATED</p>
            <h3 className="mt-1 text-sm font-bold">희망일 미지정 · {undated.length}건</h3>
            <p className="mt-0.5 text-[10px] text-ink-soft">
              NEW / CONTACTED / CONFIRMED 만 표시.
            </p>
          </header>
          {undated.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-ink-soft">없음</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {undated.map((r) => (
                <li key={r.id} className="px-4 py-3">
                  <Link href={`/admin/reservations/${r.id}`} className="block">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink">
                          {r.name}{" "}
                          <span className="text-[10px] text-ink-soft">
                            {LOCALE_FLAG[r.locale] ?? r.locale}
                          </span>
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-ink-soft">
                          {r.contactType} · {r.contact}
                          {r.interest ? ` · ${r.interest}` : ""}
                        </p>
                        <p className="mt-0.5 text-[10px] text-ink-soft/70">
                          신청 {r.createdAt}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          STATUS_BADGE[r.status] ?? "bg-ink/10 text-ink-soft"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}
