"use client";

import Image from "next/image";
import { useState } from "react";
import type { SlideItem } from "./SlideShared";

/* E. SPOTLIGHT + STACK — 좌측 큰 활성 카드 · 우측 세로 스택(다음 카드들 미리보기) */
export function SlideE({ items }: { items: SlideItem[] }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const cur = items[idx];
  const upcoming = [
    items[(idx + 1) % total],
    items[(idx + 2) % total],
    items[(idx + 3) % total],
  ];
  return (
    <section className="bg-[#e9e0d5] py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr] lg:gap-8">
          {/* Left — 큰 활성 카드 */}
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % total)}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-brand-soft/40 bg-white shadow-xl shadow-ink/15 sm:aspect-[4/3] lg:aspect-[1.1/1]"
          >
            {cur?.img && (
              <Image
                key={cur.slug}
                src={cur.img}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-8"
                style={{ animation: "se-fade 0.7s ease-out both" }}
              />
            )}
            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.28em] text-brand-dark">
                  {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {cur?.categoryLabel}
                </p>
                <p className="mt-2 font-serif text-2xl tracking-tight text-ink lg:text-3xl">
                  {cur?.name}
                </p>
              </div>
              <span className="text-[10px] font-medium tracking-[0.24em] text-ink/40">
                NEXT →
              </span>
            </div>
          </button>

          {/* Right — 다음 3개 스택 */}
          <div className="flex flex-col gap-3">
            {upcoming.map((d, offset) => (
              <button
                key={d.slug + offset}
                type="button"
                onClick={() => setIdx((idx + offset + 1) % total)}
                className="group flex items-center gap-4 rounded-2xl border border-ink/15 bg-white/70 p-3 text-left transition hover:border-ink/40 hover:bg-white"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream/40">
                  {d.img && (
                    <Image src={d.img} alt="" fill sizes="80px" className="object-contain p-1.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-medium tracking-[0.24em] text-brand-dark">
                    UP NEXT · 0{offset + 1}
                  </p>
                  <p className="mt-1 font-serif text-[15px] tracking-tight text-ink">{d.name}</p>
                  <p className="mt-0.5 text-[10px] font-medium tracking-[0.2em] text-ink/45">
                    {d.categoryLabel}
                  </p>
                </div>
                <span className="text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-brand-dark">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
        <style>{`@keyframes se-fade { 0% { opacity: 0; transform: translateY(10px);} 100% { opacity: 1; transform: translateY(0);} }`}</style>
      </div>
    </section>
  );
}
