"use client";

import { useState } from "react";
import { STD_CHAPTERS } from "./SharedChapters";

/* V. EDITORIAL MAGAZINE — 바노바기 매거진·포레브 톤:
   화보 편집 그리드. 세로쓰기 국문 헤드라인 + Vol. 표기 + 목차형 챕터 리스트.
   중앙 비주얼은 활성 챕터 컬러로 물드는 화보 플레이스홀더. */
export function VariantV() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];

  return (
    <section className="relative bg-cream text-ink">
      {/* Masthead */}
      <div className="mx-auto max-w-7xl border-b border-ink/15 px-5 pb-6 pt-16 lg:px-8 lg:pt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="font-serif text-2xl tracking-tight lg:text-3xl">
            SUNSHINE <span className="italic text-ink/45">Journal</span>
          </p>
          <div className="flex items-baseline gap-6 text-[10px] font-medium tracking-[0.28em] text-ink/50 lg:text-[11px]">
            <span>THE SUNSHINE STANDARD</span>
            <span className="hidden sm:inline">VOL. 04 — 진료의 기준</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 lg:grid-cols-[auto_1.25fr_1fr] lg:gap-16 lg:px-8 lg:py-20">
        {/* 세로쓰기 국문 헤드라인 — 데스크탑만 */}
        <div className="hidden lg:block">
          <h2
            className="font-serif text-4xl font-normal leading-[1.3] tracking-tight text-ink"
            style={{ writingMode: "vertical-rl" }}
          >
            피부를 먼저 보고,{" "}
            <span className="text-ink/40">필요한 만큼만.</span>
          </h2>
        </div>

        {/* 모바일 헤드라인 */}
        <h2 className="font-serif text-3xl font-normal leading-[1.25] tracking-tight lg:hidden">
          피부를 먼저 보고,
          <br />
          <span className="text-ink/40">필요한 만큼만.</span>
        </h2>

        {/* 중앙 화보 비주얼 — 활성 챕터 컬러 틴트 */}
        <figure className="relative">
          <div
            className="relative aspect-[3/4] w-full overflow-hidden"
            style={{
              background: `linear-gradient(165deg, #efe7d9 0%, ${c.color}38 60%, #e6dccb 100%)`,
              transition: "background 900ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* 화보 라인 오너먼트 — 옆얼굴 크롭 */}
            <svg
              viewBox="0 0 300 400"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full"
            >
              <g
                fill="none"
                stroke="rgba(33,28,23,0.4)"
                strokeWidth="1"
                strokeLinecap="round"
              >
                <path d="M210 40 C 180 28, 140 32, 116 56 C 92 80, 84 116, 90 148 C 94 170, 102 186, 100 200 C 96 218, 82 228, 80 242 C 78 258, 88 268, 106 274 L 122 280 L 124 302 C 127 322, 136 340, 150 354 C 162 366, 176 376, 188 382" />
                <path d="M126 150 C 134 143, 150 143, 159 150" strokeWidth="1.3" />
                <path d="M118 128 C 130 121, 146 123, 156 130" strokeWidth="0.9" opacity="0.7" />
                <path d="M104 160 C 97 184, 92 202, 99 210 C 104 215, 113 214, 116 210" />
                <path d="M112 246 C 121 241, 137 241, 144 246" opacity="0.85" />
                <path d="M112 253 C 121 258, 137 258, 144 253" opacity="0.7" />
              </g>
            </svg>
            {/* 이슈 넘버 스탬프 */}
            <span className="absolute right-5 top-5 font-serif text-6xl italic text-ink/20 lg:text-7xl">
              {c.num}
            </span>
          </div>
          <figcaption className="mt-3 flex items-baseline justify-between text-[10px] font-medium tracking-[0.24em] text-ink/45">
            <span>FIG. {c.num} — {c.key}</span>
            <span
              className="transition-colors duration-700"
              style={{ color: c.color }}
            >
              {c.short}
            </span>
          </figcaption>
        </figure>

        {/* 목차형 챕터 리스트 */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-medium tracking-[0.32em] text-ink/50 lg:text-[11px]">
              CONTENTS
            </p>
            <ul className="mt-6 border-t border-ink/15">
              {STD_CHAPTERS.map((ch, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={ch.key}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="cursor-pointer border-b border-ink/15"
                  >
                    <div className="flex items-baseline gap-4 py-5">
                      <span
                        className={`font-serif italic transition-colors duration-500 ${
                          isActive ? "text-ink" : "text-ink/35"
                        }`}
                      >
                        {ch.num}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-serif text-xl leading-tight transition-colors duration-500 lg:text-2xl ${
                            isActive ? "text-ink" : "text-ink/40"
                          }`}
                        >
                          {ch.short}
                        </p>
                        <p
                          className={`mt-1 truncate text-[10px] font-medium tracking-[0.24em] transition-colors duration-500 ${
                            isActive ? "text-ink/55" : "text-ink/30"
                          }`}
                        >
                          {ch.key}
                        </p>
                      </div>
                      {/* 페이지 넘버처럼 — 점선 리더 + p.번호 */}
                      <span
                        aria-hidden
                        className="mx-1 hidden flex-1 border-b border-dotted border-ink/25 sm:block lg:hidden xl:block"
                        style={{ maxWidth: 60 }}
                      />
                      <span
                        className="text-xs tabular-nums transition-colors duration-500"
                        style={{ color: isActive ? ch.color : "rgba(33,28,23,0.35)" }}
                      >
                        p.{ch.num}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="mt-10 max-w-sm text-sm leading-[1.85] text-ink/60">
            정해진 답보다 한 사람의 피부에서 시작합니다. 시술을 정하기 전에
            지금의 피부와 원하는 변화의 방향을 충분히 이해합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
