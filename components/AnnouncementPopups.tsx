"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getGrandOpenCategories } from "@/lib/grand-open";
import { useLocale } from "next-intl";

// 오픈 이벤트 팝업 인트로 카피 — ko 외 로케일은 영문
function eventCopy(locale: string) {
  return locale === "ko"
    ? {
        lead1: "오랜 준비 끝에",
        lead2: "선샤인의원이 문을 열었습니다.",
        cats: ["리프팅", "화이트닝 & 여드름", "스킨부스터", "보톡스"],
        catsTail: "4개 카테고리에서 오픈 특별가를 진행 중입니다.",
        cta: "SUNSHINE GRAND OPEN",
        openTable: "가격표 · 카테고리별 자세히 보기",
        closeTable: "가격표 닫기",
      }
    : {
        lead1: "After long preparation",
        lead2: "Sunshine Clinic is now open.",
        cats: ["Lifting", "Whitening & Acne", "Skin Booster", "Botox"],
        catsTail: "Opening specials are running in all four categories.",
        cta: "See opening specials →",
        openTable: "Price list · view by category",
        closeTable: "Close price list",
      };
}
import { GrandOpenCard } from "@/components/GrandOpenCard";
import { EventPresetRail, EventPresetTabs } from "@/components/EventPresetRail";
import type { EventPresetId } from "@/lib/event-presets";

type Popup = {
  id: string;
  variant: "event" | "holiday" | "sedation";
};

const POPUPS: Popup[] = [
  { id: "grand-open-2026-07-v3", variant: "event" },
  { id: "aug-2026-holiday", variant: "holiday" },
  { id: "sedation-2026-07", variant: "sedation" },
];

const KEY_PREFIX = "sunshine-popup:";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function AnnouncementPopups({
  onSelectPreset,
}: {
  onSelectPreset: (preset: EventPresetId) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [queue, setQueue] = useState<Popup[]>([]);
  // 데스크톱은 처음부터 가격표 펼침 (모바일은 그대로 티저)
  const [desktopDetail, setDesktopDetail] = useState(false);
  const [desktopDetailSeen, setDesktopDetailSeen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    if (mq.matches) {
      setDesktopDetail(true);
      setDesktopDetailSeen(true);
    }
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setDesktopDetail(true);
        setDesktopDetailSeen(true);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const [pricingFallback, setPricingFallback] = useState(false);
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
    setDesktopDetailSeen(false);
    setPricingFallback(false);
  }, []);

  // 티저를 닫을 때: 데스크탑에서 아직 가격표(디테일)를 열어보지 않았고
  // 현재 event 팝업이면 → 팝업을 완전히 닫지 말고 가격표 팝업으로 전환
  const requestClose = useCallback(() => {
    const cur = queue[0];
    // event 팝업이고 아직 가격표를 보지 않았다면 → 가격표 fallback 뷰로 전환
    if (
      cur?.variant === "event" &&
      !desktopDetailSeen &&
      !pricingFallback
    ) {
      setPricingFallback(true);
      return;
    }
    close();
  }, [queue, desktopDetailSeen, pricingFallback, close]);

  useEffect(() => {
    if (queue.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [queue.length, requestClose]);

  if (!mounted || queue.length === 0) return null;
  const current = queue[0];

  function closeToday() {
    try {
      localStorage.setItem(KEY_PREFIX + current.id, todayStr());
    } catch {}
    close();
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-3 py-4 sm:p-8">
      {/* backdrop click closes */}
      <button
        type="button"
        aria-label={t("close")}
        onClick={requestClose}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />
      <div
        className={`pointer-events-auto relative flex h-[92dvh] max-h-[900px] w-full max-w-[500px] flex-col transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[820px] sm:max-h-[88vh] sm:max-w-[632px] lg:flex-row ${
          desktopDetail
            ? "lg:max-w-[1192px]"
            : pricingFallback
              ? "lg:max-w-[648px]"
              : "lg:max-w-[520px]"
        }`}
      >
        {current.variant === "event" && (
          <>
            <EventPresetTabs activePreset="grand-open-2026" onSelect={onSelectPreset} />
            <EventPresetRail activePreset="grand-open-2026" onSelect={onSelectPreset} />
          </>
        )}
        <div className={`relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-ink/45 shadow-2xl shadow-ink/40 backdrop-blur-md ${current.variant === "event" ? "rounded-b-[2rem] rounded-t-none lg:rounded-l-none lg:rounded-r-[2rem]" : "rounded-[2rem]"}`}>
        {current.variant === "event" ? (
          pricingFallback ? (
            <EventCarousel />
          ) : (
            <EventPopup
              desktopDetail={desktopDetail}
              onToggleDetail={() => {
                setDesktopDetail((v) => !v);
                setDesktopDetailSeen(true);
              }}
            />
          )
        ) : current.variant === "sedation" ? (
          <SedationCard />
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
            onClick={requestClose}
            className="font-semibold text-cream hover:text-brand-soft"
          >
            {t("close")}
          </button>
        </div>
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
  const copy = eventCopy(useLocale());
  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Mobile: 티저 ↔ 가격표 스왑 (데스크탑과 같은 desktopDetail 상태 재사용, 폭 확장 없음) */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        {desktopDetail ? (
          <EventCarousel />
        ) : (
          <MobileTeaser onOpen={onToggleDetail} />
        )}
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

          {/* 타이틀 — 중앙 정렬 */}
          <div className="mt-10 text-center">
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

          {/* 골드 룰 + 날짜 (오른쪽 정렬) */}
          <div className="mt-10 flex items-center justify-end gap-3">
            <p className="text-[11px] font-medium tracking-[0.24em] text-cream/80 tabular-nums">
              07.13 <span className="text-cream/45">—</span> 08.30
            </p>
            <span aria-hidden className="h-px w-10 bg-brand-soft" />
          </div>

          {/* 오픈 안내 + 카테고리 가이드 */}
          <div className="mt-8 space-y-5 text-[13px] leading-[1.85] text-cream/75">
            <p>
              <span className="text-cream">{copy.lead1}</span>,
              <br />
              {copy.lead2}
            </p>
            <p>
              <span className="text-cream">{copy.cats[0]}</span> ·{" "}
              <span className="text-cream">{copy.cats[1]}</span> ·{" "}
              <span className="text-cream">{copy.cats[2]}</span> ·{" "}
              <span className="text-cream">{copy.cats[3]}</span>
              <br />{copy.catsTail}
            </p>
          </div>

          {/* 카테고리 뱃지 4개 */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {copy.cats.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-cream/25 bg-cream/5 px-3 py-1.5 text-[10px] font-medium tracking-[0.14em] text-cream/85"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          {!desktopDetail && (
            <p className="mb-3 text-center text-[10px] font-medium tracking-[0.28em] text-cream/55">
              {copy.cta}
            </p>
          )}
          <button
            type="button"
            onClick={onToggleDetail}
            className="group inline-flex w-full items-center justify-between gap-3 rounded-full border border-brand-soft/60 bg-brand-soft/10 px-6 py-3.5 text-xs font-semibold tracking-[0.2em] text-cream transition hover:border-brand-soft hover:bg-brand-soft/20"
          >
            <span>
              {desktopDetail ? copy.closeTable : copy.openTable}
            </span>
            <span
              aria-hidden
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-brand-soft/60 text-sm transition-transform duration-500 ${
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
            ? "lg:max-w-[680px] lg:opacity-100"
            : "lg:max-w-0 lg:opacity-0"
        }`}
      >
        <div className="flex h-full w-[680px] flex-col border-l border-white/15">
          <EventCarousel />
        </div>
      </div>
    </div>
  );
}

function MobileTeaser({ onOpen }: { onOpen: () => void }) {
  const copy = eventCopy(useLocale());
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#2b160e] text-cream">
      <Image
        src="/events/grand-open-mobile-2026.svg"
        alt="선샤인의원 그랜드 오픈 이벤트"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        draggable={false}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,246,226,0.06) 0%, rgba(40,20,13,0.02) 42%, rgba(30,14,9,0.38) 68%, rgba(25,12,8,0.9) 100%)",
        }}
      />
      <span aria-hidden className="pointer-events-none absolute left-4 top-4 h-5 w-5 border-l border-t border-[#3d251b]/35" />
      <span aria-hidden className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r border-t border-[#3d251b]/35" />

      <div className="relative flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5">
        <div className="flex items-baseline gap-3 text-[8px] font-semibold tracking-[0.28em] text-[#4b2e22]/70">
          <span className="font-serif">N°01</span>
          <span aria-hidden className="h-px flex-1 bg-[#4b2e22]/25" />
          <span>SS 2026</span>
        </div>

        <div className="mt-7 text-center text-[#2f1b14]">
          <p className="text-[8px] font-bold tracking-[0.42em] text-[#70442f]">INVITATION</p>
          <h2 className="mt-3 whitespace-nowrap font-serif text-[2.55rem] font-normal leading-none tracking-tight">
            Grand Open
          </h2>
          <p className="mt-2 text-[1.35rem] font-light tracking-[0.18em] text-[#6b402d]">EVENT</p>
          <div className="mt-4 inline-flex items-center gap-3 border-y border-[#5f3828]/30 px-4 py-2 text-[9px] font-semibold tracking-[0.24em] tabular-nums">
            <span>07.13</span><span className="opacity-45">—</span><span>08.30</span>
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-white/15 bg-[#24120c]/72 p-4 shadow-lg backdrop-blur-md">
          <p className="text-[8px] font-bold tracking-[0.3em] text-[#e5b988]">{copy.cta}</p>
          <p className="mt-2 text-[14px] font-semibold leading-relaxed text-[#fff8ed]">
            {copy.lead1},<br />{copy.lead2}
          </p>
          <p className="mt-2 text-[9px] leading-relaxed text-[#f0ddca]/70">
            {copy.cats.join(" · ")}<br />{copy.catsTail}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="group mt-3 inline-flex w-full items-center justify-between gap-3 rounded-full border border-[#edc69e]/55 bg-[#2b170f]/88 px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-[#fff5e8] transition hover:bg-[#3a2015]"
        >
          <span>{copy.openTable}</span>
          <span
            aria-hidden
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#edc69e]/55 text-sm transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </button>
      </div>
    </div>
  );
}

function EventCarousel() {
  const CATS = getGrandOpenCategories(useLocale());
  const [idx, setIdx] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("v2.popups.event");
  const total = CATS.length;

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
    start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (start.current == null) return;
    const dx = e.changedTouches[0].clientX - start.current.x;
    const dy = e.changedTouches[0].clientY - start.current.y;
    // 세로 스크롤 중 손가락이 비스듬히 움직여도 탭이 넘어가지 않도록
    // 가로 이동이 세로 이동보다 확실히 클 때만 스와이프로 판정
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    start.current = null;
  }

  const current = CATS[idx];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Slide viewport — 카테고리 콘텐츠는 스크롤, 하단 dots/CTA는 flex 바깥 고정 */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="popup-scroll h-full overflow-y-auto"
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

      {/* 4개 카테고리 탭 — 하단 전체 폭 채움 · 카테고리별 컬러 강조 */}
      <div className="grid shrink-0 grid-cols-4 border-t border-white/15 bg-ink/40 text-cream backdrop-blur">
        {CATS.map((cat, i) => {
          const isActive = i === idx;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setIdx(i)}
              aria-current={isActive}
              className={`relative flex items-center justify-center gap-2 border-r border-white/10 px-2 py-2.5 text-center transition-colors last:border-r-0 ${
                isActive
                  ? "bg-white/8 text-brand-soft"
                  : "text-cream/55 hover:bg-white/5 hover:text-cream/85"
              }`}
            >
              <span className={`text-[11px] font-medium tracking-[0.18em] tabular-nums ${isActive ? "text-brand-soft/80" : "text-cream/60"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] font-semibold tracking-tight lg:text-[14px]">
                {cat.name}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-brand-soft"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Hidden legacy CTA — 사용 안 함 */}
      <span className="hidden">{t("ctaSeeMore")}</span>
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

function SedationCard() {
  const t = useTranslations("v2.popups.sedation");
  const points = t.raw("points") as string[];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 pt-12 pb-10 text-cream sm:px-12 sm:pt-16 sm:pb-12">
      <p className="text-center text-[10px] font-medium tracking-[0.3em] text-cream/70 drop-shadow">
        {t("brand")} · {t("kicker")}
      </p>
      <h2 className="mt-5 text-center font-serif text-3xl leading-tight tracking-tight text-cream drop-shadow-md sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-3 text-center font-serif text-sm italic tracking-wide text-brand-soft drop-shadow sm:text-base">
        {t("subtitle")}
      </p>

      <div className="my-auto py-6">
        <p className="text-center text-[13px] leading-relaxed text-cream/85 drop-shadow sm:text-sm">
          {t("lead")}
        </p>

        <ul className="mt-6 space-y-3">
          {points.map((p, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 text-[12px] leading-relaxed text-cream/90 ring-1 ring-white/15 backdrop-blur sm:text-[13px]"
            >
              <span
                aria-hidden
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft/25 font-serif text-[11px] text-brand-soft"
              >
                {i + 1}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 rounded-xl border border-white/15 bg-ink/40 px-4 py-3 text-center text-[11px] leading-relaxed text-cream/75 backdrop-blur">
          {t("note")}
        </p>
      </div>

      <p className="pt-2 text-center text-[11px] leading-relaxed text-cream/70">
        {t("footer")}
      </p>
    </div>
  );
}
