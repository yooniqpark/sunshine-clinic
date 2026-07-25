"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* J. BLOOM — 4개의 꽃잎(타원) 중앙에서 개화 */
export function VariantJ() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ede4d3] lg:aspect-auto lg:min-h-[720px]">
          <svg
            viewBox="0 0 500 500"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <radialGradient id="j-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={c.color} stopOpacity="0.25" />
                <stop offset="60%" stopColor={c.color} stopOpacity="0.08" />
                <stop offset="100%" stopColor={c.color} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="250" r="240" fill="url(#j-glow)" />
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              const rotate = (i / STD_CHAPTERS.length) * 360;
              return (
                <g
                  key={ch.key}
                  transform={`rotate(${rotate} 250 250)`}
                  style={{ transition: "opacity 700ms" }}
                >
                  <ellipse
                    cx="250"
                    cy="140"
                    rx="60"
                    ry="140"
                    fill="none"
                    stroke={isActive ? ch.color : "rgba(24,19,15,0.18)"}
                    strokeWidth={isActive ? 1.5 : 0.6}
                    style={{
                      filter: isActive ? `drop-shadow(0 0 10px ${ch.color})` : "none",
                      transition: "stroke 700ms, stroke-width 700ms",
                    }}
                  />
                </g>
              );
            })}
            <circle cx="250" cy="250" r="6" fill={c.color} opacity="0.8" />
          </svg>
          <p
            className="absolute left-1/2 top-[62%] -translate-x-1/2 font-serif italic text-ink/70"
            style={{ fontSize: "clamp(1.25rem,2.6vw,2rem)" }}
          >
            {c.short}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>J · BLOOM</span>
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
