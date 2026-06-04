"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import { CalendarIcon, CloseIcon } from "@/components/icons";

type Props = {
  name: string; // form field name (stores ISO string yyyy-mm-dd)
  label: string;
  defaultValue?: string | null; // yyyy-mm-dd or null
  hint?: string;
  onChange?: (date: Date | undefined) => void;
};

function fmt(d: Date | undefined) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function toIso(d: Date | undefined) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DateField({ name, label, defaultValue, hint, onChange }: Props) {
  const initial = defaultValue ? new Date(defaultValue) : undefined;
  const [selected, setSelected] = useState<Date | undefined>(initial);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function setDate(d: Date | undefined) {
    setSelected(d);
    onChange?.(d);
    setOpen(false);
  }

  return (
    <div className="block" ref={wrapRef}>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-ink">{label}</span>
        {hint && <span className="text-[10px] text-ink-soft">{hint}</span>}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition hover:border-brand focus:border-brand"
        >
          <span className={selected ? "" : "text-ink-soft/60"}>
            {selected ? fmt(selected) : "날짜 선택"}
          </span>
          <span className="flex items-center gap-1.5">
            {selected && (
              <span
                role="button"
                tabIndex={0}
                aria-label="날짜 지우기"
                onClick={(e) => {
                  e.stopPropagation();
                  setDate(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDate(undefined);
                  }
                }}
                className="grid h-5 w-5 cursor-pointer place-items-center rounded-full text-ink-soft transition hover:bg-sand"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </span>
            )}
            <CalendarIcon className="h-4 w-4 text-brand" />
          </span>
        </button>
        {open && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 origin-top rounded-2xl border border-line bg-white p-3 shadow-xl shadow-ink/10 sm:right-auto sm:w-[19rem]">
            <DayPicker
              mode="single"
              locale={ko}
              selected={selected}
              onSelect={setDate}
              showOutsideDays
              weekStartsOn={0}
              classNames={{
                root: "rdp-clean",
                caption_label: "text-sm font-semibold",
                month_caption: "py-1.5",
                button_next: "text-ink-soft hover:text-brand",
                button_previous: "text-ink-soft hover:text-brand",
                weekday: "text-[10px] font-semibold text-ink-soft",
                day: "h-9 w-9 rounded-full text-sm text-ink hover:bg-blush",
                day_button: "h-9 w-9",
                selected:
                  "[&_button]:bg-brand [&_button]:text-white hover:[&_button]:bg-brand-dark",
                today: "[&_button]:font-bold [&_button]:text-brand-dark",
                outside: "text-ink-soft/40",
              }}
            />
          </div>
        )}
        {/* hidden form field with iso value */}
        <input type="hidden" name={name} value={toIso(selected)} />
      </div>
    </div>
  );
}
