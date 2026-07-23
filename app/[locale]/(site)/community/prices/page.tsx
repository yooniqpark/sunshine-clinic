import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";

type FeeRow = { label: string; basis: string; amount: string };
type FeeSection = { heading: string; rows: FeeRow[] };

export default async function PricesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.prices");
  const sections = t.raw("sections") as FeeSection[];
  const notes = t.raw("notes") as string[];
  const freeLabel = t("free");

  return (
    <>
      <section className="bg-ink py-24 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            {t("kicker")}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cream/60 lg:text-base">
            {t("desc")}
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-line bg-white">
              <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-line bg-sand/40 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft sm:px-8">
                <span>{t("colItem")}</span>
                <span className="text-center">{t("colBasis")}</span>
                <span className="text-right">{t("colAmount")}</span>
              </div>

              <div className="divide-y divide-line">
                {sections.map((section) => (
                  <div key={section.heading} className="px-6 py-6 sm:px-8 sm:py-7">
                    <h2 className="font-serif text-lg tracking-tight text-brand-dark sm:text-xl">
                      {section.heading}
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {section.rows.map((row, i) => (
                        <li
                          key={`${row.label}-${i}`}
                          className="grid grid-cols-[1.5fr_1fr_1fr] items-baseline gap-4"
                        >
                          <span className="text-sm leading-relaxed text-ink sm:text-base">
                            {row.label}
                          </span>
                          <span className="text-center text-xs text-ink-soft sm:text-sm">
                            {row.basis}
                          </span>
                          <span
                            className={`text-right text-sm font-semibold tabular-nums sm:text-base ${
                              row.amount === freeLabel ? "text-brand-dark" : "text-ink"
                            }`}
                          >
                            {row.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-8 space-y-3 rounded-2xl bg-ink/5 px-6 py-5 text-xs leading-relaxed text-ink-soft">
            {notes.map((n, i) => (
              <p key={i}>· {n}</p>
            ))}
            <p className="pt-2 text-[11px] text-ink-soft/80">{t("footer")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
