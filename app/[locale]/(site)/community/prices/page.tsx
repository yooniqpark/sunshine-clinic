import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";

type Row = { name: string; price: string; note?: string };
type Section = { kicker: string; title: string; rows: Row[] };

export default async function PricesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.prices");
  const sections = t.raw("sections") as Section[];

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
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cream/60">
            {t("desc")}
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          {sections.map((sec) => (
            <Reveal key={sec.kicker}>
              <div className="mb-16">
                <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                  {sec.kicker}
                </p>
                <h2 className="mt-3 font-serif text-3xl lg:text-4xl">{sec.title}</h2>
                <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
                  <table className="w-full">
                    <tbody>
                      {sec.rows.map((r) => (
                        <tr key={r.name} className="border-t border-line first:border-0">
                          <td className="p-5 align-top">
                            <p className="font-medium text-ink">{r.name}</p>
                            {r.note && (
                              <p className="mt-1 text-xs text-ink-soft">{r.note}</p>
                            )}
                          </td>
                          <td className="p-5 text-right align-top font-serif text-lg text-ink">
                            {r.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          ))}

          <p className="mt-8 rounded-2xl bg-ink/5 p-6 text-xs leading-relaxed text-ink-soft">
            {t("footnote1")}<br />
            {t("footnote2")}
          </p>
        </div>
      </section>
    </>
  );
}
