"use client";

import { useState } from "react";
import { STD_CHAPTERS } from "./SharedChapters";

/* Y. ARCHIVE INDEX — 닥터디자이너·디에이 포트폴리오 톤:
   스튜디오 아카이브 인덱스 테이블. NO / 챕터 / 타깃 깊이 / 노트 구성.
   hover 시 행이 열리며 노트가 드러나고, 우측 프리뷰 패널이 컬러 워시로 응답. */
const DEPTH_META = [
  { depth: "0.1 mm", layer: "EPIDERMIS", note: "흉터와 모공은 표면이 아니라 구조를 다룹니다." },
  { depth: "1.5 mm", layer: "DERMIS", note: "색소는 깊이에 따라 장비와 파장을 다르게." },
  { depth: "4.0 mm", layer: "DEEP DERMIS", note: "재생은 진피의 시간을 되돌리는 일." },
  { depth: "SMAS", layer: "SUB·SMAS", note: "당기는 힘은 피부 아래 SMAS층에서 시작됩니다." },
] as const;

export function VariantY() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  const meta = DEPTH_META[active];

  return (
    <section className="relative bg-[#f6f1e8] text-ink">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
        {/* Left — 인덱스 테이블 */}
        <div className="px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex items-baseline justify-between gap-6">
            <p className="text-[10px] font-medium tracking-[0.32em] text-ink/55 lg:text-[11px]">
              THE SUNSHINE STANDARD
            </p>
            <p className="text-[10px] font-medium tracking-[0.24em] text-ink/40">
              INDEX — 진료 기준 아카이브
            </p>
          </div>
          <h2 className="mt-8 font-serif text-3xl font-normal leading-[1.25] tracking-tight lg:text-[2.5rem]">
            피부를 먼저 보고, <span className="text-ink/40">필요한 만큼만.</span>
          </h2>

          {/* 컬럼 헤더 */}
          <div className="mt-12 grid grid-cols-[44px_1fr_auto] gap-4 border-b border-ink/30 pb-3 text-[9px] font-medium tracking-[0.24em] text-ink/40 sm:grid-cols-[44px_1.2fr_1fr_auto]">
            <span>NO.</span>
            <span>CHAPTER</span>
            <span className="hidden sm:block">TARGET LAYER</span>
            <span className="text-right">DEPTH</span>
          </div>

          <ul>
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              const m = DEPTH_META[i];
              return (
                <li
                  key={ch.key}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="cursor-pointer border-b border-ink/15"
                >
                  <div className="grid grid-cols-[44px_1fr_auto] items-baseline gap-4 pt-5 sm:grid-cols-[44px_1.2fr_1fr_auto]">
                    <span
                      className={`text-[11px] tabular-nums tracking-[0.2em] transition-colors duration-500 ${
                        isActive ? "text-ink" : "text-ink/35"
                      }`}
                    >
                      {ch.num}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`font-serif leading-tight transition-all duration-500 ${
                          isActive
                            ? "text-2xl text-ink lg:text-[1.75rem]"
                            : "text-xl text-ink/40"
                        }`}
                      >
                        {ch.short}
                      </p>
                      <p
                        className={`mt-1 text-[9px] font-medium tracking-[0.24em] transition-colors duration-500 ${
                          isActive ? "text-ink/50" : "text-ink/25"
                        }`}
                      >
                        {ch.key}
                      </p>
                    </div>
                    <span
                      className={`hidden text-[10px] font-medium tracking-[0.2em] transition-colors duration-500 sm:block ${
                        isActive ? "text-ink/60" : "text-ink/30"
                      }`}
                    >
                      {m.layer}
                    </span>
                    <span
                      className="text-right text-xs tabular-nums transition-colors duration-500"
                      style={{ color: isActive ? ch.color : "rgba(33,28,23,0.35)" }}
                    >
                      {m.depth}
                    </span>
                  </div>
                  {/* 노트 — 활성 행만 펼침 */}
                  <div
                    className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      gridTemplateRows: isActive ? "1fr" : "0fr",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 pl-[60px] pt-2 text-sm leading-relaxed text-ink/60">
                        {m.note}
                      </p>
                    </div>
                  </div>
                  {!isActive && <div className="pb-5" />}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right — 프리뷰 패널 */}
        <div
          className="relative hidden overflow-hidden lg:block"
          style={{
            background: `linear-gradient(180deg, #17120d 0%, #211a13 100%)`,
          }}
        >
          {/* 컬러 워시 */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-[background] duration-[1000ms]"
            style={{
              background: `radial-gradient(ellipse at 50% 62%, ${c.color}40 0%, rgba(0,0,0,0) 62%)`,
            }}
          />
          {/* 깊이 눈금 */}
          <div className="absolute left-10 top-1/2 flex -translate-y-1/2 flex-col gap-8">
            {DEPTH_META.map((m, i) => (
              <div key={m.depth} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px transition-all duration-500"
                  style={{
                    width: i === active ? 36 : 14,
                    background:
                      i === active
                        ? STD_CHAPTERS[i].color
                        : "rgba(251,248,243,0.25)",
                  }}
                />
                <span
                  className={`text-[9px] font-medium tracking-[0.24em] transition-colors duration-500 ${
                    i === active ? "text-cream/80" : "text-cream/30"
                  }`}
                >
                  {m.depth}
                </span>
              </div>
            ))}
          </div>
          {/* 중앙 프리뷰 타이포 */}
          <div className="flex h-full min-h-[560px] flex-col items-center justify-center px-10 text-center text-cream">
            <span
              className="font-serif italic leading-none transition-colors duration-700"
              style={{ fontSize: "clamp(6rem,9vw,8.5rem)", color: c.color }}
            >
              {c.num}
            </span>
            <p className="mt-6 font-serif text-2xl tracking-tight">{c.short}</p>
            <p className="mt-3 text-[10px] font-medium tracking-[0.32em] text-cream/45">
              {c.key}
            </p>
            <p className="mt-10 max-w-[240px] text-xs leading-[1.9] text-cream/55">
              {meta.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
