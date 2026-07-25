"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* E. LARGE TYPOGRAPHY — 활성 챕터의 대형 세리프 넘버 · 완전 미니멀 */
export function VariantE() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div
          className="relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden p-8 sm:p-12 lg:aspect-auto lg:min-h-[720px] lg:p-16"
          style={{
            background: `linear-gradient(180deg, #f2ebde 0%, ${c.color}25 100%)`,
            transition: "background 800ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* 상단 라벨 */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium tracking-[0.32em] text-ink/50">
              STANDARD
            </p>
            <span
              className="h-2 w-2 rounded-full transition-colors duration-700"
              style={{ background: c.color }}
            />
          </div>

          {/* 중앙 초대형 세리프 넘버 */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <p
              key={c.num}
              className="font-serif font-normal leading-[0.85] tracking-tighter text-ink"
              style={{
                fontSize: "clamp(12rem, 30vw, 22rem)",
                animation:
                  "std-num-in 700ms cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              {c.num}
            </p>
            <p
              key={c.key + "-key"}
              className="mt-4 font-serif italic tracking-tight text-ink/70"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                animation:
                  "std-num-in 800ms 120ms cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              — {c.short}
            </p>
          </div>

          {/* 하단 라벨 */}
          <div className="flex items-center justify-between text-[10px] font-medium tracking-[0.32em] text-ink/40">
            <span>E · TYPOGRAPHY</span>
            <span className="font-serif tabular-nums text-ink/55">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>

          <style>{`@keyframes std-num-in { 0% { opacity: 0; transform: translateY(24px);} 100% { opacity: 1; transform: translateY(0);} }`}</style>
        </div>

        <ChaptersRight active={active} setActive={setActive} />
      </div>
    </section>
  );
}
