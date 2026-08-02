"use client";

import Image from "next/image";
import { STD_CHAPTERS } from "../standard-variants/SharedChapters";

const PLATES = [
  {
    i: 0,
    photo: "/clinic/devices-1.jpg",
    kicker: "ACNE · SCAR · PORE",
    copy: "반복되는 트러블의 고리를 끊고, 흉터 걱정 없이.",
  },
  {
    i: 1,
    photo: "/clinic/powder-room.jpg",
    kicker: "WHITENING · REDNESS",
    copy: "색소의 깊이에 맞춘, 다운타임 없는 화이트닝.",
  },
  {
    i: 2,
    photo: "/clinic/care-room.jpg",
    kicker: "ANTI-AGING",
    copy: "채우는 것이 아니라, 다시 자라나게 하는 재생.",
  },
  {
    i: 3,
    photo: "/clinic/vip-corridor.jpg",
    kicker: "LIFTING",
    copy: "깊이를 아는 리프팅 — SMAS까지 정확하게.",
  },
];

/**
 * G — STACKED PLATES
 * 스크롤 스택 — 카테고리 4장의 풀컬러 플레이트가
 * 스크롤할수록 차곡차곡 위로 쌓인다 (position: sticky).
 * 각 플레이트: 컬러 필드 + 클리닉 컷 + 대형 세리프.
 */
export function IdentityG() {
  return (
    <section className="bg-[#171310] text-cream">
      {/* 인트로 바 */}
      <div className="mx-auto flex max-w-7xl items-end justify-between px-6 pb-10 pt-24 lg:px-8">
        <p className="text-[10px] font-medium tracking-[0.35em] text-cream/55">
          THE SUNSHINE STANDARD
        </p>
        <p className="hidden font-serif text-sm italic text-cream/50 sm:block">
          피부를 먼저 보고, 필요한 만큼만.
        </p>
      </div>

      {/* 스택 영역 */}
      <div className="relative">
        {PLATES.map((p) => {
          const c = STD_CHAPTERS[p.i];
          return (
            <div key={c.key} className="sticky top-0">
              <div
                className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-between overflow-hidden rounded-t-[34px] px-8 py-12 lg:px-16 lg:py-16"
                style={{
                  background: `linear-gradient(150deg, ${c.color} 0%, ${shade(c.color, -38)} 100%)`,
                  boxShadow: "0 -30px 60px -30px rgba(0,0,0,0.55)",
                }}
              >
                {/* 상단 행 */}
                <div className="flex items-start justify-between">
                  <span className="font-serif text-[clamp(4rem,9vw,8rem)] leading-none text-white/25">
                    {c.num}
                  </span>
                  <span className="mt-3 rounded-full border border-white/40 px-4 py-1.5 text-[10px] font-semibold tracking-[0.28em] text-white/85">
                    {p.kicker}
                  </span>
                </div>

                {/* 중앙: 대형 타이틀 + 사진 칩 */}
                <div className="grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
                  <div>
                    <h3 className="font-serif text-[clamp(2.8rem,7vw,6rem)] font-normal leading-[1.05] text-white">
                      {c.short}
                    </h3>
                    <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-white/80">
                      {p.copy}
                    </p>
                  </div>
                  <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[22px] border border-white/25 lg:block">
                    <Image
                      src={p.photo}
                      alt=""
                      fill
                      sizes="30vw"
                      className="object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: `${c.color}33` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 색상 어둡게
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
