import "server-only";

import { prisma } from "@yooniqpark/clinic-core/lib/prisma";
import {
  normalizeEventTemplateData,
  type EventLocalizedText,
  type EventTemplateLocale,
} from "@yooniqpark/clinic-core/lib/event-template";
import type { PopupEvent, PopupTheme } from "@/lib/event-popup";

function text(value: EventLocalizedText, locale: EventTemplateLocale) {
  return value[locale]?.trim() || value.ko;
}

function theme(accent: string, background: string, panel: string, ink: string): PopupTheme {
  return {
    tab: accent,
    tabText: "#ffffff",
    panel,
    line: `${accent}33`,
    accent,
    ink,
    sub: `${ink}bb`,
    meta: `${ink}88`,
    pill: accent,
    pillText: "#ffffff",
    tableBg: "#ffffffcc",
    tableLine: `${accent}24`,
    headBg: `${accent}14`,
    headText: ink,
    price: accent,
    unit: `${ink}88`,
    noteBg: `${accent}12`,
    noteText: `${ink}bb`,
    catBg: background,
    catText: `${ink}aa`,
    catOnBg: accent,
    catOnText: "#ffffff",
    footBg: ink,
    footText: "#ffffffbb",
    footStrong: "#ffffff",
  };
}

export async function getManagedPopupEvents(localeInput: string): Promise<PopupEvent[]> {
  const locale: EventTemplateLocale = localeInput === "en" || localeInput === "ja" || localeInput === "zh"
    ? localeInput
    : "ko";
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      published: true,
      templateData: { not: null },
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    include: { translations: true },
    orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }],
  });

  return events.map((event) => {
    const document = normalizeEventTemplateData(event.templateData, {
      background: event.bgColor,
      body: event.body,
    });
    const translation = event.translations.find((item) => item.locale === locale);
    const title = locale === "ko" ? event.title : translation?.title || event.title;
    const desc = locale === "ko" ? event.desc : translation?.desc || event.desc;
    const body = locale === "ko" ? event.body : translation?.body || event.body;
    const popupTheme = theme(
      document.theme.accent,
      document.theme.background,
      document.theme.panel,
      document.theme.text,
    );

    return {
      id: event.slug,
      tabLabel: text(document.tabLabel, locale),
      tabShort: text(document.tabLabel, locale),
      poster: event.photoUrl || event.bannerUrl || event.imageUrl || "/events/first-visit-2026.svg",
      posterAlt: title,
      posterFit: document.posterFit,
      posterBg: document.theme.background,
      ctaFill: `${document.theme.panel}ee`,
      ctaBorder: "transparent",
      ctaLabel: text(document.ctaLabel, locale),
      posterOverlay: event.slug === "managed-exam-special"
        ? { kicker: event.tag, titleLines: [title], sub: desc }
        : undefined,
      eyebrow: event.tag,
      title,
      subtitle: desc,
      period: event.period,
      vatNote: text(document.vatNote, locale),
      pillLabel: text(document.tabLabel, locale),
      closingCopy: text(document.closingCopy, locale) || body,
      categories: document.sections.map((section) => ({
        slug: section.id,
        name: text(section.menuLabel, locale),
        kicker: text(section.kicker, locale),
        copy: text(section.description, locale),
        columns: section.layout === "matrix"
          ? section.columns.map((column) => text(column, locale))
          : undefined,
        rows: section.rows.map((row) => ({
          name: text(row.name, locale),
          desc: text(row.description, locale) || undefined,
          original: row.originalPrice || undefined,
          event: row.eventPrice || undefined,
          prices: section.layout === "matrix" ? row.prices : undefined,
        })),
      })),
      theme: popupTheme,
    } satisfies PopupEvent;
  });
}
