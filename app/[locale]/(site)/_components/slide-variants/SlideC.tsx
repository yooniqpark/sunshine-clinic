"use client";

import Image from "next/image";
import { useState } from "react";
import type { SlideItem } from "./SlideShared";

/* C. FULL-BLEED HERO — 화면 꽉 채우는 이미지 + 대형 세리프 오버레이 */
export function SlideC({ items }: { items: SlideItem[] }) {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  return (
    <section className="relative overflow-hidden bg-[#efe8db]">
      <div className="relative min-h-[560px] w-full lg:min-h-[680px]">
        {/* 이미지 풀블리드 */}
        <div className="absolute inset-0">
          {cur?.img && (
            <Image
              key={cur.slug}
              src={cur.img}
              alt=""
              fill
              sizes="100vw"
              className="object-contain p-10 lg:p-20"
              style={{ animation: "sc-fade 0.7s ease-out both" }}
            />
          )}
        </div>
        {/* 대형 세리프 오버레이 */}
        <div className="pointer-events-none absolute inset-x-0 top-14 mx-auto max-w-7xl px-5 lg:top-20 lg:px-8">
          <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark">
            {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} · {cur?.categoryLabel}
          </p>
          <h3
            key={cur?.slug + "-h"}
            className="mt-4 font-serif font-normal leading-[0.95] tracking-tight text-ink [word-break:keep-all]"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              animation: "sc-fade 0.8s 100ms cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {cur?.name}
          </h3>
        </div>
        {/* 하단 썸네일 인디케이터 */}
        <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-4xl items-center justify-center gap-3 px-5 lg:px-8">
          {items.map((d, i) => {
            const isActive = i === idx;
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={d.name}
                className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full border transition-all duration-500 ${
                  isActive
                    ? "border-brand-dark bg-white shadow-md shadow-ink/15 scale-110"
                    : "border-ink/20 bg-white/70 hover:border-ink/45"
                }`}
              >
                {d.img && (
                  <Image src={d.img} alt="" fill sizes="48px" className="object-contain p-1" />
                )}
              </button>
            );
          })}
        </div>
        <style>{`@keyframes sc-fade { 0% { opacity: 0; transform: translateY(12px);} 100% { opacity: 1; transform: translateY(0);} }`}</style>
      </div>
    </section>
  );
}
