import { POPUP_EVENTS, type PopupEvent } from "../lib/event-popup";
import { localizeEvent } from "../lib/event-popup-i18n";

const locales = ["ko", "en", "ja", "zh"] as const;

function localized(event: PopupEvent, pick: (event: PopupEvent) => string) {
  return Object.fromEntries(locales.map((locale) => [locale, pick(localizeEvent(event, locale))]));
}

function toTemplate(event: PopupEvent) {
  return {
    version: 1,
    template: "price-list",
    tabLabel: localized(event, (item) => item.tabLabel),
    ctaLabel: localized(event, (item) => item.ctaLabel),
    vatNote: localized(event, (item) => item.vatNote),
    closingCopy: localized(event, (item) => item.closingCopy),
    posterFit: event.posterFit ?? "cover",
    theme: {
      accent: event.theme.accent,
      background: event.posterBg ?? event.theme.panel,
      panel: event.theme.panel,
      text: event.theme.ink,
    },
    sections: event.categories.map((category, sectionIndex) => ({
      id: `section-${category.slug}`,
      layout: category.columns?.length ? "matrix" : "list",
      menuLabel: localized(event, (item) => item.categories[sectionIndex].name),
      kicker: localized(event, (item) => item.categories[sectionIndex].kicker),
      title: localized(event, (item) => item.categories[sectionIndex].name),
      description: localized(event, (item) => item.categories[sectionIndex].copy),
      columns: (category.columns ?? []).map((_, columnIndex) =>
        localized(event, (item) => item.categories[sectionIndex].columns?.[columnIndex] ?? ""),
      ),
      rows: category.rows.map((row, rowIndex) => ({
        id: `row-${category.slug}-${rowIndex + 1}`,
        name: localized(event, (item) => item.categories[sectionIndex].rows[rowIndex].name),
        description: localized(event, (item) => item.categories[sectionIndex].rows[rowIndex].desc ?? ""),
        originalPrice: row.original ?? "",
        eventPrice: row.event ?? "",
        prices: row.prices ?? [],
      })),
    })),
  };
}

const periods: Record<string, { startsAt: string | null; endsAt: string | null }> = {
  "november-2026": { startsAt: "2026-11-01T00:00:00.000Z", endsAt: "2026-11-30T23:59:59.999Z" },
  "october-best": { startsAt: "2026-10-01T00:00:00.000Z", endsAt: "2026-10-31T23:59:59.999Z" },
  "exam-special": { startsAt: "2026-10-01T00:00:00.000Z", endsAt: null },
  "september-best": { startsAt: "2026-09-01T00:00:00.000Z", endsAt: "2026-09-30T23:59:59.999Z" },
  "grand-open": { startsAt: "2026-07-13T00:00:00.000Z", endsAt: "2026-08-30T23:59:59.999Z" },
  "first-visit": { startsAt: null, endsAt: null },
};

const rows = POPUP_EVENTS.map((event, sortIndex) => {
  const localizedEvents = Object.fromEntries(locales.map((locale) => [locale, localizeEvent(event, locale)])) as Record<(typeof locales)[number], PopupEvent>;
  return {
    slug: `managed-${event.id}`,
    tag: event.eyebrow,
    title: event.title,
    period: event.period,
    desc: event.subtitle,
    body: event.closingCopy,
    bgColor: event.posterBg ?? event.theme.panel,
    photoUrl: event.poster,
    bannerUrl: null,
    bannerFocus: "center",
    imageUrl: null,
    templateData: JSON.stringify(toTemplate(event)),
    published: true,
    startsAt: periods[event.id]?.startsAt ?? null,
    endsAt: periods[event.id]?.endsAt ?? null,
    sortIndex,
    translations: locales.filter((locale) => locale !== "ko").map((locale) => ({
      locale,
      title: localizedEvents[locale].title,
      desc: localizedEvents[locale].subtitle,
      body: localizedEvents[locale].closingCopy,
    })),
  };
});

process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
