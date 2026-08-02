"use client";

import { useRef } from "react";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// 잎 클러스터 path — 레이어별 재사용
function Leaves({ opacity, blur, anim, className }: { opacity: number; blur: number; anim: string; className: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{ filter: `blur(${blur}px)`, opacity, animation: anim, transformOrigin: "top center" }}
    >
      <g fill="#3f3222">
        {/* 가지 */}
        <path d="M310 20 C 300 120, 290 260, 300 420 L 306 420 C 298 260, 308 120, 318 20 Z" opacity="0.7" />
        <path d="M300 180 C 240 210, 190 250, 150 310 L 156 316 C 196 258, 244 220, 304 190 Z" opacity="0.6" />
        <path d="M304 260 C 360 290, 410 330, 445 390 L 438 396 C 404 338, 356 300, 298 272 Z" opacity="0.6" />
        {/* 잎 — 갸름한 타원, 방향 제각각 */}
        <ellipse cx="180" cy="160" rx="74" ry="26" transform="rotate(-32 180 160)" />
        <ellipse cx="260" cy="90" rx="66" ry="23" transform="rotate(-8 260 90)" />
        <ellipse cx="380" cy="130" rx="78" ry="27" transform="rotate(22 380 130)" />
        <ellipse cx="452" cy="230" rx="64" ry="22" transform="rotate(38 452 230)" />
        <ellipse cx="130" cy="300" rx="70" ry="24" transform="rotate(-46 130 300)" />
        <ellipse cx="240" cy="350" rx="60" ry="21" transform="rotate(-12 240 350)" />
        <ellipse cx="400 " cy="360" rx="72" ry="25" transform="rotate(28 400 360)" />
        <ellipse cx="320" cy="470" rx="66" ry="23" transform="rotate(10 320 470)" />
        <ellipse cx="170" cy="470" rx="56" ry="20" transform="rotate(-28 170 470)" />
      </g>
    </svg>
  );
}

/**
 * L — GOLDEN HOUR (F 증폭판)
 * 햇살·나뭇잎 그림자 세계관을 화려하게 —
 * 벽을 가로지르는 아치 광창 3개, 신광 스윕, 금빛 입자,
 * 텍스트 위로 흐르는 빛 스윕, 마우스 패럴랙스 그림자.
 */
export function IdentityL() {
  const l1 = useRef<HTMLDivElement | null>(null);
  const l2 = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    if (l1.current) l1.current.style.transform = `translate(${dx * 26}px, ${dy * 14}px)`;
    if (l2.current) l2.current.style.transform = `translate(${dx * -16}px, ${dy * -9}px)`;
  };

  return (
    <section
      onMouseMove={onMove}
      className="relative h-[95vh] min-h-[640px] overflow-hidden text-ink"
      style={{ background: "linear-gradient(155deg, #f2e9d6 0%, #ecdfc4 48%, #e2d0ab 100%)" }}
    >
      <style>{`
        @keyframes lWindow { 0%,100%{opacity:0.55} 50%{opacity:1} }
        @keyframes lSway1 { 0%,100%{rotate:-2.4deg} 50%{rotate:2.8deg} }
        @keyframes lSway2 { 0%,100%{rotate:2deg} 50%{rotate:-2.6deg} }
        @keyframes lSway3 { 0%,100%{rotate:-1.4deg} 50%{rotate:1.8deg} }
        @keyframes lRise { 0%{transform:translateY(30px); opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{transform:translateY(-52vh); opacity:0} }
        @keyframes lTwinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes lShine { 0%{background-position:130% 0} 100%{background-position:-30% 0} }
        @keyframes lRay { 0%,100%{opacity:0.35; transform:rotate(16deg)} 50%{opacity:0.7; transform:rotate(19deg)} }
      `}</style>

      {/* ── 아치 광창 3개 — 벽에 떨어진 빛 */}
      {[
        { left: "8%", w: "17%", h: "72%", delay: 0, tilt: -6 },
        { left: "38%", w: "22%", h: "84%", delay: 2.4, tilt: -7 },
        { left: "72%", w: "18%", h: "76%", delay: 4.8, tilt: -6 },
      ].map((win, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-t-[999px]"
          style={{
            left: win.left,
            width: win.w,
            height: win.h,
            transform: `translateY(-50%) skewX(${win.tilt}deg)`,
            background:
              "linear-gradient(to bottom, rgba(255,244,214,0.95) 0%, rgba(255,235,196,0.5) 55%, rgba(255,235,196,0.08) 100%)",
            boxShadow: "0 0 80px 26px rgba(255,238,200,0.55)",
            filter: "blur(1.5px)",
            animation: `lWindow ${7 + i * 2}s ease-in-out ${win.delay}s infinite`,
          }}
        >
          {/* 창살 */}
          <span className="absolute inset-y-0 left-1/2 w-[7px] -translate-x-1/2 bg-[#d8c19b]/55 blur-[2px]" />
          <span className="absolute inset-x-0 top-[44%] h-[7px] bg-[#d8c19b]/55 blur-[2px]" />
        </div>
      ))}

      {/* ── 신광 스윕 (대각 광선) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[20%] left-[30%] h-[150%] w-64 blur-2xl"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,236,190,0.5), rgba(255,236,190,0))",
          animation: "lRay 9s ease-in-out infinite",
        }}
      />

      {/* ── 나뭇잎 그림자 3겹 (패럴랙스 + 스웨이) */}
      <div ref={l1} className="absolute inset-0 transition-transform duration-300 ease-out">
        <Leaves opacity={0.2} blur={18} anim="lSway1 10s ease-in-out infinite" className="right-[-6%] top-[-8%] w-[52%]" />
        <Leaves opacity={0.15} blur={22} anim="lSway2 13s ease-in-out infinite" className="left-[-10%] bottom-[-14%] w-[46%]" />
      </div>
      <div ref={l2} className="absolute inset-0 transition-transform duration-300 ease-out">
        <Leaves opacity={0.24} blur={7} anim="lSway3 8s ease-in-out infinite" className="right-[16%] top-[26%] w-[26%]" />
      </div>

      {/* ── 금빛 입자 */}
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            left: `${6 + ((i * 41) % 88)}%`,
            bottom: `${4 + ((i * 17) % 30)}%`,
            width: i % 3 === 0 ? 5 : 3,
            height: i % 3 === 0 ? 5 : 3,
            background: "#eec87f",
            boxShadow: "0 0 10px 2px rgba(238,200,127,0.8)",
            animation: `lRise ${9 + (i % 5) * 2.4}s linear ${i * 0.9}s infinite, lTwinkle ${2 + (i % 3)}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* ── 카피 — 빛 스윕 텍스트 */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
        <p className="text-[10px] font-medium tracking-[0.4em] text-ink/50">
          THE SUNSHINE STANDARD
        </p>
        <h2
          className="mx-auto mt-8 max-w-4xl bg-clip-text font-serif text-[clamp(2.8rem,6.5vw,5.6rem)] font-normal leading-[1.12] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(110deg, #221c16 0%, #221c16 38%, #b8862e 50%, #221c16 62%, #221c16 100%)",
            backgroundSize: "220% 100%",
            animation: "lShine 5.5s ease-in-out infinite",
          }}
        >
          햇살처럼 스며드는
          <br />
          아름다움
        </h2>
        <p className="mt-8 font-serif text-[13px] italic tracking-[0.26em] text-ink/55">
          first light, every skin — Sunshine Clinic
        </p>
      </div>

      {/* 그레인 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "170px 170px" }}
      />
    </section>
  );
}
