"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* N. CRYSTAL FACET — 삼각형 격자 크리스털 */
export function VariantN() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];

  // 4개 챕터에 매핑될 facet의 index (SVG polygon order)
  const facetActiveMap = [0, 3, 6, 9]; // 각 챕터가 밝게 빛나는 facet index

  const facets = [
    { pts: "200,60 130,180 200,180", i: 0 },
    { pts: "200,60 270,180 200,180", i: 1 },
    { pts: "130,180 200,180 165,300", i: 2 },
    { pts: "270,180 200,180 235,300", i: 3 },
    { pts: "130,180 60,300 165,300", i: 4 },
    { pts: "270,180 340,300 235,300", i: 5 },
    { pts: "165,300 235,300 200,420", i: 6 },
    { pts: "60,300 165,300 100,420", i: 7 },
    { pts: "235,300 340,300 300,420", i: 8 },
    { pts: "165,300 200,420 100,420", i: 9 },
    { pts: "235,300 300,420 200,420", i: 10 },
  ];

  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#efe8db] lg:aspect-auto lg:min-h-[720px]">
          <svg
            viewBox="0 0 400 480"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            {facets.map((f) => {
              const isChActive = facetActiveMap[active] === f.i;
              return (
                <polygon
                  key={f.i}
                  points={f.pts}
                  fill={isChActive ? c.color + "35" : "rgba(24,19,15,0.02)"}
                  stroke={isChActive ? c.color : "rgba(24,19,15,0.20)"}
                  strokeWidth={isChActive ? 1.5 : 0.5}
                  style={{
                    transition: "fill 700ms, stroke 700ms, stroke-width 700ms",
                    filter: isChActive
                      ? `drop-shadow(0 0 8px ${c.color}80)`
                      : "none",
                  }}
                />
              );
            })}
          </svg>
          <p
            className="absolute bottom-20 left-1/2 -translate-x-1/2 font-serif italic text-ink/70"
            style={{ fontSize: "clamp(1.25rem,2.4vw,1.75rem)" }}
          >
            {c.short}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>N · CRYSTAL FACET</span>
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
