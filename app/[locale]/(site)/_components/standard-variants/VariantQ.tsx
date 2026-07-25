"use client";

import { useState } from "react";
import { ChaptersRight, STD_CHAPTERS } from "./SharedChapters";

/* Q. FRAGMENTED PORTRAIT — 눈/코/입술을 분리된 편집 프레임에 배치 */
export function VariantQ() {
  const [active, setActive] = useState(0);
  const c = STD_CHAPTERS[active];

  // 4개 프레임: 눈 · 광대 · 입술 · 턱선
  const frames = [
    { id: "eye", label: "EYE", top: 8, left: 10, w: 42, h: 22 },
    { id: "cheek", label: "CHEEK", top: 8, left: 55, w: 35, h: 30 },
    { id: "lip", label: "LIP", top: 40, left: 10, w: 42, h: 22 },
    { id: "jaw", label: "JAWLINE", top: 68, left: 30, w: 55, h: 24 },
  ];

  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ede4d3] lg:aspect-auto lg:min-h-[720px]">
          <div className="absolute inset-6 lg:inset-10">
            {frames.map((f, i) => {
              const isActive = i === active;
              return (
                <div
                  key={f.id}
                  className="absolute overflow-hidden rounded-sm border transition-all duration-700"
                  style={{
                    top: `${f.top}%`,
                    left: `${f.left}%`,
                    width: `${f.w}%`,
                    height: `${f.h}%`,
                    borderColor: isActive ? c.color : "rgba(24,19,15,0.20)",
                    borderWidth: isActive ? 1.5 : 0.5,
                    background: isActive
                      ? `linear-gradient(135deg, ${c.color}12 0%, transparent 60%)`
                      : "rgba(24,19,15,0.02)",
                    boxShadow: isActive ? `0 0 20px ${c.color}40` : "none",
                  }}
                >
                  {/* Frame label */}
                  <p
                    className={`absolute left-3 top-2.5 text-[8px] font-medium tracking-[0.28em] transition-colors ${
                      isActive ? "text-ink" : "text-ink/40"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} · {f.label}
                  </p>
                  {/* SVG feature closeup — 각 프레임마다 얼굴 부위 */}
                  <svg
                    viewBox="0 0 200 100"
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 h-full w-full"
                  >
                    <g
                      fill="none"
                      stroke={isActive ? c.color : "rgba(24,19,15,0.35)"}
                      strokeWidth={isActive ? 1.4 : 0.9}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: "stroke 700ms" }}
                    >
                      {f.id === "eye" && (
                        <>
                          <path d="M40 55 C 70 30, 130 30, 160 55" />
                          <path d="M40 55 C 70 75, 130 75, 160 55" />
                          <circle cx="100" cy="55" r="10" />
                          <circle cx="100" cy="55" r="3" fill={isActive ? c.color : "rgba(24,19,15,0.35)"} stroke="none" />
                          <path d="M40 40 C 70 20, 130 20, 160 40" opacity="0.4" />
                        </>
                      )}
                      {f.id === "cheek" && (
                        <>
                          <path d="M50 30 C 80 40, 130 60, 160 85" />
                          <path d="M40 50 C 70 60, 120 75, 155 90" opacity="0.5" />
                          <circle cx="105" cy="55" r="20" strokeDasharray="2 3" opacity="0.5" />
                        </>
                      )}
                      {f.id === "lip" && (
                        <>
                          <path d="M40 45 C 70 30, 100 25, 130 30 C 150 33, 160 40, 165 48" />
                          <path d="M40 50 C 70 65, 100 70, 130 65 C 150 62, 160 55, 165 48" />
                          <path d="M100 25 L 100 48" opacity="0.4" />
                        </>
                      )}
                      {f.id === "jaw" && (
                        <>
                          <path d="M20 30 C 60 40, 100 55, 140 60 C 165 63, 180 60, 190 55" />
                          <path d="M20 50 C 60 60, 100 75, 140 78 C 165 79, 180 75, 190 68" opacity="0.4" />
                        </>
                      )}
                    </g>
                  </svg>
                  {/* Center dot */}
                  <span
                    className="absolute right-3 bottom-2.5 h-1.5 w-1.5 rounded-full transition-colors"
                    style={{ background: isActive ? c.color : "rgba(24,19,15,0.25)" }}
                  />
                </div>
              );
            })}
          </div>

          {/* Center label */}
          <p
            className="absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif italic text-ink/70"
            style={{ fontSize: "clamp(1rem,2vw,1.5rem)" }}
          >
            — {c.short}
          </p>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-ink/40 lg:px-10">
            <span>Q · FRAGMENTED PORTRAIT</span>
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
