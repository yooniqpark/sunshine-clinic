"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* L. CONTOUR — 얼굴 등고선(topography) */
export function VariantL() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#efe8db] lg:aspect-auto lg:min-h-[720px]">
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            {/* 여러 겹의 얼굴 실루엣 (등고선처럼 안쪽으로 축소) */}
            {[0, 6, 12, 18, 24, 30, 36, 42].map((offset, i) => {
              const stroke = "rgba(24,19,15," + (0.12 + i * 0.03) + ")";
              return (
                <path
                  key={i}
                  d={`M${228 - offset} ${90 + offset} C ${210 - offset} ${78 + offset}, ${190 - offset} ${76 + offset}, ${175 - offset} ${80 + offset} C ${155 - offset} ${85 + offset}, ${138 - offset} ${100 + offset}, ${130 - offset} ${122 + offset} C ${122 - offset} ${145 + offset}, ${122 - offset} ${175 + offset}, ${130 - offset} ${200 + offset} C ${132 - offset} ${208 + offset}, ${137 - offset} ${215 + offset}, ${138 - offset} ${224 + offset} C ${140 - offset} ${240 + offset}, ${132 - offset} ${250 + offset}, ${130 - offset} ${260 + offset} C ${128 - offset} ${275 + offset}, ${138 - offset} ${288 + offset}, ${154 - offset} ${292 + offset} L ${168 - offset} ${296 + offset} L ${172 - offset} ${320 + offset} C ${174 - offset} ${340 + offset}, ${180 - offset} ${360 + offset}, ${200 - offset} ${372 + offset}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="0.6"
                />
              );
            })}
            {/* 활성 챕터의 강조 등고선 */}
            <path
              d={`M228 90 C 210 78, 190 76, 175 80 C 155 85, 138 100, 130 122 C 122 145, 122 175, 130 200 C 132 208, 137 215, 138 224 C 140 240, 132 250, 130 260 C 128 275, 138 288, 154 292 L 168 296 L 172 320 C 174 340, 180 360, 200 372`}
              fill="none"
              stroke={c.color}
              strokeWidth="1.5"
              style={{
                filter: `drop-shadow(0 0 8px ${c.color})`,
                transition: "stroke 700ms",
              }}
            />
          </svg>
          <p
            className="absolute bottom-20 left-8 font-serif italic text-ink/60 lg:left-12"
            style={{ fontSize: "clamp(1.25rem,2.4vw,1.75rem)" }}
          >
            {c.short}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>L · CONTOUR</span>
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
