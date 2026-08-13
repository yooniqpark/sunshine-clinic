"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const KEY_PREFIX = "sunshine-popup:";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * 안내형 팝업 (진료 안내 · 수면마취) — 밝은 베이지 셸에 안내 콘텐츠를 담는다.
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
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 px-1.5 py-3 sm:p-8">
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={dismiss}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <section
        aria-label={ariaLabel}
        className="pointer-events-auto relative flex h-auto max-h-[92dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-[1.5rem] bg-[#fffdf9] shadow-2xl shadow-black/35 sm:max-w-[480px]"
      >
        {variant === "holiday" ? <HolidayDetail /> : <SedationDetail />}

        <div className="flex shrink-0 items-center justify-between border-t border-[#d95f26]/20 bg-[#efe7da] px-5 py-2.5 text-xs text-[#5a4a3c]">
          <button type="button" onClick={closeToday} className="hover:text-[#3d3129]">
            오늘 하루 보지 않기
          </button>
          <button type="button" onClick={dismiss} className="font-semibold hover:text-[#3d3129]">
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
    <div className="min-h-0 overflow-y-auto bg-[#fffdf9] px-6 pb-6 pt-7 text-center">
      <p className="text-[10px] font-semibold tracking-[0.3em] text-[#d95f26]">{t("brand")}</p>
      <h2 className="mt-2 font-serif text-[26px] tracking-tight text-[#3d3129]">{t("title")}</h2>
      <p className="mt-3 text-[13px] leading-relaxed text-[#6d5c4a]">
        {t("body1")}
        <br />
        {t("body2")}
      </p>

      {/* 8/15 정상 진료 — 메인 강조 카드 */}
      {openDay && (
        <div className="mt-5 rounded-3xl bg-gradient-to-b from-[#fff3e6] to-[#ffe8d2] px-5 py-6 ring-2 ring-[#d95f26]/45 shadow-md shadow-[#d95f26]/10">
          <p className="text-[12px] font-semibold text-[#8a5a34]">
            {openDay.date} ({openDay.weekday}) · {openDay.label}
          </p>
          <p className="mt-1.5 font-serif text-4xl font-semibold text-[#d95f26]">
            {t("openLabel")}
          </p>
          {openDay.hours && (
            <p className="mt-2 inline-block rounded-full bg-white/80 px-4 py-1.5 text-[13px] font-semibold tabular-nums text-[#3d3129]">
              {openDay.hours}
            </p>
          )}
        </div>
      )}

      {/* 8/17 휴진 — 보조 안내 */}
      {closedDay && (
        <div className="mt-2.5 flex items-center justify-center gap-2 rounded-2xl bg-[#f2ece2] px-4 py-3 text-[12px] text-[#6d5c4a]">
          <span className="font-semibold">
            {closedDay.date} ({closedDay.weekday}) {closedDay.label}
          </span>
          <span aria-hidden className="text-[#b5a68f]">·</span>
          <span>{t("closedLabel")}</span>
        </div>
      )}

      <p className="mt-5 text-[11px] leading-relaxed text-[#8a7660]">{t("footer")}</p>
    </div>
  );
}

function SedationDetail() {
  const t = useTranslations("v2.popups.sedation");
  const points = t.raw("points") as string[];

  return (
    <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-7">
      <p className="text-center text-[10px] font-semibold tracking-[0.3em] text-[#d95f26]">
        {t("brand")} · {t("kicker")}
      </p>
      <h2 className="mt-2 text-center font-serif text-2xl tracking-tight text-[#3d3129]">
        {t("title")}
      </h2>
      <p className="mt-1.5 text-center font-serif text-[13px] italic text-[#c65b22]">
        {t("subtitle")}
      </p>
      <p className="mt-4 text-center text-[13px] leading-relaxed text-[#6d5c4a]">{t("lead")}</p>
      <ul className="mt-4 space-y-2.5">
        {points.map((p, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-[12px] leading-relaxed text-[#4a3b2c] ring-1 ring-[#d95f26]/12"
          >
            <span
              aria-hidden
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#c65b22]/12 font-serif text-[11px] text-[#c65b22]"
            >
              {i + 1}
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-xl bg-[#efe7da] px-4 py-3 text-center text-[11px] leading-relaxed text-[#6d5c4a]">
        {t("note")}
      </p>
    </div>
  );
}
