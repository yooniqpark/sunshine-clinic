"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GRAND_OPEN_CATEGORIES } from "@/lib/grand-open";
import { GrandOpenCard } from "@/components/GrandOpenCard";

type Popup = {
  id: string;
  variant: "event" | "holiday";
};

const POPUPS: Popup[] = [
  { id: "grand-open-2026-07-v3", variant: "event" },
  { id: "aug-2026-holiday", variant: "holiday" },
];

const KEY_PREFIX = "sunshine-popup:";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function AnnouncementPopups() {
  const [mounted, setMounted] = useState(false);
  const [queue, setQueue] = useState<Popup[]>([]);
  const [desktopDetail, setDesktopDetail] = useState(false);
  const t = useTranslations("v2.popups");

  useEffect(() => {
    setMounted(true);
    const today = todayStr();
    const remaining = POPUPS.filter((p) => {
      try {
        return localStorage.getItem(KEY_PREFIX + p.id) !== today;
      } catch {
        return true;
      }
    });
    setQueue(remaining);
  }, []);

  const close = useCallback(() => {
    setQueue((q) => q.slice(1));
    setDesktopDetail(false);
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [queue.length, close]);

  if (!mounted || queue.length === 0) return null;
  const current = queue[0];

  function closeToday() {
    try {
      localStorage.setItem(KEY_PREFIX + current.id, todayStr());
    } catch {}
    close();
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-3 pb-28 pt-4 sm:p-8">
      {/* backdrop click closes */}
      <button
        type="button"
        aria-label={t("close")}
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />
      <div
        className={`pointer-events-auto relative flex h-[78vh] max-h-[600px] w-full max-w-md flex-col overflow-hidden rounded-[2rem] bg-ink/45 shadow-2xl shadow-ink/40 backdrop-blur-md transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[820px] sm:max-h-[88vh] sm:max-w-xl ${
          desktopDetail ? "lg:max-w-5xl" : "lg:max-w-md"
        }`}
      >
        {current.variant === "event" ? (
          <EventPopup
            desktopDetail={desktopDetail}
            onToggleDetail={() => setDesktopDetail((v) => !v)}
          />
        ) : (
          <HolidayCard />
        )}

        <div className="flex shrink-0 items-center justify-between border-t border-white/15 bg-ink/40 px-5 py-3 text-xs text-cream backdrop-blur">
          <label className="flex cursor-pointer items-center gap-2 text-cream/80">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.currentTarget.checked) closeToday();
              }}
              className="h-3.5 w-3.5 rounded border-white/30 accent-cream"
            />
            {t("dontShowToday")}
          </label>
          <button
            type="button"
            onClick={close}
            className="font-semibold text-cream hover:text-brand-soft"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventPopup({
  desktopDetail,
  onToggleDetail,
}: {
  desktopDetail: boolean;
  onToggleDetail: () => void;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Mobile: 기존 캐러셀 그대로 */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        <EventCarousel />
      </div>

      {/* Desktop: 에디토리얼 GRAND OPEN 티저 (왼쪽) */}
      <div className="relative hidden min-h-0 flex-col justify-between px-10 py-14 text-cream lg:flex lg:w-[440px] lg:shrink-0">
        {/* 앰비언트 웜톤 그로우 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 20%, rgba(232,205,175,0.22) 0%, transparent 55%), radial-gradient(ellipse at 75% 85%, rgba(154,110,84,0.22) 0%, transparent 55%)",
          }}
        />
        {/* 코너 브라켓 오너먼트 */}
        <span aria-hidden className="pointer-events-none absolute left-6 top-6 h-6 w-6 border-l border-t border-cream/30" />
        <span aria-hidden className="pointer-events-none absolute right-6 top-6 h-6 w-6 border-r border-t border-cream/30" />
        <span aria-hidden className="pointer-events-none absolute bottom-6 left-6 h-6 w-6 border-b border-l border-cream/30" />
        <span aria-hidden className="pointer-events-none absolute bottom-6 right-6 h-6 w-6 border-b border-r border-cream/30" />

        <div className="relative">
          {/* 상단 세리얼 인디케이터 */}
          <div className="flex items-baseline gap-3 text-[10px] font-medium tracking-[0.32em] text-cream/55">
            <span className="font-serif text-cream/80">N°01</span>
            <span aria-hidden className="h-px flex-1 bg-cream/25" />
            <span>SS 2026</span>
          </div>

          {/* 타이틀 */}
          <div className="mt-10">
            <p className="text-[10px] font-medium tracking-[0.4em] text-brand-soft">
              INVITATION
            </p>
            <h2 className="mt-5 whitespace-nowrap font-serif text-[3.25rem] leading-[1] tracking-tight text-cream">
              Grand Open
            </h2>
            <p
              className="mt-2 leading-none tracking-tight text-brand-soft"
              style={{ fontSize: "3rem", fontFamily: '"Allura", cursive' }}
            >
              Event
            </p>
          </div>

          {/* 골드 룰 + 날짜 */}
          <div className="mt-10 flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-brand-soft" />
            <p className="text-[11px] font-medium tracking-[0.24em] text-cream/80 tabular-nums">
              07.13 <span className="text-cream/45">—</span> 08.30
            </p>
          </div>

          {/* 오픈 메시지 */}
          <p className="mt-8 max-w-[300px] text-[13px] leading-[1.85] text-cream/75">
            <span className="text-cream">오랜 준비 끝에</span>,
            <br />
            선샤인 스킨 클리닉이 문을 엽니다.
            <br />
            <br />
            첫 여름을 시작하는 자리에 <br />
            여러분을 정중히 초대합니다.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleDetail}
            className="group inline-flex w-full items-center justify-between gap-3 rounded-full border border-cream/40 bg-transparent px-6 py-3.5 text-xs font-semibold tracking-[0.2em] text-cream transition hover:border-cream hover:bg-cream/10"
          >
            <span>{desktopDetail ? "PROMOTION DETAIL — 닫기" : "PROMOTION DETAIL"}</span>
            <span
              aria-hidden
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-cream/40 text-sm transition-transform duration-500 ${
                desktopDetail ? "rotate-45" : "group-hover:translate-x-0.5"
              }`}
            >
              {desktopDetail ? "+" : "→"}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop: 확장되는 상세 패널 (오른쪽) */}
      <div
        className={`hidden overflow-hidden transition-[max-width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex lg:h-full ${
          desktopDetail
            ? "lg:max-w-[560px] lg:opacity-100"
            : "lg:max-w-0 lg:opacity-0"
        }`}
      >
        <div className="flex h-full w-[560px] flex-col border-l border-white/15">
          <EventCarousel />
        </div>
      </div>
    </div>
  );
}

function EventCarousel() {
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("v2.popups.event");
  const total = GRAND_OPEN_CATEGORIES.length;

  const go = useCallback(
    (dir: 1 | -1) => setIdx((i) => (i + dir + total) % total),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // 카테고리 바뀌면 스크롤 최상단으로 리셋 → 하단 dots/CTA는 항상 화면 바닥에 고정된 것처럼 보임
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [idx]);

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    startX.current = null;
  }

  const current = GRAND_OPEN_CATEGORIES[idx];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Slide viewport — 카테고리 콘텐츠는 스크롤, 하단 dots/CTA는 flex 바깥 고정 */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <GrandOpenCard category={current} variant="compact" />
        </div>

        {/* Prev / Next arrows — top of viewport, translucent white */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute left-3 top-16 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-transparent text-cream transition hover:border-white hover:bg-white/10 sm:left-4 sm:top-20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-3 top-16 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-transparent text-cream transition hover:border-white hover:bg-white/10 sm:right-4 sm:top-20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>

      {/* Dots + CTA */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/15 bg-ink/40 px-5 py-3 text-cream backdrop-blur">
        <div className="flex items-center gap-1.5">
          {GRAND_OPEN_CATEGORIES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === idx}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-cream" : "w-1.5 bg-cream/40"
              }`}
            />
          ))}
        </div>
        <Link
          href="/community/events#grand-open-2026-07"
          className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-brand-soft hover:text-cream"
        >
          {t("ctaSeeMore")}
          <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}

function HolidayCard() {
  const t = useTranslations("v2.popups.holiday");
  const days = t.raw("days") as {
    date: string;
    weekday: string;
    label: string;
    status: "open" | "closed";
    hours?: string;
  }[];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 pt-12 pb-10 text-center text-cream sm:px-12 sm:pt-16 sm:pb-12">
      <p className="text-[10px] font-medium tracking-[0.3em] text-cream/70 drop-shadow">
        {t("brand")}
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-cream drop-shadow-md sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-cream/80 drop-shadow">
        {t("body1")}
        <br />
        {t("body2")}
      </p>

      <div className="my-auto grid grid-cols-2 gap-3 py-6">
        {days.map((d) => (
          <div
            key={d.date}
            className={`rounded-2xl px-4 py-5 text-center backdrop-blur ${
              d.status === "closed"
                ? "bg-ink/70 text-cream ring-1 ring-white/10"
                : "bg-white/15 text-cream ring-1 ring-white/25"
            }`}
          >
            <p className="text-[10px] font-medium text-cream/70">
              {d.date} ({d.weekday})
            </p>
            <p
              className={`mt-1 text-[10px] font-medium tracking-[0.1em] ${
                d.status === "closed" ? "text-brand-soft" : "text-brand-soft"
              }`}
            >
              {d.label}
            </p>
            <p className="mt-3 font-serif text-2xl text-cream drop-shadow">
              {d.status === "closed" ? t("closedLabel") : t("openLabel")}
            </p>
            {d.hours && (
              <p className="mt-2 text-[10px] text-cream/70">{d.hours}</p>
            )}
          </div>
        ))}
      </div>

      <p className="pt-2 text-[11px] leading-relaxed text-cream/70">
        {t("footer")}
      </p>
    </div>
  );
}
