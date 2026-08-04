"use client";

import { useEffect, useRef, useState } from "react";

/**
 * OUR PHILOSOPHY — 스크롤에 맞춰 강조 단어(필요한 진료·검증된 결과·건강한 변화)에
 * 한 줄씩 색이 들어온다. 내려오기 한 템포 전에 미리 켜져서 스크롤하며 자연스럽게 보인다.
 */
const LINES = [
  { lead: "과잉 진료보다", accent: "필요한 진료", tail: "를" },
  { lead: "화려한 광고보다", accent: "검증된 결과", tail: "를" },
  { lead: "일시적 개선보다", accent: "건강한 변화", tail: "를" },
];

export function PhilosophyLines() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [lit, setLit] = useState<boolean[]>(() => LINES.map(() => false));

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const lines = [...root.querySelectorAll<HTMLElement>("[data-line]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.line);
          setLit((prev) => {
            if (prev[i]) return prev;
            const next = [...prev];
            next[i] = true;
            return next;
          });
          io.unobserve(e.target);
        }
      },
      // 화면 하단보다 12% 아래까지 관찰 범위를 넓혀 한 템포 빨리 점등
      { rootMargin: "0px 0px 12% 0px", threshold: 0.6 }
    );
    lines.forEach((l) => io.observe(l));
    return () => io.disconnect();
  }, []);

  return (
    <h2
      ref={ref}
      className="mt-8 font-serif text-3xl font-normal leading-[1.35] tracking-tight text-ink lg:text-[3rem] lg:leading-[1.3]"
    >
      {LINES.map((l, i) => (
        <span key={i} data-line={i} className="block">
          <span className="text-ink/40">{l.lead}</span>{" "}
          <span
            className={`transition-colors duration-700 ease-out ${
              lit[i] ? "text-brand-dark" : "text-ink/40"
            }`}
            style={{ transitionDelay: lit[i] ? `${i * 120}ms` : "0ms" }}
          >
            {l.accent}
          </span>
          <span className="text-ink/40">{l.tail}</span>
        </span>
      ))}
    </h2>
  );
}
