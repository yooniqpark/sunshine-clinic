"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* C. TEXTURE — 대리석/유리 재질 톤 (사진 없이 그라디언트로) + 오너먼트 */
export function VariantC() {
  const [active, setActive] = useState(0);
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — texture panel */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e8dfd0] lg:aspect-auto lg:min-h-[720px]">
          {/* 대리석 톤: 여러 라운드 그라디언트로 표현 */}
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse at 25% 20%, rgba(255,248,235,0.9) 0%, transparent 45%)",
                "radial-gradient(ellipse at 75% 60%, rgba(232,205,175,0.7) 0%, transparent 50%)",
                "radial-gradient(ellipse at 40% 85%, rgba(196,144,116,0.35) 0%, transparent 50%)",
                "radial-gradient(ellipse at 90% 15%, rgba(212,180,145,0.55) 0%, transparent 40%)",
              ].join(", "),
            }}
          />
          {/* 대리석 veining — 얇은 곡선 */}
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          >
            <g fill="none" stroke="rgba(154,110,84,0.35)" strokeWidth="0.6">
              <path d="M0 120 C 80 100, 160 140, 260 110 C 320 90, 380 130, 400 120" />
              <path d="M0 260 C 90 240, 180 280, 280 250 C 340 230, 380 260, 400 250" />
              <path d="M20 380 C 110 360, 200 400, 300 370 C 360 350, 400 380, 400 370" />
            </g>
            <g fill="none" stroke="rgba(196,144,116,0.25)" strokeWidth="0.4">
              <path d="M0 60 C 100 80, 200 55, 320 75 C 360 82, 400 65, 400 70" />
              <path d="M0 200 C 90 220, 180 195, 300 215 C 360 225, 400 205, 400 210" />
              <path d="M0 340 C 100 320, 200 355, 300 335 C 360 325, 400 340, 400 335" />
            </g>
          </svg>

          {/* 중앙 원형 오너먼트 (골드 링) */}
          <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-brand-dark/25"
            />
            <span
              aria-hidden
              className="absolute inset-[10%] rounded-full border border-brand-dark/20"
            />
            {/* 4 앵커 마커 원 위에 배치 */}
            {STD_CHAPTERS.map((c, i) => {
              const isActive = i === active;
              const angle = (i / STD_CHAPTERS.length) * Math.PI * 2 - Math.PI / 2;
              const r = 42; // %
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              return (
                <div
                  key={c.key}
                  aria-hidden
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                    isActive ? "scale-125 opacity-100" : "scale-100 opacity-45"
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span
                    className="block h-3 w-3 rounded-full"
                    style={{
                      background: c.color,
                      boxShadow: isActive
                        ? `0 0 0 4px ${c.color}25, 0 0 14px ${c.color}80`
                        : `0 0 0 2px ${c.color}15`,
                    }}
                  />
                  <p
                    className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium tracking-[0.24em] transition-colors ${
                      isActive ? "text-ink" : "text-ink/50"
                    }`}
                  >
                    {c.key.split(" · ")[0]}
                  </p>
                </div>
              );
            })}
            {/* 중앙 세리프 이니셜 */}
            <p
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif italic text-ink/25"
              style={{ fontSize: "8rem", lineHeight: 1 }}
            >
              S
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>C · MATERIAL</span>
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
