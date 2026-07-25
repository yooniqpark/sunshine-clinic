"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* D. GEOMETRY — 순수 기하학 (얇은 원 궤도 + 4개 지점 · Bauhaus 톤) */
export function VariantD() {
  const [active, setActive] = useState(0);
  const orbitRotation = active * -20;
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#efe8db] lg:aspect-auto lg:min-h-[720px]">
          {/* Center orbit */}
          <div
            className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translate(-50%,-50%) rotate(${orbitRotation}deg)` }}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-ink/25"
            />
            <span
              aria-hidden
              className="absolute inset-[15%] rounded-full border border-ink/15"
            />
            {STD_CHAPTERS.map((c, i) => {
              const isActive = i === active;
              const angle = (i / STD_CHAPTERS.length) * Math.PI * 2 - Math.PI / 2;
              const r = 50;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              return (
                <div
                  key={c.key}
                  aria-hidden
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                    isActive ? "scale-150 opacity-100" : "scale-100 opacity-40"
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%,-50%) rotate(${-orbitRotation}deg)`,
                  }}
                >
                  <span
                    className="block h-4 w-4 rounded-full"
                    style={{
                      background: c.color,
                      boxShadow: isActive
                        ? `0 0 0 4px ${c.color}20, 0 0 16px ${c.color}90`
                        : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* 세로 얇은 라인 */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-full w-px bg-ink/10"
          />
          <span
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-px bg-ink/10"
          />

          {/* 중앙 텍스트 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-[9px] font-medium tracking-[0.36em] text-ink/40">
              STANDARD
            </p>
            <p
              className="mt-1 font-serif text-2xl italic text-ink/70"
            >
              {STD_CHAPTERS[active].short}
            </p>
          </div>

          {/* 하단 라벨 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>D · GEOMETRY</span>
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
