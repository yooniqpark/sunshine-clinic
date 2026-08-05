"use client";

import { useEffect, useRef } from "react";

/**
 * OUR PHILOSOPHY — 스크롤 스크럽 단어 리빌.
 * 스크롤 진행에 맞춰 단어가 앞에서부터 순서대로 흐릿함(블러·저채도) → 선명한 색으로
 * 살아난다. 강조 단어는 브랜드 컬러로 마무리.
 */
type Token = { w: string; suffix?: string; accent?: boolean; br?: boolean };

const TOKENS: Token[] = [
  { w: "과잉" },
  { w: "진료보다" },
  { w: "필요한", accent: true },
  { w: "진료", suffix: "를", accent: true, br: true },
  { w: "화려한" },
  { w: "광고보다" },
  { w: "검증된", accent: true },
  { w: "결과", suffix: "를", accent: true, br: true },
  { w: "일시적" },
  { w: "개선보다" },
  { w: "건강한", accent: true },
  { w: "변화", suffix: "를", accent: true },
];

export function PhilosophyLines() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = [...root.querySelectorAll<HTMLElement>("[data-wi]")];
    const n = words.length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      words.forEach((w) => w.style.setProperty("--wp", "1"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // 화면 하단 90% 지점에 들어올 때 시작 → 상단 35% 지점에서 완료 (한 템포 빠르게)
      const p = Math.min(1, Math.max(0, (vh * 0.9 - rect.top) / (vh * 0.62)));
      for (let i = 0; i < n; i++) {
        const local = Math.min(1, Math.max(0, p * (n + 2) - i));
        words[i].style.setProperty("--wp", local.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <h2
      ref={ref}
      className="mt-8 font-serif text-3xl font-normal leading-[1.35] tracking-tight lg:text-[3rem] lg:leading-[1.3]"
    >
      {TOKENS.map((tk, i) => (
        <span key={i}>
          <span
            data-wi={i}
            className={tk.accent ? "philo-word text-brand-dark" : "philo-word text-ink"}
          >
            {tk.w}
            {tk.suffix ? <span className="text-ink">{tk.suffix}</span> : null}
          </span>
          {tk.br ? <br /> : " "}
        </span>
      ))}
    </h2>
  );
}
