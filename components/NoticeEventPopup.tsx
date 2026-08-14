"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { hideAllToday, isHiddenToday } from "@/lib/popup-prefs";

/** 이벤트 팝업(그랜드 오픈)과 같은 지면 톤 — 아이보리 종이 · 잉크 · 더스티 로즈 */
const PAPER = "#f6f3ed";
const INK = "#1f1c1a";
const SUB = "#6b625c";
const META = "#a3968f";
const ROSE = "#c98a8a";
const RULE = "rgba(45,35,33,0.14)";
const TAB = "#282422";
const TAB_TEXT = "#f0ece5";
const FOOT = "#1c1917";

const TAB_LABEL: Record<"holiday" | "sedation", string> = {
  holiday: "NOTICE",
  sedation: "SAFETY",
};

/**
 * 안내형 팝업 (진료 안내 · 수면마취).
 * 이벤트 팝업과 같은 매거진 지면 문법 — 위로 솟은 인덱스 탭, 직각 상단, 얇은 괘선.
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
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
    const hidden = isHiddenToday(popupId);
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

  // 남은 안내 팝업까지 함께 숨긴다
  function closeToday() {
    hideAllToday();
    dismiss();
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-7 py-3 sm:p-8">
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={dismiss}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div className="pointer-events-auto relative flex w-full max-w-[480px] flex-col lg:h-[660px]">
        {/* 지면 위로 솟은 인덱스 탭 */}
        <div className="flex pl-0">
          <span
            className="rounded-t-[10px] px-[22px] pb-[7px] pt-4 text-[8.5px] font-bold tracking-[0.16em]"
            style={{ background: TAB, color: TAB_TEXT }}
          >
            {TAB_LABEL[variant]}
          </span>
        </div>

        <section
          aria-label={ariaLabel}
          // 모바일은 이벤트 팝업과 같은 크기, 데스크톱은 세로만 660px로 맞춘다
          className="flex h-[70dvh] max-h-[590px] min-h-0 flex-col overflow-hidden rounded-b-[1.5rem] shadow-2xl shadow-black/35 lg:h-auto lg:max-h-none lg:flex-1"
          style={{ background: PAPER }}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {variant === "holiday" ? <HolidayDetail /> : <SedationDetail />}
          </div>

          <div
            className="flex shrink-0 items-center justify-between px-5 py-2.5 text-[11px]"
            style={{ background: FOOT, color: "rgba(240,235,228,0.75)" }}
          >
            <button type="button" onClick={closeToday} className="transition hover:opacity-80">
              오늘 하루 보지 않기
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="font-semibold transition hover:opacity-80"
              style={{ color: "#efe9e1" }}
            >
              닫기
            </button>
          </div>
        </section>
      </div>
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

  return (
    <div className="my-auto px-7 pb-7 pt-8 lg:px-9">
      <p className="text-[9.5px] font-bold tracking-[0.26em]" style={{ color: ROSE }}>
        {t("brand")}
      </p>
      <h2
        className="mt-2.5 break-keep font-serif text-[26px] leading-tight lg:text-[30px]"
        style={{ color: INK }}
      >
        {t("title")}
      </h2>
      <p className="mt-3 break-keep text-[12.5px] leading-relaxed" style={{ color: SUB }}>
        {t("body1")} {t("body2")}
      </p>

      {/* 날짜 — 굵은 괘선 아래 항목별 얇은 괘선 */}
      <div className="mt-6 border-t" style={{ borderColor: INK }}>
        {days.map((d) => {
          const isOpen = d.status === "open";
          const dayNum = d.date.replace(/[^0-9.]/g, "").split(".").pop() ?? d.date;
          return (
            <div
              key={d.date}
              className="flex items-center gap-4 border-b py-4"
              style={{ borderColor: RULE }}
            >
              <span
                className="w-[52px] shrink-0 font-serif text-[34px] leading-none tabular-nums"
                style={{ color: isOpen ? ROSE : META }}
              >
                {dayNum}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block text-[10px] font-bold tracking-[0.18em]"
                  style={{ color: META }}
                >
                  {d.weekday} · {d.label}
                </span>
                <span
                  className="mt-1 block break-keep text-[15px] font-semibold"
                  style={{ color: isOpen ? INK : SUB }}
                >
                  {isOpen ? t("openLabel") : t("closedLabel")}
                </span>
              </span>
              {/* 휴진일의 hours는 "휴진합니다" 같은 상태 문구라 왼쪽과 겹친다 — 진료일만 시간 표기 */}
              {isOpen && d.hours && (
                <span
                  className="shrink-0 text-[12px] font-semibold tabular-nums"
                  style={{ color: INK }}
                >
                  {d.hours}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-5 break-keep text-[10.5px] leading-relaxed" style={{ color: META }}>
        {t("footer")}
      </p>
    </div>
  );
}

function SedationDetail() {
  const t = useTranslations("v2.popups.sedation");
  const points = t.raw("points") as string[];

  return (
    <div className="my-auto px-7 pb-7 pt-8 lg:px-9">
      <p className="text-[9.5px] font-bold tracking-[0.26em]" style={{ color: ROSE }}>
        {t("brand")}
      </p>
      <h2
        className="mt-2.5 break-keep font-serif text-[26px] leading-tight lg:text-[30px]"
        style={{ color: INK }}
      >
        {t("title")}
      </h2>
      <p className="mt-2 break-keep font-serif text-[13px] italic" style={{ color: ROSE }}>
        {t("subtitle")}
      </p>
      <p className="mt-3 break-keep text-[12.5px] leading-relaxed" style={{ color: SUB }}>
        {t("lead")}
      </p>

      <div className="mt-6 border-t" style={{ borderColor: INK }}>
        {points.map((p, i) => (
          <div
            key={i}
            className="flex items-start gap-4 border-b py-3.5"
            style={{ borderColor: RULE }}
          >
            <span
              aria-hidden
              className="w-[52px] shrink-0 font-serif text-[22px] leading-none tabular-nums"
              style={{ color: ROSE }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="break-keep text-[12.5px] leading-relaxed" style={{ color: INK }}>
              {p}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-5 break-keep text-[10.5px] leading-relaxed" style={{ color: META }}>
        {t("note")}
      </p>
    </div>
  );
}
