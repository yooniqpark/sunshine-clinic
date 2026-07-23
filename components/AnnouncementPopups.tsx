"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Popup = {
  id: string;
  variant: "event" | "holiday";
};

const POPUPS: Popup[] = [
  { id: "grand-open-2026-07", variant: "event" },
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

  if (!mounted || queue.length === 0) return null;
  const current = queue[0];

  function close() {
    setQueue((q) => q.slice(1));
  }
  function closeToday() {
    try {
      localStorage.setItem(KEY_PREFIX + current.id, todayStr());
    } catch {}
    close();
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] flex items-end justify-center px-4 py-6 sm:items-center sm:p-8">
      <div className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-2xl shadow-ink/25 backdrop-blur-2xl sm:max-w-lg">
        {current.variant === "event" ? <EventCard /> : <HolidayCard />}

        <div className="flex items-center justify-between border-t border-line/60 px-5 py-3 text-xs">
          <label className="flex cursor-pointer items-center gap-2 text-ink-soft">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.currentTarget.checked) closeToday();
              }}
              className="h-3.5 w-3.5 rounded border-line accent-ink"
            />
            {t("dontShowToday")}
          </label>
          <button
            type="button"
            onClick={close}
            className="font-semibold text-ink hover:text-brand-dark"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventCard() {
  const t = useTranslations("v2.popups.event");
  return (
    <div className="relative overflow-hidden px-10 pt-14 pb-12 text-center sm:px-14 sm:pt-16 sm:pb-14">
      {/* Corner ornaments */}
      <div className="pointer-events-none absolute left-6 top-6 h-6 w-6 border-l border-t border-ink/25" />
      <div className="pointer-events-none absolute right-6 top-6 h-6 w-6 border-r border-t border-ink/25" />
      <div className="pointer-events-none absolute bottom-6 left-6 h-6 w-6 border-b border-l border-ink/25" />
      <div className="pointer-events-none absolute bottom-6 right-6 h-6 w-6 border-b border-r border-ink/25" />

      <p className="text-[10px] font-medium tracking-[0.3em] text-ink-soft">
        {t("kicker")}
      </p>
      <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-ink">
        {t("brand")}
      </p>
      <div className="mx-auto mt-2 flex items-center justify-center gap-2">
        <span className="h-px w-8 bg-ink/25" />
        <span className="text-[10px] tracking-[0.35em] text-ink-soft">2026</span>
        <span className="h-px w-8 bg-ink/25" />
      </div>

      <h2 className="mt-8 font-serif text-5xl font-normal leading-[0.95] tracking-tight text-ink sm:text-6xl">
        GRAND
        <br />
        OPEN
      </h2>
      <p className="mt-6 text-sm tracking-[0.32em] text-ink-soft">
        {t("date")}
      </p>
      <p className="mx-auto mt-8 max-w-[280px] text-xs leading-relaxed text-ink-soft sm:text-sm">
        {t("body")}
      </p>

      <Link
        href="/community/events#grand-open-2026-07"
        className="group mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold tracking-[0.15em] text-cream transition hover:bg-brand-dark"
      >
        {t("ctaSeeMore")}
        <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
      </Link>
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
    <div className="px-8 pt-16 pb-12 text-center sm:px-12 sm:pt-20 sm:pb-14">
      <p className="text-[10px] font-medium tracking-[0.3em] text-ink-soft">
        {t("brand")}
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        {t("body1")}
        <br />
        {t("body2")}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {days.map((d) => (
          <div
            key={d.date}
            className={`rounded-2xl px-4 py-5 text-center ${
              d.status === "closed"
                ? "bg-ink text-cream"
                : "bg-sand/70 text-ink"
            }`}
          >
            <p className={`text-[10px] font-medium ${d.status === "closed" ? "text-cream/70" : "text-ink-soft"}`}>
              {d.date} ({d.weekday})
            </p>
            <p className={`mt-1 text-[10px] font-medium tracking-[0.1em] ${d.status === "closed" ? "text-brand-soft" : "text-brand-dark"}`}>
              {d.label}
            </p>
            <p className="mt-3 font-serif text-2xl">
              {d.status === "closed" ? t("closedLabel") : t("openLabel")}
            </p>
            {d.hours && (
              <p className={`mt-2 text-[10px] ${d.status === "closed" ? "text-cream/60" : "text-ink-soft"}`}>
                {d.hours}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-ink-soft">
        {t("footer")}
      </p>
    </div>
  );
}
