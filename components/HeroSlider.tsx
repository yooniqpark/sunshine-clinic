"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { clinic } from "@/lib/data";
import type { EventItem } from "@/lib/data";
import { ArrowIcon, CalendarIcon } from "./icons";

type Slide =
  | { type: "brand"; bg: string }
  | {
      type: "event";
      layout: "full" | "split";
      bg: string; // banner if full; portrait photo if split
      photo: string;
      bgColor: string;
      bannerFocus: "top" | "center" | "bottom";
      tag: string;
      title: string;
      period: string;
      desc: string;
    };

const AUTOPLAY_MS = 5500;

export function HeroSlider({ events }: { events: EventItem[] }) {
  const tHero = useTranslations("hero");
  const tBrand = useTranslations("brand");
  const brandLabel = tBrand("name");
  const slides = useMemo<Slide[]>(
    () => [
      { type: "brand", bg: "/hero-clinic.png" },
      ...events.map((e) => ({
        type: "event" as const,
        layout: e.banner ? ("full" as const) : ("split" as const),
        bg: e.banner ?? e.photo,
        photo: e.photo,
        bgColor: e.bgColor,
        bannerFocus: e.bannerFocus ?? "center",
        tag: e.tag,
        title: e.title,
        period: e.period,
        desc: e.desc,
      })),
    ],
    [events]
  );
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    const id = setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, go]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  return (
    <section
      className="relative h-[560px] overflow-hidden sm:h-[600px] lg:h-[660px]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        const bgPos =
          slide.type === "brand"
            ? "center 38%"
            : slide.layout === "full"
              ? // landscape banner — vertical focal point from staff
                slide.bannerFocus === "top"
                ? "center 0%"
                : slide.bannerFocus === "bottom"
                  ? "center 100%"
                  : "center center"
              : // split fallback (portrait photo) — show upper face area
                "center 22%";
        const isFull = slide.type === "brand" || slide.layout === "full";
        return (
          <div
            key={i}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {isFull ? (
              <>
                <div
                  className={`absolute inset-0 bg-cover bg-no-repeat transition-transform ease-out ${
                    active ? "scale-105 duration-[6500ms]" : "scale-100 duration-0"
                  }`}
                  style={{ backgroundImage: `url('${slide.bg}')`, backgroundPosition: bgPos }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-ink/10" />

                <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 lg:px-8">
                  <div className="max-w-xl text-cream lg:ml-48 xl:ml-56">
                    {slide.type === "brand" ? (
                      <>
                        <h1 className="mt-14 text-balance text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:mt-20 lg:max-w-2xl lg:text-5xl">
                          <span className="whitespace-nowrap">
                            {tHero("brandHeadlineLine1")}
                          </span>
                          <br />
                          <span className="whitespace-nowrap">
                            <span className="text-brand-soft">{tHero("brandHeadlineHighlight")}</span>
                            {tHero("brandHeadlineLine2")}
                          </span>
                        </h1>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-cream/85 lg:text-lg">
                          {tHero("brandDescLine1")}
                          <br />
                          {tHero("brandDescLine2")}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                          <a
                            href={clinic.bookingHref}
                            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-none transition-all duration-500 hover:bg-brand-dark hover:shadow-[0_22px_48px_-6px_rgba(196,144,116,0.85),0_10px_24px_-4px_rgba(196,144,116,0.65),0_0_18px_2px_rgba(232,205,175,0.45)]"
                          >
                            <CalendarIcon className="h-4 w-4" />
                            {tHero("ctaBook")}
                          </a>
                          <Link
                            href="/treatments/lifting"
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-cream backdrop-blur shadow-none transition-all duration-500 hover:bg-white/20 hover:shadow-[0_22px_48px_-6px_rgba(196,144,116,0.7),0_10px_24px_-4px_rgba(196,144,116,0.5),0_0_18px_2px_rgba(232,205,175,0.4)]"
                          >
                            {tHero("ctaTreatments")}
                            <ArrowIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-semibold tracking-[0.25em] text-brand-soft">
                          {tHero("event")} · {slide.tag}
                        </span>
                        <p className="mt-3 text-sm font-medium text-cream/80">{slide.period}</p>
                        <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                          {slide.title}
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-cream/85">
                          {slide.desc}
                        </p>
                        <Link
                          href="/community/events"
                          className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-ink shadow-none transition-all duration-500 hover:bg-white hover:shadow-[0_22px_48px_-6px_rgba(196,144,116,0.9),0_10px_24px_-4px_rgba(196,144,116,0.7),0_0_18px_2px_rgba(232,205,175,0.5)]"
                        >
                          {tHero("ctaDetail")}
                          <ArrowIcon className="h-4 w-4" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // SPLIT EVENT — portrait photo right + dark text on light bgColor backdrop
              slide.type === "event" && (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${slide.bgColor} 0%, ${slide.bgColor}f0 55%, ${slide.bgColor}b8 100%)`,
                    }}
                  />
                  <div className="relative mx-auto grid h-full max-w-7xl items-stretch gap-8 px-5 lg:grid-cols-[1fr_1fr] lg:px-8">
                    <div className="flex flex-col justify-center max-w-xl lg:ml-44 xl:ml-52">
                      <span className="text-xs font-semibold tracking-[0.25em] text-brand-dark">
                        {tHero("event")} · {slide.tag}
                      </span>
                      <p className="mt-3 text-sm font-medium text-ink/65">{slide.period}</p>
                      <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
                        {slide.title}
                      </h2>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75">
                        {slide.desc}
                      </p>
                      <Link
                        href="/community/events"
                        className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream shadow-none transition-all duration-500 hover:bg-brand-dark hover:shadow-[0_22px_48px_-6px_rgba(130,95,70,0.5),0_10px_24px_-4px_rgba(130,95,70,0.4),0_0_18px_2px_rgba(196,144,116,0.35)]"
                      >
                        {tHero("ctaDetail")}
                        <ArrowIcon className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="relative hidden h-full w-full overflow-hidden shadow-2xl shadow-ink/20 lg:block">
                      <div
                        className={`absolute inset-0 bg-cover bg-no-repeat transition-transform ease-out ${
                          active ? "scale-105 duration-[6500ms]" : "scale-100 duration-0"
                        }`}
                        style={{
                          backgroundImage: `url('${slide.photo}')`,
                          backgroundPosition: "center 18%",
                        }}
                      />
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        );
      })}

      {/* side tab menu (desktop) — color adapts to current slide brightness */}
      {(() => {
        const activeSlide = slides[index];
        const isDarkBg =
          activeSlide.type === "brand" ||
          (activeSlide.type === "event" && activeSlide.layout === "full");
        const fg = isDarkBg
          ? { active: "text-cream", idle: "text-cream/55", hover: "hover:text-cream/90", barOn: "bg-cream", barOff: "bg-cream/40", barHover: "group-hover:bg-cream/70" }
          : { active: "text-ink", idle: "text-ink/55", hover: "hover:text-ink/85", barOn: "bg-ink", barOff: "bg-ink/40", barHover: "group-hover:bg-ink/70" };
        return (
          <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex xl:left-8">
            {slides.map((s, i) => {
              const title = s.type === "brand" ? brandLabel : s.title;
              const isActive = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${i + 1} / ${title}`}
                  aria-current={isActive}
                  className={`group flex items-center gap-3 text-left transition duration-500 ${
                    isActive ? fg.active : `${fg.idle} ${fg.hover}`
                  }`}
                >
                  <span
                    className={`block h-px transition-all duration-500 ${
                      isActive
                        ? `w-10 ${fg.barOn}`
                        : `w-4 ${fg.barOff} group-hover:w-7 ${fg.barHover}`
                    }`}
                  />
                  <span className="whitespace-nowrap text-xs font-semibold tracking-wide">
                    {String(i + 1).padStart(2, "0")} {title}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* title chips (mobile/tablet) */}
      <div className="absolute bottom-5 left-1/2 z-10 flex max-w-[94%] -translate-x-1/2 gap-1.5 overflow-x-auto px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
        {slides.map((s, i) => {
          const title = s.type === "brand" ? brandLabel : s.title;
          const active = i === index;
          return (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1} / ${title}`}
              aria-current={active}
              onClick={() => go(i)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                active
                  ? "bg-cream text-ink"
                  : "border border-white/30 bg-ink/25 text-cream/85 backdrop-blur"
              }`}
            >
              {title}
            </button>
          );
        })}
      </div>
    </section>
  );
}
