"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* S. ORNAMENT SYSTEM — Ever/Body 스타일 시그니처 마크 (원 안의 S가 미세 변주) */
export function VariantS() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  // 챕터별로 원 외곽 획 각도/두께 미세 변주
  const strokeVariants = [
    { dashArray: "none", strokeW: 1, rotate: 0 },
    { dashArray: "2 5", strokeW: 0.8, rotate: 22 },
    { dashArray: "8 4", strokeW: 1.2, rotate: -18 },
    { dashArray: "1 3", strokeW: 0.9, rotate: 40 },
  ];
  const v = strokeVariants[active];

  return (
    <section className="relative bg-[#f4ede0] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div
          className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden lg:aspect-auto lg:min-h-[720px]"
          style={{
            background: `linear-gradient(160deg, #efe8db 0%, ${c.color}22 60%, #ede4d3 100%)`,
            transition: "background 900ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* 반복되는 그리드 (배경 오너먼트) */}
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
          >
            {[80, 160, 240, 320, 400].map((y) => (
              <line key={"h" + y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(24,19,15,0.35)" strokeWidth="0.3" />
            ))}
            {[80, 160, 240, 320].map((x) => (
              <line key={"v" + x} x1={x} y1="0" x2={x} y2="500" stroke="rgba(24,19,15,0.35)" strokeWidth="0.3" />
            ))}
          </svg>

          {/* 시그니처 마크 (원 + S 이니셜) */}
          <div className="relative">
            <svg
              viewBox="0 0 300 300"
              className="h-[260px] w-[260px] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-[340px] lg:w-[340px]"
              style={{ transform: `rotate(${v.rotate}deg)` }}
            >
              {/* Outer ring — 챕터별 dashArray 변주 */}
              <circle
                cx="150"
                cy="150"
                r="145"
                fill="none"
                stroke={c.color}
                strokeWidth={v.strokeW}
                strokeDasharray={v.dashArray}
                style={{ transition: "stroke 700ms, stroke-width 700ms" }}
              />
              {/* Inner ring */}
              <circle
                cx="150"
                cy="150"
                r="120"
                fill="none"
                stroke="rgba(24,19,15,0.20)"
                strokeWidth="0.6"
              />
              {/* Corner brackets */}
              {[
                [50, 50, "M0 20 L0 0 L20 0"],
                [230, 50, "M0 0 L20 0 L20 20"],
                [50, 230, "M0 0 L0 20 L20 20"],
                [230, 230, "M0 20 L20 20 L20 0"],
              ].map(([x, y, d], i) => (
                <path
                  key={i}
                  d={d as string}
                  transform={`translate(${x} ${y})`}
                  stroke={c.color}
                  strokeWidth="1"
                  fill="none"
                  opacity="0.75"
                />
              ))}
            </svg>
            {/* 중앙 세리프 이니셜 — 챕터 짝수/홀수마다 style toggle */}
            <p
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif italic text-ink"
              style={{
                fontSize: "clamp(6rem, 12vw, 9rem)",
                lineHeight: 1,
                textShadow: `0 4px 20px ${c.color}55`,
              }}
            >
              S
            </p>
          </div>

          {/* 상단·하단 라벨 */}
          <p className="absolute left-8 top-8 text-[10px] font-medium tracking-[0.32em] text-ink/50 lg:left-12 lg:top-12">
            THE SUNSHINE STANDARD
          </p>
          <p
            className="absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif italic text-ink/70"
            style={{ fontSize: "clamp(1.25rem,2.2vw,1.75rem)" }}
          >
            {c.short}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>S · ORNAMENT SYSTEM</span>
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
