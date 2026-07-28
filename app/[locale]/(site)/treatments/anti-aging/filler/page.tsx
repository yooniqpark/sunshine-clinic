import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  getDeviceImage,
  getDeviceMarketing,
  type DeviceDetail,
} from "@/lib/devices";
const FILLER_SLUGS = ["juvederm", "belotero"];

export const metadata = {
  title: "필러",
  robots: { index: false, follow: false },
};

export default async function FillerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const dict = (
    await import(`@/content/devices-${locale}.json`).catch(
      async () => await import(`@/content/devices-ko.json`),
    )
  ).default as Record<string, DeviceDetail>;

  const fillers = FILLER_SLUGS.map((slug) => dict[slug]).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-[#1a1310]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pb-32 lg:pt-40">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.15em] text-cream/40">
            <Link href="/home" className="hover:text-cream">HOME</Link>
            <span>/</span>
            <span className="text-cream/80">ANTI-AGING</span>
            <span>/</span>
            <span className="text-cream/70">필러</span>
          </nav>

          <p className="mt-16 text-[11px] font-bold tracking-[0.4em] text-brand-soft">
            FILLER
          </p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,6.5rem)] font-normal leading-[1.02] tracking-tight">
            필러
          </h1>
          <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-cream/75 lg:text-2xl">
            &ldquo;볼륨·윤곽·잔주름 개선을 위한 HA · CaHA 필러&rdquo;
          </p>
          <p className="mt-12 text-[10px] tracking-[0.3em] text-cream/40">
            JUVÉDERM · BELOTERO
          </p>
        </div>
      </section>

      {/* Filler list */}
      <section className="bg-cream pb-24 lg:pb-32">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {fillers.map((d) => {
              const img = getDeviceImage(d.slug);
              const mk = getDeviceMarketing(d.slug);
              return (
                <li key={d.slug}>
                  <Link
                    href={`/treatments/anti-aging/${d.slug}`}
                    className="group block overflow-hidden rounded-3xl border border-ink/10 bg-white transition-all duration-500 hover:border-brand-dark hover:shadow-xl hover:shadow-ink/10"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5eee1]">
                      {img && (
                        <Image
                          src={img}
                          alt={d.name}
                          fill
                          sizes="(max-width: 768px) 90vw, 33vw"
                          className="object-contain object-center p-8 transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="border-t border-ink/10 p-6">
                      {mk?.englishName && (
                        <p className="font-serif text-[11px] tracking-[0.18em] text-ink/45">
                          {mk.englishName}
                        </p>
                      )}
                      <h2 className="mt-1.5 font-serif text-2xl font-normal tracking-tight text-ink transition-colors group-hover:text-brand-dark">
                        {d.name}
                      </h2>
                      <p className="mt-3 text-[13px] leading-[1.7] text-ink/60">
                        {d.tagline}
                      </p>
                      {d.manufacturer && (
                        <p className="mt-4 text-[11px] tracking-[0.14em] text-ink/45">
                          MANUFACTURER · {d.manufacturer}
                        </p>
                      )}
                      <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-ink/70 transition group-hover:text-brand-dark">
                        상세 보기
                        <span aria-hidden className="text-brand-dark">↗</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-12 text-center text-[11px] tracking-[0.2em] text-ink/40">
            시술 전 상담을 통해 개인 얼굴 균형 · 연조직 상태를 반영해 필러 종류와
            용량을 결정합니다
          </p>
        </div>
      </section>
    </>
  );
}
