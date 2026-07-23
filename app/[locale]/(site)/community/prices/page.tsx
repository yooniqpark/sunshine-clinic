import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";

export default async function PricesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.prices");

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

      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <Reveal>
            <p className="font-serif text-2xl leading-relaxed text-ink lg:text-3xl">
              {t("placeholder")}
            </p>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ink-soft lg:text-base">
              {t("footnote1")}<br />
              {t("footnote2")}
            </p>
            <a
              href="tel:024217588"
              className="mt-12 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-brand-dark"
            >
              02-421-7588
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
