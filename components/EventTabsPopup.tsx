"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { POPUP_EVENTS, type PopupEvent } from "@/lib/event-popup";
import { ListTable, MatrixTable } from "@/components/EventPriceTables";
import { hideAllToday, isHiddenToday } from "@/lib/popup-prefs";

const POPUP_ID = "sunshine-events-2026-v1";

/**
 * 이벤트 팝업 — 상단(모바일)·좌측(데스크톱) 탭으로 두 이벤트를 오가고,
 * 포스터에서 CTA를 누르면 가격표로 전환된다. 데스크톱은 포스터·가격표 좌우 분할.
 */
export function EventTabsPopup({ onClose }: { onClose?: () => void } = {}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [eventIdx, setEventIdx] = useState(0);
  const [showPrice, setShowPrice] = useState(false); // 모바일 전용
  const [catIdx, setCatIdx] = useState(0);

  const ev = POPUP_EVENTS[eventIdx];
  const t = ev.theme;
  const category = ev.categories[Math.min(catIdx, ev.categories.length - 1)];

  useEffect(() => {
    setMounted(true);
    const hidden = isHiddenToday(POPUP_ID);
    setOpen(!hidden);
    if (hidden) onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() {
    setOpen(false);
    onClose?.();
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted || !open) return null;

  // 뒤이어 뜰 안내 팝업까지 함께 숨긴다
  function closeToday() {
    hideAllToday();
    dismiss();
  }

  // 닫기 → 아직 못 본 이벤트가 있으면 그 이벤트를 먼저 보여준다
  function nextOrClose() {
    if (eventIdx < POPUP_EVENTS.length - 1) {
      selectEvent(eventIdx + 1);
      return;
    }
    dismiss();
  }

  function selectEvent(i: number) {
    setEventIdx(i);
    setCatIdx(0);
    setShowPrice(false);
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 px-7 py-3 sm:p-8">
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={dismiss}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div className="pointer-events-auto relative flex w-full max-w-[480px] flex-col sm:max-w-[520px] lg:h-[660px] lg:max-w-[1180px] lg:flex-row lg:overflow-hidden lg:rounded-[1.5rem] lg:shadow-2xl lg:shadow-black/40">
        {/* ── 데스크톱: 좌측 세로 탭 레일 ── */}
        <nav aria-label="이벤트 전환" className="hidden w-[42px] shrink-0 flex-col lg:flex">
          {POPUP_EVENTS.map((e, i) => {
            const on = i === eventIdx;
            return (
            <button
              key={e.id}
              type="button"
              onClick={() => selectEvent(i)}
              aria-current={on ? "true" : undefined}
              className={`relative flex flex-1 items-center justify-center rounded-l-[14px] text-[9px] font-bold tracking-[0.2em] transition-all ${
                on ? "shadow-[-3px_0_10px_rgba(20,14,8,0.3)]" : ""
              }`}
              style={{
                background: e.theme.tab,
                color: e.theme.tabText,
                // 아래 탭이 위 탭에 물리도록 겹치고, 선택된 탭만 앞으로 올린다
                marginTop: i === 0 ? 0 : -14,
                zIndex: on ? 2 : 1,
              }}
            >
              <span
                className="flex items-center gap-2.5 whitespace-nowrap"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                <span className="text-[7.5px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {e.tabLabel}
              </span>
            </button>
            );
          })}
        </nav>

        {/* ── 모바일: 지면 위로 솟은 매거진 인덱스 탭 (겹쳐 물리고 선택된 탭이 앞으로) ── */}
        <nav aria-label="이벤트 전환" className="flex items-end lg:hidden">
          {POPUP_EVENTS.map((e, i) => {
            const on = i === eventIdx;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => selectEvent(i)}
                aria-current={on ? "true" : undefined}
                className={`relative rounded-t-[10px] px-[22px] pb-[7px] text-[8.5px] font-bold tracking-[0.16em] transition-all ${
                  on ? "pt-4 shadow-[-3px_-2px_8px_rgba(20,14,8,0.28)]" : "pt-2"
                }`}
                style={{
                  background: e.theme.tab,
                  color: e.theme.tabText,
                  // 뒤 탭이 앞 탭에 물리도록 겹치고, 선택된 탭만 위로 올린다
                  marginLeft: i === 0 ? 0 : -20,
                  zIndex: on ? 2 : 1,
                }}
              >
                {String(i + 1).padStart(2, "0")} {e.tabLabel}
              </button>
            );
          })}
        </nav>

        {/* 모바일은 탭이 얹힌 지면처럼 위쪽 모서리를 직각으로 둔다 */}
        <div className="relative flex h-[70dvh] max-h-[590px] w-full flex-col overflow-hidden rounded-b-[1.5rem] shadow-2xl shadow-black/35 lg:h-auto lg:max-h-none lg:flex-1 lg:flex-row lg:rounded-none lg:shadow-none">
          {/* ── 포스터 (모바일: 가격표 보기 전 / 데스크톱: 항상) ── */}
          <div
            className={`relative min-h-0 flex-1 lg:w-[410px] lg:flex-none ${showPrice ? "hidden lg:block" : "block"}`}
            style={{ background: t.panel }}
          >
            <button
              type="button"
              onClick={() => setShowPrice(true)}
              aria-label={`${ev.tabLabel} 가격표 보기`}
              className="relative block h-full w-full overflow-hidden lg:h-[660px] lg:cursor-default"
            >
              <Image
                src={ev.poster}
                alt={ev.posterAlt}
                fill
                priority
                sizes="(min-width: 1024px) 410px, 100vw"
                className="object-cover object-center lg:object-top"
                draggable={false}
              />
            </button>

            {/* 포스터 위 볼록 유리 CTA — 모바일 전용.
                ctaTopPct가 있으면 포스터 구도(화살표 등)에 맞춰 그 위치에, 없으면 하단에 둔다. */}
            <div
              className={`absolute inset-x-4 lg:hidden ${ev.ctaTopPct == null ? "bottom-4" : ""}`}
              style={ev.ctaTopPct == null ? undefined : { top: `${ev.ctaTopPct}%` }}
            >
              <button
                type="button"
                onClick={() => setShowPrice(true)}
                className="group mx-auto flex items-center gap-2.5 rounded-full border px-6 py-2.5 text-[12.5px] font-semibold tracking-[0.06em] backdrop-blur-[2px] transition"
                style={{ borderColor: ev.ctaBorder ?? t.accent, color: t.ink, background: ev.ctaFill }}
              >
                <span>{ev.ctaLabel}</span>
                <span aria-hidden style={{ color: t.accent }}>
                  →
                </span>
              </button>
            </div>
          </div>

          {/* 모바일 포스터 화면 하단 바 */}
          {!showPrice && (
            <div
              className="flex shrink-0 items-center justify-between px-5 py-2.5 text-[11px] lg:hidden"
              style={{ background: t.footBg, color: t.footText }}
            >
              <button type="button" onClick={closeToday} className="transition hover:opacity-80">
                오늘 하루 보지 않기
              </button>
              <button
                type="button"
                onClick={nextOrClose}
                className="font-semibold transition hover:opacity-80"
                style={{ color: t.footStrong }}
              >
                닫기
              </button>
            </div>
          )}

          {/* ── 가격 패널 ── */}
          <div
            className={`flex min-h-0 min-w-0 flex-1 flex-col ${showPrice ? "flex" : "hidden lg:flex"}`}
            style={{ background: t.panel }}
          >
            <PriceHeader ev={ev} />

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-2 pt-3 sm:px-7 lg:px-9 lg:pt-5">
              <p
                className="text-[9px] font-bold tracking-[0.2em] lg:text-[10px]"
                style={{ color: t.accent }}
              >
                {category.kicker}
              </p>
              <h3 className="mt-1 text-lg font-extrabold lg:text-2xl" style={{ color: t.ink }}>
                {category.name}
              </h3>
              <p className="mt-1 break-keep text-[10.5px] lg:text-xs" style={{ color: t.meta }}>
                {category.copy}
              </p>

              <div className="mt-3 lg:mt-4">
                {category.columns ? (
                  <MatrixTable category={category} theme={t} />
                ) : (
                  <ListTable category={category} theme={t} />
                )}
              </div>

              <p
                className="mt-3 rounded-xl px-4 py-2.5 text-[10px] leading-relaxed lg:mt-4 lg:text-[11px]"
                style={{ background: t.noteBg, color: t.noteText }}
              >
                {ev.closingCopy}
              </p>
            </div>

            {/* 카테고리 탭 */}
            <div
              className="grid shrink-0 border-t"
              style={{
                gridTemplateColumns: `repeat(${ev.categories.length}, minmax(0,1fr))`,
                borderColor: t.line,
              }}
            >
              {ev.categories.map((c, i) => {
                const on = i === catIdx;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCatIdx(i)}
                    aria-current={on ? "true" : undefined}
                    className="px-1 pb-[7px] pt-2 text-center transition lg:px-1.5 lg:pb-[9px] lg:pt-2.5"
                    style={{
                      background: on ? t.catOnBg : t.catBg,
                      color: on ? t.catOnText : t.catText,
                    }}
                  >
                    <span className="block text-[8px] font-bold tracking-[0.14em] lg:text-[9px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-0.5 block break-keep text-[10px] font-bold leading-tight lg:text-xs">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 하단 바 */}
            <div
              className="flex shrink-0 items-center justify-between px-5 py-2.5 text-[11px] lg:px-9"
              style={{ background: t.footBg, color: t.footText }}
            >
              <button type="button" onClick={closeToday} className="transition hover:opacity-80">
                오늘 하루 보지 않기
              </button>
              <button
                type="button"
                onClick={nextOrClose}
                className="font-semibold transition hover:opacity-80"
                style={{ color: t.footStrong }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceHeader({ ev }: { ev: PopupEvent }) {
  const t = ev.theme;
  return (
    <header
      className="relative shrink-0 border-b px-5 pb-3 pt-4 sm:px-7 lg:px-9 lg:pb-4 lg:pt-6"
      style={{ borderColor: t.line }}
    >
      <div
        className="flex items-center justify-between text-[9px] font-semibold tracking-[0.14em] lg:text-[10px]"
        style={{ color: t.meta }}
      >
        <span>{ev.period}</span>
        <span>{ev.vatNote}</span>
      </div>
    </header>
  );
}
