"use client";

import Image from "next/image";
import { useState } from "react";
import type { SlideItem } from "./SlideShared";

/* B. COVERFLOW — 3D 회전 캐러셀 (Apple Music 스타일) */
export function SlideB({ items }: { items: SlideItem[] }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  return (
    <section className="bg-ink py-14 text-cream lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative h-[420px] w-full lg:h-[500px]" style={{ perspective: "1400px" }}>
          <div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {items.map((d, i) => {
              let offset = i - idx;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;
              const isActive = offset === 0;
              const absOffset = Math.abs(offset);
              if (absOffset > 3) return null;
              const translateX = offset * 220;
              const rotateY = offset * -30;
              const z = isActive ? 100 : 50 - absOffset * 10;
              const opacity = 1 - absOffset * 0.18;
              return (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={d.name}
                  className={`absolute left-1/2 top-1/2 h-[380px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "border-brand-soft/70 bg-white shadow-2xl shadow-black/40"
                      : "border-cream/15 bg-white/95"
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg)`,
                    zIndex: z,
                    opacity,
                  }}
                >
                  <div className="relative h-[70%] w-full">
                    {d.img && (
                      <Image
                        src={d.img}
                        alt=""
                        fill
                        sizes="280px"
                        className="object-contain p-5"
                      />
                    )}
                  </div>
                  <div className="border-t border-ink/10 px-4 py-3 text-center">
                    <p className="text-[9px] font-medium tracking-[0.24em] text-brand-dark">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 font-serif text-sm tracking-tight text-ink">
                      {d.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-1 rounded-full transition-all ${
                i === idx ? "w-8 bg-brand-soft" : "w-2 bg-cream/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
