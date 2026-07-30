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
  const cardMetaRef = useRef<{ center: number; halfW: number; el: HTMLElement }[]>([]);
  const viewportRef = useRef({ width: 0, halfW: 0 });
  const rafPendingRef = useRef(0);

  // 카드 위치 캐싱 — layout 읽기를 rAF 밖에서만 수행
  function measure() {
    const el = scrollerRef.current;
    if (!el) return;
    viewportRef.current.width = el.clientWidth;
    viewportRef.current.halfW = el.clientWidth / 2;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const meta: { center: number; halfW: number; el: HTMLElement }[] = [];
    cards.forEach((card) => {
      // offsetLeft/offsetWidth는 layout thrash 없이 캐시 가능
      const halfW = card.offsetWidth / 2;
      meta.push({ center: card.offsetLeft + halfW, halfW, el: card });
    });
    cardMetaRef.current = meta;
  }

  // 캐시된 좌표만 사용 → getBoundingClientRect 호출 0회
  function applyCoverflow() {
    const el = scrollerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const viewportCenter = scrollLeft + viewportRef.current.halfW;
    const FALLOFF = viewportRef.current.halfW || 1;
    const MAX_ANGLE = 30;
    const MAX_Z = 40;
    const MIN_SCALE = 0.72; // 좌우 끝 카드 크기 비율 (중앙은 1)
    for (const m of cardMetaRef.current) {
      const dist = m.center - viewportCenter;
      const t = Math.max(-1, Math.min(1, dist / FALLOFF));
      const abs = Math.abs(t);
      const angle = -t * MAX_ANGLE;
      const translateZ = -abs * MAX_Z;
      const scale = 1 - (1 - MIN_SCALE) * abs;
      m.el.style.transform = `perspective(1600px) translateZ(${translateZ}px) rotateY(${angle}deg) scale(${scale})`;
      m.el.style.transformOrigin = "center bottom";
    }
  }

  function scheduleApply() {
    if (rafPendingRef.current) return;
    rafPendingRef.current = window.requestAnimationFrame(() => {
      rafPendingRef.current = 0;
      applyCoverflow();
    });
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    measure();
    applyCoverflow();
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);

    const onScroll = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
      scheduleApply();
    };
    const onResize = () => {
      measure();
      scheduleApply();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // 이미지 로드 후 offsetLeft 확정된 뒤 한 번 더
    const t = window.setTimeout(() => { measure(); applyCoverflow(); }, 700);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
      if (rafPendingRef.current) window.cancelAnimationFrame(rafPendingRef.current);
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
    const SPEED = 280;

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
          applyCoverflow(); // 스크롤 이벤트 자동 발화하지만 즉시 반영
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
          className="absolute left-4 top-[210px] z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/25 text-ink shadow-md shadow-ink/10 backdrop-blur-md transition hover:border-ink hover:bg-white/70 disabled:opacity-0 disabled:pointer-events-none lg:h-12 lg:w-12 lg:top-[300px]"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="다음"
          className="absolute right-4 top-[210px] z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/25 text-ink shadow-md shadow-ink/10 backdrop-blur-md transition hover:border-ink hover:bg-white/70 disabled:opacity-0 disabled:pointer-events-none lg:h-12 lg:w-12 lg:top-[300px]"
        >
          →
        </button>
        <ul
          ref={scrollerRef}
          className="flex touch-pan-x snap-x snap-proximity items-end gap-3 overflow-x-auto overscroll-x-contain px-5 pb-10 pt-6 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] lg:snap-none lg:gap-4 lg:px-8 lg:pb-14 lg:pt-8 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollBehavior: "smooth",
            perspective: "1800px",
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((d, i) => (
            <li
              key={d.slug}
              data-card
              className="shrink-0 snap-start"
            >
              <Link
                href={`/treatments/${d.category}/${d.slug}`}
                className="group relative block h-[360px] w-[220px] overflow-hidden rounded-2xl border border-ink/10 bg-[#f5eee1] transition-all duration-500 hover:border-brand-dark hover:shadow-xl hover:shadow-ink/15 lg:h-[500px] lg:w-[300px]"
              >
                {/* Full-bleed image */}
                {d.img && (
                  <Image
                    src={d.img}
                    alt=""
                    fill
                    priority={i < 5}
                    sizes="(max-width: 1024px) 220px, 300px"
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
