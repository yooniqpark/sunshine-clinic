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

  // 아치(커버플로우) 효과 제거 — 모든 카드를 동일한 크기·정면으로 평평하게 슬라이딩.
  // 혹시 남아있을 수 있는 인라인 transform만 정리한다.
  function applyCoverflow() {
    for (const m of cardMetaRef.current) {
      m.el.style.transform = "";
      m.el.style.opacity = "";
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

  // 자동 스크롤: 데스크톱·모바일 공통. 모바일은 터치하는 동안 멈추고
  // 손을 떼면 잠시 후(관성 스크롤이 끝날 때쯤) 다시 흐른다.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || items.length <= 1) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const onTouchStart = () => {
      pausedUntilRef.current = Number.MAX_SAFE_INTEGER;
    };
    const onTouchEnd = () => {
      pausedUntilRef.current = performance.now() + 2500;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    let raf = 0;
    let lastTs = 0;
    const SPEED = 55;
    // scrollLeft 정수 반올림으로 소수점 이동량이 버려져 끊겨 보이는 것을 막기 위해
    // 위치를 float으로 직접 관리하고, 사용자 스크롤로 어긋나면 재동기화한다.
    let pos = el.scrollLeft;

    const tick = (ts: number) => {
      const dt = lastTs === 0 ? 0 : Math.min(64, ts - lastTs);
      lastTs = ts;
      if (!document.hidden && ts > pausedUntilRef.current) {
        if (Math.abs(el.scrollLeft - pos) > 1.5) pos = el.scrollLeft; // 사용자 이동 반영
        const delta = (SPEED * dt) / 1000;
        const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        if (nearEnd) {
          el.scrollTo({ left: 0, behavior: "smooth" });
          pos = 0;
          // 되감기 애니메이션이 끝나기 전에 tick이 다시 밀면 두 스크롤이
          // 싸우며 이음새가 끊긴다 → 넉넉히 대기
          pausedUntilRef.current = ts + 2000;
        } else {
          pos += delta;
          el.scrollLeft = pos;
          applyCoverflow(); // 스크롤 이벤트 자동 발화하지만 즉시 반영
        }
      } else {
        pos = el.scrollLeft;
      }
      raf = window.requestAnimationFrame(tick);
    };

    const startId = window.setTimeout(() => {
      raf = window.requestAnimationFrame(tick);
    }, 600);

    return () => {
      window.clearTimeout(startId);
      if (raf) window.cancelAnimationFrame(raf);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
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
      <div className="mb-6 lg:mb-14">
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
          className="absolute left-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-transparent bg-white/25 text-ink shadow-md shadow-ink/10 backdrop-blur-md transition hover:border-ink hover:bg-white/70 disabled:opacity-0 disabled:pointer-events-none lg:h-12 lg:w-12 "
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="다음"
          className="absolute right-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-transparent bg-white/25 text-ink shadow-md shadow-ink/10 backdrop-blur-md transition hover:border-ink hover:bg-white/70 disabled:opacity-0 disabled:pointer-events-none lg:h-12 lg:w-12 "
        >
          →
        </button>
        {/* scroll-behavior: smooth를 여기 걸면 rAF 자동 스크롤의 scrollLeft
            대입이 매 프레임 smooth 애니메이션을 재시작해 덜컹거린다.
            부드러운 이동이 필요한 곳(화살표·되감기)은 scrollTo/scrollBy에
            behavior: "smooth"를 명시적으로 넘긴다. */}
        <ul
          ref={scrollerRef}
          className="flex touch-pan-x items-center gap-2 overflow-x-auto overscroll-x-contain px-5 pb-8 pt-4 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] lg:gap-3 lg:px-8 lg:pb-24 lg:pt-16 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((d, i) => (
            <li
              key={d.slug}
              data-card
              className="shrink-0"
            >
              <Link
                href={`/treatments/${d.category}/${d.slug}`}
                aria-label={`${d.categoryLabel} — ${d.name}`}
                className="group relative block h-[380px] w-[285px] overflow-hidden rounded-[2px] border border-ink/[0.08] bg-white shadow-[0_12px_28px_-16px_rgba(28,25,23,0.35)] lg:h-[480px] lg:w-[360px]"
              >
                {d.img && (
                  <Image
                    src={d.img}
                    alt={`${d.categoryLabel} ${d.name}`}
                    fill
                    priority={i < 5}
                    sizes="(max-width: 1024px) 285px, 360px"
                    className="object-cover object-center"
                  />
                )}

                {/* Bottom gradient — 캡션 가독용 */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent"
                />

                {/* Caption — 카테고리 · 이름 · 영문 · 설명 */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-cream lg:p-6">
                  <p className="text-[9px] font-medium tracking-[0.3em] text-cream/70 lg:text-[10px]">
                    {d.categoryLabel}
                  </p>
                  <h3 className="mt-1.5 font-serif text-xl font-normal leading-tight tracking-tight lg:text-2xl">
                    {d.name}
                  </h3>
                  {d.english && (
                    <p className="mt-1 font-serif text-[10px] tracking-[0.18em] text-cream/55 lg:text-[11px]">
                      {d.english}
                    </p>
                  )}
                  {(d.description ?? d.tagline) && (
                    <p className="mt-2 line-clamp-2 text-[11px] leading-[1.55] text-cream/80 lg:text-[12px]">
                      {d.description ?? d.tagline}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
