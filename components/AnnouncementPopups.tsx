"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CloseIcon } from "@/components/icons";

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
      <div className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/60 bg-cream/65 shadow-2xl shadow-ink/20 backdrop-blur-xl">
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

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
    <div className="px-8 pt-14 pb-10 text-center">
      <p className="text-[10px] font-medium tracking-[0.3em] text-ink-soft">
        {t("kicker")}
      </p>
      <p className="mt-6 text-sm font-semibold tracking-[0.15em] text-ink">
        {t("brand")}
      </p>
      <div className="mx-auto mt-1 h-px w-16 bg-ink/20" />
      <h2 className="mt-6 font-serif text-5xl font-normal leading-none tracking-tight text-ink">
        GRAND
        <br />
        OPEN
      </h2>
      <p className="mt-6 text-sm tracking-[0.3em] text-ink-soft">
        {t("date")}
      </p>
      <p className="mx-auto mt-8 max-w-[240px] text-xs leading-relaxed text-ink-soft">
        {t("body")}
      </p>
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
    <div className="px-6 pt-14 pb-8 text-center">
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
