"use client";

import Image from "next/image";
import { useState } from "react";
import type { SlideItem } from "./SlideShared";

/* D. GRID MOSAIC — 2행 4열 그리드, 하버 시 확대 */
export function SlideD({ items }: { items: SlideItem[] }) {
  const [idx, setIdx] = useState(0);
  return (
    <section className="bg-[#f2ebde] py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {items.map((d, i) => {
            const isActive = i === idx;
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => setIdx(i)}
                onMouseEnter={() => setIdx(i)}
                className={`group relative aspect-[4/5] overflow-hidden rounded-xl border transition-all duration-500 ${
                  isActive
                    ? "border-brand-dark bg-white shadow-xl shadow-ink/15 lg:scale-[1.03]"
                    : "border-ink/15 bg-white/60 hover:border-ink/45"
                }`}
              >
                <div className="relative h-[75%] w-full">
                  {d.img && (
                    <Image
                      src={d.img}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 45vw, 24vw"
                      className={`object-contain p-4 transition duration-500 ${
                        isActive ? "opacity-100 scale-100" : "opacity-80 group-hover:opacity-95 scale-95"
                      }`}
                    />
                  )}
                </div>
                <div className="border-t border-ink/10 px-3 py-3 text-center">
                  <p
                    className={`text-[9px] font-medium tracking-[0.24em] transition ${
                      isActive ? "text-brand-dark" : "text-ink/40"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p
                    className={`mt-1 font-serif text-[13px] tracking-tight transition ${
                      isActive ? "text-ink" : "text-ink/60"
                    }`}
                  >
                    {d.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
