import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";
import {
  getDevicesByCategory,
  getDeviceMarketing,
  getDeviceImage,
} from "@/lib/devices";
import { getConcernsByCategory, getConcern } from "@/lib/concerns";
import type { AppLocale } from "@/i18n/routing";
import { pageSeo, truncateDescription, localeUrl } from "@/lib/seo";
import {
  MedicalProceduresJsonLd,
  FaqPageJsonLd,
  BreadcrumbJsonLd,
} from "@/components/JsonLd";

const CATEGORY_SLUGS = ["lifting", "anti-aging", "whitening", "acne", "skin-disease"] as const;

const CATEGORY_IMAGE: Record<string, string> = {
  lifting: "/models/lifting.png",
  "anti-aging": "/models/anti-aging.jpg",
  whitening: "/models/whitening.png",
  acne: "/models/acne.png",
  "skin-disease": "/models/skin-disease.png",
};

type ProcessStep = { step: string; title: string; body: string };
type SubItem = { label: string; href: string; sub?: string };

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!CATEGORY_IMAGE[category]) return {};
  const tc = await getTranslations({
    locale,
    namespace: `v2.treatments.categories.${category}`,
  });
  return pageSeo({
    locale,
    path: `/treatments/${category}`,
    title: tc("label"),
    description: truncateDescription(tc("intro")),
  });
}

export default async function TreatmentCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const image = CATEGORY_IMAGE[category];
  if (!image) notFound();

  const t = await getTranslations("v2.treatments");
  const tc = await getTranslations(`v2.treatments.categories.${category}`);
  const tHeader = await getTranslations("v2.header");

  const label = tc("label");
  const kicker = tc("kicker");
  const heroLine1 = tc("heroLine1");
  const heroLine2 = tc("heroLine2");
  const intro = tc("intro");
  const process = tc.raw("process") as ProcessStep[];

  // 헤더 드롭다운과 동일한 메뉴가 이 카테고리의 정본 목록 — 장비/컨선 정보로 보강
  const subItems = (tHeader.raw(`subMenus.${category}`) as SubItem[]) ?? [];
  const devices = getDevicesByCategory(locale as AppLocale, category);
  const deviceBySlug = new Map(devices.map((d) => [d.slug, d]));

  const rows = subItems.map((it) => {
    const slug = it.href.split("/").pop() ?? "";
    const d = deviceBySlug.get(slug);
    const concern = d ? null : getConcern(locale as AppLocale, slug);
    return {
      name: it.label,
      desc: d?.tagline ?? concern?.tagline ?? "",
      href: it.href,
      meta: getDeviceMarketing(slug)?.englishName ?? it.sub,
      image: getDeviceImage(slug) ?? concern?.image,
    };
  });

  const concerns = getConcernsByCategory(locale as AppLocale, category);
  const pageUrl = localeUrl(locale, `/treatments/${category}`);

  return (
    <>
      <MedicalProceduresJsonLd
        category={category}
        categoryLabel={label}
        devices={devices}
      />
      <FaqPageJsonLd concerns={concerns} />
      <BreadcrumbJsonLd
        items={[
          { name: "HOME", url: localeUrl(locale, "/home") },
          { name: label, url: pageUrl },
        ]}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
        <div className="absolute inset-0 opacity-25">
          <Image src={image} alt="" fill className="object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-[11px] tracking-[0.15em] text-cream/50">
            <Link href="/home" className="hover:text-cream">{t("crumbHome")}</Link>
            <span>/</span>
            <span className="text-cream/80">{t("crumbTreatments")}</span>
          </nav>
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            {kicker}
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05]">
            {heroLine1}
            <br />
            {heroLine2}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-cream/70 lg:text-lg">
            {intro}
          </p>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <div className="border-b border-line bg-cream">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 lg:px-8">
          {CATEGORY_SLUGS.map((slug) => (
            <CategoryTab key={slug} slug={slug} active={slug === category} />
          ))}
        </div>
      </div>

      {/* ITEMS */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">{t("menuKicker")}</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
            {label}
            {t("menuTitleSuffix")}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft lg:text-base">
            {t("menuDesc")}
          </p>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {rows.map((row, i) => (
              <Reveal key={row.href} delay={i * 40}>
                <Link href={row.href} className="group block h-full">
                  <div className="flex h-full items-start justify-between gap-6 border-t border-line py-8 transition group-hover:border-brand-dark">
                    <div className="flex min-w-0 flex-1 items-start gap-5">
                      {row.image && (
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ink/5">
                          <Image
                            src={row.image}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        {row.meta && (
                          <p className="text-[10px] font-bold tracking-[0.2em] text-brand-dark">
                            {row.meta}
                          </p>
                        )}
                        <h3 className="mt-2 font-serif text-2xl transition group-hover:text-brand-dark">
                          {row.name}
                        </h3>
                        {row.desc && (
                          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                            {row.desc}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowUpRightIcon className="mt-2 h-5 w-5 shrink-0 text-ink-soft transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-dark" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">{t("processKicker")}</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">{t("processTitle")}</h2>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {process.map((p) => (
              <Reveal key={p.step}>
                <div className="border-t border-cream/15 pt-8">
                  <p className="font-serif text-3xl text-brand-soft">{p.step}</p>
                  <h3 className="mt-4 font-serif text-xl">{p.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/65">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center lg:px-8">
          <h2 className="font-serif text-3xl lg:text-5xl">
            {t.rich("ctaTitle", {
              label,
              accent: (chunks) => (
                <span className="text-brand-dark">{chunks}</span>
              ),
            })}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/home#book"
              className="rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream hover:bg-brand-dark"
            >
              {t("ctaOnline")}
            </Link>
            <a
              href="tel:024217588"
              className="rounded-full border border-ink/20 px-8 py-4 text-sm font-semibold text-ink hover:border-ink"
            >
              {t("ctaPhone")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

async function CategoryTab({ slug, active }: { slug: string; active: boolean }) {
  const tc = await getTranslations(`v2.treatments.categories.${slug}`);
  return (
    <Link
      href={`/treatments/${slug}`}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
        active ? "bg-ink text-cream" : "text-ink-soft hover:bg-ink/5"
      }`}
    >
      {tc("label")}
    </Link>
  );
}
