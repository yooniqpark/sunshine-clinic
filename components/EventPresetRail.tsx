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
      className="hidden w-[72px] shrink-0 flex-col overflow-hidden rounded-l-[1.75rem] border-r border-white/15 bg-[#eeeef7] shadow-lg lg:flex"
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
                  ? "bg-[#2b1f1a] text-[#f4d5b4]"
                  : "bg-[#3d59cb] text-white"
                : openEvent
                  ? "bg-[#392821] text-[#f1d9c1]/70 hover:text-[#f1d9c1]"
                  : "bg-[#f0f2ff] text-[#314171]/70 hover:text-[#314171]"
            }`}
          >
            <span
              className="flex items-center gap-3 whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              <span className="text-[8px] font-bold tracking-[0.22em] opacity-70">{tab.index}</span>
              <span className="text-[9px] font-bold tracking-[0.16em] sm:text-[10px]">{tab.label}</span>
            </span>
            {active && <span aria-hidden className="absolute inset-y-5 right-0 w-0.5 rounded-full bg-current" />}
          </button>
        );
      })}
    </nav>
  );
}

export function EventPresetTabs({
  activePreset,
  onSelect,
}: {
  activePreset: SwitchableEventId;
  onSelect: (preset: SwitchableEventId) => void;
}) {
  return (
    <nav
      aria-label="이벤트 전환"
      className="grid h-16 shrink-0 grid-cols-2 overflow-hidden rounded-t-[2rem] border-b border-white/15 shadow-lg lg:hidden"
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
            className={`flex min-w-0 flex-col items-center justify-center gap-1 border-r border-white/15 px-2 transition-colors last:border-r-0 ${
              openEvent
                ? "bg-[#2b201c] text-[#f4dfca]"
                : active
                  ? "bg-[#405dcb] text-white"
                  : "bg-[#f0f2fc] text-[#2d4079]"
            }`}
          >
            <span className="text-[7px] font-bold tracking-[0.18em] opacity-75">
              {tab.index}{active ? " · ACTIVE" : ""}
            </span>
            <span className="text-[10px] font-bold tracking-[0.16em]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
