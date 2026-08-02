"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// 세로 마퀴 2열 — 실제 보유 장비 제품 컷
const COL_A = [
  "ulthera-prime.png", "shurink-universe.png", "clarity-ii.png", "vbeam.png",
  "carpri-co2.png", "inmode-morpheus.png", "aqua-peel.png",
];
const COL_B = [
  "thermage-flx.png", "inmode.png", "fotona-starwalker.png", "secret-rf.png",
  "mirajet-forte.png", "markview.png", "bellalux.png",
];

const STATS = [
  { value: 26, suffix: "종", label: "정품 본사 장비", sub: "울쎄라 · 써마지 · 슈링크 · 인모드…" },
  { value: 4, suffix: "개 국어", label: "진료 언어", sub: "한국어 · English · 日本語 · 中文" },
  { value: 10, suffix: "F", label: "잠실새내역 도보 3분", sub: "올림픽로 102 서일빌딩" },
  { value: 100, suffix: "%", label: "비급여 정찰 공개", sub: "의료법 제45조 기준 수가표 게시" },
];

/**
 * K — EVIDENCE WALL
 * 무드 대신 증명 — 실보유 장비 제품 컷이 두 줄로 흐르고,
 * 좌측엔 카운트업 스탯. 팩트로 말하는 아이덴티티.
 */
export function IdentityK() {
  const [seen, setSeen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setSeen(true),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-cream py-24 text-ink lg:py-0">
      <style>{`
        @keyframes colUp { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes colDown { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      `}</style>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:min-h-[88vh] lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:px-8">
        {/* 좌: 스탯 */}
        <div className="py-4 lg:py-24">
          <p className="text-[10px] font-medium tracking-[0.35em] text-ink/55">
            THE SUNSHINE STANDARD
          </p>
          <h2 className="mt-8 font-serif text-4xl leading-[1.2] lg:text-5xl">
            말보다,
            <br />
            <span className="italic text-brand-dark">갖춰진 것</span>으로 증명합니다
          </h2>

          <div className="mt-14 grid grid-cols-2 gap-x-10 gap-y-12">
            {STATS.map((s, i) => (
              <div key={s.label}>
                <p className="font-serif text-5xl leading-none text-ink lg:text-6xl">
                  <Count target={s.value} run={seen} delay={i * 150} />
                  <span className="ml-1 text-2xl text-brand-dark lg:text-3xl">{s.suffix}</span>
                </p>
                <p className="mt-3 text-sm font-semibold text-ink/80">{s.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/45">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 우: 장비 세로 마퀴 2열 */}
        <div className="relative h-[520px] overflow-hidden lg:h-[88vh]">
          {/* 상하 페이드 */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-cream to-transparent" />
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-cream to-transparent" />

          <div className="flex h-full gap-5">
            <div className="w-1/2" style={{ animation: "colUp 46s linear infinite" }}>
              {[...COL_A, ...COL_A].map((f, i) => (
                <DeviceCard key={`a${i}`} file={f} />
              ))}
            </div>
            <div className="mt-[-120px] w-1/2" style={{ animation: "colDown 52s linear infinite" }}>
              {[...COL_B, ...COL_B].map((f, i) => (
                <DeviceCard key={`b${i}`} file={f} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeviceCard({ file }: { file: string }) {
  return (
    <div className="mb-5 overflow-hidden rounded-[18px] border border-ink/[0.07] bg-[#f7f2e9]">
      <div className="relative aspect-[4/5]">
        <Image
          src={`/devices/${file}`}
          alt=""
          fill
          sizes="220px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function Count({ target, run, delay }: { target: number; run: boolean; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now() + delay;
    const DUR = 1400;
    const tick = (ts: number) => {
      const p = Math.min(1, Math.max(0, (ts - t0) / DUR));
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, delay]);
  return <>{n}</>;
}
