"use client";

import { useRef, useState } from "react";
import { STD_CHAPTERS } from "../standard-variants/SharedChapters";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// 같은 커맨드 수의 웨이브 path — SMIL 모핑용 (phase만 다르게)
function wave(y: number, amp: number, phase: number) {
  const seg = 360;
  const pts: string[] = [`M -40 ${y + Math.sin(phase) * amp}`];
  for (let i = 0; i <= 4; i++) {
    const x0 = -40 + i * seg;
    const c1 = x0 + seg * 0.33;
    const c2 = x0 + seg * 0.66;
    const x1 = x0 + seg;
    const s = (k: number) => y + Math.sin(phase + (x0 + seg * k) / 150) * amp;
    pts.push(`C ${c1} ${s(0.33)}, ${c2} ${s(0.66)}, ${x1} ${s(1)}`);
  }
  return pts.join(" ");
}

/**
 * B — CONTOUR SCIENCE v2
 * 다크 풀블리드 지형도. 등고선이 실제로 물결치고(SMIL 모프),
 * 스캔 빔이 깊이를 훑고, 활성 챕터 라인은 발광 + 두꺼워진다.
 * 마우스를 따라 스포트라이트가 지형을 비춘다.
 */
export function IdentityB() {
  const [active, setActive] = useState(3);
  const spotRef = useRef<HTMLSpanElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = spotRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.transform = `translate(${e.clientX - r.left - 260}px, ${e.clientY - r.top - 260}px)`;
  };

  const c = STD_CHAPTERS[active];

  return (
    <section
      onMouseMove={onMove}
      className="relative overflow-hidden bg-[#14100d] py-24 text-cream lg:py-32"
    >
      <style>{`
        @keyframes scanY { 0%{top:6%} 50%{top:88%} 100%{top:6%} }
        @keyframes pulseGlow { 0%,100%{opacity:0.75} 50%{opacity:1} }
      `}</style>

      {/* 마우스 스포트라이트 */}
      <span
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[520px] w-[520px] rounded-full transition-transform duration-100 ease-out"
        style={{
          background: `radial-gradient(circle, ${c.color}2e 0%, transparent 62%)`,
        }}
      />

      {/* 등고선 필드 */}
      <svg
        viewBox="0 0 1400 760"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* 배경 등고선 — 미세 웨이브 모핑 */}
        {Array.from({ length: 18 }, (_, i) => {
          const y = 40 + i * 40;
          const amp = 10 + (i % 4) * 5;
          return (
            <path key={i} fill="none" stroke="rgba(246,240,229,0.09)" strokeWidth="1">
              <animate
                attributeName="d"
                dur={`${9 + (i % 5) * 2}s`}
                repeatCount="indefinite"
                values={`${wave(y, amp, i)};${wave(y, amp, i + Math.PI)};${wave(y, amp, i)}`}
              />
            </path>
          );
        })}
        {/* 챕터 깊이 라인 */}
        {STD_CHAPTERS.map((ch, i) => {
          const y = 140 + i * 155;
          const on = i === active;
          return (
            <g key={ch.key}>
              {/* 글로우 언더레이 */}
              {on && (
                <path fill="none" stroke={ch.color} strokeWidth="10" opacity="0.18">
                  <animate
                    attributeName="d"
                    dur="7s"
                    repeatCount="indefinite"
                    values={`${wave(y, 26, i * 2)};${wave(y, 26, i * 2 + Math.PI)};${wave(y, 26, i * 2)}`}
                  />
                </path>
              )}
              <path
                fill="none"
                stroke={ch.color}
                strokeWidth={on ? 3 : 1.3}
                opacity={on ? 1 : 0.4}
                style={{
                  transition: "stroke-width 500ms, opacity 500ms",
                  filter: on ? `drop-shadow(0 0 10px ${ch.color})` : "none",
                  animation: on ? "pulseGlow 3s ease-in-out infinite" : "none",
                }}
              >
                <animate
                  attributeName="d"
                  dur="7s"
                  repeatCount="indefinite"
                  values={`${wave(y, 26, i * 2)};${wave(y, 26, i * 2 + Math.PI)};${wave(y, 26, i * 2)}`}
                />
              </path>
            </g>
          );
        })}
      </svg>

      {/* 스캔 빔 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(246,240,229,0.5) 50%, transparent)",
          boxShadow: "0 0 24px 2px rgba(246,240,229,0.25)",
          animation: "scanY 11s ease-in-out infinite",
        }}
      />

      {/* 필름 그레인 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      {/* 우측 깊이 눈금 */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-[4.4rem] text-[9px] font-semibold tracking-[0.25em] text-cream/30 lg:flex">
        <span>0.1 MM — SURFACE</span>
        <span>1.5 MM — DERMIS</span>
        <span>3.0 MM — SUBCUTIS</span>
        <span>4.5 MM — SMAS</span>
      </div>

      {/* 콘텐츠 */}
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium tracking-[0.35em] text-cream/50">
            THE SUNSHINE STANDARD
          </p>
          <p className="hidden font-serif text-[11px] italic tracking-[0.15em] text-cream/40 sm:block">
            Skin · Depth · Map
          </p>
        </div>

        <h2 className="mt-20 max-w-2xl font-serif text-[clamp(2.6rem,5.5vw,4.6rem)] font-normal leading-[1.12] lg:mt-24">
          깊이를 알아야,
          <br />
          <span className="italic transition-colors duration-500" style={{ color: c.color }}>
            필요한 만큼만.
          </span>
        </h2>

        {/* 챕터 셀렉터 — 깊이 순 */}
        <div className="mt-24 grid grid-cols-2 gap-3 lg:mt-32 lg:grid-cols-4">
          {STD_CHAPTERS.map((ch, i) => {
            const on = i === active;
            return (
              <button
                key={ch.key}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group relative overflow-hidden rounded-2xl border p-5 text-left backdrop-blur-sm transition-all duration-500 lg:p-6"
                style={{
                  borderColor: on ? `${ch.color}80` : "rgba(246,240,229,0.12)",
                  background: on ? `${ch.color}16` : "rgba(246,240,229,0.03)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold tracking-[0.24em] text-cream/40">
                    DEPTH {ch.num}
                  </span>
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full transition-all duration-500"
                    style={{
                      background: ch.color,
                      boxShadow: on ? `0 0 12px ${ch.color}` : "none",
                      transform: on ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                </div>
                <p
                  className="mt-4 font-serif text-lg transition-colors duration-500 lg:text-xl"
                  style={{ color: on ? "#f6f0e5" : "rgba(246,240,229,0.55)" }}
                >
                  {ch.short}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
