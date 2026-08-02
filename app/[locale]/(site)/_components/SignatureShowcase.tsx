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
  // 레퍼런스 스타일: 중앙 카드는 정면·선명, 가장자리로 갈수록
  // 완만한 rotateY 아치 + 살짝 축소 + 페이드아웃
  function applyCoverflow() {
    const el = scrollerRef.current;
    if (!el) return;
    // 모바일: 3D 아치 없이 작은 카드가 평평하게 한 줄로 정렬 (레퍼런스 스타일)
    if (window.innerWidth < 1024) {
      for (const m of cardMetaRef.current) {
        m.el.style.transform = "";
        m.el.style.opacity = "";
      }
      return;
    }
    const scrollLeft = el.scrollLeft;
    const viewportCenter = scrollLeft + viewportRef.current.halfW;
    // falloff를 뷰포트 절반보다 넓게 — 카드가 화면을 가로지르는 동안
    // 각도 변화가 완만해서 "그대로 쭉 미끄러지는" 느낌 (레퍼런스와 동일)
    const FALLOFF = (viewportRef.current.width || 1) * 0.72;
    // 레퍼런스(Lumière) 매칭: 중앙 정면·플랫, 옆으로 갈수록 중앙을 향해
    // 뚜렷하게 꺾이는 아치. 페이드는 맨 끝 카드만.
    // 볼록 원통의 표면 노멀 방향(바깥쪽)으로 살짝만 —
    // 각도를 낮춰 "묘하게 바라보는" 느낌 제거, 곡면의 자연스러운 접선처럼
    const MAX_ANGLE = 18;
    const BULGE = 70; // 중앙이 관찰자 쪽으로 볼록 (원통 곡면)
    const MAX_Z = 80; // 가장자리는 뒤로 후퇴
    const MIN_SCALE = 0.9; // 깊이가 크기감을 만들므로 scale 변화는 살짝만
    for (const m of cardMetaRef.current) {
      const dist = m.center - viewportCenter;
      const t = Math.max(-1, Math.min(1, dist / FALLOFF));
      const abs = Math.abs(t);
      // rotateY(+θ): 카드가 오른쪽을 바라봄. 우측(t>0) 카드 → 오른쪽,
      // 좌측(t<0) 카드 → 왼쪽 (볼록 곡면의 바깥 방향)
      const angle = t * MAX_ANGLE;
      // 포물선 깊이: 중앙 +BULGE(앞) → 가장자리 -MAX_Z(뒤). 볼록한 원통 곡면.
      const translateZ = BULGE * (1 - abs * abs) - MAX_Z * abs;
      const scale = 1 - (1 - MIN_SCALE) * abs;
      // per-card perspective()를 쓰면 카드마다 소실점이 달라 아치가 끊겨 보인다.
      // 부모 ul의 공유 perspective 하나로 통일해 이어진 곡면처럼.
      m.el.style.transform = `translateZ(${translateZ}px) rotateY(${angle}deg) scale(${scale})`;
      m.el.style.transformOrigin = "center center";
      // abs^4 커브 — 중앙~중간은 선명(1), 맨 끝에서만 급격히 사라짐
      m.el.style.opacity = String(1 - 0.85 * abs ** 4);
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
    const SPEED = 55;

    const tick = (ts: number) => {
      const dt = lastTs === 0 ? 0 : Math.min(64, ts - lastTs);
      lastTs = ts;
      if (!document.hidden && ts > pausedUntilRef.current) {
        const delta = (SPEED * dt) / 1000;
        const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        if (nearEnd) {
          el.scrollTo({ left: 0, behavior: "smooth" });
          // 되감기 애니메이션이 끝나기 전에 tick이 다시 밀면 두 스크롤이
          // 싸우며 이음새가 끊긴다 → 넉넉히 대기
          pausedUntilRef.current = ts + 2000;
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
          className="absolute left-4 top-1/2 z-20 hidden lg:grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/25 text-ink shadow-md shadow-ink/10 backdrop-blur-md transition hover:border-ink hover:bg-white/70 disabled:opacity-0 disabled:pointer-events-none lg:h-12 lg:w-12 "
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="다음"
          className="absolute right-4 top-1/2 z-20 hidden lg:grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/25 text-ink shadow-md shadow-ink/10 backdrop-blur-md transition hover:border-ink hover:bg-white/70 disabled:opacity-0 disabled:pointer-events-none lg:h-12 lg:w-12 "
        >
          →
        </button>
        {/* scroll-behavior: smooth를 여기 걸면 rAF 자동 스크롤의 scrollLeft
            대입이 매 프레임 smooth 애니메이션을 재시작해 덜컹거린다.
            부드러운 이동이 필요한 곳(화살표·되감기)은 scrollTo/scrollBy에
            behavior: "smooth"를 명시적으로 넘긴다. */}
        <ul
          ref={scrollerRef}
          className="flex touch-pan-x snap-x snap-proximity items-center gap-2 overflow-x-auto overscroll-x-contain px-5 pb-10 pt-6 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] lg:snap-none lg:gap-3 lg:px-8 lg:pb-24 lg:pt-16 [&::-webkit-scrollbar]:hidden"
          style={{
            perspective: "1400px",
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
                aria-label={`${d.categoryLabel} — ${d.name}`}
                className="group relative block h-[180px] w-[135px] overflow-hidden rounded-lg border border-ink/[0.08] bg-white shadow-[0_12px_28px_-16px_rgba(28,25,23,0.35)] lg:h-[373px] lg:w-[280px] lg:rounded-[2px]"
              >
                {/* 레퍼런스 스타일: 캡션 없는 순수 이미지 카드 */}
                {d.img && (
                  <Image
                    src={d.img}
                    alt={`${d.categoryLabel} ${d.name}`}
                    fill
                    priority={i < 5}
                    sizes="(max-width: 1024px) 135px, 280px"
                    className="object-cover object-center"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
