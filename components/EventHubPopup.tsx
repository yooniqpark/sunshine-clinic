"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const POPUP_ID = "event-hub-2026-v1";
const KEY = "sunshine-popup:" + POPUP_ID;

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

type View = "hub" | "first-visit" | "grand-open" | "holiday" | "sedation";

const IMAGE_EVENTS = {
  "first-visit": {
    cover: "/events/first-visit-welcome-2026.jpg",
    price: "/events/first-visit-benefit-2026.jpg",
    coverAspect: "2 / 3",
    priceAspect: "2 / 3",
    cta: "첫 방문 혜택 · 가격 보기",
    alt: "선샤인의원 첫 방문 이벤트",
  },
  "grand-open": {
    cover: "/events/grand-open-welcome-2026.jpg",
    price: "/events/grand-open-benefit-2026.jpg",
    coverAspect: "2 / 3",
    priceAspect: "1237 / 1271",
    cta: "오픈 기념 혜택 · 가격 보기",
    alt: "선샤인의원 그랜드 오픈 이벤트",
  },
} as const;

/**
 * 이벤트 허브 팝업 — 진행 중인 이벤트 4가지를 한 화면 그리드로 보여주고,
 * 카드를 누르면 해당 이벤트 상세(포스터 → 가격표 / 안내문)로 전환된다.
 */
export function EventHubPopup() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [view, setView] = useState<View>("hub");
  const [stage, setStage] = useState<0 | 1>(0);

  useEffect(() => {
    setMounted(true);
    try {
      setOpen(localStorage.getItem(KEY) !== todayStr());
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted || !open) return null;

  function closeToday() {
    try {
      localStorage.setItem(KEY, todayStr());
    } catch {}
    setOpen(false);
  }

  function goHub() {
    setView("hub");
    setStage(0);
  }

  const isImageEvent = view === "first-visit" || view === "grand-open";

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 px-1.5 py-3 sm:p-8">
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={() => setOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <section
        aria-label="선샤인의원 이벤트 안내"
        className="pointer-events-auto relative flex h-auto max-h-[92dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-[1.5rem] bg-[#f4efe7] shadow-2xl shadow-black/35 sm:max-w-[520px]"
      >
        {/* ── 허브: 4개 이벤트 그리드 ── */}
        {view === "hub" && (
          <div className="min-h-0 overflow-y-auto px-4 pb-3 pt-5">
            <p className="text-center text-[10px] font-semibold tracking-[0.3em] text-[#a08360]">
              SUNSHINE SKIN CLINIC
            </p>
            <h2 className="mt-1.5 text-center font-serif text-2xl tracking-tight text-[#3d3129]">
              진행 중인 이벤트
            </h2>
            <p className="mb-4 mt-1 text-center text-[11px] text-[#8a7660]">
              궁금한 이벤트를 눌러 자세히 확인해 보세요
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {/* 첫 방문 */}
              <button
                type="button"
                onClick={() => setView("first-visit")}
                className="group overflow-hidden rounded-2xl border border-[#d95f26]/15 bg-white text-left shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={IMAGE_EVENTS["first-visit"].cover}
                    alt="첫 방문 이벤트"
                    fill
                    sizes="240px"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-[12px] font-bold text-[#3d3129]">첫 방문 이벤트</span>
                  <span aria-hidden className="text-[#c65b22]">→</span>
                </div>
              </button>

              {/* 그랜드 오픈 */}
              <button
                type="button"
                onClick={() => setView("grand-open")}
                className="group overflow-hidden rounded-2xl border border-[#d95f26]/15 bg-white text-left shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={IMAGE_EVENTS["grand-open"].cover}
                    alt="그랜드 오픈 이벤트"
                    fill
                    sizes="240px"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-[12px] font-bold text-[#3d3129]">그랜드 오픈</span>
                  <span aria-hidden className="text-[#c65b22]">→</span>
                </div>
              </button>

              {/* 8월 진료 안내 */}
              <button
                type="button"
                onClick={() => setView("holiday")}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[#3d3129] p-4 text-left shadow-sm transition hover:shadow-md"
              >
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.22em] text-[#d8b48c]">NOTICE</p>
                  <p className="mt-1.5 font-serif text-lg leading-snug text-[#f6ecdc]">
                    8월 진료 안내
                  </p>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-[10px] leading-relaxed text-[#f6ecdc]/60">
                    광복절 정상 진료
                    <br />
                    8.17(월) 휴진
                  </p>
                  <span aria-hidden className="text-[#d8b48c]">→</span>
                </div>
              </button>

              {/* 안심 수면마취 */}
              <button
                type="button"
                onClick={() => setView("sedation")}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[#6f4a33] p-4 text-left shadow-sm transition hover:shadow-md"
              >
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.22em] text-[#f0cfa6]">SAFE SEDATION</p>
                  <p className="mt-1.5 font-serif text-lg leading-snug text-[#fdf4e8]">
                    안심 수면마취
                  </p>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-[10px] leading-relaxed text-[#fdf4e8]/60">
                    편안하고 안전한
                    <br />
                    수면 시스템
                  </p>
                  <span aria-hidden className="text-[#f0cfa6]">→</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── 이미지 이벤트 상세 (첫 방문 · 그랜드 오픈) ── */}
        {isImageEvent && (
          <>
            <button
              type="button"
              onClick={() => setStage(stage === 0 ? 1 : 0)}
              aria-label={stage === 0 ? "가격표 보기" : "이벤트 첫 화면으로 돌아가기"}
              className="relative block w-full shrink overflow-hidden"
              style={{
                aspectRatio:
                  stage === 0
                    ? IMAGE_EVENTS[view].coverAspect
                    : IMAGE_EVENTS[view].priceAspect,
              }}
            >
              <Image
                src={stage === 0 ? IMAGE_EVENTS[view].cover : IMAGE_EVENTS[view].price}
                alt={IMAGE_EVENTS[view].alt}
                fill
                priority
                sizes="(min-width: 640px) 520px, 100vw"
                className="object-contain"
                draggable={false}
              />
            </button>
            {stage === 0 && (
              <div className="shrink-0 bg-[#f4efe7] px-4 pb-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="group flex w-full items-center justify-between rounded-full bg-[#c65b22] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#fdf4e8] shadow-md shadow-[#c65b22]/25 transition hover:bg-[#a94a18]"
                >
                  <span>{IMAGE_EVENTS[view].cta}</span>
                  <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ── 진료 안내 · 수면마취 상세 ── */}
        {view === "holiday" && <HolidayDetail />}
        {view === "sedation" && <SedationDetail />}

        <div className="flex shrink-0 items-center justify-between border-t border-[#d95f26]/20 bg-[#efe7da] px-5 py-2.5 text-xs text-[#5a4a3c]">
          <button type="button" onClick={closeToday} className="hover:text-[#3d3129]">
            오늘 하루 보지 않기
          </button>
          {view !== "hub" && (
            <button type="button" onClick={goHub} className="font-semibold hover:text-[#3d3129]">
              ← 전체 이벤트
            </button>
          )}
          <button type="button" onClick={() => setOpen(false)} className="font-semibold hover:text-[#3d3129]">
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

  return (
    <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-7 text-center">
      <p className="text-[10px] font-semibold tracking-[0.3em] text-[#a08360]">{t("brand")}</p>
      <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#3d3129]">{t("title")}</h2>
      <p className="mt-3 text-[13px] leading-relaxed text-[#6d5c4a]">
        {t("body1")}
        <br />
        {t("body2")}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {days.map((d) => (
          <div
            key={d.date}
            className={`rounded-2xl px-3 py-4 ${
              d.status === "closed"
                ? "bg-[#3d3129] text-[#f6ecdc]"
                : "bg-white text-[#3d3129] ring-1 ring-[#d95f26]/15"
            }`}
          >
            <p className="text-[10px] opacity-70">
              {d.date} ({d.weekday})
            </p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-[0.08em] text-[#c65b22]">
              {d.label}
            </p>
            <p className="mt-2 font-serif text-xl">
              {d.status === "closed" ? t("closedLabel") : t("openLabel")}
            </p>
            {d.hours && <p className="mt-1.5 text-[10px] opacity-70">{d.hours}</p>}
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] leading-relaxed text-[#8a7660]">{t("footer")}</p>
    </div>
  );
}

function SedationDetail() {
  const t = useTranslations("v2.popups.sedation");
  const points = t.raw("points") as string[];

  return (
    <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-7">
      <p className="text-center text-[10px] font-semibold tracking-[0.3em] text-[#a08360]">
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
