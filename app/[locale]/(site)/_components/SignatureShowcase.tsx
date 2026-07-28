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

  function scrollByCard(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-card]");
    const step = first ? first.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Heading row */}
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark lg:text-[11px]">
          SIGNATURE SELECTION
        </p>
        <p className="hidden text-[10px] font-medium tracking-[0.32em] text-ink/50 md:block">
          TOTAL {String(items.length).padStart(2, "0")}
        </p>
      </div>

      {/* Horizontal snap strip */}
      <div className="relative -mx-5 lg:-mx-8">
        {/* Desktop nav buttons — 슬라이드 세로 중심 */}
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="이전"
          className="absolute left-4 top-[220px] z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ink/20 bg-white/90 text-ink shadow-lg shadow-ink/10 backdrop-blur transition hover:border-ink hover:bg-white disabled:opacity-0 disabled:pointer-events-none lg:top-[300px] lg:grid"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="다음"
          className="absolute right-4 top-[220px] z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ink/20 bg-white/90 text-ink shadow-lg shadow-ink/10 backdrop-blur transition hover:border-ink hover:bg-white disabled:opacity-0 disabled:pointer-events-none lg:top-[300px] lg:grid"
        >
          →
        </button>
        <ul
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
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
                    sizes="(max-width: 1024px) 300px, 420px"
                    className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                )}

                {/* Index badge */}
                <span className="absolute left-5 top-5 z-10 rounded-full bg-white/70 px-3 py-1 font-serif text-xs italic text-ink/70 backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>

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
