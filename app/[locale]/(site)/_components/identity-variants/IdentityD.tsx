"use client";

import Image from "next/image";
import { useState } from "react";
import { STD_CHAPTERS } from "../standard-variants/SharedChapters";

const SPACES = [
  { src: "/clinic/reception-v2.jpg", label: "RECEPTION" },
  { src: "/clinic/lounge.jpg", label: "LOUNGE" },
  { src: "/clinic/vip-corridor.jpg", label: "VIP CORRIDOR" },
  { src: "/clinic/devices-1.jpg", label: "DEVICE ROOM" },
];

/**
 * D — ARCHITECTURAL PANELS
 * 공간이 곧 아이덴티티 — 클리닉 인테리어(사람 없음) 아코디언.
 * 호버 시 확장 + 챕터 컬러 라인이 하단에 뜬다.
 */
export function IdentityD() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#171310] py-20 text-cream lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-end justify-between pb-8">
          <p className="text-[10px] font-medium tracking-[0.35em] text-cream/55">
            THE SUNSHINE STANDARD
          </p>
          <p className="hidden font-serif text-sm italic text-cream/50 sm:block">
            피부를 먼저 보고, 필요한 만큼만.
          </p>
        </div>

        <div className="flex h-[460px] flex-col gap-3 lg:h-[540px] lg:flex-row">
          {SPACES.map((s, i) => {
            const on = active === i;
            const c = STD_CHAPTERS[i];
            return (
              <button
                key={s.label}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="relative overflow-hidden rounded-[22px] text-left transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ flexGrow: on ? 3 : 1, flexBasis: 0 }}
              >
                <Image
                  src={s.src}
                  alt={s.label}
                  fill
                  sizes="(min-width:1024px) 60vw, 100vw"
                  className="object-cover transition-all duration-700"
                  style={{
                    transform: on ? "scale(1.02)" : "scale(1.12)",
                    filter: on ? "none" : "grayscale(0.5) brightness(0.55)",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#171310]/80 via-transparent to-transparent"
                />
                {/* 챕터 컬러 라인 */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[3px] transition-all duration-700"
                  style={{ width: on ? "100%" : "0%", background: c.color }}
                />
                <span className="absolute left-5 top-5 font-serif text-sm text-white/80">
                  {c.num}
                </span>
                {/* 라벨 */}
                <span
                  className={`absolute bottom-6 left-6 transition-all duration-500 ${
                    on ? "opacity-100" : "opacity-70"
                  }`}
                >
                  <span className="block text-[9px] font-semibold tracking-[0.3em] text-white/70">
                    {s.label}
                  </span>
                  <span
                    className={`mt-1.5 block font-serif text-white transition-all duration-500 ${
                      on ? "text-3xl lg:text-4xl" : "text-lg"
                    }`}
                  >
                    {c.short}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
