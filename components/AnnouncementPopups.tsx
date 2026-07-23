"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GRAND_OPEN_CATEGORIES } from "@/lib/grand-open";
import { GrandOpenCard } from "@/components/GrandOpenCard";

type Popup = {
  id: string;
  variant: "event" | "holiday";
};

const POPUPS: Popup[] = [
  { id: "grand-open-2026-07-v3", variant: "event" },
  { id: "aug-2026-holiday", variant: "holiday" },
];

const KEY_PREFIX = "sunshine-popup:";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function AnnouncementPopups() {
  const [mounted, setMounted] = useState(false);
  const [queue, setQueue] = useState<Popup[]>([]);
  const t = useTranslations("v2.popups");

  useEffect(() => {
    setMounted(true);
    const today = todayStr();
    const remaining = POPUPS.filter((p) => {
      try {
        return localStorage.getItem(KEY_PREFIX + p.id) !== today;
      } catch {
        return true;
      }
    });
    setQueue(remaining);
  }, []);

  const close = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [queue.length, close]);

  if (!mounted || queue.length === 0) return null;
  const current = queue[0];

  function closeToday() {
    try {
      localStorage.setItem(KEY_PREFIX + current.id, todayStr());
    } catch {}
    close();
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center px-3 py-4 sm:items-center sm:p-8">
      {/* backdrop click closes */}
      <button
        type="button"
        aria-label={t("close")}
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />
      <div className="pointer-events-auto relative flex h-[78vh] max-h-[600px] w-full max-w-md flex-col overflow-hidden rounded-[2rem] bg-ink/45 shadow-2xl shadow-ink/40 backdrop-blur-md sm:h-[820px] sm:max-h-[88vh] sm:max-w-xl">
        {current.variant === "event" ? <EventCarousel /> : <HolidayCard />}

        <div className="flex shrink-0 items-center justify-between border-t border-white/15 bg-ink/40 px-5 py-3 text-xs text-cream backdrop-blur">
          <label className="flex cursor-pointer items-center gap-2 text-cream/80">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.currentTarget.checked) closeToday();
              }}
              className="h-3.5 w-3.5 rounded border-white/30 accent-cream"
            />
            {t("dontShowToday")}
          </label>
          <button
            type="button"
            onClick={close}
            className="font-semibold text-cream hover:text-brand-soft"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventCarousel() {
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);
  const t = useTranslations("v2.popups.event");
  const total = GRAND_OPEN_CATEGORIES.length;

  const go = useCallback(
    (dir: 1 | -1) => setIdx((i) => (i + dir + total) % total),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    startX.current = null;
  }

  const current = GRAND_OPEN_CATEGORIES[idx];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Slide viewport — uniform height so all slides look the same */}
      <div className="relative min-h-0 flex-1">
        <div
          className="h-full overflow-y-auto"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <GrandOpenCard category={current} variant="compact" />
        </div>

        {/* Prev / Next arrows — top of viewport, translucent white */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute left-3 top-16 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-transparent text-cream transition hover:border-white hover:bg-white/10 sm:left-4 sm:top-20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-3 top-16 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-transparent text-cream transition hover:border-white hover:bg-white/10 sm:right-4 sm:top-20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>

      {/* Dots + CTA */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/15 bg-ink/40 px-5 py-3 text-cream backdrop-blur">
        <div className="flex items-center gap-1.5">
          {GRAND_OPEN_CATEGORIES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === idx}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-cream" : "w-1.5 bg-cream/40"
              }`}
            />
          ))}
        </div>
        <Link
          href="/community/events#grand-open-2026-07"
          className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-brand-soft hover:text-cream"
        >
          {t("ctaSeeMore")}
          <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}

function HolidayCard() {
  const t = useTranslations("v2.popups.holiday");
  const days = t.raw("days") as {
    date: string;
    weekday: string;
    label: string;
    status: "open" | "closed";
    hours?: string;
  }[];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 pt-12 pb-10 text-center text-cream sm:px-12 sm:pt-16 sm:pb-12">
      <p className="text-[10px] font-medium tracking-[0.3em] text-cream/70 drop-shadow">
        {t("brand")}
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-cream drop-shadow-md sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-cream/80 drop-shadow">
        {t("body1")}
        <br />
        {t("body2")}
      </p>

      <div className="my-auto grid grid-cols-2 gap-3 py-6">
        {days.map((d) => (
          <div
            key={d.date}
            className={`rounded-2xl px-4 py-5 text-center backdrop-blur ${
              d.status === "closed"
                ? "bg-ink/70 text-cream ring-1 ring-white/10"
                : "bg-white/15 text-cream ring-1 ring-white/25"
            }`}
          >
            <p className="text-[10px] font-medium text-cream/70">
              {d.date} ({d.weekday})
            </p>
            <p
              className={`mt-1 text-[10px] font-medium tracking-[0.1em] ${
                d.status === "closed" ? "text-brand-soft" : "text-brand-soft"
              }`}
            >
              {d.label}
            </p>
            <p className="mt-3 font-serif text-2xl text-cream drop-shadow">
              {d.status === "closed" ? t("closedLabel") : t("openLabel")}
            </p>
            {d.hours && (
              <p className="mt-2 text-[10px] text-cream/70">{d.hours}</p>
            )}
          </div>
        ))}
      </div>

      <p className="pt-2 text-[11px] leading-relaxed text-cream/70">
        {t("footer")}
      </p>
    </div>
  );
}
