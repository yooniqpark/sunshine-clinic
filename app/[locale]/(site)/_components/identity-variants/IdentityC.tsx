"use client";

import { STD_CHAPTERS } from "../standard-variants/SharedChapters";

/**
 * C — GLASS PEARLS
 * 다크 럭셔리 + 글래스모피즘. 브랜드 진주 모티프 —
 * 유리질 3D 펄 4개가 부유, 각 펄 = 챕터 컬러 코어.
 */
export function IdentityC() {
  return (
    <section className="relative overflow-hidden bg-[#171310] py-32 text-cream lg:py-40">
      <style>{`
        @keyframes pfloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes pglow { 0%,100%{opacity:0.45} 50%{opacity:0.8} }
      `}</style>

      {/* 바닥 반사광 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(224,177,140,0.16) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <p className="text-center text-[10px] font-medium tracking-[0.35em] text-cream/50">
          THE SUNSHINE STANDARD
        </p>
        <h2 className="mx-auto mt-8 max-w-2xl text-center font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-normal leading-[1.2]">
          피부를 먼저 보고,
          <br />
          <span className="italic text-[#e8c9a8]">필요한 만큼만.</span>
        </h2>

        {/* 펄 4개 */}
        <div className="mt-24 grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-6">
          {STD_CHAPTERS.map((c, i) => (
            <div
              key={c.key}
              className="flex flex-col items-center"
              style={{ animation: `pfloat ${5 + i * 0.8}s ease-in-out infinite` }}
            >
              {/* 글래스 펄 */}
              <div className="relative h-36 w-36 lg:h-44 lg:w-44">
                {/* 후광 */}
                <span
                  aria-hidden
                  className="absolute inset-[-22%] rounded-full blur-2xl"
                  style={{ background: `${c.color}40`, animation: `pglow ${6 + i}s ease-in-out infinite` }}
                />
                {/* 구체 */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.28) 14%, ${c.color}55 45%, ${c.color}22 68%, rgba(15,12,10,0.6) 100%)`,
                    boxShadow: `inset -14px -18px 34px rgba(0,0,0,0.5), inset 10px 12px 26px rgba(255,255,255,0.22), 0 26px 48px -18px ${c.color}66`,
                    border: "1px solid rgba(255,255,255,0.14)",
                    backdropFilter: "blur(4px)",
                  }}
                />
                {/* 하이라이트 */}
                <span
                  aria-hidden
                  className="absolute left-[24%] top-[16%] h-7 w-10 -rotate-[24deg] rounded-full bg-white/70 blur-[7px]"
                />
                {/* 번호 */}
                <span className="absolute inset-0 grid place-items-center font-serif text-xl text-white/85">
                  {c.num}
                </span>
              </div>
              <p className="mt-7 font-serif text-lg text-cream/90">{c.short}</p>
              <p className="mt-1 text-[9px] font-semibold tracking-[0.26em] text-cream/40">
                {c.key}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
