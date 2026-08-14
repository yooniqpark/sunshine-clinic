"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { POPUP_EVENTS, type PopupEvent, type PopupTheme } from "@/lib/event-popup";
import { hideAllToday, isHiddenToday } from "@/lib/popup-prefs";
import type { CampaignCategory } from "@/lib/campaign-events";

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
        <nav aria-label="이벤트 전환" className="flex items-end pl-4 lg:hidden">
          {POPUP_EVENTS.map((e, i) => {
            const on = i === eventIdx;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => selectEvent(i)}
                aria-current={on ? "true" : undefined}
                className={`relative rounded-t-[10px] px-[15px] pb-[7px] text-[8.5px] font-bold tracking-[0.16em] transition-all ${
                  on ? "pt-4 shadow-[-3px_-2px_8px_rgba(20,14,8,0.28)]" : "pt-2"
                }`}
                style={{
                  background: e.theme.tab,
                  color: e.theme.tabText,
                  // 뒤 탭이 앞 탭에 물리도록 겹치고, 선택된 탭만 위로 올린다
                  marginLeft: i === 0 ? 0 : -11,
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
                className="group mx-auto flex items-center gap-2.5 rounded-full border px-6 py-2.5 text-[12.5px] font-semibold tracking-[0.06em] transition"
                style={{ borderColor: t.accent, color: t.ink }}
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
                onClick={dismiss}
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
              <p className="mt-1 text-[10.5px] lg:text-xs" style={{ color: t.meta }}>
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
                onClick={dismiss}
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
      <div className="flex items-start justify-between gap-3">
        <p
          className="min-w-0 pt-1 text-[9.5px] font-bold tracking-[0.26em] lg:text-[11px]"
          style={{ color: t.accent }}
        >
          {ev.eyebrow}
        </p>
        <span
          className="shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold lg:px-4 lg:py-2 lg:text-[11px]"
          style={{ background: t.pill, color: t.pillText }}
        >
          {ev.pillLabel}
        </span>
      </div>
      <h2
        className="mt-1.5 font-serif text-[19px] leading-tight lg:mt-2 lg:text-[32px]"
        style={{ color: t.ink }}
      >
        {ev.title}
      </h2>
      <div
        className="mt-2 flex items-center justify-between text-[9px] font-semibold tracking-[0.14em] lg:mt-2.5 lg:text-[10px]"
        style={{ color: t.meta }}
      >
        <span>{ev.period}</span>
        <span>{ev.vatNote}</span>
      </div>
    </header>
  );
}

function MatrixTable({ category, theme: t }: { category: CampaignCategory; theme: PopupTheme }) {
  const columns = category.columns ?? [];
  const template = `minmax(72px, 1.2fr) repeat(${columns.length}, minmax(0, 1fr))`;

  return (
    <div
      className="overflow-hidden rounded-xl border lg:rounded-2xl"
      style={{ background: t.tableBg, borderColor: t.tableLine }}
    >
      <div
        className="grid items-center gap-1.5 px-2.5 py-2 sm:gap-2 sm:px-4 lg:py-3"
        style={{ gridTemplateColumns: template, background: t.headBg }}
      >
        <span className="text-[9px] font-bold lg:text-[11px]" style={{ color: t.meta }}>
          구분
        </span>
        {columns.map((c) => (
          <span
            key={c}
            className="break-keep text-center text-[8px] font-bold leading-tight lg:text-[11px]"
            style={{ color: t.headText }}
          >
            {c}
          </span>
        ))}
      </div>
      {category.rows.map((row) => (
        <div
          key={row.name}
          className="grid items-center gap-1.5 border-t px-2.5 py-2.5 sm:gap-2 sm:px-4 lg:py-3"
          style={{ gridTemplateColumns: template, borderColor: t.tableLine }}
        >
          <span
            className="break-keep text-[10px] font-semibold leading-snug lg:text-[13px]"
            style={{ color: t.ink }}
          >
            {row.name}
          </span>
          {(row.prices ?? []).map((p, i) => (
            <span
              key={`${row.name}-${i}`}
              className="text-center text-[11px] font-bold tabular-nums lg:text-[13px]"
              style={{ color: t.price }}
            >
              <Won value={p} unitColor={t.unit} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function ListTable({ category, theme: t }: { category: CampaignCategory; theme: PopupTheme }) {
  return (
    <div
      className="overflow-hidden rounded-xl border px-4 lg:rounded-2xl"
      style={{ background: t.tableBg, borderColor: t.tableLine }}
    >
      {category.rows.map((row, i) => (
        <div
          key={row.name}
          className="flex items-center justify-between gap-4 py-3 lg:py-3.5"
          style={i > 0 ? { borderTop: `1px solid ${t.tableLine}` } : undefined}
        >
          <div className="min-w-0">
            <p className="text-[11.5px] font-semibold lg:text-[13px]" style={{ color: t.ink }}>
              {row.name}
            </p>
            {row.desc && (
              <p className="mt-0.5 text-[9px] leading-relaxed lg:text-[10px]" style={{ color: t.meta }}>
                {row.desc}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            {row.original && (
              <p className="text-[9px] line-through lg:text-[10px]" style={{ color: t.meta }}>
                {row.original}
              </p>
            )}
            <p
              className="text-[13px] font-bold tabular-nums lg:text-[15px]"
              style={{ color: t.price }}
            >
              <Won value={row.event ?? ""} unitColor={t.unit} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** "100만원" → 숫자는 강조, 만원 단위는 작게 */
function Won({ value, unitColor }: { value: string; unitColor: string }) {
  const m = value.match(/^([\d.]+)(.*)$/);
  if (!m) return <>{value}</>;
  return (
    <>
      {m[1]}
      <em className="ml-0.5 text-[0.72em] font-semibold not-italic" style={{ color: unitColor }}>
        {m[2]}
      </em>
    </>
  );
}
