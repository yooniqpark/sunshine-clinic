"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* B. SKIN CROSS-SECTION — 표피/진피/피하 3-layer 단면도 */
export function VariantB() {
  const [active, setActive] = useState(0);
  const layers = [
    { label: "EPIDERMIS", sub: "표피", top: 12, height: 18, tint: "rgba(255,240,220,0.14)" },
    { label: "DERMIS", sub: "진피", top: 32, height: 42, tint: "rgba(196,144,116,0.18)" },
    { label: "SUBCUTANEOUS", sub: "피하지방 · SMAS", top: 76, height: 20, tint: "rgba(154,110,84,0.22)" },
  ];
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — skin cross-section */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5eee1] lg:aspect-auto lg:min-h-[720px]">
          {/* Layer bands */}
          {layers.map((l) => (
            <div
              key={l.label}
              className="absolute inset-x-0"
              style={{
                top: `${l.top}%`,
                height: `${l.height}%`,
                background: l.tint,
              }}
            />
          ))}

          {/* Horizontal layer separators */}
          {layers.map((l) => (
            <span
              key={l.label + "-line"}
              aria-hidden
              className="absolute inset-x-0 h-px bg-ink/25"
              style={{ top: `${l.top}%` }}
            />
          ))}
          <span
            aria-hidden
            className="absolute inset-x-0 h-px bg-ink/25"
            style={{ top: `${layers[layers.length - 1].top + layers[layers.length - 1].height}%` }}
          />

          {/* Layer labels */}
          {layers.map((l) => (
            <div
              key={l.label + "-label"}
              className="absolute left-6 flex flex-col text-[10px] font-medium tracking-[0.24em] text-ink/45 lg:left-10"
              style={{ top: `calc(${l.top}% + 8px)` }}
            >
              <span className="font-serif">{l.label}</span>
              <span className="text-ink/35">{l.sub}</span>
            </div>
          ))}

          {/* Anchor markers on layers */}
          {STD_CHAPTERS.map((c, i) => {
            const isActive = i === active;
            return (
              <div
                key={c.key}
                aria-hidden
                className={`pointer-events-none absolute right-8 -translate-y-1/2 transition-all duration-500 lg:right-16 ${
                  isActive ? "scale-100 opacity-100" : "scale-95 opacity-45"
                }`}
                style={{ top: `${c.layerY}%` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: c.color,
                      boxShadow: isActive
                        ? `0 0 0 3px ${c.color}25, 0 0 12px ${c.color}80`
                        : `0 0 0 2px ${c.color}20`,
                    }}
                  />
                  <span
                    aria-hidden
                    className="h-px"
                    style={{
                      width: isActive ? "40px" : "24px",
                      background: c.color,
                      transition: "width 500ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                  <span
                    className={`whitespace-nowrap text-[10px] font-medium tracking-[0.24em] transition-colors ${
                      isActive ? "text-ink" : "text-ink/50"
                    }`}
                  >
                    {c.key.split(" · ")[0]}
                  </span>
                </div>
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 animate-sss-ping rounded-full"
                    style={{ background: c.color }}
                  />
                )}
              </div>
            );
          })}

          {/* Depth ruler on right edge */}
          <div className="pointer-events-none absolute right-2 top-[12%] bottom-[4%] flex flex-col justify-between text-[8px] font-medium tracking-[0.2em] text-ink/30">
            <span>0.1mm</span>
            <span>1.5mm</span>
            <span>4mm</span>
            <span>SMAS</span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/50 lg:px-10">
            <span>B · SKIN LAYERS</span>
            <span className="font-serif tabular-nums text-ink/60">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </div>

        <ChaptersRight active={active} setActive={setActive} />
      </div>
    </section>
  );
}
