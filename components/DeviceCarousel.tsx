"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon, ArrowUpRightIcon } from "./icons";
import { DeviceMarketingCard, type DeviceMarketingData } from "./DeviceMarketingCard";

export type DeviceCard = {
  slug: string;
  name: string;
  desc: string;
  image: string;
  href: string;
  marketing: DeviceMarketingData;
};

export type CarouselBrand = {
  tagline: string;
  clinicName: string;
  englishName: string;
};

export type IntroCard = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
};

export type CarouselItem =
  | ({ kind: "intro" } & IntroCard)
  | ({ kind: "device" } & DeviceCard);

export function DeviceCarousel({
  items,
  detailLabel,
  brand,
}: {
  items: CarouselItem[];
  detailLabel: string;
  brand: CarouselBrand;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  function snapTargetScroll(card: HTMLElement, railWidth: number) {
    const align = card.dataset.snap === "start" ? "start" : "center";
    return align === "start"
      ? card.offsetLeft
      : card.offsetLeft - (railWidth - card.offsetWidth) / 2;
  }

  function update() {
    const rail = railRef.current;
    if (!rail) return;
    setMaxScroll(rail.scrollWidth - rail.clientWidth);
    const cards = rail.querySelectorAll<HTMLElement>("[data-card]");
    // active = card whose snap-target scroll position is closest to current scrollLeft
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const target = snapTargetScroll(c, rail.clientWidth);
      const dist = Math.abs(target - rail.scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    // explicitly snap to the leftmost card (intro if present, else first device) so initial active is unambiguous
    const firstCard = rail.querySelector<HTMLElement>("[data-card]");
    if (firstCard) {
      rail.scrollLeft = snapTargetScroll(firstCard, rail.clientWidth);
    }
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollToIndex(i: number) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelectorAll<HTMLElement>("[data-card]")[i];
    if (!card) return;
    rail.scrollTo({
      left: snapTargetScroll(card, rail.clientWidth),
      behavior: "smooth",
    });
  }

  function scrollBy(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : rail.clientWidth * 0.7;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* arrows (desktop only) */}
      <button
        type="button"
        aria-label="prev"
        onClick={() => scrollBy(-1)}
        disabled={railRef.current ? railRef.current.scrollLeft <= 2 : false}
        className="absolute -left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow-lg shadow-ink/10 transition hover:bg-cream hover:text-brand disabled:opacity-30 md:grid"
      >
        <ArrowIcon className="h-4 w-4 rotate-180" />
      </button>
      <button
        type="button"
        aria-label="next"
        onClick={() => scrollBy(1)}
        disabled={railRef.current ? railRef.current.scrollLeft >= maxScroll - 2 : false}
        className="absolute -right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow-lg shadow-ink/10 transition hover:bg-cream hover:text-brand disabled:opacity-30 md:grid"
      >
        <ArrowIcon className="h-4 w-4" />
      </button>

      <div
        ref={railRef}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-pl-5 px-5 pb-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:-mx-8 lg:scroll-pl-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const isActive = i === active;
          if (item.kind === "intro") {
            return (
              <div
                key={`intro-${i}`}
                data-card
                data-intro
                data-snap="start"
                className={`group relative shrink-0 snap-start overflow-hidden rounded-[2rem] w-[78%] sm:w-[55%] lg:w-[42%] xl:w-[36%] origin-center bg-gradient-to-br from-ink via-ink to-ink/85 text-cream transition-all duration-500 ${
                  isActive
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-75 hover:opacity-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={item.title}
                  className="absolute inset-0 z-10 cursor-pointer"
                  tabIndex={-1}
                />
                <div className="relative flex aspect-[4/5] flex-col justify-between p-7 lg:p-9">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/40 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-brand-soft/25 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 18px)",
                    }}
                  />
                  <div className="relative z-20">
                    <p className="text-[10px] font-semibold tracking-[0.28em] text-brand-soft">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-4 text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
                      {item.title}
                    </h3>
                  </div>
                  <div className="relative z-20">
                    <p className="max-w-[20rem] text-sm leading-relaxed text-cream/75">
                      {item.body}
                    </p>
                    <Link
                      href={item.href}
                      className={`mt-6 inline-flex items-center gap-1.5 rounded-full border border-cream/30 px-4 py-2 text-xs font-semibold text-cream transition hover:border-cream hover:bg-cream hover:text-ink ${
                        isActive ? "" : "pointer-events-none opacity-0"
                      }`}
                    >
                      {item.ctaLabel}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          }
          const d = item;
          return (
            <div
              key={`device-${d.slug}-${i}`}
              data-card
              data-device-card
              data-snap="center"
              className={`group relative shrink-0 snap-center overflow-hidden rounded-[2rem] border border-line bg-white shadow-lg shadow-ink/5 transition-all duration-500 w-[78%] sm:w-[55%] lg:w-[42%] xl:w-[36%] ${
                isActive
                  ? "scale-100 opacity-100"
                  : "scale-90 opacity-35 hover:opacity-70"
              }`}
            >
              <button
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={d.name}
                className="absolute inset-0 z-10 cursor-pointer"
                tabIndex={-1}
              />
              <DeviceMarketingCard
                device={d.marketing}
                brand={brand}
                className="!rounded-none !ring-0"
              />
              <Link
                href={d.href}
                aria-label={detailLabel}
                title={detailLabel}
                className={`group/cta absolute bottom-5 right-5 z-30 grid h-11 w-11 place-items-center rounded-full bg-ink text-cream shadow-lg transition hover:bg-brand-dark hover:shadow-brand/30 lg:bottom-7 lg:right-7 ${
                  isActive ? "" : "pointer-events-none opacity-0"
                }`}
              >
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
              </Link>
            </div>
          );
        })}
        {/* trailing spacer — allow last card to snap to left with peek room beyond */}
        <span
          aria-hidden
          className="-mr-4 shrink-0 w-[11%] sm:w-[22.5%] lg:w-[29%] xl:w-[32%]"
        />
      </div>

      {/* dots */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {Array.from({ length: items.length }).map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                isActive ? "w-6 bg-ink" : "w-1.5 bg-ink/25 hover:bg-ink/50"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
