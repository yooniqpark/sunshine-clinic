"use client";

import Image from "next/image";
import { useState } from "react";

type Chapter = {
  num: string;
  key: string;
  short: string;
  // anchor position on the image (percent)
  x: number;
  y: number;
  color: string;
};

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    key: "ACNE",
    short: "여드름",
    x: 62,
    y: 28, // 이마
    color: "#e08a5b", // warm orange
  },
  {
    num: "02",
    key: "LIFTING",
    short: "리프팅",
    x: 51,
    y: 58, // 턱선 (왼쪽 - 손이 없는 쪽)
    color: "#c49074", // brand gold
  },
  {
    num: "03",
    key: "ANTI-AGING",
    short: "안티에이징",
    x: 62,
    y: 41, // 눈가
    color: "#8fb389", // soft green
  },
  {
    num: "04",
    key: "WHITENING",
    short: "화이트닝",
    x: 56,
    y: 48, // 광대
    color: "#a3b3cf", // editorial blue
  },
];

export function SunshineStandardSplit() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-[#f2ebde] text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — model + observation overlay */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand lg:aspect-auto lg:min-h-[720px]">
          <Image
            src="/clinic/model-consult.png"
            alt=""
            fill
            priority={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />

          {/* Subtle mesh grid overlay (curved wireframe on face area) */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full mix-blend-soft-light opacity-70"
          >
            <defs>
              <pattern
                id="face-mesh"
                x="0"
                y="0"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="skewX(-4) skewY(2)"
              >
                <path
                  d="M0 0 H6 M0 0 V6"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="0.15"
                  fill="none"
                />
              </pattern>
              <radialGradient id="mesh-mask" cx="60%" cy="42%" r="32%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="70%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <mask id="mesh-clip">
                <rect width="100" height="100" fill="url(#mesh-mask)" />
              </mask>
            </defs>
            <rect
              width="100"
              height="100"
              fill="url(#face-mesh)"
              mask="url(#mesh-clip)"
            />
          </svg>

          {/* Vertical scan line — soft breathing glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 h-full w-px animate-sss-scan"
            style={{
              left: "60%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,240,215,0.9) 20%, rgba(255,235,200,0.75) 50%, rgba(255,240,215,0.9) 80%, transparent 100%)",
              boxShadow:
                "0 0 12px rgba(255,235,200,0.55), 0 0 24px rgba(255,220,175,0.35)",
            }}
          />

          {/* Anchor markers */}
          {CHAPTERS.map((c, i) => {
            const isActive = i === active;
            return (
              <div
                key={c.key}
                aria-hidden
                className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive ? "opacity-100 scale-100" : "opacity-50 scale-90"
                }`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                {/* Bracket frame — 얼굴에 맞게 축소 */}
                <div className="relative h-9 w-16 lg:h-10 lg:w-20">
                  {[
                    "left-0 top-0 border-l border-t",
                    "right-0 top-0 border-r border-t",
                    "left-0 bottom-0 border-l border-b",
                    "right-0 bottom-0 border-r border-b",
                  ].map((pos) => (
                    <span
                      key={pos}
                      className={`absolute h-2.5 w-2.5 transition-all duration-500 ${pos} ${
                        isActive
                          ? "border-white/95"
                          : "border-white/45"
                      }`}
                    />
                  ))}
                  {/* Center pulsing dot */}
                  <span
                    className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                      isActive ? "scale-125" : ""
                    }`}
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
                {/* Label */}
                <p
                  className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold tracking-[0.24em] transition-all duration-500 lg:text-[10px] ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                  style={{
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {c.key}
                </p>
              </div>
            );
          })}

          {/* Bottom-left label + page indicator */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 text-[10px] font-medium tracking-[0.32em] text-cream lg:px-10">
            <span
              className="drop-shadow"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              SKIN OBSERVATION
            </span>
            <span
              className="font-serif tabular-nums"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(CHAPTERS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right — heading + chapter list */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
          <p className="text-[10px] font-medium tracking-[0.32em] text-ink/55 lg:text-[11px]">
            THE SUNSHINE STANDARD
          </p>
          <h2 className="mt-8 font-serif text-4xl font-normal leading-[1.15] tracking-tight text-ink lg:text-[3.75rem] lg:leading-[1.05]">
            피부를 먼저 보고,
            <br />
            <span className="text-ink/55">필요한 만큼만.</span>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-[1.7] text-ink/60 lg:text-[15px]">
            정해진 답보다 한 사람의 피부에서 시작하는 선샤인의 진료 기준.
          </p>

          <p className="mt-8 max-w-lg text-sm leading-[1.8] text-ink/70 lg:text-[15px]">
            유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을
            지향하며 — 시술을 정하기 전에 지금의 피부와 원하는 변화의
            방향을 충분히 이해합니다.
          </p>

          <span aria-hidden className="mt-14 block h-px w-full bg-ink/15" />

          <ul className="divide-y divide-ink/15">
            {CHAPTERS.map((c, i) => {
              const isActive = i === active;
              return (
                <li
                  key={c.key}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <div className="grid w-full grid-cols-[48px_1fr_auto_24px] items-center gap-6 py-6">
                    <span
                      className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] tracking-[0.24em] font-medium ${
                        isActive
                          ? "text-[13px] text-ink"
                          : "text-[11px] text-ink/35"
                      }`}
                    >
                      {c.num}
                    </span>
                    <span
                      className={`font-serif tracking-tight transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "text-2xl text-ink lg:text-[2rem]"
                          : "text-lg text-ink/35 lg:text-xl"
                      }`}
                    >
                      {c.key}
                    </span>
                    <span
                      className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "text-base text-ink"
                          : "text-sm text-ink/40"
                      }`}
                    >
                      {c.short}
                    </span>
                    <span
                      aria-hidden
                      className="justify-self-end flex h-4 w-4 items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        background: isActive ? c.color : "transparent",
                        border: isActive
                          ? `1px solid ${c.color}`
                          : "1px solid rgba(24,19,15,0.25)",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes sss-scan {
          0%, 100% { opacity: 0.4; transform: translateY(-2%); }
          50% { opacity: 0.95; transform: translateY(2%); }
        }
        .animate-sss-scan { animation: sss-scan 5s ease-in-out infinite; }

        @keyframes sss-ping {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
        }
        .animate-sss-ping { animation: sss-ping 1.6s cubic-bezier(0.22,1,0.36,1) infinite; }
      `}</style>
    </section>
  );
}
