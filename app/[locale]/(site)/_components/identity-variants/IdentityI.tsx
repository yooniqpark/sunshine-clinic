"use client";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * I — DAWN, FULL BLEED
 * 새벽 씬이 섹션 전체. 모델·탭·리스트 전부 없음.
 * 카피 한 줄 + 브랜드 진주만.
 */
export function IdentityI() {
  return (
    <section className="relative h-[92vh] min-h-[620px] overflow-hidden text-ink">
      <style>{`
        @keyframes iSun { 0%,100%{opacity:0.8; transform:translateX(-50%) scale(1)} 50%{opacity:1; transform:translateX(-50%) scale(1.05)} }
        @keyframes iPearl { 0%,100%{transform:translate(-50%,0)} 50%{transform:translate(-50%,-16px)} }
        @keyframes iHaze { 0%,100%{transform:translateX(-4%)} 50%{transform:translateX(4%)} }
      `}</style>

      {/* 하늘 */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f7ecd8 0%, #f8e3bd 34%, #f4cf9d 58%, #efc28c 78%, #ecbd85 100%)",
        }}
      />

      {/* 태양 */}
      <span
        aria-hidden
        className="absolute left-1/2 top-[30%] h-36 w-36 -translate-x-1/2 rounded-full lg:h-44 lg:w-44"
        style={{
          background:
            "radial-gradient(circle, #fffaf0 0%, #ffedc4 52%, rgba(255,228,175,0) 74%)",
          boxShadow: "0 0 140px 60px rgba(255,228,172,0.8)",
          animation: "iSun 9s ease-in-out infinite",
        }}
      />

      {/* 떠다니는 안개 */}
      <span
        aria-hidden
        className="absolute inset-x-[-10%] top-[48%] h-24 rounded-full blur-3xl"
        style={{ background: "rgba(255,242,215,0.7)", animation: "iHaze 16s ease-in-out infinite" }}
      />

      {/* 모래 지평선 — 3겹 */}
      <span aria-hidden className="absolute inset-x-[-12%] top-[54%] h-[24%] rounded-[100%] blur-[3px]"
        style={{ background: "linear-gradient(180deg, #f0dcbc 0%, #e9d1ae 100%)" }} />
      <span aria-hidden className="absolute inset-x-[-8%] top-[64%] h-[30%] rounded-[100%_100%_0_0/50%_50%_0_0] blur-[1px]"
        style={{ background: "linear-gradient(180deg, #eed9b6 0%, #e5cda9 100%)" }} />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[30%]"
        style={{ background: "linear-gradient(180deg, #ead4b0 0%, #e2c9a3 100%)" }} />

      {/* 진주 그림자 + 진주 */}
      <span
        aria-hidden
        className="absolute bottom-[16%] left-1/2 h-6 w-56 -translate-x-1/2 rounded-full blur-[8px]"
        style={{ background: "rgba(122,90,52,0.3)" }}
      />
      <span
        aria-hidden
        className="absolute bottom-[19%] left-1/2 h-36 w-36 rounded-full lg:h-44 lg:w-44"
        style={{
          background:
            "radial-gradient(circle at 33% 27%, #fffdf9 0%, #f8ead6 28%, #ecd0af 58%, #d0a983 84%, #b78f68 100%)",
          boxShadow:
            "inset -14px -18px 34px rgba(140,100,60,0.45), inset 10px 12px 26px rgba(255,255,255,0.8), 0 30px 60px -20px rgba(122,90,52,0.55)",
          animation: "iPearl 8s ease-in-out infinite",
        }}
      />

      {/* 카피 — 상단 중앙, 한 줄 */}
      <div className="absolute inset-x-0 top-[12%] text-center">
        <p className="text-[10px] font-medium tracking-[0.4em] text-ink/50">
          THE SUNSHINE STANDARD
        </p>
        <h2 className="mt-6 font-serif text-[clamp(2.2rem,4.5vw,3.8rem)] font-normal leading-[1.2]">
          햇살처럼 스며드는 아름다움
        </h2>
        <p className="mt-5 font-serif text-[12px] italic tracking-[0.24em] text-ink/50">
          first light, every skin
        </p>
      </div>

      {/* 그레인 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "170px 170px" }}
      />
    </section>
  );
}
