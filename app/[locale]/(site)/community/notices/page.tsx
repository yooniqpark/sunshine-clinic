import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";

type NoticeItem = { tag: string; date: string; title: string; excerpt: string };

export default async function NoticesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.notices");
  const items = t.raw("items") as NoticeItem[];
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
          <ul>
            {items.map((n, i) => (
              <Reveal key={i} delay={i * 30}>
                <li>
                  <Link
                    href="#"
                    className="group grid grid-cols-[80px_1fr_24px] items-start gap-6 border-t border-line py-8 transition hover:border-brand-dark md:grid-cols-[100px_1fr_120px_24px] md:items-center"
                  >
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] ${
                        n.tag === openTag
                          ? "bg-brand-dark text-cream"
                          : "bg-ink/5 text-ink-soft"
                      }`}
                    >
                      {n.tag}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-serif text-xl transition group-hover:text-brand-dark md:text-2xl">
                        {n.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{n.excerpt}</p>
                    </div>
                    <span className="hidden text-xs tracking-[0.15em] text-ink-soft md:block md:text-right">
                      {n.date}
                    </span>
                    <ArrowUpRightIcon className="hidden h-5 w-5 text-ink-soft transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-dark md:block" />
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
