"use client";

import Image from "next/image";
import { useState } from "react";
import type { SlideItem } from "./SlideShared";

/* A. SPLIT SCREEN — 좌: 큰 이미지 · 우: 수직 인덱스 리스트 */
export function SlideA({ items }: { items: SlideItem[] }) {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  return (
    <section className="bg-[#e9e0d5] py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          {/* Left — 큰 이미지 */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white lg:aspect-[1.3/1]">
            {cur?.img && (
              <Image
                key={cur.slug}
                src={cur.img}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-8"
                style={{ animation: "fade-in 0.6s ease-out both" }}
              />
            )}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.28em] text-brand-dark">
                  {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  {" · "}
                  {cur?.categoryLabel}
                </p>
                <p className="mt-2 font-serif text-2xl tracking-tight text-ink lg:text-3xl">
                  {cur?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Right — 수직 인덱스 리스트 */}
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {items.map((d, i) => {
              const isActive = i === idx;
              return (
                <li key={d.slug}>
                  <button
                    type="button"
                    onClick={() => setIdx(i)}
                    onMouseEnter={() => setIdx(i)}
                    className="grid w-full grid-cols-[36px_1fr_auto] items-center gap-4 py-4 text-left transition"
                  >
                    <span
                      className={`text-[10px] font-medium tracking-[0.24em] tabular-nums transition ${
                        isActive ? "text-ink" : "text-ink/40"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-serif tracking-tight transition-all duration-500 ${
                        isActive
                          ? "text-lg text-ink lg:text-xl"
                          : "text-base text-ink/50"
                      }`}
                    >
                      {d.name}
                    </span>
                    <span
                      className={`text-[9px] font-medium tracking-[0.24em] transition ${
                        isActive ? "text-brand-dark" : "text-ink/30"
                      }`}
                    >
                      {d.categoryLabel}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <style>{`@keyframes fade-in { 0% { opacity: 0; transform: translateY(8px);} 100% { opacity: 1; transform: translateY(0);} }`}</style>
    </section>
  );
}
