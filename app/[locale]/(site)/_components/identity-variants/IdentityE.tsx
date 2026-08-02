"use client";

import { STD_CHAPTERS } from "../standard-variants/SharedChapters";

/**
 * E — RIBBON & ROTOR
 * 키네틱 그래픽 — 챕터 4색 그라디언트 리본이 섹션을 가로질러 흐르고,
 * 중앙엔 회전하는 원형 텍스트 씰. 사람·사진 0.
 */
export function IdentityE() {
  const ringText = "THE SUNSHINE STANDARD · SEOUL · SKIN FIRST · ";

  return (
    <section className="relative overflow-hidden bg-[#f7f1e7] py-36 text-ink lg:py-48">
      <style>{`
        @keyframes sealspin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ribbonshift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-24px)} }
      `}</style>

      {/* 그라디언트 리본 웨이브 */}
      <svg
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="ribbonG" x1="0" y1="0" x2="1" y2="0">
            {STD_CHAPTERS.map((c, i) => (
              <stop key={c.key} offset={`${(i / 3) * 100}%`} stopColor={c.color} />
            ))}
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M -40 ${300 + i * 46} C 260 ${170 + i * 46}, 480 ${430 + i * 46}, 760 ${300 + i * 46} S 1240 ${170 + i * 46}, 1480 ${310 + i * 46}`}
            fill="none"
            stroke="url(#ribbonG)"
            strokeWidth={i === 1 ? 60 : 2}
            opacity={i === 1 ? 0.32 : 0.55}
            style={{ animation: `ribbonshift ${10 + i * 3}s ease-in-out infinite` }}
          />
        ))}
      </svg>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 lg:px-8">
        {/* 회전 씰 */}
        <div className="relative h-44 w-44 lg:h-52 lg:w-52">
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            style={{ animation: "sealspin 26s linear infinite" }}
          >
            <defs>
              <path id="circ" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
            </defs>
            <text
              fill="rgba(28,25,23,0.7)"
              style={{ fontSize: 13.5, letterSpacing: "3.5px", fontWeight: 600 }}
            >
              <textPath href="#circ">{ringText}</textPath>
            </text>
          </svg>
          {/* 씰 코어 — 햇살 그라디언트 */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full lg:h-28 lg:w-28"
            style={{
              background:
                "radial-gradient(circle at 34% 30%, #fff6e8 0%, #f0c9a4 55%, #d99e6f 100%)",
              boxShadow: "0 18px 44px -14px rgba(217,158,111,0.75)",
            }}
          />
        </div>

        <h2 className="mt-14 text-center font-serif text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[1.16]">
          피부를 먼저 보고,
          <br />
          <span className="italic">필요한 만큼만.</span>
        </h2>

        {/* 컬러 인덱스 바 */}
        <div className="mt-14 flex w-full max-w-2xl overflow-hidden rounded-full border border-ink/12 bg-white/50 backdrop-blur">
          {STD_CHAPTERS.map((c) => (
            <div key={c.key} className="group relative flex-1 cursor-pointer py-4 text-center">
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                style={{ background: `${c.color}30` }}
              />
              <span className="relative text-[11px] font-semibold tracking-[0.05em] text-ink/75 lg:text-xs">
                {c.short}
              </span>
              <span
                aria-hidden
                className="absolute inset-x-6 bottom-2 h-[2.5px] rounded-full"
                style={{ background: c.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
