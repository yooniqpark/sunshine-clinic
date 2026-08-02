"use client";

import { STD_CHAPTERS } from "../standard-variants/SharedChapters";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * H — DAWN STAGE (국내 어워드 스타일)
 * 미모던·프리미엄 K-클리닉 무드 — 초현실 미니멀 씬.
 * 벽의 개구부 너머로 해가 떠오르는 모래 지평선,
 * 바닥엔 브랜드 진주가 떠 있다. 전부 CSS/SVG.
 */
export function IdentityH() {
  return (
    <section
      className="relative overflow-hidden py-24 text-ink lg:py-32"
      style={{ background: "linear-gradient(180deg, #f0eae0 0%, #ece4d6 100%)" }}
    >
      <style>{`
        @keyframes sunGlow { 0%,100%{opacity:0.75; transform:scale(1)} 50%{opacity:1; transform:scale(1.06)} }
        @keyframes pearlFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes hazeDrift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-40px)} }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
          {/* 좌: 브랜드 스토리 */}
          <div className="relative z-10">
            <p className="text-[10px] font-medium tracking-[0.35em] text-ink/55">
              THE SUNSHINE STANDARD
            </p>
            <h2 className="mt-8 font-serif text-[clamp(2.4rem,4.6vw,3.9rem)] font-normal leading-[1.18]">
              햇살처럼
              <br />
              스며드는 아름다움
            </h2>
            <p className="mt-8 max-w-sm text-[15px] leading-[1.95] text-ink/60">
              선샤인은 아침 햇살처럼 부드럽게 밝아지는 피부를 상징합니다.
              정해진 답보다 한 사람의 피부에서 시작해,
              필요한 만큼만 정직하게 진료합니다.
            </p>

            <div className="mt-12 flex flex-col gap-0 border-t border-ink/12">
              {STD_CHAPTERS.map((c) => (
                <div
                  key={c.key}
                  className="group flex cursor-pointer items-center justify-between border-b border-ink/12 py-4 transition-colors hover:bg-white/40"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.2em] text-ink/35">{c.num}</span>
                    <span className="font-serif text-lg text-ink/85">{c.short}</span>
                  </span>
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                    style={{ background: c.color }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 우: 새벽 씬 — 벽 개구부 */}
          <div className="relative">
            <div
              className="relative aspect-[4/4.4] overflow-hidden rounded-[10px] sm:aspect-[4/3.6] lg:aspect-[4/4.1]"
              style={{
                boxShadow:
                  "inset 0 0 0 1px rgba(28,25,23,0.06), 0 40px 90px -50px rgba(120,90,50,0.55)",
              }}
            >
              {/* 하늘 */}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, #f6e7cf 0%, #f7dcb2 38%, #f2c896 62%, #eebd85 100%)",
                }}
              />
              {/* 태양 */}
              <span
                aria-hidden
                className="absolute left-1/2 top-[34%] h-24 w-24 -translate-x-1/2 rounded-full lg:h-28 lg:w-28"
                style={{
                  background:
                    "radial-gradient(circle, #fff8ea 0%, #ffe9bd 55%, rgba(255,222,166,0) 75%)",
                  boxShadow: "0 0 90px 40px rgba(255,226,170,0.75)",
                  animation: "sunGlow 8s ease-in-out infinite",
                }}
              />
              {/* 안개 밴드 */}
              <span
                aria-hidden
                className="absolute inset-x-[-15%] top-[46%] h-16 rounded-full blur-2xl"
                style={{
                  background: "rgba(255,240,214,0.65)",
                  animation: "hazeDrift 14s ease-in-out infinite",
                }}
              />
              {/* 모래 언덕 */}
              <span aria-hidden className="absolute inset-x-[-10%] top-[50%] h-[26%] rounded-[100%] blur-[2px]"
                style={{ background: "linear-gradient(180deg, #eed9b8 0%, #e7cda9 100%)" }} />
              <span aria-hidden className="absolute inset-x-[-6%] top-[62%] h-[46%] rounded-[100%_100%_0_0/40%_40%_0_0]"
                style={{ background: "linear-gradient(180deg, #ecd7b5 0%, #e3ccab 55%, #dfc7a6 100%)" }} />
              {/* 진주 그림자 */}
              <span
                aria-hidden
                className="absolute bottom-[13%] left-1/2 h-5 w-40 -translate-x-1/2 rounded-full blur-[6px]"
                style={{ background: "rgba(120,90,50,0.28)" }}
              />
              {/* 브랜드 진주 */}
              <span
                aria-hidden
                className="absolute bottom-[16%] left-1/2 h-28 w-28 -translate-x-1/2 rounded-full lg:h-32 lg:w-32"
                style={{
                  background:
                    "radial-gradient(circle at 34% 28%, #fffdf8 0%, #f7e7d2 30%, #e9c9a8 60%, #caa27c 85%, #b08a63 100%)",
                  boxShadow:
                    "inset -10px -14px 26px rgba(140,100,60,0.45), inset 8px 10px 20px rgba(255,255,255,0.75), 0 24px 44px -16px rgba(120,90,50,0.5)",
                  animation: "pearlFloat 7s ease-in-out infinite",
                }}
              />
              {/* 렌즈 플레어 */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-[8%] top-[10%] h-40 w-1.5 rotate-[24deg] rounded-full blur-[3px]"
                style={{ background: "linear-gradient(to bottom, rgba(255,210,150,0.55), transparent)" }}
              />
              {/* 그레인 */}
              <span
                aria-hidden
                className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
                style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px" }}
              />
            </div>

            {/* 개구부 양옆 커튼 벽 */}
            <span
              aria-hidden
              className="absolute -left-3 top-[-4%] hidden h-[108%] w-10 rounded-[6px] lg:block"
              style={{
                background: "linear-gradient(90deg, #efe8db 0%, #e6dccb 100%)",
                boxShadow: "12px 0 26px -12px rgba(120,90,50,0.35)",
              }}
            />
            <span
              aria-hidden
              className="absolute -right-3 top-[-4%] hidden h-[108%] w-10 rounded-[6px] lg:block"
              style={{
                background: "linear-gradient(270deg, #efe8db 0%, #e6dccb 100%)",
                boxShadow: "-12px 0 26px -12px rgba(120,90,50,0.35)",
              }}
            />

            {/* 씬 캡션 */}
            <p className="mt-5 text-center font-serif text-[11px] italic tracking-[0.22em] text-ink/45">
              first light, every skin — Sunshine Clinic
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
