"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* K. SUNSHINE RAY — 브랜드 이름과 연결되는 광선 다발 */
export function VariantK() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink lg:aspect-auto lg:min-h-[720px]">
          {/* Ambient sun */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-[background] duration-[900ms]"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, ${c.color}55 0%, ${c.color}18 30%, rgba(0,0,0,0) 65%)`,
            }}
          />
          {/* Sun disc */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[68%] h-40 w-40 -translate-x-1/2 rounded-full transition-[background,box-shadow] duration-[900ms]"
            style={{
              background: `radial-gradient(circle, ${c.color}b0 0%, ${c.color}30 60%, rgba(0,0,0,0) 100%)`,
              boxShadow: `0 0 80px ${c.color}80`,
            }}
          />
          {/* Ray lines */}
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            {Array.from({ length: 18 }).map((_, i) => {
              const angle = -90 + (i - 9) * 5;
              const rad = (angle * Math.PI) / 180;
              const x2 = 200 + Math.cos(rad) * 400;
              const y2 = 340 + Math.sin(rad) * 400;
              const chIdx = i % STD_CHAPTERS.length;
              const isChActive = chIdx === active;
              return (
                <line
                  key={i}
                  x1="200"
                  y1="340"
                  x2={x2}
                  y2={y2}
                  stroke={isChActive ? STD_CHAPTERS[chIdx].color : "rgba(255,240,220,0.08)"}
                  strokeWidth={isChActive ? 0.9 : 0.4}
                  style={{ transition: "stroke 700ms, stroke-width 700ms" }}
                />
              );
            })}
          </svg>
          <p
            className="absolute left-1/2 top-[18%] -translate-x-1/2 text-center font-serif italic text-cream"
            style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)" }}
          >
            {c.short}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream/60 lg:px-10">
            <span>K · SUNSHINE RAY</span>
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
