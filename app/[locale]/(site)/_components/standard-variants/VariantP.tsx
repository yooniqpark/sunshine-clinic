"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* P. CASCADE — 얼굴 실루엣 4겹이 살짝씩 어긋나게 반복 (모션 잔상) */
export function VariantP() {
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
              background: `radial-gradient(ellipse at 50% 45%, ${c.color}25 0%, ${c.color}08 30%, rgba(0,0,0,0) 70%)`,
            }}
          />

          {/* 4겹 잔상 얼굴 */}
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              const offset = i * 12;
              const stroke = isActive
                ? ch.color
                : `rgba(255,240,220,${0.35 - i * 0.06})`;
              return (
                <g
                  key={ch.key}
                  transform={`translate(${offset} ${offset * 0.4})`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isActive ? 1.2 : 0.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transition: "stroke 700ms, stroke-width 700ms",
                    filter: isActive
                      ? `drop-shadow(0 0 8px ${ch.color})`
                      : "none",
                  }}
                >
                  {/* 긴 머리 */}
                  <path
                    d="M228 78 C 250 85, 258 120, 254 160 C 250 200, 244 240, 240 280 C 236 320, 230 360, 226 400"
                    opacity="0.5"
                  />
                  {/* 얼굴 프로필 */}
                  <path d="M228 82 C 214 74, 196 72, 180 78 C 158 86, 144 108, 138 132 C 134 156, 138 180, 142 198 C 144 208, 146 216, 144 224 C 140 236, 130 244, 128 254 C 126 266, 132 276, 146 282 L 158 288 L 160 306 C 162 322, 168 336, 178 348 C 186 358, 196 366, 204 372" />
                  {/* 앞머리 */}
                  <path d="M182 84 C 198 74, 220 68, 240 78" opacity="0.6" />
                  {/* 눈 */}
                  <path d="M158 168 C 164 162, 178 162, 186 168" strokeWidth="1.1" />
                  {/* 코 */}
                  <path d="M148 175 C 142 195, 138 210, 144 216" />
                  {/* 입술 */}
                  <path d="M152 244 C 160 240, 174 240, 180 244" opacity="0.85" />
                  {/* 목 */}
                  <path d="M204 372 L 198 420 L 232 420" opacity="0.75" />
                </g>
              );
            })}
          </svg>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream/60 lg:px-10">
            <span>P · CASCADE</span>
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
