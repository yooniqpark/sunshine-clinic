"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  meta?: string; // e.g. "LIFTING · HIFU"
};

export function SignatureShowcase({ items }: { items: Item[] }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // pointer drag on desktop
  const dragging = useRef(false);
  const dragStartX = useRef(0);

  useEffect(() => {
    // reset transition on idx change (nothing required for now)
  }, [idx]);

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

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "touch") return;
    dragging.current = true;
    dragStartX.current = e.clientX;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (e.pointerType === "touch" || !dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  }

  if (total === 0) return null;
  const cur = items[idx];

  return (
    <div className="relative w-full">
      {/* Desktop edge arrows (전체 섹션 좌우 끝) */}
      <button
        type="button"
        onClick={prev}
        aria-label="이전"
        className="absolute left-[-1rem] top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ink/25 bg-[#e9e0d5]/80 text-ink backdrop-blur transition hover:border-ink hover:bg-white lg:grid xl:left-[-3rem]"
      >
        ←
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="다음"
        className="absolute right-[-1rem] top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ink/25 bg-[#e9e0d5]/80 text-ink backdrop-blur transition hover:border-ink hover:bg-white lg:grid xl:right-[-3rem]"
      >
        →
      </button>

      {/* Heading row */}
      <div className="mb-14 flex items-end justify-between gap-6 lg:mb-20">
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

      {/* Stage — 이미지 위 · 텍스트 하단 (풀와이드) */}
      <div
        ref={stageRef}
        className="flex flex-col gap-8 lg:gap-10"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Visual — 풀와이드 · 큰 이미지 */}
        <div className="relative aspect-[3/4] w-full select-none overflow-hidden sm:aspect-[4/3] lg:aspect-[2.4/1] lg:min-h-[520px]">
          {/* Mobile-only arrows overlaid on image */}
          <button
            type="button"
            onClick={prev}
            aria-label="이전"
            className="absolute left-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-ink/25 bg-white/70 text-ink backdrop-blur transition hover:bg-white lg:hidden"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="다음"
            className="absolute right-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-ink/25 bg-white/70 text-ink backdrop-blur transition hover:bg-white lg:hidden"
          >
            →
          </button>

          {/* Halo circles */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-soft/50"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-soft/40"
          />

          {/* Ghost number */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-2 select-none font-serif leading-none text-ink/[0.06] lg:text-[14rem]"
            style={{ fontSize: "clamp(6rem, 14vw, 14rem)" }}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>

          {/* Image slides — 활성 카드 옆으로 이전/다음이 살짝 겹쳐 보임 */}
          {items.map((d, i) => {
            // relative offset in [-N..N] range, wrap
            let offset = i - idx;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            let cls = "opacity-0 scale-75 pointer-events-none";
            let z = 0;
            if (offset === 0) {
              cls = "translate-x-0 scale-100 opacity-100";
              z = 30;
            } else if (offset === -1) {
              cls = "-translate-x-[38%] scale-[0.72] opacity-30 blur-[1px]";
              z = 10;
            } else if (offset === 1) {
              cls = "translate-x-[38%] scale-[0.72] opacity-30 blur-[1px]";
              z = 10;
            } else if (offset === -2) {
              cls = "-translate-x-[62%] scale-[0.55] opacity-10 blur-[2px]";
              z = 5;
            } else if (offset === 2) {
              cls = "translate-x-[62%] scale-[0.55] opacity-10 blur-[2px]";
              z = 5;
            }

            return (
              <div
                key={d.slug}
                aria-hidden={i !== idx}
                style={{ zIndex: z }}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${cls}`}
              >
                {d.img && (
                  <Image
                    src={d.img}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-contain"
                  />
                )}
              </div>
            );
          })}

          {/* Reflection */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[10%] bottom-0 h-24 rounded-[50%] blur-2xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(24,19,15,0.14) 0%, rgba(24,19,15,0) 70%)",
            }}
          />
        </div>

        {/* Copy — 이미지 아래, 풀와이드 · 좌측: 카테고리+영문+이름, 우측: 설명+CTA */}
        <article
          className="relative grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
          aria-live="polite"
        >
          <div key={cur.slug + "-a"} style={{ animation: "sig-fade 0.7s cubic-bezier(0.22,1,0.36,1) both" }}>
            <p className="text-[9px] font-medium tracking-[0.28em] text-brand-dark lg:text-[10px]">
              {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              {cur.meta ? ` · ${cur.meta}` : ` · ${cur.categoryLabel}`}
            </p>
            {cur.english && (
              <p className="mt-2.5 font-serif text-[11px] tracking-[0.18em] text-ink/70">
                {cur.english}
              </p>
            )}
            <h3 className="mt-1.5 font-serif text-2xl font-normal leading-[1.1] tracking-tight text-ink [word-break:keep-all] lg:text-[2rem] xl:text-[2.5rem]">
              {cur.name}
            </h3>
          </div>

          <div
            key={cur.slug + "-b"}
            className="flex flex-col justify-end"
            style={{ animation: "sig-fade 0.7s 80ms cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <p className="max-w-xl text-[12.5px] leading-[1.7] text-ink/70 lg:text-[13.5px]">
              {cur.description ?? cur.tagline}
            </p>
            <Link
              href={`/treatments/${cur.category}/${cur.slug}`}
              className="mt-4 inline-flex w-fit items-center gap-2.5 border-b border-ink/30 pb-1 text-[10px] font-medium tracking-[0.18em] text-ink transition hover:border-brand-dark hover:text-brand-dark"
            >
              제품 자세히 보기
              <span aria-hidden className="text-brand-dark">↗</span>
            </Link>
          </div>
        </article>
      </div>

      {/* Thumbnail strip — 모든 제품 한 눈에, 클릭으로 이동 */}
      <div className="mt-8 flex items-center gap-4 lg:mt-10">
        <div
          className="flex flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-3"
          aria-label="슬라이드 선택"
        >
          {items.map((it, i) => {
            const isActive = i === idx;
            return (
              <button
                key={it.slug}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`${it.name} 보기`}
                aria-current={isActive}
                className={`group relative flex shrink-0 flex-col items-center overflow-hidden rounded-xl border transition-all duration-500 ${
                  isActive
                    ? "border-brand-dark bg-white shadow-md shadow-ink/10"
                    : "border-ink/15 bg-white/60 hover:border-ink/40"
                }`}
                style={{ width: 92, height: 92 }}
              >
                {it.img && (
                  <div className="relative h-full w-full">
                    <Image
                      src={it.img}
                      alt=""
                      fill
                      sizes="92px"
                      className={`object-contain p-2 transition ${
                        isActive ? "opacity-100" : "opacity-70 group-hover:opacity-90"
                      }`}
                    />
                  </div>
                )}
                {isActive && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-brand-dark"
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="hidden shrink-0 font-serif text-sm tabular-nums text-ink/60 sm:block">
          <span className="text-ink">{String(idx + 1).padStart(2, "0")}</span>
          <span aria-hidden className="mx-2 inline-block h-px w-4 align-middle bg-ink/30" />
          {String(total).padStart(2, "0")}
        </p>
      </div>

      <style>{`@keyframes sig-fade { 0% { opacity: 0; transform: translateY(10px);} 100% { opacity: 1; transform: translateY(0);} }`}</style>
    </div>
  );
}
