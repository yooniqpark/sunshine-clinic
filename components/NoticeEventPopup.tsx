"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const KEY_PREFIX = "sunshine-popup:";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * 안내형 팝업 (진료 안내 · 수면마취) — 배경이 비치는 유리(프로스티드) 셸에 안내 콘텐츠를 담는다.
 */
export function NoticeEventPopup({
  popupId,
  ariaLabel,
  variant,
  onClose,
}: {
  popupId: string;
  ariaLabel: string;
  variant: "holiday" | "sedation";
  onClose?: () => void;
}) {
  const KEY = KEY_PREFIX + popupId;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
    let hidden = false;
    try {
      hidden = localStorage.getItem(KEY) === todayStr();
    } catch {}
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted || !open) return null;

  function closeToday() {
    try {
      localStorage.setItem(KEY, todayStr());
    } catch {}
    dismiss();
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-1.5 py-3 backdrop-blur-[2px] sm:p-8">
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={dismiss}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <section
        aria-label={ariaLabel}
        className="pointer-events-auto relative flex h-auto max-h-[92dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-[1.5rem] border border-white/25 bg-white/12 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.45),0_24px_60px_rgba(20,12,4,0.5)] backdrop-blur-2xl sm:max-w-[480px]"
      >
        {variant === "holiday" ? <HolidayDetail /> : <SedationDetail />}

        <div className="flex shrink-0 items-center justify-between border-t border-white/20 bg-black/20 px-5 py-2.5 text-xs text-white/70">
          <button type="button" onClick={closeToday} className="transition hover:text-white">
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="font-semibold text-white/90 transition hover:text-white"
          >
            닫기
          </button>
        </div>
      </section>
    </div>
  );
}

function HolidayDetail() {
  const t = useTranslations("v2.popups.holiday");
  const days = t.raw("days") as {
    date: string;
    weekday: string;
    label: string;
    status: "open" | "closed";
    hours?: string;
  }[];

  const openDay = days.find((d) => d.status === "open");
  const closedDay = days.find((d) => d.status === "closed");

  return (
    <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-7 text-center [text-shadow:0_1px_6px_rgba(25,15,5,0.35)]">
      <p className="text-[10px] font-semibold tracking-[0.3em] text-[#ffb282]">{t("brand")}</p>
      <h2 className="mt-2 font-serif text-[26px] tracking-tight text-white">{t("title")}</h2>
      <p className="mt-3 text-[13px] leading-relaxed text-white/80">
        {t("body1")}
        <br />
        {t("body2")}
      </p>

      {/* 8/15 정상 진료 — 메인 강조 카드 */}
      {openDay && (
        <div className="mt-5 rounded-3xl border border-white/35 bg-white/20 px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-md">
          <p className="text-[12px] font-semibold text-[#ffd2b0]">
            {openDay.date} ({openDay.weekday}) · {openDay.label}
          </p>
          <p className="mt-1.5 font-serif text-4xl font-semibold text-[#ffa363]">
            {t("openLabel")}
          </p>
          {openDay.hours && (
            <p className="mt-2 inline-block rounded-full border border-white/25 bg-white/20 px-4 py-1.5 text-[13px] font-semibold tabular-nums text-white">
              {openDay.hours}
            </p>
          )}
        </div>
      )}

      {/* 8/17 휴진 — 보조 안내 */}
      {closedDay && (
        <div className="mt-2.5 flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-[12px] text-white/75">
          <span className="font-semibold">
            {closedDay.date} ({closedDay.weekday}) {closedDay.label}
          </span>
          <span aria-hidden className="text-white/40">·</span>
          <span>{t("closedLabel")}</span>
        </div>
      )}

      <p className="mt-5 text-[11px] leading-relaxed text-white/60">{t("footer")}</p>
    </div>
  );
}

function SedationDetail() {
  const t = useTranslations("v2.popups.sedation");
  const points = t.raw("points") as string[];

  return (
    <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-7 [text-shadow:0_1px_6px_rgba(25,15,5,0.35)]">
      <p className="text-center text-[10px] font-semibold tracking-[0.3em] text-[#ffb282]">
        {t("brand")} · {t("kicker")}
      </p>
      <h2 className="mt-2 text-center font-serif text-2xl tracking-tight text-white">
        {t("title")}
      </h2>
      <p className="mt-1.5 text-center font-serif text-[13px] italic text-[#ffa363]">
        {t("subtitle")}
      </p>
      <p className="mt-4 text-center text-[13px] leading-relaxed text-white/80">{t("lead")}</p>
      <ul className="mt-4 space-y-2.5">
        {points.map((p, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-[12px] leading-relaxed text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            <span
              aria-hidden
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/25 bg-white/15 font-serif text-[11px] text-[#ffbf95]"
            >
              {i + 1}
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-center text-[11px] leading-relaxed text-white/70">
        {t("note")}
      </p>
    </div>
  );
}
