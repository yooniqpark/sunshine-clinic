"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ACTIVE_EVENT_PRESET_KEY } from "@/lib/active-event-preset";
import { isEventPresetId } from "@/lib/event-presets";

export async function setActiveEventPreset(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  const user = session.user as { id?: string };

  const presetId = String(formData.get("presetId") ?? "");
  if (!isEventPresetId(presetId)) throw new Error("INVALID_EVENT_PRESET");

  await prisma.setting.upsert({
    where: { key: ACTIVE_EVENT_PRESET_KEY },
    create: {
      key: ACTIVE_EVENT_PRESET_KEY,
      value: presetId,
      updatedBy: user.id,
    },
    update: {
      value: presetId,
      updatedBy: user.id,
    },
  });

  revalidatePath("/admin/events");
  for (const locale of ["ko", "en", "ja", "zh"]) {
    revalidatePath(`/${locale}/home`);
  }
}
