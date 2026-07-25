"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* M. INK WASH — 먹 번짐 스트로크 */
export function VariantM() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ede4d3] lg:aspect-auto lg:min-h-[720px]">
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <filter id="m-blur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            {/* 4개 붓 스트로크 (세로 방향 + 살짝 곡선) */}
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              const baseX = 90 + i * 60;
              return (
                <g key={ch.key}>
                  {/* 그림자 번짐 */}
                  <path
                    d={`M ${baseX} 60 C ${baseX + 8} 180, ${baseX - 10} 300, ${baseX + 4} 440`}
                    stroke={isActive ? ch.color : "rgba(24,19,15,0.28)"}
                    strokeWidth={isActive ? 8 : 3}
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#m-blur)"
                    opacity="0.35"
                    style={{ transition: "stroke 700ms, stroke-width 700ms" }}
                  />
                  {/* 붓 본선 */}
                  <path
                    d={`M ${baseX} 60 C ${baseX + 8} 180, ${baseX - 10} 300, ${baseX + 4} 440`}
                    stroke={isActive ? ch.color : "rgba(24,19,15,0.45)"}
                    strokeWidth={isActive ? 3 : 1.5}
                    fill="none"
                    strokeLinecap="round"
                    style={{ transition: "stroke 700ms, stroke-width 700ms" }}
                  />
                </g>
              );
            })}
            {/* 낙관(印) 스타일 스퀘어 */}
            <rect
              x="290"
              y="380"
              width="34"
              height="34"
              fill="none"
              stroke="rgba(24,19,15,0.4)"
              strokeWidth="0.8"
            />
          </svg>
          <p
            className="absolute bottom-24 right-8 font-serif italic text-ink/70 lg:right-14"
            style={{ fontSize: "clamp(1.25rem,2.4vw,1.75rem)" }}
          >
            — {c.short}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>M · INK WASH</span>
            <span className="font-serif tabular-nums text-ink/55">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </div>
        <ChaptersRight active={active} setActive={setActive} />
      </div>
    </section>
  );
}
