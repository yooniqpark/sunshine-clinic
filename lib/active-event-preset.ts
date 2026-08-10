import "server-only";

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_EVENT_PRESET_ID,
  getEventPreset,
  type EventPresetId,
} from "@/lib/event-presets";

export const ACTIVE_EVENT_PRESET_KEY = "active-event-preset-v2";

export async function getActiveEventPreset(): Promise<EventPresetId> {
  const setting = await prisma.setting.findUnique({
    where: { key: ACTIVE_EVENT_PRESET_KEY },
    select: { value: true },
  });

  return getEventPreset(setting?.value)?.id ?? DEFAULT_EVENT_PRESET_ID;
}
