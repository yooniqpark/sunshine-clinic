import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventsBoard, type EventEntry } from "./EventsBoard";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.events");
  const items = t.raw("items") as EventEntry[];
  const openTag = t("tagOpen");

  return (
    <>
      <section className="bg-ink py-24 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            {t("kicker")}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight lg:text-6xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <EventsBoard items={items} openTag={openTag} />
        </div>
      </section>
    </>
  );
}
