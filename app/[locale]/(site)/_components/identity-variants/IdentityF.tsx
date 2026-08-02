"use client";

import { STD_CHAPTERS } from "../standard-variants/SharedChapters";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * F — SUNLIGHT & SHADOW
 * 브랜드 이름을 그대로 공간으로 — 오후 햇살이 창을 통해 크림 벽에 드리우고,
 * 나뭇잎 그림자가 천천히 흔들린다. 아치 창 광 패치 + 스웨이 모션.
 */
export function IdentityF() {
  return (
    <section className="relative overflow-hidden py-32 text-ink lg:py-44"
      style={{ background: "linear-gradient(160deg, #f8f2e6 0%, #f3e9d7 55%, #eddfc7 100%)" }}
    >
      <style>{`
        @keyframes sway1 { 0%,100%{transform:rotate(-2deg) translateX(0)} 50%{transform:rotate(2.4deg) translateX(14px)} }
        @keyframes sway2 { 0%,100%{transform:rotate(1.6deg) translateX(0)} 50%{transform:rotate(-2deg) translateX(-18px)} }
        @keyframes beam { 0%,100%{opacity:0.5} 50%{opacity:0.85} }
      `}</style>

      {/* 아치 창으로 들어온 빛 패치 — 살짝 기울어짐 */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-1/2 hidden h-[78%] w-[34%] -translate-y-1/2 lg:block"
        style={{ transform: "translateY(-50%) skewX(-7deg)", animation: "beam 9s ease-in-out infinite" }}
      >
        <div
          className="absolute inset-0 rounded-t-[999px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,243,214,0.95) 0%, rgba(255,236,200,0.55) 55%, rgba(255,236,200,0.12) 100%)",
            filter: "blur(2px)",
            boxShadow: "0 0 90px 30px rgba(255,240,205,0.5)",
          }}
        />
        {/* 창살 그림자 */}
        <span className="absolute inset-y-0 left-1/3 w-[10px] bg-[#d9c5a4]/60 blur-[3px]" />
        <span className="absolute inset-y-0 left-2/3 w-[10px] bg-[#d9c5a4]/60 blur-[3px]" />
        <span className="absolute inset-x-0 top-[46%] h-[10px] bg-[#d9c5a4]/60 blur-[3px]" />
      </div>

      {/* 모바일용 작은 빛 패치 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-8 h-72 w-56 rounded-t-[999px] lg:hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(255,243,214,0.9), rgba(255,236,200,0.1))",
          transform: "skewX(-6deg)",
          filter: "blur(2px)",
        }}
      />

      {/* 흔들리는 나뭇잎 그림자 */}
      <svg
        viewBox="0 0 600 600"
        aria-hidden
        className="pointer-events-none absolute right-[2%] top-[-4%] hidden w-[44%] opacity-[0.16] lg:block"
        style={{ filter: "blur(14px)", animation: "sway1 9s ease-in-out infinite", transformOrigin: "top center" }}
      >
        <g fill="#4a3a28">
          <ellipse cx="300" cy="120" rx="130" ry="54" transform="rotate(-18 300 120)" />
          <ellipse cx="420" cy="200" rx="110" ry="44" transform="rotate(24 420 200)" />
          <ellipse cx="220" cy="230" rx="96" ry="38" transform="rotate(-32 220 230)" />
          <ellipse cx="360" cy="320" rx="120" ry="46" transform="rotate(12 360 320)" />
          <ellipse cx="180" cy="380" rx="84" ry="34" transform="rotate(-14 180 380)" />
        </g>
      </svg>
      <svg
        viewBox="0 0 600 600"
        aria-hidden
        className="pointer-events-none absolute left-[-6%] bottom-[-10%] w-[38%] opacity-[0.12]"
        style={{ filter: "blur(16px)", animation: "sway2 11s ease-in-out infinite", transformOrigin: "bottom left" }}
      >
        <g fill="#4a3a28">
          <ellipse cx="300" cy="200" rx="150" ry="60" transform="rotate(20 300 200)" />
          <ellipse cx="180" cy="320" rx="110" ry="44" transform="rotate(-24 180 320)" />
          <ellipse cx="400" cy="380" rx="120" ry="48" transform="rotate(8 400 380)" />
        </g>
      </svg>

      {/* 그레인 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <p className="text-[10px] font-medium tracking-[0.35em] text-ink/55">
          THE SUNSHINE STANDARD
        </p>

        <h2 className="mt-12 max-w-2xl font-serif text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.14]">
          빛이 머무는 자리,
          <br />
          피부를 먼저 봅니다.
        </h2>

        <p className="mt-8 max-w-md text-[15px] leading-[1.9] text-ink/60">
          정해진 답보다 한 사람의 피부에서 시작하는 진료.
          필요한 만큼만, 오래가는 아름다움을 지향합니다.
        </p>

        {/* 금박 룰 + 카테고리 */}
        <div className="mt-16 h-px w-24" style={{ background: "linear-gradient(to right, #c9a25e, #e8cf9a)" }} />
        <div className="mt-8 flex flex-wrap gap-3">
          {STD_CHAPTERS.map((c) => (
            <span
              key={c.key}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#d9c5a4]/60 bg-white/35 px-5 py-2.5 text-[12px] font-medium text-ink/75 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60"
            >
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: c.color }} />
              {c.short}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
