"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* I. RIPPLE — 원형 파문 4겹 */
export function VariantI() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink lg:aspect-auto lg:min-h-[720px]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-[background] duration-[900ms]"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${c.color}25 0%, ${c.color}08 40%, rgba(0,0,0,0) 70%)`,
            }}
          />
          {/* Ripples */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {STD_CHAPTERS.map((ch, i) => {
              const isActive = i === active;
              const size = 200 + i * 130;
              return (
                <span
                  key={ch.key}
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: size,
                    height: size,
                    borderColor: isActive ? ch.color : "rgba(255,240,220,0.10)",
                    borderWidth: isActive ? 1.5 : 0.5,
                    boxShadow: isActive ? `0 0 24px ${ch.color}60` : "none",
                    transform: `translate(-50%,-50%) scale(${isActive ? 1.05 : 1})`,
                  }}
                />
              );
            })}
            <p
              className="relative font-serif italic text-cream/70"
              style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)" }}
            >
              {c.short}
            </p>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream/60 lg:px-10">
            <span>I · RIPPLE</span>
            <span className="font-serif tabular-nums text-cream">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </div>
        <ChaptersRight active={active} setActive={setActive} />
      </div>
    </section>
  );
}
