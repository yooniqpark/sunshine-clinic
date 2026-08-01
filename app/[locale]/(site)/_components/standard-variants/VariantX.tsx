"use client";

import { useState } from "react";
import { STD_CHAPTERS } from "./SharedChapters";

/* X. AURORA GLOW — 오라클피부과·포레브 톤:
   아이보리 배경 위 챕터 컬러의 대형 블러 오브가 숨쉬듯 번지는 글로우 스킨 무드.
   센터 정렬 세리프 카피 + 글래스 필(pill) 챕터 내비게이션. */
export function VariantX() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];

  return (
    <section className="relative overflow-hidden bg-cream text-ink">
      <style>{`
        @keyframes std-breathe-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(4%, -3%) scale(1.12); } }
        @keyframes std-breathe-b { 0%,100% { transform: translate(0,0) scale(1.05); } 50% { transform: translate(-5%, 4%) scale(0.95); } }
      `}</style>

      {/* Glow orbs — 활성 챕터 컬러로 전환 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 top-8 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background: c.color,
          opacity: 0.28,
          animation: "std-breathe-a 9s ease-in-out infinite",
          transition: "background 1200ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background: c.color,
          opacity: 0.18,
          animation: "std-breathe-b 11s ease-in-out infinite",
          transition: "background 1200ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center lg:py-36">
        <p className="text-[10px] font-medium tracking-[0.32em] text-ink/55 lg:text-[11px]">
          THE SUNSHINE STANDARD
        </p>
        <h2 className="mt-8 font-serif text-4xl font-normal leading-[1.2] tracking-tight lg:text-6xl">
          피부를 먼저 보고,
          <br />
          <span
            className="italic transition-colors duration-1000"
            style={{ color: c.color }}
          >
            필요한 만큼만.
          </span>
        </h2>
        <p className="mt-8 max-w-lg text-sm leading-[1.85] text-ink/60 lg:text-[15px]">
          유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을 지향하며
          시술을 정하기 전에 지금의 피부와 원하는 변화의 방향을 충분히
          이해합니다.
        </p>

        {/* 글래스 pill 챕터 내비 */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {STD_CHAPTERS.map((ch, i) => {
            const isActive = i === active;
            return (
              <button
                key={ch.key}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="rounded-full border px-5 py-2.5 backdrop-blur transition-all duration-500"
                style={{
                  borderColor: isActive ? ch.color : "rgba(33,28,23,0.18)",
                  background: isActive ? `${ch.color}1f` : "rgba(255,255,255,0.45)",
                }}
              >
                <span
                  className="text-xs font-medium tracking-[0.08em] transition-colors duration-500 lg:text-[13px]"
                  style={{ color: isActive ? ch.color : "rgba(33,28,23,0.5)" }}
                >
                  <span className="mr-2 tabular-nums opacity-70">{ch.num}</span>
                  {ch.short}
                </span>
              </button>
            );
          })}
        </div>

        {/* 활성 챕터 영문 키 */}
        <p
          className="mt-10 text-[10px] font-medium tracking-[0.36em] transition-colors duration-700 lg:text-[11px]"
          style={{ color: c.color }}
        >
          {c.key}
        </p>
      </div>
    </section>
  );
}
