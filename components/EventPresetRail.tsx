"use client";

import type { EventPresetId } from "@/lib/event-presets";

type SwitchableEventId = Extract<EventPresetId, "grand-open-2026" | "first-visit-2026">;

const TABS: Array<{ id: SwitchableEventId; index: string; label: string }> = [
  { id: "grand-open-2026", index: "01", label: "OPEN EVENT" },
  { id: "first-visit-2026", index: "02", label: "FIRST VISIT" },
];

export function EventPresetRail({
  activePreset,
  onSelect,
}: {
  activePreset: SwitchableEventId;
  onSelect: (preset: SwitchableEventId) => void;
}) {
  return (
    <nav
      aria-label="이벤트 전환"
      className="flex w-8 shrink-0 flex-col overflow-hidden rounded-l-[1.5rem] border-r border-white/20 bg-[#f3f3f8] shadow-md sm:w-12 lg:w-[72px] lg:rounded-l-[1.75rem]"
    >
      {TABS.map((tab) => {
        const active = tab.id === activePreset;
        const openEvent = tab.id === "grand-open-2026";

        return (
          <button
            key={tab.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(tab.id)}
            className={`group relative flex min-h-0 flex-1 items-center justify-center border-b border-black/10 px-1 py-4 transition-colors last:border-b-0 ${
              active
                ? openEvent
                  ? "bg-[#5b4940] text-[#f6e5d4]"
                  : "bg-[#6d7fc9] text-white"
                : openEvent
                  ? "bg-[#ded5cf] text-[#6a5448]/75 hover:text-[#59443a]"
                  : "bg-[#eef0f8] text-[#52618d]/75 hover:text-[#42517e]"
            }`}
          >
            <span
              className="flex items-center gap-2.5 whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              <span className="text-[7px] font-bold tracking-[0.18em] opacity-65 sm:text-[8px]">{tab.index}</span>
              <span className="text-[8px] font-bold tracking-[0.12em] sm:text-[9px] lg:text-[10px] lg:tracking-[0.16em]">{tab.label}</span>
            </span>
            {active && <span aria-hidden className="absolute inset-y-6 right-0 w-px rounded-full bg-current/75" />}
          </button>
        );
      })}
    </nav>
  );
}
