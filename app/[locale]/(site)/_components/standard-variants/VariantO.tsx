"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* O. RECLINING — 얼굴이 90도 왼쪽 회전 (뒤로 누운 자세), 층 밴드는 세로로 흐름 */
export function VariantO() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink lg:aspect-auto lg:min-h-[720px]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-[background] duration-[900ms]"
            style={{
              background: `radial-gradient(ellipse at 50% 55%, ${c.color}30 0%, ${c.color}10 30%, rgba(0,0,0,0) 65%)`,
            }}
          />

          {/* 세로 방향 층 밴드 (누운 얼굴에 맞춰 좌우로 흐름) */}
          <div className="pointer-events-none absolute inset-y-0">
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              // 세로로 뻗는 층: 왼쪽부터 오른쪽으로 depth
              const xPct = 15 + (ch.layerY! / 100) * 70;
              return (
                <div
                  key={ch.key + "-vlayer"}
                  className="absolute inset-y-0 transition-all duration-700"
                  style={{ left: `${xPct}%`, width: "1px" }}
                >
                  <span
                    className="block h-full w-full transition-all duration-700"
                    style={{
                      background: isActive
                        ? `linear-gradient(to bottom, transparent 0%, ${ch.color} 25%, ${ch.color} 75%, transparent 100%)`
                        : "rgba(255,240,220,0.10)",
                      boxShadow: isActive ? `0 0 8px ${ch.color}80` : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* 누운 얼굴 SVG (90도 반시계 회전) */}
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <g
              transform="rotate(-90 200 250) translate(-50 100)"
              fill="none"
              stroke="rgba(255,240,220,0.6)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* 흘러내리는 긴 머리 */}
              <path
                d="M228 78 C 250 85, 258 120, 254 160 C 250 200, 244 240, 240 280 C 236 320, 230 360, 226 400 C 224 424, 232 448, 246 468"
                opacity="0.55"
              />
              {/* 얼굴 프로필 */}
              <path d="M228 82 C 214 74, 196 72, 180 78 C 158 86, 144 108, 138 132 C 134 156, 138 180, 142 198 C 144 208, 146 216, 144 224 C 140 236, 130 244, 128 254 C 126 266, 132 276, 146 282 L 158 288 L 160 306 C 162 322, 168 336, 178 348 C 186 358, 196 366, 204 372" />
              {/* 앞머리 */}
              <path d="M182 84 C 198 74, 220 68, 240 78" opacity="0.5" />
              {/* 감은 눈 (누운 자세라 살포시 감은) */}
              <path d="M158 168 C 164 174, 178 174, 186 168" strokeWidth="1.2" />
              {/* 눈썹 */}
              <path d="M158 156 C 168 150, 182 152, 190 158" opacity="0.7" strokeWidth="0.9" />
              {/* 코 */}
              <path d="M148 175 C 142 195, 138 210, 144 216 C 148 220, 156 219, 158 216" />
              {/* 입술 */}
              <path d="M152 244 C 160 240, 174 240, 180 244" opacity="0.85" />
              <path d="M152 250 C 160 254, 174 254, 180 250" opacity="0.7" />
              {/* 목 */}
              <path d="M204 372 L 198 420 L 232 420" opacity="0.85" />
              {/* 귀 */}
              <path d="M204 190 C 214 192, 220 204, 216 218 C 212 230, 202 232, 200 226" opacity="0.55" />
            </g>
          </svg>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream/60 lg:px-10">
            <span>O · RECLINING</span>
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
