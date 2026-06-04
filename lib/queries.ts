import { prisma } from "./prisma";
import type { EventItem } from "./data";
import { getSiteContent } from "./site-content";

export type Locale = "ko" | "en" | "ja" | "zh";

const PERIOD_ALWAYS_KO = "상시 진행";

function localizePeriod(period: string, locale: Locale): string {
  if (locale === "ko") return period;
  if (period.trim() === PERIOD_ALWAYS_KO) {
    return getSiteContent(locale).common.always;
  }
  return period;
}

/**
 * Build the clinic manual context for the chatbot from published manual sections.
 * For ko, uses the base columns; for other locales, uses the matching translation if present,
 * falling back to the ko text so the chatbot still has context.
 */
export async function getChatbotManual(locale: Locale = "ko"): Promise<string> {
  const sections = await prisma.manualSection.findMany({
    where: { published: true },
    orderBy: [{ sortIndex: "asc" }, { createdAt: "asc" }],
    include: { translations: { where: { locale } } },
  });
  if (sections.length === 0) return "";
  return sections
    .map((s, i) => {
      const tr = s.translations[0];
      const title = tr?.title ?? s.title;
      const body = (tr?.body ?? s.body).trim();
      return `## ${i + 1}. ${title}\n${body}`;
    })
    .join("\n\n");
}

/**
 * Fetch published events for site rendering, translated to the requested locale.
 * Falls back to the base ko columns when a translation row is missing.
 */
export async function getPublishedEvents(locale: Locale = "ko"): Promise<EventItem[]> {
  const now = new Date();
  const rows = await prisma.event.findMany({
    where: {
      published: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }],
    include: { translations: { where: { locale } } },
  });

  return rows.map((e) => {
    const tr = e.translations[0];
    const title = tr?.title ?? e.title;
    const desc = tr?.desc ?? e.desc;
    const body = tr?.body ?? e.body;
    return {
      slug: e.slug,
      tag: e.tag,
      title,
      period: localizePeriod(e.period, locale),
      desc,
      image: e.imageUrl ?? "/events/event-1.svg",
      photo: e.photoUrl,
      banner: e.bannerUrl ?? null,
      bannerFocus:
        (e.bannerFocus === "top" || e.bannerFocus === "bottom"
          ? e.bannerFocus
          : "center") as "top" | "center" | "bottom",
      bgColor: e.bgColor,
      body: body.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean),
    };
  });
}
