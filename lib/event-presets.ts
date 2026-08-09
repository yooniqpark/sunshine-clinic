export const EVENT_PRESETS = [
  {
    id: "after-summer-2026",
    popupId: "after-summer-2026-v1",
    variant: "after-summer",
    eyebrow: "2026 AUTUMN",
    title: "AFTER SUMMER",
    period: "2026 가을",
    description: "여름의 흔적을 지우는 계절 — 새 가을 이벤트 시안",
    imageUrl: "/events/after-summer-2026.svg",
  },
  {
    id: "grand-open-2026",
    popupId: "grand-open-2026-07-v3",
    variant: "event",
    eyebrow: "GRAND OPEN",
    title: "오픈 이벤트",
    period: "07.13 — 08.30",
    description: "리프팅·화이트닝·스킨부스터·보톡스 오픈 특별가",
    imageUrl: null,
  },
  {
    id: "aug-2026-holiday",
    popupId: "aug-2026-holiday",
    variant: "holiday",
    eyebrow: "NOTICE",
    title: "8월 휴진 안내",
    period: "2026년 8월",
    description: "광복절·정기 휴진 일정을 안내하는 팝업",
    imageUrl: null,
  },
  {
    id: "sedation-2026",
    popupId: "sedation-2026-07",
    variant: "sedation",
    eyebrow: "SAFE SEDATION",
    title: "안심 수면마취",
    period: "상시 안내",
    description: "수면마취 시스템과 안전 수칙을 소개하는 팝업",
    imageUrl: null,
  },
] as const;

export type EventPreset = (typeof EVENT_PRESETS)[number];
export type EventPresetId = EventPreset["id"];
export type EventPresetVariant = EventPreset["variant"];

export const DEFAULT_EVENT_PRESET_ID: EventPresetId = "grand-open-2026";

export function getEventPreset(id: string | null | undefined) {
  return EVENT_PRESETS.find((preset) => preset.id === id);
}

export function isEventPresetId(value: string): value is EventPresetId {
  return getEventPreset(value) !== undefined;
}
