"use client";

import { useEffect, useRef, useState } from "react";

type Chapter = {
  num: string;
  key: string;
  eyebrow: string;
  heading: string;
  body: string;
};

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    key: "LISTEN",
    eyebrow: "01 — LISTEN",
    heading: "피부의 이야기를\n먼저 듣습니다.",
    body: "시술을 정하기 전에, 지금의 피부와 원하는 변화의 방향을 충분히 이해합니다.",
  },
  {
    num: "02",
    key: "DISCERN",
    eyebrow: "02 — DISCERN",
    heading: "필요한 것과\n필요하지 않은 것.",
    body: "과잉 진료를 걷어내고, 검증된 근거를 기준으로 필요한 시술만 제안드립니다.",
  },
  {
    num: "03",
    key: "REFINE",
    eyebrow: "03 — REFINE",
    heading: "정교한 도구로\n결을 다듬습니다.",
    body: "임상 데이터가 축적된 프리미엄 장비를 목적에 맞게 조합해 결과를 설계합니다.",
  },
  {
    num: "04",
    key: "SUSTAIN",
    eyebrow: "04 — SUSTAIN",
    heading: "오래 지속되는\n건강한 변화.",
    body: "일시적인 개선이 아니라, 장기적으로 유지 가능한 피부 상태를 함께 만들어 갑니다.",
  },
];

export function SunshineStandard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when section top hits vh, 1 when section bottom passes 0
      const total = rect.height - vh;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = scrolled / total; // 0..1
      const idx = Math.min(
        CHAPTERS.length - 1,
        Math.floor(p * CHAPTERS.length + 0.0001),
      );
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink text-cream"
      style={{ height: `${CHAPTERS.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 flex h-screen w-full overflow-hidden">
        {/* Ambient warm glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 75% 45%, rgba(196,144,116,0.28) 0%, rgba(154,110,84,0.14) 30%, rgba(0,0,0,0) 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute right-[-10%] top-[10%] h-[80vh] w-[80vh] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(232,205,175,0.55) 0%, rgba(196,144,116,0.15) 55%, transparent 80%)",
          }}
        />

        <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-8 px-5 py-16 lg:grid-cols-[minmax(260px,340px)_1fr] lg:gap-16 lg:px-8 lg:py-20">
          {/* Left column — section eyebrow + chapter list */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-medium tracking-[0.32em] text-cream/60 lg:text-[11px]">
                THE SUNSHINE STANDARD
              </p>
              <h2 className="mt-4 font-serif text-3xl font-normal leading-[1.2] tracking-tight text-cream lg:text-[2.5rem]">
                아름다움보다 먼저,
                <br />
                <span className="text-cream/70">피부를 대하는 기준.</span>
              </h2>
            </div>

            {/* Chapter indicator (desktop only) */}
            <ul className="hidden flex-col gap-6 lg:flex">
              {CHAPTERS.map((c, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={c.key}
                    className="grid grid-cols-[24px_1fr_auto] items-center gap-3 text-[10px] tracking-[0.24em]"
                  >
                    <span
                      className={`transition-colors ${
                        isActive ? "text-cream" : "text-cream/40"
                      }`}
                    >
                      {c.num}
                    </span>
                    <span className="relative block h-px w-full overflow-hidden bg-cream/15">
                      <span
                        className={`absolute inset-y-0 left-0 origin-left bg-cream transition-transform duration-500 ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                        style={{ width: "100%" }}
                      />
                    </span>
                    <span
                      className={`transition-colors ${
                        isActive ? "text-cream" : "text-cream/40"
                      }`}
                    >
                      {c.key}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right column — active chapter body */}
          <div className="relative flex items-center">
            {CHAPTERS.map((c, i) => {
              const isActive = i === active;
              return (
                <div
                  key={c.key}
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-6 opacity-0"
                  }`}
                >
                  <p className="text-[10px] font-medium tracking-[0.32em] text-cream/60 lg:text-[11px]">
                    {c.eyebrow}
                  </p>
                  <h3 className="mt-6 whitespace-pre-line font-serif text-4xl font-normal leading-[1.1] tracking-tight text-cream lg:text-6xl">
                    {c.heading}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-8 block h-px w-16 bg-cream/40"
                  />
                  <p className="mt-6 max-w-xl text-sm leading-relaxed text-cream/70 lg:text-[15px]">
                    {c.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer indicator */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto flex max-w-7xl items-center justify-between px-5 text-[10px] font-medium tracking-[0.32em] text-cream/40 lg:px-8">
          <span>{CHAPTERS[active].num}</span>
          <span>{CHAPTERS[CHAPTERS.length - 1].num}</span>
        </div>
      </div>
    </section>
  );
}
