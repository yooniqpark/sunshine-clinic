"use client";

import { useState } from "react";
import {
  ChaptersRight,
  STD_CHAPTERS,
} from "./standard-variants/SharedChapters";

/**
 * THE SUNSHINE STANDARD — Face × Layers × Waves 융합 버전
 * · 얇은 여성 얼굴 실루엣 (line-art)
 * · 뒤로 흐르는 깊이 층 밴드 (표피 → SMAS)
 * · 각 챕터의 브랜드 컬러 세로 웨이브 (활성 웨이브 발광)
 * · 챕터: 마우스 hover · 탭으로 활성화 (자동 순환 없음)
 */
export function SunshineStandardSplit() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];

  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink lg:aspect-auto lg:min-h-[720px]">
          {/* Ambient glow — 활성 챕터 컬러로 물듦 */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-[background] duration-[900ms]"
            style={{
              background: `radial-gradient(ellipse at 55% 45%, ${c.color}30 0%, ${c.color}10 30%, rgba(0,0,0,0) 65%)`,
            }}
          />

          {/* 피부 층 배경 밴드 (표피 · 진피 · SMAS) — 얼굴 뒤로 은은한 tint */}
          <div className="pointer-events-none absolute inset-0">
            {[
              { top: 8, height: 15, tint: "rgba(255,240,220,0.06)", label: "EPIDERMIS", sub: "표피" },
              { top: 23, height: 42, tint: "rgba(196,144,116,0.08)", label: "DERMIS", sub: "진피" },
              { top: 65, height: 25, tint: "rgba(154,110,84,0.10)", label: "SUBCUTANEOUS · SMAS", sub: "피하 · SMAS" },
            ].map((l) => (
              <div key={l.label} className="absolute inset-x-0" style={{ top: `${l.top}%`, height: `${l.height}%` }}>
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: l.tint }}
                />
                {/* 층 경계선 */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent 0%, rgba(255,240,220,0.18) 20%, rgba(255,240,220,0.22) 50%, rgba(255,240,220,0.18) 80%, transparent 100%)",
                  }}
                />
                {/* 층 라벨 (좌측) — 모바일 숨김 */}
                <div
                  className="absolute left-6 top-2 hidden flex-col text-[9px] font-medium tracking-[0.28em] text-cream/30 lg:left-10 lg:flex"
                >
                  <span className="font-serif not-italic">{l.label}</span>
                  <span className="text-cream/25">{l.sub}</span>
                </div>
              </div>
            ))}
            {/* 하단 경계선 (SMAS 아래) */}
            <span
              aria-hidden
              className="absolute inset-x-0 h-px"
              style={{
                top: "90%",
                background:
                  "linear-gradient(to right, transparent 0%, rgba(255,240,220,0.18) 20%, rgba(255,240,220,0.22) 50%, rgba(255,240,220,0.18) 80%, transparent 100%)",
              }}
            />
            {/* 우측 depth ruler — 모바일 숨김 */}
            <div className="pointer-events-none absolute right-6 top-[10%] hidden flex-col items-end gap-4 text-[8px] font-medium tracking-[0.2em] text-cream/25 lg:right-10 lg:flex">
              <span>0.1 mm</span>
              <span className="mt-6">1.5 mm</span>
              <span className="mt-10">4 mm</span>
              <span className="mt-8">SMAS</span>
            </div>
          </div>

          {/* 챕터 depth 하이라이트 라인 */}
          <div className="pointer-events-none absolute inset-0">
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              return (
                <div
                  key={ch.key + "-layer"}
                  className="absolute inset-x-0 transition-all duration-700"
                  style={{ top: `${ch.layerY}%` }}
                >
                  <span
                    className="block h-px transition-all duration-700"
                    style={{
                      background: isActive
                        ? `linear-gradient(to right, transparent 0%, ${ch.color} 30%, ${ch.color} 70%, transparent 100%)`
                        : "rgba(255,240,220,0.10)",
                      opacity: isActive ? 1 : 0.6,
                      boxShadow: isActive ? `0 0 8px ${ch.color}80` : "none",
                    }}
                  />
                  <div
                    className={`mt-1.5 hidden items-center gap-3 px-6 text-[9px] font-medium tracking-[0.28em] transition-all duration-700 lg:flex lg:px-10 ${
                      isActive ? "text-cream" : "text-cream/25"
                    }`}
                  >
                    <span
                      className="h-px transition-all duration-700"
                      style={{
                        width: isActive ? "24px" : "12px",
                        background: isActive
                          ? ch.color
                          : "rgba(255,240,220,0.35)",
                      }}
                    />
                    <span className="font-serif normal-case not-italic tracking-[0.24em]">
                      {ch.key.split(" · ")[0]}
                    </span>
                    <span
                      className={`transition-opacity duration-700 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ color: ch.color }}
                    >
                      · {ch.short}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 브랜드 컬러 세로 웨이브 */}
          <svg
            viewBox="0 0 400 800"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              const baseX = 55 + i * 25;
              const amp = 10;
              const path = `M ${baseX} 0
                Q ${baseX + amp} 120 ${baseX} 240
                Q ${baseX - amp} 360 ${baseX} 480
                Q ${baseX + amp} 600 ${baseX} 720
                L ${baseX} 800`;
              return (
                <path
                  key={ch.key + "-wave"}
                  d={path}
                  stroke={isActive ? ch.color : "rgba(255,240,220,0.10)"}
                  strokeWidth={isActive ? 1.2 : 0.4}
                  fill="none"
                  style={{
                    transition: "stroke 700ms, stroke-width 700ms",
                    filter: isActive
                      ? `drop-shadow(0 0 6px ${ch.color})`
                      : "none",
                  }}
                />
              );
            })}
          </svg>

          {/* 여성 얼굴 실루엣 */}
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <g
              fill="none"
              stroke="rgba(255,240,220,0.55)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* 긴 웨이브 헤어 */}
              <path
                d="M228 78 C 250 85, 258 120, 254 160 C 250 200, 244 240, 240 280 C 236 320, 230 360, 226 400 C 224 424, 232 448, 246 468"
                opacity="0.6"
              />
              {/* 얼굴 프로필 */}
              <path d="M228 82 C 214 74, 196 72, 180 78 C 158 86, 144 108, 138 132 C 134 156, 138 180, 142 198 C 144 208, 146 216, 144 224 C 140 236, 130 244, 128 254 C 126 266, 132 276, 146 282 L 158 288 L 160 306 C 162 322, 168 336, 178 348 C 186 358, 196 366, 204 372" />
              {/* 앞머리 */}
              <path d="M182 84 C 198 74, 220 68, 240 78" opacity="0.55" />
              <path d="M188 90 C 200 84, 216 82, 232 90" opacity="0.35" />
              {/* 눈 + 속눈썹 */}
              <path
                d="M158 168 C 164 162, 178 162, 186 168"
                strokeWidth="1.2"
              />
              <path
                d="M158 168 C 164 172, 178 172, 186 168"
                opacity="0.6"
              />
              <circle
                cx="172"
                cy="171"
                r="1.8"
                fill="rgba(255,240,220,0.75)"
                stroke="none"
              />
              {/* 눈썹 */}
              <path
                d="M158 156 C 168 150, 182 152, 190 158"
                opacity="0.7"
                strokeWidth="0.9"
              />
              {/* 코 */}
              <path d="M148 175 C 142 195, 138 210, 144 216 C 148 220, 156 219, 158 216" />
              {/* 입술 */}
              <path
                d="M152 244 C 160 240, 174 240, 180 244"
                opacity="0.85"
              />
              <path
                d="M152 250 C 160 254, 174 254, 180 250"
                opacity="0.7"
              />
              {/* 턱 */}
              <path
                d="M158 288 C 164 296, 172 302, 178 300"
                opacity="0.35"
              />
              {/* 목 */}
              <path
                d="M204 372 L 198 420 L 232 420"
                opacity="0.85"
              />
              {/* 귀 + 귀걸이 */}
              <path
                d="M204 190 C 214 192, 220 204, 216 218 C 212 230, 202 232, 200 226"
                opacity="0.55"
              />
              <circle
                cx="212"
                cy="230"
                r="1.2"
                fill="rgba(255,240,220,0.7)"
                stroke="none"
              />
            </g>
          </svg>

          {/* 하단 라벨 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream/60 lg:px-10">
            <span>SKIN OBSERVATION</span>
            <span className="font-serif tabular-nums text-cream">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </div>

        <ChaptersRight active={active} setActive={setActive} />
      </div>
    </section>
  );
}
