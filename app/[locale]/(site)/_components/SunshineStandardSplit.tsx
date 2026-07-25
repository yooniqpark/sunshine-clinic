"use client";

import Image from "next/image";
import { useState } from "react";

type Chapter = {
  num: string;
  key: string;
  short: string;
  body: string;
};

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    key: "LISTEN",
    short: "피부를 듣다",
    body: "시술을 정하기 전에, 지금의 피부와 원하는 변화의 방향을 충분히 이해합니다.",
  },
  {
    num: "02",
    key: "DISCERN",
    short: "필요한 것만",
    body: "과잉 진료를 걷어내고, 검증된 근거를 기준으로 필요한 시술만 제안드립니다.",
  },
  {
    num: "03",
    key: "REFINE",
    short: "섬세하게",
    body: "임상 데이터가 축적된 프리미엄 장비를 목적과 부위에 맞게 정교하게 조합합니다.",
  },
  {
    num: "04",
    key: "SUSTAIN",
    short: "오래도록",
    body: "일시적인 개선이 아닌, 장기적으로 유지 가능한 건강한 피부 상태를 함께 만들어 갑니다.",
  },
];

export function SunshineStandardSplit() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — model image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand lg:aspect-auto lg:min-h-[720px]">
          <Image
            src="/clinic/model-consult.png"
            alt=""
            fill
            priority={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          {/* Corner bracket ornament (upper-right area) */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-6 top-24 z-10 h-24 w-32 lg:right-10 lg:top-32 lg:h-28 lg:w-40"
          >
            <span className="absolute right-0 top-0 h-full w-px bg-ink/25" />
            <span className="absolute right-0 top-0 h-px w-full bg-ink/25" />
          </span>
          {/* Bottom-left label + page indicator */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream lg:px-10">
            <span className="drop-shadow">SKIN OBSERVATION</span>
            <span className="font-serif tabular-nums text-cream drop-shadow">
              {String(active + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right — heading + chapter accordion */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
          <p className="text-[10px] font-medium tracking-[0.32em] text-ink/55 lg:text-[11px]">
            THE SUNSHINE STANDARD
          </p>
          <h2 className="mt-8 font-serif text-4xl font-normal leading-[1.15] tracking-tight text-ink lg:text-[3.75rem] lg:leading-[1.05]">
            피부를 먼저 보고,
            <br />
            <span className="text-ink/55">필요한 만큼만.</span>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-[1.7] text-ink/60 lg:text-[15px]">
            정해진 답보다 한 사람의 피부에서 시작하는 선샤인의 진료 기준.
          </p>

          <p className="mt-8 max-w-lg text-sm leading-[1.8] text-ink/70 lg:text-[15px]">
            선샤인 스킨 클리닉은 대학병원에서 오랜 임상 경험을 쌓은
            피부과 전문의가 직접 진료하는 로컬 클리닉입니다.
            <br />
            <br />
            유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을
            지향하며 — 시술을 정하기 전에 지금의 피부와 원하는 변화의
            방향을 충분히 이해합니다.
          </p>

          {/* Divider */}
          <span aria-hidden className="mt-14 block h-px w-full bg-ink/15" />

          {/* Chapter list — hover selects, no inline expand */}
          <ul className="divide-y divide-ink/15">
            {CHAPTERS.map((c, i) => {
              const isActive = i === active;
              return (
                <li
                  key={c.key}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <div className="grid w-full grid-cols-[48px_1fr_auto_24px] items-center gap-6 py-6">
                    <span
                      className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] tracking-[0.24em] font-medium ${
                        isActive ? "text-[13px] text-ink" : "text-[11px] text-ink/35"
                      }`}
                    >
                      {c.num}
                    </span>
                    <span
                      className={`font-serif tracking-tight transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "text-2xl text-ink lg:text-[2rem]"
                          : "text-lg text-ink/35 lg:text-xl"
                      }`}
                    >
                      {c.key}
                    </span>
                    <span
                      className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? "text-base text-ink" : "text-sm text-ink/40"
                      }`}
                    >
                      {c.short}
                    </span>
                    <span
                      aria-hidden
                      className={`justify-self-end transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? "text-xl text-ink" : "text-base text-ink/35"
                      }`}
                    >
                      {isActive ? "×" : "+"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

        </div>
      </div>
    </section>
  );
}
