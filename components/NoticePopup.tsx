"use client";

import { useEffect, useState } from "react";

// Bump this whenever the notice content changes so returning visitors see it.
const NOTICE_ID = "notice-2026-08-15";

type NoticeItem = {
  month: string;
  day: string;
  weekday: string;
  status: "open" | "closed";
  label: string;
};

const ITEMS: NoticeItem[] = [
  { month: "2026년 8월", day: "15", weekday: "토", status: "open", label: "정상 진료" },
  { month: "2026년 8월", day: "17", weekday: "월", status: "closed", label: "휴진" },
];

export function NoticePopup() {
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false); // for slide-in animation
  const [hideToday, setHideToday] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTICE_ID);
      if (raw) {
        const dismissedAt = new Date(raw);
        const now = new Date();
        if (dismissedAt.toDateString() === now.toDateString()) return; // still same day
      }
    } catch {
      /* localStorage unavailable — just show */
    }
    const t1 = window.setTimeout(() => setOpen(true), 500);
    // trigger slide-in one tick after mount
    const t2 = window.setTimeout(() => setEntered(true), 550);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  function close() {
    setEntered(false);
    // let slide-out animation play, then remove
    window.setTimeout(() => setOpen(false), 250);
    if (hideToday) {
      try {
        localStorage.setItem(NOTICE_ID, new Date().toISOString());
      } catch {
        /* ignore */
      }
    }
  }

  if (!open) return null;

  return (
    <>
      {/* ═══════════ Mobile: bottom-anchored toast above the chat bar ═══════════ */}
      <div
        className={`pointer-events-none fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+7.5rem)] z-[90] transition-all duration-300 ease-out lg:hidden ${
          entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-auto overflow-hidden rounded-2xl border border-line bg-cream/95 shadow-xl shadow-ink/20 backdrop-blur-lg">
          <div className="flex items-start gap-3 px-4 pt-3.5">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
                  NOTICE
                </span>
                <span className="text-[11px] font-medium text-ink-soft">8월 진료 안내</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {ITEMS.map((it) => (
                  <div key={it.day} className="flex items-center gap-2 text-sm text-ink">
                    <span
                      className={
                        it.status === "closed"
                          ? "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-lg font-bold text-cream"
                          : "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-lg font-bold text-brand-dark"
                      }
                    >
                      {it.day}
                    </span>
                    <span>
                      <span className="font-semibold">{it.day}일 ({it.weekday})</span>
                      <span
                        className={
                          it.status === "closed"
                            ? "ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600"
                            : "ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-brand-dark"
                        }
                      >
                        {it.label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line/70 bg-white/40 px-4 py-2">
            <label className="flex cursor-pointer select-none items-center gap-2 text-[11px] text-ink-soft">
              <input
                type="checkbox"
                checked={hideToday}
                onChange={(e) => setHideToday(e.target.checked)}
                className="h-3.5 w-3.5 accent-brand"
              />
              오늘 하루 보지 않기
            </label>
            <a
              href="tel:024217588"
              className="text-[11px] font-semibold text-brand hover:underline"
            >
              02-421-7588
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════ Desktop: centered modal popup ═══════════ */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-title"
        className={`fixed inset-0 z-[100] hidden items-center justify-center bg-ink/40 p-4 backdrop-blur-sm transition-opacity duration-200 lg:flex ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-md overflow-hidden rounded-3xl border border-line bg-cream shadow-2xl shadow-ink/25 transition-transform duration-300 ${
            entered ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          }`}
        >
          <div className="relative border-b border-line bg-gradient-to-br from-brand-soft/30 via-blush/40 to-sand px-6 py-5">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-brand">NOTICE</p>
            <h2 id="notice-title" className="mt-1 text-xl font-bold text-ink">
              진료 안내
            </h2>
            <p className="mt-1 text-xs text-ink-soft">8월 정기 안내 사항입니다.</p>
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-ink transition hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 px-6 py-6">
            {ITEMS.map((it) => (
              <div
                key={it.day}
                className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
              >
                <div
                  className={
                    it.status === "closed"
                      ? "grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-ink text-cream"
                      : "grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand/15 text-brand-dark"
                  }
                >
                  <span className="text-3xl font-bold leading-none">{it.day}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium tracking-wide text-ink-soft">
                    {it.month}
                  </p>
                  <p className="mt-1 text-base font-semibold text-ink">
                    {it.day}일 ({it.weekday}){" "}
                    <span
                      className={
                        it.status === "closed"
                          ? "ml-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600"
                          : "ml-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand-dark"
                      }
                    >
                      {it.label}
                    </span>
                  </p>
                </div>
              </div>
            ))}
            <p className="pt-2 text-center text-[11px] leading-relaxed text-ink-soft">
              문의는{" "}
              <a href="tel:024217588" className="font-semibold text-brand hover:underline">
                02-421-7588
              </a>{" "}
              또는 카카오톡 채널로 연락해 주세요.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line bg-white/60 px-6 py-4">
            <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-ink-soft">
              <input
                type="checkbox"
                checked={hideToday}
                onChange={(e) => setHideToday(e.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              오늘 하루 보지 않기
            </label>
            <button
              type="button"
              onClick={close}
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-brand-dark"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
