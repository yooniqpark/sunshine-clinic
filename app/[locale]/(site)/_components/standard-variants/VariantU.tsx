"use client";

import { useState } from "react";
import { STD_CHAPTERS } from "./SharedChapters";

/* U. KINETIC MARQUEE — 톡스앤필·브랜뉴클리닉 톤:
   흐르는 초대형 세리프 마퀴 4밴드. 비활성은 아웃라인 타이포,
   활성 밴드만 브랜드 컬러로 채워지며 흐른다. */
export function VariantU() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];

  return (
    <section className="relative overflow-hidden bg-[#f2ebde] text-ink">
      <style>{`
        @keyframes std-marquee-l { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes std-marquee-r { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
      `}</style>

      {/* Kicker */}
      <div className="mx-auto max-w-7xl px-5 pt-16 lg:px-8 lg:pt-24">
        <div className="flex items-baseline justify-between gap-6">
          <p className="text-[10px] font-medium tracking-[0.32em] text-ink/55 lg:text-[11px]">
            THE SUNSHINE STANDARD
          </p>
          <p className="hidden font-serif italic text-ink/45 sm:block">
            피부를 먼저 보고, 필요한 만큼만.
          </p>
        </div>
      </div>

      {/* Marquee bands */}
      <div className="mt-10 flex flex-col lg:mt-14">
        {STD_CHAPTERS.map((ch, i) => {
          const isActive = i === active;
          const dir = i % 2 === 0 ? "std-marquee-l" : "std-marquee-r";
          const phrase = `${ch.key} — ${ch.short} — `;
          return (
            <button
              key={ch.key}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="group relative block w-full cursor-pointer overflow-hidden border-t border-ink/10 py-2 text-left last:border-b lg:py-3"
              aria-label={ch.short}
            >
              <div
                className="flex w-max whitespace-nowrap will-change-transform"
                style={{
                  animation: `${dir} ${isActive ? 26 : 60}s linear infinite`,
                }}
              >
                {[0, 1].map((dup) => (
                  <span
                    key={dup}
                    aria-hidden={dup === 1}
                    className="font-serif font-normal leading-[1.05] tracking-tight transition-colors duration-700"
                    style={{
                      fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
                      color: isActive ? ch.color : "transparent",
                      WebkitTextStroke: isActive
                        ? "0px transparent"
                        : "1px rgba(33,28,23,0.28)",
                    }}
                  >
                    {phrase.repeat(3)}
                  </span>
                ))}
              </div>
              {/* 활성 밴드 좌측 인덱스 */}
              <span
                className={`pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-medium tracking-[0.28em] transition-opacity duration-500 lg:left-8 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                style={{ color: ch.color }}
              >
                {ch.num}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom copy */}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 pb-16 pt-10 sm:flex-row sm:items-end sm:justify-between lg:px-8 lg:pb-24 lg:pt-14">
        <p className="max-w-md text-sm leading-[1.85] text-ink/65">
          유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을.
          시술을 정하기 전에 지금의 피부와 원하는 변화의 방향을 충분히
          이해합니다.
        </p>
        <p
          className="font-serif tabular-nums transition-colors duration-700"
          style={{ fontSize: "1.25rem", color: c.color }}
        >
          {String(active + 1).padStart(2, "0")}{" "}
          <span className="text-ink/30">/ 04 — {c.short}</span>
        </p>
      </div>
    </section>
  );
}
