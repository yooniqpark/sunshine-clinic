"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* A. FACE SCAN — 어두운 배경 + 얇은 얼굴 실루엣 line-art + 앵커 마커 */
export function VariantA() {
  const [active, setActive] = useState(0);
  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — face scan */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink lg:aspect-auto lg:min-h-[720px]">
          {/* Ambient warm glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 60% 45%, rgba(196,144,116,0.35) 0%, rgba(154,110,84,0.15) 35%, rgba(0,0,0,0) 70%)",
            }}
          />
          {/* Vertical scan line */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 h-full w-px animate-sss-scan"
            style={{
              left: "58%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,240,215,0.9) 20%, rgba(255,235,200,0.75) 50%, rgba(255,240,215,0.9) 80%, transparent 100%)",
              boxShadow:
                "0 0 12px rgba(255,235,200,0.55), 0 0 24px rgba(255,220,175,0.35)",
            }}
          />

          {/* Face silhouette SVG (side profile) */}
          <svg
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <g
              fill="none"
              stroke="rgba(255,240,220,0.55)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hair back (long, flowing) */}
              <path
                d="M228 78 C 250 85, 258 120, 254 160 C 250 200, 244 240, 240 280 C 236 320, 230 360, 226 400 C 224 424, 232 448, 246 468"
                opacity="0.6"
              />
              {/* Face profile (feminine soft curves) */}
              <path d="M228 82 C 214 74, 196 72, 180 78 C 158 86, 144 108, 138 132 C 134 156, 138 180, 142 198 C 144 208, 146 216, 144 224 C 140 236, 130 244, 128 254 C 126 266, 132 276, 146 282 L 158 288 L 160 306 C 162 322, 168 336, 178 348 C 186 358, 196 366, 204 372" />
              {/* Bangs / hairline */}
              <path d="M182 84 C 198 74, 220 68, 240 78" opacity="0.55" />
              <path d="M188 90 C 200 84, 216 82, 232 90" opacity="0.35" />
              {/* Eyelash + eye */}
              <path d="M158 168 C 164 162, 178 162, 186 168" strokeWidth="1.2" />
              <path d="M158 168 C 164 172, 178 172, 186 168" opacity="0.6" />
              <circle cx="172" cy="171" r="1.8" fill="rgba(255,240,220,0.75)" stroke="none" />
              {/* Eyebrow (delicate arch) */}
              <path d="M158 156 C 168 150, 182 152, 190 158" opacity="0.7" strokeWidth="0.9" />
              {/* Nose */}
              <path d="M148 175 C 142 195, 138 210, 144 216 C 148 220, 156 219, 158 216" />
              {/* Lips (fuller) */}
              <path d="M152 244 C 160 240, 174 240, 180 244" opacity="0.85" />
              <path d="M152 250 C 160 254, 174 254, 180 250" opacity="0.7" />
              {/* Chin dimple hint */}
              <path d="M158 288 C 164 296, 172 302, 178 300" opacity="0.35" />
              {/* Slender neck */}
              <path d="M204 372 L 198 420 L 232 420" opacity="0.85" />
              {/* Ear + earring */}
              <path d="M204 190 C 214 192, 220 204, 216 218 C 212 230, 202 232, 200 226" opacity="0.55" />
              <circle cx="212" cy="230" r="1.2" fill="rgba(255,240,220,0.7)" stroke="none" />
            </g>
            {/* Mesh grid on face — subtle */}
            <g
              stroke="rgba(255,240,220,0.15)"
              strokeWidth="0.4"
              fill="none"
            >
              {[100, 130, 160, 190, 220, 250, 280].map((y) => (
                <path
                  key={y}
                  d={`M120 ${y} Q 165 ${y - 3} 220 ${y + 3}`}
                />
              ))}
              {[130, 155, 180, 205].map((x) => (
                <path
                  key={x}
                  d={`M${x} 100 Q ${x + 2} 200 ${x - 2} 300`}
                />
              ))}
            </g>
          </svg>

          {/* Anchor markers on face */}
          {STD_CHAPTERS.map((c, i) => {
            const isActive = i === active;
            return (
              <div
                key={c.key}
                aria-hidden
                className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isActive ? "scale-100 opacity-100" : "scale-90 opacity-50"
                }`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                <div className="relative h-9 w-16 lg:h-10 lg:w-20">
                  {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((p) => (
                    <span
                      key={p}
                      className={`absolute h-2.5 w-2.5 transition-all ${p} ${isActive ? "border-white/95" : "border-white/45"}`}
                    />
                  ))}
                  <span
                    className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: c.color,
                      boxShadow: isActive
                        ? `0 0 0 3px ${c.color}30, 0 0 10px ${c.color}80`
                        : `0 0 0 2px ${c.color}20`,
                    }}
                  />
                  {isActive && (
                    <span
                      className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-sss-ping rounded-full"
                      style={{ background: c.color }}
                    />
                  )}
                </div>
                <p
                  className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold tracking-[0.24em] transition-all ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                >
                  {c.key.split(" · ")[0]}
                </p>
              </div>
            );
          })}

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream lg:px-10">
            <span>A · FACE SCAN</span>
            <span className="font-serif tabular-nums">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </div>

        <ChaptersRight active={active} setActive={setActive} />
      </div>
    </section>
  );
}
