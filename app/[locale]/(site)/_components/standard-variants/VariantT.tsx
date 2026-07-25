"use client";

import { useState } from "react";
import { STD_CHAPTERS } from "./SharedChapters";

/* T. TYPOGRAPHIC WALL — Heyday 스타일: 카피 자체가 히어로, 전체 폭 활용 */
export function VariantT() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{
        background: `linear-gradient(180deg, #f4ede0 0%, ${c.color}22 100%)`,
        transition: "background 900ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* 상단 kicker */}
        <div className="flex items-baseline justify-between gap-6">
          <p className="text-[10px] font-medium tracking-[0.32em] text-ink/50 lg:text-[11px]">
            THE SUNSHINE STANDARD
          </p>
          <p className="font-serif italic text-ink/45 lg:text-lg">
            — Sunshine Skin Clinic
          </p>
        </div>

        {/* 초대형 스테이트먼트 */}
        <h2
          className="mt-16 font-serif font-normal tracking-tight text-ink lg:mt-24"
          style={{
            fontSize: "clamp(3rem, 9vw, 7.5rem)",
            lineHeight: 0.95,
          }}
        >
          Skin, first.
          <br />
          <span className="italic text-ink/55">Only what&apos;s needed.</span>
        </h2>

        {/* Sub statement */}
        <p className="mt-12 max-w-2xl text-base leading-[1.85] text-ink/60 lg:text-lg">
          유행보다 오래가는 아름다움, 화려함보다 건강한 회복. 정직한 진단과
          검증된 근거로 시술을 결정합니다.
        </p>

        {/* 챕터 인라인 리스트 (텍스트 벽) */}
        <div className="mt-20 border-t border-ink/15 lg:mt-28">
          <ul className="divide-y divide-ink/15">
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              return (
                <li
                  key={ch.key}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="grid cursor-pointer grid-cols-[64px_1fr_auto_28px] items-baseline gap-6 py-6 transition"
                >
                  <span
                    className={`font-serif italic transition-all duration-500 ${
                      isActive ? "text-ink" : "text-ink/30"
                    }`}
                    style={{ fontSize: isActive ? "2rem" : "1.5rem" }}
                  >
                    {ch.num}
                  </span>
                  <span
                    className={`font-serif tracking-tight transition-all duration-500 ${
                      isActive ? "text-ink" : "text-ink/35"
                    }`}
                    style={{
                      fontSize: isActive ? "clamp(2rem, 4vw, 3rem)" : "clamp(1.5rem, 3vw, 2.25rem)",
                      lineHeight: 1.05,
                    }}
                  >
                    <span className="italic">— </span>
                    {ch.short}
                  </span>
                  <span
                    className={`hidden text-[11px] font-medium tracking-[0.24em] transition-colors duration-500 md:inline ${
                      isActive ? "text-ink/70" : "text-ink/30"
                    }`}
                  >
                    {ch.key}
                  </span>
                  <span
                    aria-hidden
                    className="justify-self-end h-2 w-2 rounded-full transition-all duration-500"
                    style={{
                      background: isActive ? ch.color : "transparent",
                      border: isActive
                        ? `1px solid ${ch.color}`
                        : "1px solid rgba(24,19,15,0.20)",
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        {/* 하단 라벨 */}
        <div className="mt-16 flex items-center justify-between text-[10px] font-medium tracking-[0.32em] text-ink/40">
          <span>T · TYPOGRAPHIC WALL</span>
          <span className="font-serif tabular-nums text-ink/55">
            {String(active + 1).padStart(2, "0")} / 04
          </span>
        </div>
      </div>
    </section>
  );
}
