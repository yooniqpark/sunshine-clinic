"use client";

import { useLocale } from "next-intl";

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

// 챕터 국문 라벨의 로케일 번역 (key 순서와 동일)
export const STD_SHORTS_BY_LOCALE: Record<string, string[]> = {
  ko: ["여드름 · 흉터 · 모공", "화이트닝", "안티에이징", "리프팅"],
  en: ["Acne · Scars · Pores", "Whitening", "Anti-aging", "Lifting"],
  ja: ["ニキビ · 傷跡 · 毛穴", "ホワイトニング", "アンチエイジング", "リフティング"],
  zh: ["痘痘 · 疤痕 · 毛孔", "美白", "抗衰老", "提升"],
};

const COPY_BY_LOCALE: Record<
  string,
  { title: string; titleSecond: string; subtitle: string; body: string }
> = {
  ko: {
    title: "피부를 먼저 보고,",
    titleSecond: "필요한 만큼만.",
    subtitle: "정해진 답보다 한 사람의 피부에서 시작하는 선샤인의 진료 기준.",
    body: "유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을 지향하며\n시술을 정하기 전에 지금의 피부와 원하는 변화의 방향을 충분히 이해합니다.",
  },
  en: {
    title: "We look at your skin first,",
    titleSecond: "and do only what's needed.",
    subtitle: "Sunshine's standard of care starts from each person's skin, not a set answer.",
    body: "We pursue lasting beauty over trends and healthy recovery over flash —\nbefore deciding on any treatment, we take time to understand your skin today and the change you want.",
  },
  ja: {
    title: "まず肌を見て、",
    titleSecond: "必要な分だけ。",
    subtitle: "決まった答えではなく、一人ひとりの肌から始まるサンシャインの診療基準。",
    body: "流行よりも長く続く美しさを、華やかさよりも健やかな回復を目指し、\n施術を決める前に今の肌と望む変化の方向を十分に理解します。",
  },
  zh: {
    title: "先看肌肤，",
    titleSecond: "只做必要的治疗。",
    subtitle: "阳光皮肤科的诊疗标准，从每个人的肌肤出发，而非固定答案。",
    body: "我们追求持久之美而非流行，健康恢复而非浮华——\n在决定治疗之前，充分了解您现在的肌肤与期望的改变方向。",
  },
};

export function ChaptersRight({
  active,
  setActive,
  title,
  titleSecond,
  subtitle,
  body,
}: {
  active: number;
  setActive: (i: number) => void;
  title?: string;
  titleSecond?: string;
  subtitle?: string;
  body?: string;
}) {
  const locale = useLocale();
  const copy = COPY_BY_LOCALE[locale] ?? COPY_BY_LOCALE.ko;
  const shorts = STD_SHORTS_BY_LOCALE[locale] ?? STD_SHORTS_BY_LOCALE.ko;
  title = title ?? copy.title;
  titleSecond = titleSecond ?? copy.titleSecond;
  subtitle = subtitle ?? copy.subtitle;
  body = body ?? copy.body;
  return (
    <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
      {/* 데스크탑에서 헤딩은 좌측 그래픽 패널로 이동 — 우측은 본문 + 챕터 리스트만 */}
      <p className="hidden text-[10px] font-medium tracking-[0.32em] text-ink/55 lg:hidden lg:text-[11px]">
        THE SUNSHINE STANDARD
      </p>
      <p className="max-w-lg whitespace-pre-line text-sm leading-[1.85] text-ink/70 lg:max-w-xl lg:text-[15px]">
        {body}
      </p>
      <span aria-hidden className="mt-10 block h-px w-full bg-ink/15" />
      {/* silence unused params (title/titleSecond/subtitle 이제 그래픽 패널에서 표시) */}
      <span aria-hidden className="hidden">{title}{titleSecond}{subtitle}</span>
      <ul className="divide-y divide-ink/15">
        {STD_CHAPTERS.map((c, i) => {
          const isActive = i === active;
          return (
            <li
              key={c.key}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="cursor-pointer"
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
                  {shorts[i] ?? c.short}
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
