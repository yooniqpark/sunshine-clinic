import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";

type EventItem = {
  tag: string;
  slug?: string;
  title: string;
  period: string;
  body: string;
  highlights?: string[];
};

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.events");
  const items = t.raw("items") as EventItem[];
  const openItem = items.find((e) => e.tag === "OPEN") ?? items[0];
  const others = items.filter((e) => e !== openItem);

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

      {/* Featured GRAND OPEN */}
      <section
        id={openItem.slug}
        className="border-b border-line py-20 lg:py-28"
        style={{ backgroundColor: "#F5F0EA" }}
      >
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/60 p-8 shadow-xl shadow-ink/10 backdrop-blur-md sm:p-12 lg:p-16">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "url('/splash.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  mixBlendMode: "multiply",
                }}
              />
              <div className="relative">
                <span className="inline-flex rounded-full bg-brand-dark px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-cream">
                  {openItem.tag}
                </span>
                <p className="mt-8 text-[11px] font-medium tracking-[0.4em] text-ink-soft">
                  {openItem.period}
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  {openItem.title}
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft lg:text-lg">
                  {openItem.body}
                </p>

                {openItem.highlights && openItem.highlights.length > 0 && (
                  <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                    {openItem.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 rounded-2xl border border-line/60 bg-white/70 px-4 py-3 text-sm text-ink"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-dark" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="/home#book"
                    className="rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-brand-dark"
                  >
                    {t("ctaBook")}
                  </Link>
                  <a
                    href="tel:024217588"
                    className="rounded-full border border-ink/20 px-8 py-4 text-sm font-semibold text-ink hover:border-ink"
                  >
                    02-421-7588
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Other events */}
      {others.length > 0 && (
        <section className="bg-cream py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:px-8">
            {others.map((e, i) => (
              <Reveal key={i} delay={i * 60}>
                <article className="group flex h-full flex-col justify-between rounded-3xl border border-line bg-white p-8 transition hover:-translate-y-1 hover:border-brand-dark hover:shadow-lg">
                  <div>
                    <span className="inline-flex rounded-full bg-ink/5 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-ink-soft">
                      {e.tag}
                    </span>
                    <h3 className="mt-5 font-serif text-2xl leading-tight lg:text-3xl">
                      {e.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-ink-soft">{e.body}</p>
                  </div>
                  <div className="mt-8 border-t border-line pt-5 text-xs tracking-[0.15em] text-ink-soft">
                    {e.period}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
