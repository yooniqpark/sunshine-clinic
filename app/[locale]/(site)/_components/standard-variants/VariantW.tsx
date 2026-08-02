"use client";

import { useState } from "react";
import { STD_CHAPTERS } from "./SharedChapters";

/* W. CHEONGDAM NOIR — 뮤즈클리닉·글로우클리닉 톤:
   딥 블랙 + 골드 헤어라인 럭셔리. 중앙 세리프 모노그램 S 링,
   활성 챕터에 따라 골드 아크가 회전하고 챕터 컬러 글로우가 스민다. */
const GOLD = "#d3b284";

export function VariantW() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];

  return (
    <section className="relative overflow-hidden bg-[#0d0a07] text-cream">
      {/* 챕터 컬러 앰비언트 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background] duration-[1200ms]"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${c.color}22 0%, rgba(0,0,0,0) 55%)`,
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-8 lg:py-32">
        {/* Left — 모노그램 링 */}
        <div className="relative flex aspect-square max-h-[560px] items-center justify-center">
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full"
          >
            {/* 바깥 헤어라인 링 */}
            <circle
              cx="200"
              cy="200"
              r="168"
              fill="none"
              stroke="rgba(211,178,132,0.25)"
              strokeWidth="0.7"
            />
            <circle
              cx="200"
              cy="200"
              r="132"
              fill="none"
              stroke="rgba(211,178,132,0.15)"
              strokeWidth="0.7"
            />
            {/* 활성 챕터 골드 아크 — 90도씩 회전 */}
            <g
              style={{
                transformOrigin: "200px 200px",
                transform: `rotate(${active * 90}deg)`,
                transition: "transform 900ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <path
                d="M 200 32 A 168 168 0 0 1 318.8 81.2"
                fill="none"
                stroke={GOLD}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="200" cy="32" r="3" fill={GOLD} />
            </g>
            {/* 4방위 챕터 도트 */}
            {STD_CHAPTERS.map((ch, i) => {
              const angle = (i * 90 - 90) * (Math.PI / 180);
              const x = 200 + 168 * Math.cos(angle);
              const y = 200 + 168 * Math.sin(angle);
              const isActive = i === active;
              return (
                <circle
                  key={ch.key}
                  cx={x}
                  cy={y}
                  r={isActive ? 4 : 2}
                  fill={isActive ? ch.color : "rgba(251,248,243,0.3)"}
                  style={{ transition: "all 700ms" }}
                />
              );
            })}
          </svg>
          {/* 중앙 모노그램 */}
          <div className="relative text-center">
            <p
              className="font-serif italic leading-none"
              style={{
                fontSize: "clamp(5rem, 12vw, 9rem)",
                color: GOLD,
              }}
            >
              S
            </p>
            <p className="mt-4 text-[9px] font-medium tracking-[0.4em] text-cream/50 lg:text-[10px]">
              EST. SEOUL
            </p>
            <p
              className="mt-2 font-serif italic transition-colors duration-700"
              style={{ color: c.color, fontSize: "1.1rem" }}
            >
              {c.short}
            </p>
          </div>
        </div>

        {/* Right — 카피 + 챕터 메뉴 */}
        <div className="flex flex-col justify-center">
          <p className="text-[10px] font-medium tracking-[0.32em] lg:text-[11px]" style={{ color: GOLD }}>
            THE SUNSHINE STANDARD
          </p>
          <h2 className="mt-6 font-serif text-3xl font-normal leading-[1.25] tracking-tight lg:text-[2.75rem]">
            피부를 먼저 보고,
            <br />
            <span className="text-cream/50">필요한 만큼만.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-[1.85] text-cream/60">
            유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을
            지향합니다. 정해진 답보다 한 사람의 피부에서 시작하는 선샤인의
            진료 기준.
          </p>

          <ul className="mt-12 border-t border-cream/15">
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              return (
                <li
                  key={ch.key}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="cursor-pointer border-b border-cream/15"
                >
                  <div className="grid grid-cols-[40px_1fr_auto] items-baseline gap-5 py-5">
                    <span
                      className={`text-[11px] font-medium tracking-[0.24em] transition-colors duration-500 ${
                        isActive ? "" : "text-cream/30"
                      }`}
                      style={isActive ? { color: GOLD } : undefined}
                    >
                      {ch.num}
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-4">
                      <span
                        className={`font-serif text-xl tracking-tight transition-colors duration-500 lg:text-2xl ${
                          isActive ? "text-cream" : "text-cream/35"
                        }`}
                      >
                        {ch.key}
                      </span>
                      <span
                        className={`text-sm transition-colors duration-500 ${
                          isActive ? "text-cream/70" : "text-cream/30"
                        }`}
                      >
                        {ch.short}
                      </span>
                    </div>
                    {/* 골드 인디케이터 라인 */}
                    <span
                      aria-hidden
                      className="h-px self-center transition-all duration-500"
                      style={{
                        width: isActive ? 40 : 16,
                        background: isActive ? GOLD : "rgba(251,248,243,0.2)",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
