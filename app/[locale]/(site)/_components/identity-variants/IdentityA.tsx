"use client";

import { STD_CHAPTERS } from "../standard-variants/SharedChapters";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * A — AURA FIELD
 * 미국 코스메틱-메드스파 트렌드: 유기적 그라디언트 오라 + 필름 그레인.
 * 챕터 4색이 천천히 유영하는 컬러 필드. 사람 없음, 빛과 색만.
 */
export function IdentityA() {
  return (
    <section className="relative overflow-hidden bg-[#f7f1e7] py-32 text-ink lg:py-44">
      <style>{`
        @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,-40px) scale(1.15)} }
        @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1.1)} 50%{transform:translate(-70px,50px) scale(0.95)} }
        @keyframes blobC { 0%,100%{transform:translate(0,0) scale(0.95)} 50%{transform:translate(40px,60px) scale(1.12)} }
        @keyframes blobD { 0%,100%{transform:translate(0,0) scale(1.05)} 50%{transform:translate(-50px,-55px) scale(0.9)} }
      `}</style>

      {/* 오라 블롭 4색 */}
      {STD_CHAPTERS.map((c, i) => (
        <span
          key={c.key}
          aria-hidden
          className="pointer-events-none absolute rounded-full blur-[110px]"
          style={{
            width: 460,
            height: 460,
            left: ["4%", "58%", "30%", "72%"][i],
            top: ["6%", "-6%", "48%", "42%"][i],
            background: c.color,
            opacity: 0.5,
            animation: `blob${"ABCD"[i]} ${16 + i * 3}s ease-in-out infinite`,
          }}
        />
      ))}
      {/* 필름 그레인 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <p className="text-[10px] font-medium tracking-[0.35em] text-ink/55">
          THE SUNSHINE STANDARD
        </p>
        <h2 className="mt-10 font-serif text-[clamp(2.6rem,6vw,4.8rem)] font-normal leading-[1.14]">
          피부를 먼저 보고,
          <br />
          <span className="italic">필요한 만큼만.</span>
        </h2>

        {/* 미니멀 칩 — 색점만 */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {STD_CHAPTERS.map((c) => (
            <span key={c.key} className="inline-flex items-center gap-2.5 text-[13px] font-medium text-ink/70">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: c.color, boxShadow: `0 0 14px ${c.color}` }}
              />
              {c.short}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
