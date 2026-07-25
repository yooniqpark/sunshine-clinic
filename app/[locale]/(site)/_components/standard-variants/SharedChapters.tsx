"use client";

export type StdChapter = {
  num: string;
  key: string;
  short: string;
  color: string;
  layerY?: number; // for skin cross-section
  x?: number;
  y?: number;
};

// depth 순 (얕은 표피 → 깊은 SMAS)
export const STD_CHAPTERS: StdChapter[] = [
  { num: "01", key: "ACNE · SCAR · PORE", short: "여드름 · 흉터 · 모공", color: "#e08a5b", layerY: 15, x: 62, y: 28 },
  { num: "02", key: "WHITENING", short: "화이트닝", color: "#a3b3cf", layerY: 30, x: 56, y: 44 },
  { num: "03", key: "ANTI-AGING", short: "안티에이징", color: "#8fb389", layerY: 55, x: 62, y: 41 },
  { num: "04", key: "LIFTING", short: "리프팅", color: "#c49074", layerY: 80, x: 73, y: 48 },
];

export function ChaptersRight({
  active,
  setActive,
  title = "피부를 먼저 보고,",
  titleSecond = "필요한 만큼만.",
  subtitle = "정해진 답보다 한 사람의 피부에서 시작하는 선샤인의 진료 기준.",
  body = "유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을 지향하며 — 시술을 정하기 전에 지금의 피부와 원하는 변화의 방향을 충분히 이해합니다.",
}: {
  active: number;
  setActive: (i: number) => void;
  title?: string;
  titleSecond?: string;
  subtitle?: string;
  body?: string;
}) {
  return (
    <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
      <p className="text-[10px] font-medium tracking-[0.32em] text-ink/55 lg:text-[11px]">
        THE SUNSHINE STANDARD
      </p>
      <h2 className="mt-8 font-serif text-4xl font-normal leading-[1.15] tracking-tight text-ink lg:text-[3.75rem] lg:leading-[1.05]">
        {title}
        <br />
        <span className="text-ink/55">{titleSecond}</span>
      </h2>
      <p className="mt-6 max-w-lg text-sm leading-[1.7] text-ink/60 lg:text-[15px]">
        {subtitle}
      </p>
      <p className="mt-8 max-w-lg text-sm leading-[1.8] text-ink/70 lg:text-[15px]">
        {body}
      </p>
      <span aria-hidden className="mt-14 block h-px w-full bg-ink/15" />
      <ul className="divide-y divide-ink/15">
        {STD_CHAPTERS.map((c, i) => {
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
                  className="justify-self-end flex h-4 w-4 items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    background: isActive ? c.color : "transparent",
                    border: isActive
                      ? `1px solid ${c.color}`
                      : "1px solid rgba(24,19,15,0.25)",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
