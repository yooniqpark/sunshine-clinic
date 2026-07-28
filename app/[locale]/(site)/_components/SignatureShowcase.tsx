"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
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
 * SIGNATURE SELECTION — 풀블리드 카드 가로 스크롤 스트립
 * · 이미지가 카드 전체를 꽉 채움 (여백 없음)
 * · 하단 그라디언트 위 이름 + 간단 설명 오버레이
 * · 스크롤 스냅으로 부드럽게 이동, 데스크톱은 좌우 버튼
 */
export function SignatureShowcase({ items }: { items: Item[] }) {
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const pausedUntilRef = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  // 자동 스크롤: 데스크톱 전용 (모바일은 사용자 스와이프 우선)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || items.length <= 1) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // 터치 기기(모바일/태블릿)에서는 자동 스크롤을 완전히 끔 →
    // 사용자 스와이프가 rAF와 충돌하지 않게
    const isTouchDevice =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouchDevice) return;

    let raf = 0;
    let lastTs = 0;
    const SPEED = 600;

    const tick = (ts: number) => {
      const dt = lastTs === 0 ? 0 : Math.min(64, ts - lastTs);
      lastTs = ts;
      if (!document.hidden && ts > pausedUntilRef.current) {
        const delta = (SPEED * dt) / 1000;
        const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        if (nearEnd) {
          el.scrollTo({ left: 0, behavior: "smooth" });
          pausedUntilRef.current = ts + 1000;
        } else {
          el.scrollLeft += delta;
        }
      }
      raf = window.requestAnimationFrame(tick);
    };

    const startId = window.setTimeout(() => {
      raf = window.requestAnimationFrame(tick);
    }, 600);

    return () => {
      window.clearTimeout(startId);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [items.length]);

  function scrollByCard(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    // 화살표 클릭 시엔 rAF 자동 스크롤이 방해되지 않도록 잠시 pause
    pausedUntilRef.current = performance.now() + 900;
    // 화살표는 페이지 단위(가시 영역 폭)로 크게 이동
    const step = el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Heading row */}
      <div className="mb-10 lg:mb-14">
        <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark lg:text-[11px]">
          SIGNATURE SELECTION
        </p>
      </div>

      {/* Horizontal snap strip — 뷰포트 좌우 살짝 여백 (~4vw) */}
      <div className="relative left-1/2 w-[calc(100vw-4rem)] -translate-x-1/2 lg:w-[calc(100vw-6rem)]">
        {/* Desktop nav buttons — 슬라이드 세로 중심 */}
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="이전"
          className="absolute left-4 top-[210px] z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ink/20 bg-white/90 text-ink shadow-lg shadow-ink/10 backdrop-blur transition hover:border-ink hover:bg-white disabled:opacity-0 disabled:pointer-events-none lg:top-[300px] lg:grid"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="다음"
          className="absolute right-4 top-[210px] z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ink/20 bg-white/90 text-ink shadow-lg shadow-ink/10 backdrop-blur transition hover:border-ink hover:bg-white disabled:opacity-0 disabled:pointer-events-none lg:top-[300px] lg:grid"
        >
          →
        </button>
        <ul
          ref={scrollerRef}
          className="flex touch-pan-x snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain px-5 pb-6 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] lg:snap-none lg:gap-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: "smooth" }}
        >
          {items.map((d, i) => (
            <li
              key={d.slug}
              data-card
              className="shrink-0 snap-start"
            >
              <Link
                href={`/treatments/${d.category}/${d.slug}`}
                className="group relative block h-[440px] w-[300px] overflow-hidden rounded-3xl border border-ink/10 bg-[#f5eee1] transition-all duration-500 hover:border-brand-dark hover:shadow-xl hover:shadow-ink/15 lg:h-[600px] lg:w-[420px]"
              >
                {/* Full-bleed image */}
                {d.img && (
                  <Image
                    src={d.img}
                    alt=""
                    fill
                    priority={i < 5}
                    sizes="(max-width: 1024px) 300px, 420px"
                    className="object-cover object-center"
                  />
                )}

                {/* Bottom gradient */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent"
                />

                {/* Caption overlay */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-cream lg:p-7">
                  <p className="text-[9px] font-medium tracking-[0.28em] text-brand-soft lg:text-[10px]">
                    {d.categoryLabel}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-normal leading-tight tracking-tight lg:text-3xl">
                    {d.name}
                  </h3>
                  {d.english && (
                    <p className="mt-1 font-serif text-[11px] tracking-[0.16em] text-cream/60 lg:text-xs">
                      {d.english}
                    </p>
                  )}
                  <p className="mt-3 line-clamp-2 text-[12px] leading-[1.55] text-cream/75 lg:text-[13px]">
                    {d.description ?? d.tagline}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
