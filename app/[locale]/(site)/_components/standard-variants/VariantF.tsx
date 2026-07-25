"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* F. VERTICAL WAVE — 골드 웨이브 라인 + 활성 챕터 강조 · 점 없음 */
export function VariantF() {
  const [active, setActive] = useState(0);
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink lg:aspect-auto lg:min-h-[720px]">
          {/* 어두운 배경 + 웜톤 그로우 */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 60% 45%, rgba(196,144,116,0.35) 0%, rgba(154,110,84,0.15) 40%, rgba(0,0,0,0) 75%)",
            }}
          />

          {/* 세로 웨이브 SVG (4개, 각 챕터마다 강조 하나) */}
          <svg
            viewBox="0 0 400 800"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="wave-fade" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="currentColor" />
                <stop offset="80%" stopColor="currentColor" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {STD_CHAPTERS.map((c, i) => {
              const isActive = i === active;
              const baseX = 90 + i * 60;
              const amp = 22;
              const path = `M ${baseX} 0
                Q ${baseX + amp} 100 ${baseX} 200
                Q ${baseX - amp} 300 ${baseX} 400
                Q ${baseX + amp} 500 ${baseX} 600
                Q ${baseX - amp} 700 ${baseX} 800`;
              return (
                <g key={c.key}>
                  <path
                    d={path}
                    stroke={isActive ? c.color : "rgba(255,240,220,0.18)"}
                    strokeWidth={isActive ? 1.4 : 0.6}
                    fill="none"
                    style={{
                      transition: "stroke 600ms, stroke-width 600ms",
                      filter: isActive ? `drop-shadow(0 0 6px ${c.color})` : "none",
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* 중앙 텍스트: 활성 챕터 이름 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p
              className="text-[10px] font-medium tracking-[0.4em] text-cream/60"
              key={STD_CHAPTERS[active].key + "-kicker"}
              style={{
                animation: "std-num-in 500ms cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              {STD_CHAPTERS[active].num} · STANDARD
            </p>
            <p
              className="mt-4 font-serif text-4xl italic leading-tight tracking-tight text-cream lg:text-5xl"
              key={STD_CHAPTERS[active].short}
              style={{
                animation:
                  "std-num-in 700ms 100ms cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              {STD_CHAPTERS[active].short}
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream/50 lg:px-10">
            <span>F · WAVE</span>
            <span className="font-serif tabular-nums text-cream/60">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </div>

        <ChaptersRight active={active} setActive={setActive} />
      </div>
    </section>
  );
}
