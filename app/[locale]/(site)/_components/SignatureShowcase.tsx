"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

type Item = {
  slug: string;
  name: string;
  tagline: string;
  img: string;
  category: string;
  categoryLabel: string;
  english?: string;
  statement?: [string, string];
  description?: string;
  meta?: string;
};

/**
 * SIGNATURE SHOWCASE — Coverflow 3D 캐러셀
 * · 활성 카드가 중앙에서 앞으로, 좌우 카드는 각도 회전으로 뒤로
 * · 카드 전체를 제품 사진으로 꽉 채움 (여백 없음)
 * · 하단 카피(카테고리·이름·설명·CTA)는 활성 카드 기준으로 노출
 */
export function SignatureShowcase({ items }: { items: Item[] }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  function next() {
    setIdx((i) => (i + 1) % total);
  }
  function prev() {
    setIdx((i) => (i - 1 + total) % total);
  }

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null || startY.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      dx < 0 ? next() : prev();
    }
    startX.current = null;
    startY.current = null;
  }

  if (total === 0) return null;
  const cur = items[idx];

  return (
    <div className="relative w-full">
      {/* Heading row */}
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <div>
          <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark lg:text-[11px]">
            SIGNATURE SELECTION
          </p>
          <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.15] tracking-tight text-ink lg:text-[3.5rem]">
            선샤인이 선택한
            <br />
            <span className="text-ink/50">정교한 도구들.</span>
          </h2>
        </div>
        <p className="hidden items-center gap-3 text-[10px] font-medium tracking-[0.32em] text-ink/50 md:flex">
          DRAG TO EXPLORE
          <span aria-hidden className="block h-px w-16 bg-ink/30" />
        </p>
      </div>

      {/* Coverflow stage */}
      <div
        className="relative h-[440px] w-full overflow-hidden lg:h-[560px]"
        style={{ perspective: "1400px" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Prev/Next arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="이전"
          className="absolute left-4 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ink/25 bg-white/70 text-ink backdrop-blur transition hover:border-ink hover:bg-white lg:left-8"
        >
          ←
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="다음"
          className="absolute right-4 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ink/25 bg-white/70 text-ink backdrop-blur transition hover:border-ink hover:bg-white lg:right-8"
        >
          →
        </button>

        <div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((d, i) => {
            let offset = i - idx;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            const absOffset = Math.abs(offset);
            if (absOffset > 3) return null;
            const isActive = offset === 0;
            const translateX = offset * 250;
            const rotateY = offset * -32;
            const z = isActive ? 100 : 50 - absOffset * 10;
            const opacity = 1 - absOffset * 0.2;
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={d.name}
                aria-current={isActive}
                className={`absolute left-1/2 top-1/2 h-[400px] w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-[520px] lg:w-[400px] ${
                  isActive
                    ? "border-brand-dark bg-white shadow-2xl shadow-ink/25"
                    : "border-ink/15 bg-white"
                }`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg)`,
                  zIndex: z,
                  opacity,
                }}
              >
                {d.img && (
                  <Image
                    src={d.img}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(max-width: 1024px) 300px, 400px"
                    className="object-contain"
                  />
                )}
                {/* 활성 카드 하단 그라디언트 + 라벨 */}
                {isActive && (
                  <>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 px-5 text-center text-cream">
                      <p className="text-[9px] font-medium tracking-[0.28em] text-brand-soft">
                        {String(i + 1).padStart(2, "0")} · {d.categoryLabel}
                      </p>
                      <p className="mt-1 font-serif text-lg tracking-tight lg:text-xl">
                        {d.name}
                      </p>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Copy — 활성 카드 정보 */}
      <div
        key={cur.slug + "-copy"}
        className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
        style={{ animation: "sig-fade 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div>
          <p className="text-[10px] font-medium tracking-[0.28em] text-brand-dark lg:text-[11px]">
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {cur.categoryLabel}
          </p>
          {cur.english && (
            <p className="mt-3 font-serif text-[12px] tracking-[0.18em] text-ink/70">
              {cur.english}
            </p>
          )}
          <h3 className="mt-2 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-ink [word-break:keep-all] lg:text-[2.75rem] xl:text-5xl">
            {cur.name}
          </h3>
        </div>
        <div className="flex flex-col justify-end">
          <p className="max-w-xl text-[13px] leading-[1.75] text-ink/70 lg:text-[14px]">
            {cur.description ?? cur.tagline}
          </p>
          <Link
            href={`/treatments/${cur.category}/${cur.slug}`}
            className="mt-5 inline-flex w-fit items-center gap-2.5 border-b border-ink/30 pb-1 text-[11px] font-medium tracking-[0.18em] text-ink transition hover:border-brand-dark hover:text-brand-dark"
          >
            제품 자세히 보기
            <span aria-hidden className="text-brand-dark">↗</span>
          </Link>
        </div>
      </div>

      {/* 도트 인디케이터 */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`슬라이드 ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === idx ? "w-10 bg-brand-dark" : "w-2 bg-ink/25 hover:bg-ink/45"
            }`}
          />
        ))}
      </div>

      <style>{`@keyframes sig-fade { 0% { opacity: 0; transform: translateY(10px);} 100% { opacity: 1; transform: translateY(0);} }`}</style>
    </div>
  );
}
