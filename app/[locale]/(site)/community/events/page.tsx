import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";

type EventItem = { tag: string; title: string; period: string; body: string };

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.events");
  const items = t.raw("items") as EventItem[];

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
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          {items.map((e, i) => (
            <Reveal key={i} delay={i * 60}>
              <article className="group flex h-full flex-col justify-between rounded-3xl border border-line bg-white p-8 transition hover:-translate-y-1 hover:border-brand-dark hover:shadow-lg">
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] ${
                      e.tag === "OPEN"
                        ? "bg-brand-dark text-cream"
                        : "bg-ink/5 text-ink-soft"
                    }`}
                  >
                    {e.tag}
                  </span>
                  <h3 className="mt-5 font-serif text-2xl leading-tight lg:text-3xl">
                    {e.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">{e.body}</p>
                </div>
                <div className="mt-8 border-t border-line pt-5 text-xs tracking-[0.15em] text-ink-soft">
                  {t("periodLabel")} · {e.period}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/home#book"
            className="inline-flex rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-brand-dark"
          >
            {t("cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
