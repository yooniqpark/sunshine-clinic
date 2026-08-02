"use client";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * J — PEARL IN THE DARK
 * 다크 럭셔리 무대 — 어둠 속 한 줄기 신광(god ray)이
 * 브랜드 진주 하나를 비춘다. 카피 한 줄.
 */
export function IdentityJ() {
  return (
    <section className="relative h-[92vh] min-h-[620px] overflow-hidden bg-[#12100d] text-cream">
      <style>{`
        @keyframes jRay { 0%,100%{opacity:0.55} 50%{opacity:0.9} }
        @keyframes jPearl { 0%,100%{transform:translate(-50%,0) rotate(0.001deg)} 50%{transform:translate(-50%,-14px) rotate(0.001deg)} }
        @keyframes jDust { 0%{transform:translateY(0); opacity:0} 12%{opacity:0.7} 100%{transform:translateY(-140px); opacity:0} }
      `}</style>

      {/* 신광 — 위에서 진주로 떨어지는 빛기둥 */}
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-[75%] w-[420px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,232,190,0.5) 0%, rgba(255,225,175,0.22) 55%, rgba(255,225,175,0) 100%)",
          clipPath: "polygon(38% 0, 62% 0, 92% 100%, 8% 100%)",
          filter: "blur(6px)",
          animation: "jRay 7s ease-in-out infinite",
        }}
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-[70%] w-40 -translate-x-1/2 blur-2xl"
        style={{ background: "rgba(255,230,185,0.22)" }}
      />

      {/* 빛 속 먼지 입자 */}
      {[18, 42, 58, 30, 66].map((x, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute h-1 w-1 rounded-full bg-[#ffe9c2]"
          style={{
            left: `calc(50% + ${x - 42}px)`,
            top: `${38 + (i % 3) * 9}%`,
            animation: `jDust ${5 + i * 1.4}s linear ${i * 1.1}s infinite`,
          }}
        />
      ))}

      {/* 바닥 반사 */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[26%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,226,175,0.18) 0%, transparent 60%)",
        }}
      />

      {/* 진주 그림자 + 진주 */}
      <span
        aria-hidden
        className="absolute bottom-[17%] left-1/2 h-5 w-52 -translate-x-1/2 rounded-full blur-[10px]"
        style={{ background: "rgba(0,0,0,0.6)" }}
      />
      <span
        aria-hidden
        className="absolute bottom-[20%] left-1/2 h-40 w-40 rounded-full lg:h-48 lg:w-48"
        style={{
          background:
            "radial-gradient(circle at 34% 26%, #fff8ec 0%, #f3ddc0 26%, #d9b48c 55%, #a57f58 82%, #7d5f42 100%)",
          boxShadow:
            "inset -16px -20px 40px rgba(0,0,0,0.55), inset 12px 14px 30px rgba(255,246,230,0.7), 0 40px 80px -24px rgba(0,0,0,0.8), 0 0 70px rgba(255,226,175,0.28)",
          animation: "jPearl 8s ease-in-out infinite",
        }}
      />

      {/* 카피 */}
      <div className="absolute inset-x-0 bottom-[8%] text-center">
        <p className="text-[10px] font-medium tracking-[0.4em] text-cream/45">
          THE SUNSHINE STANDARD
        </p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,4vw,3.4rem)] font-normal leading-[1.22]">
          어둠 속에서도, <span className="italic text-[#eed3ab]">빛나는 것</span>은 피부입니다
        </h2>
      </div>

      {/* 그레인 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "170px 170px" }}
      />
    </section>
  );
}
