import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon, ArrowIcon } from "@/components/icons";

export default function PreviewHome() {
  return (
    <>
      {/* ═══════ 1. HERO — dark editorial ═══════ */}
      <section className="relative h-[92vh] min-h-[640px] overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0">
          <Image
            src="/hero-clinic.png"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/30" />
        </div>
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-5 py-16 lg:px-8 lg:py-24">
          <div>
            <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
              SUNSHINE DERMATOLOGY CLINIC · SINCE 2026
            </p>
          </div>

          <Reveal>
            <div className="max-w-3xl">
              <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-normal leading-[1.05] tracking-tight">
                피부의 결,
                <br />
                <em className="italic text-brand-soft">일상의 빛.</em>
              </h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-cream/75 lg:text-lg">
                환자 한 분 한 분에게 맞춘 섬세하고 정직한 진료.
                <br />
                프리미엄 하이엔드 장비로 건강한 변화를 함께 만들어 갑니다.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  href="#book"
                  className="group inline-flex items-center gap-3 text-sm font-semibold text-cream"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-cream/40 transition group-hover:bg-cream group-hover:text-ink">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                  상담 예약하기
                </Link>
                <Link
                  href="/treatments/lifting"
                  className="text-xs font-semibold tracking-[0.2em] text-cream/70 underline underline-offset-8 transition hover:text-brand-soft"
                >
                  시술 둘러보기
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="flex items-end justify-between text-[10px] tracking-[0.24em] text-cream/50">
            <span>SCROLL ↓</span>
            <span>SEOUL · 송파</span>
          </div>
        </div>
      </section>

      {/* ═══════ 2. TRUST BAR ═══════ */}
      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-14 md:grid-cols-4 lg:px-8">
          {[
            { n: "10", u: "년+", l: "임상 경험" },
            { n: "15", u: "종", l: "정품 인증 장비" },
            { n: "4", u: "개국", l: "다국어 진료" },
            { n: "1:1", u: "", l: "맞춤 진료" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="text-center">
                <p className="font-serif text-5xl font-normal tracking-tight lg:text-6xl">
                  {s.n}
                  <span className="text-xl align-super text-brand">{s.u}</span>
                </p>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">
                  {s.l}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════ 3. EDITORIAL QUOTE — director spotlight ═══════ */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:px-8">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-sand/40">
              <Image
                src="/team/kim.jpg"
                alt="대표원장 김병현"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[10px] font-bold tracking-[0.28em] text-brand">
              DIRECTOR · 대표원장
            </p>
            <blockquote className="mt-5 font-serif text-3xl font-normal leading-[1.35] tracking-tight text-ink lg:text-[2.75rem] lg:leading-[1.25]">
              &ldquo;환자 한 분 한 분의 <em className="italic text-brand-dark">피부와 마음</em>까지
              함께 살피는 진료를 지향합니다.&rdquo;
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-line" />
              <div>
                <p className="text-base font-semibold">김병현</p>
                <p className="text-xs text-ink-soft">대표원장 · Sunshine Dermatology Clinic</p>
              </div>
            </div>
            <Link
              href="/about#doctors"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand"
            >
              의료진 소개 <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════ 4. CATEGORIES — bento grid ═══════ */}
      <section className="border-y border-line bg-sand/30 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] text-brand">TREATMENTS</p>
              <h2 className="mt-3 font-serif text-4xl font-normal leading-tight tracking-tight lg:text-5xl">
                고민별 <em className="italic text-brand-dark">맞춤 시술</em>
              </h2>
            </div>
            <Link
              href="/treatments/lifting"
              className="hidden text-xs font-semibold tracking-[0.18em] text-ink-soft underline underline-offset-4 hover:text-brand sm:inline"
            >
              전체 카테고리 →
            </Link>
          </div>

          {/* Bento grid: 리프팅 큼(2×2) + 나머지 작음 */}
          <div className="grid gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
            <BentoCard
              slug="lifting"
              img="/models/lifting.png"
              label="LIFTING"
              title="리프팅"
              tall
              wide
            />
            <BentoCard
              slug="anti-aging"
              img="/models/anti-aging.jpg"
              label="ANTI-AGING"
              title="안티에이징"
            />
            <BentoCard
              slug="whitening"
              img="/models/whitening.png"
              label="WHITENING"
              title="화이트닝·홍조"
            />
            <BentoCard
              slug="acne"
              img="/models/acne.png"
              label="ACNE · SCAR"
              title="여드름·흉터"
            />
            <BentoCard
              slug="skin-disease"
              label="SKIN DISEASE"
              title="피부질환"
              wide
            />
          </div>
        </div>
      </section>

      {/* ═══════ 5. SIGNATURE DEVICES — dark rhythm ═══════ */}
      <section className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] text-brand-soft">
                SIGNATURE DEVICES
              </p>
              <h2 className="mt-3 font-serif text-4xl font-normal leading-tight tracking-tight lg:text-5xl">
                본사 <em className="italic text-brand-soft">정품 인증</em>
                <br />
                하이엔드 장비.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70">
                울쎄라 · 써마지 · 슈링크 유니버스 등 15종 이상의 정품 장비로
                피부층·부위·개별 상태에 맞춘 정밀 시술을 제공합니다.
              </p>
              <Link
                href="/about#devices"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cream hover:text-brand-soft"
              >
                전체 장비 보기 <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
              {[
                { name: "울쎄라 프라임", tag: "HIFU · 리프팅", img: "/devices/ulthera-prime.png" },
                { name: "써마지 FLX", tag: "RF · 탄력", img: "/devices/thermage-flx.png" },
                { name: "슈링크 유니버스", tag: "HIFU · 부위 맞춤", img: "/devices/shurink-universe.png" },
                { name: "포토나 스타워커", tag: "레이저 · 색소", img: "/devices/fotona-starwalker.png" },
                { name: "V-Beam", tag: "홍조 · 혈관", img: "/devices/vbeam.png" },
                { name: "Secret RF", tag: "미세바늘 RF", img: "/devices/secret-rf.png" },
              ].map((d, i) => (
                <Reveal key={d.name} delay={i * 60}>
                  <div className="group overflow-hidden rounded-2xl bg-cream/95 p-4 transition hover:bg-cream">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-sand/60">
                      <Image
                        src={d.img}
                        alt={d.name}
                        fill
                        sizes="(max-width: 1024px) 40vw, 20vw"
                        className="object-contain p-3 transition group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 text-[10px] font-bold tracking-[0.22em] text-brand">
                      {d.tag}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">{d.name}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 6. CONCEPT · WHY ═══════ */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.28em] text-brand">WHY SUNSHINE</p>
          <h2 className="mt-6 font-serif text-3xl font-normal leading-tight tracking-tight lg:text-5xl">
            <em className="italic text-brand-dark">과잉 진료보다</em> 필요한 진료를,
            <br />
            <em className="italic text-brand-dark">화려한 광고보다</em> 검증된 결과를,
            <br />
            <em className="italic text-brand-dark">일시적 개선보다</em> 건강한 변화를.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ink-soft lg:text-base">
            피부 본연의 건강과 아름다움을 회복하여 일상에 더 큰 자신감을 선물하는
            주치의가 되겠습니다.
          </p>
          <Link
            href="/about"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand"
          >
            병원 소개 자세히 <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══════ 7. CTA / LOCATION ═══════ */}
      <section id="book" className="bg-ink py-24 text-cream lg:py-32">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.28em] text-brand-soft">CONTACT</p>
          <h2 className="mt-4 font-serif text-4xl font-normal leading-tight tracking-tight lg:text-6xl">
            지금 <em className="italic text-brand-soft">상담을 예약</em>하세요.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-cream/70">
            1:1 맞춤 상담 후 가장 적합한 시술 플랜을 안내드립니다. 방문 상담은 무료입니다.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a
              href="tel:024217588"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              전화 02-421-7588
            </a>
            <a
              href="https://m.booking.naver.com/booking/13/bizes/1698236"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-white/10 px-8 py-4 text-sm font-semibold text-cream backdrop-blur transition hover:bg-white/20"
            >
              네이버 예약하기
            </a>
          </div>
          <p className="mt-16 text-[11px] tracking-[0.2em] text-cream/50">
            서울특별시 송파구 올림픽로 102, 서일빌딩 10층 · 평일 10:00–20:00 · 토요일 10:00–16:00
          </p>
        </div>
      </section>
    </>
  );
}

function BentoCard({
  slug,
  img,
  label,
  title,
  wide,
  tall,
}: {
  slug: string;
  img?: string;
  label: string;
  title: string;
  wide?: boolean;
  tall?: boolean;
}) {
  const span = [
    wide ? "lg:col-span-2" : "",
    tall ? "lg:row-span-2" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Reveal className={`${span} h-full`}>
      <Link
        href={`/treatments/${slug}`}
        className="group relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-3xl bg-ink"
      >
        {img ? (
          <>
            <Image
              src={img}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-soft/70" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-cream/15 blur-3xl" />
          </>
        )}
        <div className="relative mt-auto p-6 lg:p-7">
          <p className="text-[10px] font-bold tracking-[0.22em] text-brand-soft">{label}</p>
          <h3 className="mt-2 font-serif text-2xl font-normal leading-tight text-cream lg:text-3xl">
            {title}
          </h3>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cream/80 transition group-hover:text-cream">
            자세히 보기
            <ArrowUpRightIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
