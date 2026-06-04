"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko, ja, enUS, zhCN } from "date-fns/locale";
import type { Locale } from "date-fns";
import "react-day-picker/style.css";
import { CalendarIcon } from "@/components/icons";

const LOCALES: Record<string, Locale> = {
  ko,
  en: enUS,
  ja,
  zh: zhCN,
};

function toIso(d: Date | undefined) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromIso(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map((n) => Number(n));
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function LocalizedDatePicker({
  value,
  onChange,
  locale = "ko",
  placeholder,
  ariaLabel,
  className,
}: {
  value: string; // yyyy-mm-dd
  onChange: (next: string) => void;
  locale?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = fromIso(value);
  const dfLocale = LOCALES[locale] ?? LOCALES.en;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const displayFormatter = new Intl.DateTimeFormat(
    locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const display = selected ? displayFormatter.format(selected) : "";

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        className="flex w-full items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-left text-sm outline-none transition focus:border-brand"
      >
        <CalendarIcon className="h-4 w-4 shrink-0 text-ink-soft" />
        <span className={display ? "text-ink" : "text-ink-soft/60"}>
          {display || placeholder || ""}
        </span>
      </button>
      {open && (
        <div className="absolute left-0 z-30 mt-1 rounded-2xl border border-line bg-white p-3 shadow-xl shadow-ink/15">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => {
              onChange(toIso(d));
              setOpen(false);
            }}
            locale={dfLocale}
            weekStartsOn={locale === "en" ? 0 : 1}
            disabled={{ before: new Date() }}
            classNames={{
              months: "flex",
              month: "space-y-3",
              month_caption: "flex justify-center items-center h-9 relative",
              caption_label: "text-sm font-semibold text-ink",
              nav: "absolute inset-x-0 top-0 flex items-center justify-between",
              button_previous:
                "grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-brand/10 hover:text-brand",
              button_next:
                "grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-brand/10 hover:text-brand",
              chevron: "h-4 w-4 fill-current",
              weekdays: "flex",
              weekday: "w-9 text-center text-[11px] font-medium text-ink-soft",
              week: "flex",
              day: "w-9 h-9 p-0",
              day_button:
                "w-9 h-9 grid place-items-center rounded-full text-sm text-ink transition hover:bg-sand",
              today: "font-bold text-brand",
              selected: "[&_button]:!bg-brand [&_button]:!text-white [&_button]:!font-semibold",
              disabled: "opacity-30 pointer-events-none",
              outside: "text-ink-soft/40",
            }}
          />
        </div>
      )}
    </div>
  );
}
