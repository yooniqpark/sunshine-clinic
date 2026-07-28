import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  getDeviceImage,
  getDeviceMarketing,
  type DeviceDetail,
} from "@/lib/devices";
const FILLER_SLUGS = ["juvederm", "belotero", "radiesse"];

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
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark lg:text-[11px]">
            ANTI-AGING · FILLER
          </p>
          <h1 className="mt-6 font-serif text-4xl font-normal leading-[1.1] tracking-tight text-ink lg:text-[3.5rem]">
            필러
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-[1.8] text-ink/65 lg:text-base">
            볼륨·윤곽·잔주름 개선을 위한 HA · CaHA 필러를 개인의 얼굴 균형과
            연조직 상태에 맞춰 안전하게 시술합니다. 종류별 특성을 이해하고
            자연스러운 결과를 위한 최적 조합을 상담해 드립니다.
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
