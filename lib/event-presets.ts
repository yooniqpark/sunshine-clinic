export const EVENT_PRESETS = [
  {
    id: "first-visit-2026",
    popupId: "first-visit-2026-v1",
    variant: "first-visit",
    eyebrow: "WELCOME EDIT",
    title: "첫 방문 이벤트",
    period: "첫 방문 고객 대상",
    description: "보톡스·필러·리프팅·콜라겐 볼륨 첫 방문 특별가",
    imageUrl: "/events/first-visit-2026.svg",
  },
  {
    id: "after-summer-2026",
    popupId: "after-summer-2026-v1",
    variant: "after-summer",
    eyebrow: "2026 AUTUMN",
    title: "AFTER SUMMER",
    period: "2026 가을",
    description: "여름의 흔적을 지우는 가을 피부 리셋 이벤트",
    imageUrl: "/events/after-summer-2026.svg",
  },
  {
    id: "grand-open-2026",
    popupId: "grand-open-2026-07-v3",
    variant: "legacy",
    eyebrow: "GRAND OPEN",
    title: "오픈 이벤트",
    period: "기존 이벤트",
    description: "현재 운영 중인 기존 오픈 이벤트 팝업",
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
