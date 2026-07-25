"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* G. LAYERED CARDS — 종이 카드 4장이 뒤에 겹쳐 있고, 활성 카드가 앞으로 나옴 */
export function VariantG() {
  const [active, setActive] = useState(0);
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-[#ede4d3] lg:aspect-auto lg:min-h-[720px]">
          <div className="relative h-[70%] w-[62%]">
            {STD_CHAPTERS.map((c, i) => {
              const offset = i - active;
              const isActive = offset === 0;
              const z = 10 - Math.abs(offset);
              return (
                <div
                  key={c.key}
                  aria-hidden
                  className="absolute inset-0 rounded-[1.5rem] transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    zIndex: z,
                    transform: `translateY(${offset * 22}px) translateX(${offset * 14}px) rotate(${offset * -2}deg) scale(${1 - Math.abs(offset) * 0.06})`,
                    opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25,
                    background: `linear-gradient(155deg, #f5eee1 0%, ${c.color}22 55%, #ede4d3 100%)`,
                    boxShadow:
                      "0 30px 60px -20px rgba(24,19,15,0.18), 0 8px 20px -8px rgba(24,19,15,0.12)",
                  }}
                >
                  <div className="flex h-full flex-col justify-between p-8 lg:p-10">
                    <div className="flex items-start justify-between">
                      <p
                        className="text-[10px] font-medium tracking-[0.32em]"
                        style={{ color: isActive ? c.color : "rgba(24,19,15,0.45)" }}
                      >
                        {c.num}
                      </p>
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-full transition-opacity"
                        style={{
                          background: c.color,
                          opacity: isActive ? 1 : 0.3,
                        }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-medium tracking-[0.24em]"
                        style={{ color: isActive ? c.color : "rgba(24,19,15,0.4)" }}
                      >
                        STANDARD · {c.key.split(" · ")[0]}
                      </p>
                      <p
                        className="mt-3 font-serif tracking-tight"
                        style={{
                          fontSize: "clamp(2rem, 4.5vw, 3rem)",
                          lineHeight: 1.05,
                          color: isActive ? "rgb(24,19,15)" : "rgba(24,19,15,0.55)",
                        }}
                      >
                        {c.short}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>G · LAYERED CARDS</span>
            <span className="font-serif tabular-nums text-ink/55">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </div>

        <ChaptersRight active={active} setActive={setActive} />
      </div>
    </section>
  );
}
