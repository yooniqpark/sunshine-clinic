import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";

type HistoryItem = { year: string; event: string };
type SpaceItem = { label: string; desc: string };
type ValueItem = { n: string; title: string; body: string };

const SPACE_IMGS = [
  "/clinic/lounge.jpg",
  "/clinic/corridor.jpg",
  "/clinic/vip-corridor.jpg",
  "/clinic/care-room.jpg",
  "/clinic/powder-room.jpg",
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.about");
  const tLoc = await getTranslations("v2.location");
  const history = t.raw("history") as HistoryItem[];
  const spaces = t.raw("spaces") as SpaceItem[];
  const values = t.raw("values") as ValueItem[];

  return (
    <>
      {/* ══════ HERO ══════ */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0">
          <Image
            src="/clinic/reception.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-24 lg:px-8 lg:pb-36 lg:pt-32">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            {t("heroKicker")}
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05]">
            {t("heroTitleLine1")}
            <br />
            <span className="text-brand-soft">{t("heroTitleAccent")}</span>
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-cream/75 lg:text-lg">
            {t("heroDesc")}
          </p>
        </div>
      </section>

      {/* ══════ DIRECTOR ══════ */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5">
              <Image
                src="/team/kim.jpg"
                alt={t("directorName")}
                fill
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                {t("directorKicker")}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
                {t("directorName")} <span className="text-ink-soft/70">{t("directorTitle")}</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">
                {t("directorBio")}
              </p>

              <div className="mt-10 border-t border-line pt-8">
                <p className="text-[10px] font-bold tracking-[0.24em] text-ink-soft">
                  {t("historyLabel")}
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {history.map((h) => (
                    <li key={h.year} className="grid grid-cols-[64px_1fr] gap-4">
                      <span className="font-serif text-base text-brand-dark">
                        {h.year}
                      </span>
                      <span className="text-ink-soft">{h.event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ CONSULT ROOM ══════ */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-2 lg:gap-24 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink/5">
              <Image
                src="/clinic/consult-room.jpg"
                alt={t("consultTitle")}
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              {t("consultKicker")}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              {t("consultTitle")}
            </h2>
            <p className="mt-8 text-base leading-relaxed text-ink-soft lg:text-lg">
              {t("consultBody")}
            </p>
          </div>
        </div>
      </section>

      {/* ══════ SPACE GALLERY ══════ */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                {t("spaceKicker")}
              </p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight lg:text-6xl">
                {t("spaceTitleLead")}
                <br />
                <span className="text-brand-dark">{t("spaceTitleAccent")}</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              {t("spaceDesc")}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {spaces.map((s, i) => (
              <Reveal
                key={SPACE_IMGS[i]}
                delay={i * 60}
                className={
                  i === 0
                    ? "col-span-2 md:col-span-2 md:row-span-2"
                    : ""
                }
              >
                <figure
                  className={`group relative overflow-hidden rounded-3xl bg-ink/5 ${
                    i === 0
                      ? "aspect-[4/5] md:aspect-square"
                      : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={SPACE_IMGS[i]}
                    alt={s.desc}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
                  <figcaption className="absolute inset-x-5 bottom-5 text-cream">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-brand-soft">
                      {s.label}
                    </p>
                    <p className="mt-1 font-serif text-lg md:text-xl">{s.desc}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PHILOSOPHY ══════ */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
        <div className="absolute inset-0 opacity-25">
          <Image src="/clinic/corridor.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            {t("philosophyKicker")}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight lg:text-6xl">
            {t("philosophyTitleLead")}
            <br />
            <span className="text-brand-soft">{t("philosophyTitleAccent")}</span>
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {values.map((v) => (
              <Reveal key={v.n}>
                <div className="border-t border-cream/20 pt-8">
                  <p className="font-serif text-3xl text-brand-soft">{v.n}</p>
                  <h3 className="mt-4 font-serif text-xl">{v.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream/70">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ DEVICES ══════ */}
      <section className="bg-white py-28 lg:py-36">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              {t("equipmentKicker")}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-6xl">
              {t("equipmentTitleLead")}
              <br />
              <span className="text-brand-dark">{t("equipmentTitleAccent")}</span>
            </h2>
            <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-ink-soft lg:text-lg">
              {t("equipmentDesc")}
            </p>
            <Link
              href="/treatments/lifting"
              className="group mt-12 inline-flex items-center gap-3 border-b border-ink/30 pb-2 text-sm font-semibold text-ink transition hover:border-brand-dark hover:text-brand-dark"
            >
              {t("equipmentCta")}
              <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight lg:text-6xl">
              {t("ctaTitleLine1")}
              <br />
              {t("ctaTitleLine2Lead")}
              <span className="text-brand-dark">{t("ctaTitleAccent")}</span>
              {t("ctaTitleTail")}
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/treatments/lifting"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition hover:bg-brand-dark"
              >
                {t("ctaTreatments")}
                <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="tel:024217588"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-8 py-4 text-sm font-semibold text-ink hover:border-ink"
              >
                02-421-7588
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ LOCATION ══════ */}
      <section className="border-t border-line bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-14">
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              {tLoc("kicker")}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              {tLoc("title")}
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="space-y-6">
                <div className="rounded-3xl border border-line bg-cream/40 p-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-brand-dark">
                    {tLoc("addressLabel")}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-ink">
                    {tLoc("address")}
                  </p>
                </div>
                <div className="rounded-3xl border border-line bg-cream/40 p-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-brand-dark">
                    {tLoc("hoursLabel")}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-base text-ink-soft">
                    {(tLoc.raw("hoursLines") as string[]).map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-line bg-cream/40 p-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-brand-dark">
                    {tLoc("phoneLabel")}
                  </p>
                  <a
                    href="tel:024217588"
                    className="mt-3 block font-serif text-2xl text-ink hover:text-brand-dark"
                  >
                    02-421-7588
                  </a>
                </div>
                <div className="rounded-3xl border border-line bg-cream/40 p-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-brand-dark">
                    {tLoc("directionsLabel")}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                    {(tLoc.raw("directions") as string[]).map((d) => (
                      <li key={d} className="flex gap-2">
                        <span className="text-brand-dark">·</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="overflow-hidden rounded-3xl border border-line">
                <iframe
                  title={tLoc("mapTitle")}
                  src={`https://www.google.com/maps?q=${encodeURIComponent("선샤인의원 서울특별시 송파구 올림픽로 102")}&z=17&output=embed`}
                  className="block h-[420px] w-full lg:h-[620px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex gap-2 border-t border-line bg-white p-3">
                  <a
                    href="https://map.naver.com/p/search/서울특별시 송파구 올림픽로 102"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center rounded-xl bg-sand/70 py-3 text-sm font-semibold text-ink hover:bg-blush"
                  >
                    {tLoc("naverMap")}
                  </a>
                  <a
                    href="https://map.kakao.com/?q=서울특별시 송파구 올림픽로 102"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center rounded-xl bg-sand/70 py-3 text-sm font-semibold text-ink hover:bg-blush"
                  >
                    {tLoc("kakaoMap")}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
