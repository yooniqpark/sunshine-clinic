"use client";

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
        {/* Left — model image (placeholder for now) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand lg:aspect-auto lg:min-h-[720px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-medium tracking-[0.3em] text-ink/25">
              MODEL IMAGE
            </span>
          </div>
          {/* subtle warm gradient */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, rgba(232,205,175,0.24) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(196,144,116,0.14) 0%, transparent 55%)",
            }}
          />
          {/* Corner bracket ornament (upper-right area) */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-6 top-24 h-24 w-32 lg:right-10 lg:top-32 lg:h-28 lg:w-40"
          >
            <span className="absolute right-0 top-0 h-full w-px bg-ink/25" />
            <span className="absolute right-0 top-0 h-px w-full bg-ink/25" />
          </span>
          {/* Bottom-left label + page indicator */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/50 lg:px-10">
            <span>SKIN OBSERVATION</span>
            <span className="font-serif tabular-nums text-ink/60">
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
                  <div
                    className="grid w-full grid-cols-[48px_1fr_auto_24px] items-center gap-6 py-6 transition-colors duration-500"
                  >
                    <span
                      className={`text-[11px] font-medium tracking-[0.24em] transition-colors duration-500 ${
                        isActive ? "text-ink" : "text-ink/35"
                      }`}
                    >
                      {c.num}
                    </span>
                    <span
                      className={`font-serif text-xl tracking-tight transition-colors duration-500 lg:text-2xl ${
                        isActive ? "text-ink" : "text-ink/35"
                      }`}
                    >
                      {c.key}
                    </span>
                    <span
                      className={`text-sm transition-colors duration-500 ${
                        isActive ? "text-ink" : "text-ink/40"
                      }`}
                    >
                      {c.short}
                    </span>
                    <span
                      aria-hidden
                      className={`justify-self-end text-lg transition-colors duration-500 ${
                        isActive ? "text-ink" : "text-ink/35"
                      }`}
                    >
                      {isActive ? "×" : "+"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Bottom message — 활성 챕터 본문이 하단 고정 영역에서 부드럽게 전환 */}
          <div className="mt-10 min-h-[110px]">
            <div
              key={CHAPTERS[active]?.key ?? "none"}
              className="grid grid-cols-[80px_1fr] gap-6"
              style={{ animation: "sss-fade 0.6s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <span className="text-sm text-ink/55">
                {CHAPTERS[active]?.short}
              </span>
              <p className="max-w-lg text-sm leading-[1.85] text-ink/65 lg:text-[15px]">
                {CHAPTERS[active]?.body}
              </p>
            </div>
          </div>

          <style>{`@keyframes sss-fade { 0% { opacity: 0; transform: translateY(6px);} 100% { opacity: 1; transform: translateY(0);} }`}</style>
        </div>
      </div>
    </section>
  );
}
