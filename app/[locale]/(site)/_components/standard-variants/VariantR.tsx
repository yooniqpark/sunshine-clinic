"use client";

import { useState } from "react";
import { STD_CHAPTERS } from "./SharedChapters";

/* R. EDITORIAL STATEMENT — Alchemy 43 톤: 대형 세리프 카피 + 좌측 텍스처 + 넘버링 원칙 */
export function VariantR() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section className="relative bg-[#f4ede0] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr]">
        {/* Left — texture / warm wash (없는 사진 대신) */}
        <div
          className="relative aspect-[3/4] w-full overflow-hidden lg:aspect-auto lg:min-h-[760px]"
          style={{
            background: `linear-gradient(155deg, #e8dfd0 0%, ${c.color}25 55%, #efe8db 100%)`,
            transition: "background 900ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* subtle veining */}
          <svg
            viewBox="0 0 300 400"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full opacity-40"
          >
            <g fill="none" stroke="rgba(154,110,84,0.35)" strokeWidth="0.5">
              <path d="M0 100 C 60 80, 120 130, 200 100 C 240 82, 280 118, 300 108" />
              <path d="M0 220 C 70 200, 140 240, 220 210 C 260 195, 290 220, 300 215" />
              <path d="M20 320 C 90 300, 160 340, 240 310 C 280 295, 300 320, 300 315" />
            </g>
          </svg>
          {/* Top-left kicker */}
          <div className="absolute left-8 top-8 lg:left-12 lg:top-12">
            <p className="text-[10px] font-medium tracking-[0.32em] text-ink/50 lg:text-[11px]">
              THE SUNSHINE STANDARD
            </p>
            <p className="mt-2 font-serif italic text-ink/45">— 진료의 기준</p>
          </div>
          {/* Bottom-right signature */}
          <div className="absolute bottom-8 right-8 flex flex-col items-end lg:bottom-12 lg:right-12">
            <span
              aria-hidden
              className="h-px w-16 transition-colors duration-700"
              style={{ background: c.color }}
            />
            <p
              className="mt-3 font-serif italic text-ink/55"
              style={{ fontSize: "clamp(1.5rem,2.4vw,1.75rem)" }}
            >
              {c.short}
            </p>
          </div>
        </div>

        {/* Right — 대형 세리프 스테이트먼트 + 넘버링 원칙 */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
          <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-tight text-ink lg:text-[4.5rem] lg:leading-[1.02]">
            The best work
            <br />
            <span className="italic text-ink/55">goes unnoticed.</span>
          </h2>
          <p className="mt-8 max-w-lg text-sm leading-[1.85] text-ink/60 lg:text-base">
            정해진 답보다 한 사람의 피부에서 시작합니다. 유행보다는 오래가는
            결과, 화려함보다는 건강한 회복 — 선샤인의 진료 기준입니다.
          </p>

          <ul className="mt-16 border-t border-ink/15">
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              return (
                <li
                  key={ch.key}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="grid cursor-pointer grid-cols-[52px_1fr_auto] items-baseline gap-6 border-b border-ink/15 py-5 transition"
                >
                  <span
                    className={`font-serif italic transition-colors duration-500 ${
                      isActive ? "text-ink" : "text-ink/35"
                    }`}
                    style={{ fontSize: "1.5rem" }}
                  >
                    {ch.num}
                  </span>
                  <div>
                    <p
                      className={`font-serif transition-colors duration-500 ${
                        isActive ? "text-ink" : "text-ink/45"
                      }`}
                      style={{ fontSize: "1.5rem", lineHeight: 1.1 }}
                    >
                      {ch.short}
                    </p>
                    <p
                      className={`mt-1 text-[10px] font-medium tracking-[0.28em] transition-colors duration-500 ${
                        isActive ? "text-ink/60" : "text-ink/30"
                      }`}
                    >
                      {ch.key}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full transition-all duration-500"
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
      </div>
    </section>
  );
}
