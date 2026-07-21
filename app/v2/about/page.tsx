import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";

const HISTORY = [
  { year: "2010", event: "가톨릭대학교 의과대학 졸업" },
  { year: "2015", event: "가톨릭대학교 서울성모병원 피부과 전문의 취득" },
  { year: "2016", event: "대한피부과학회 정회원" },
  { year: "2018", event: "대한미용성형레이저의학회 정회원" },
  { year: "2020", event: "국제모발이식학회 (ISHRS) 정회원" },
  { year: "2026", event: "선샤인의원 개원 · 대표원장" },
];

const VALUES = [
  {
    n: "01",
    title: "정직한 진료",
    body: "필요하지 않은 시술은 권하지 않습니다. 피부 상태와 라이프 사이클에 맞춘 최소 개입을 우선합니다.",
  },
  {
    n: "02",
    title: "섬세한 손길",
    body: "10년 이상의 임상 경험을 바탕으로 결·톤·라인을 하나씩 다듬는 밀도 있는 진료를 제공합니다.",
  },
  {
    n: "03",
    title: "프리미엄 장비",
    body: "국내 상위권 하이엔드 장비를 도입해 회복이 빠르고 편안한 시술 환경을 만듭니다.",
  },
];

const SPACES = [
  { src: "/clinic/lounge.jpg", label: "WAITING LOUNGE", desc: "대기 라운지" },
  { src: "/clinic/corridor.jpg", label: "CORRIDOR", desc: "진료실 복도" },
  { src: "/clinic/vip-corridor.jpg", label: "VIP AREA", desc: "VIP 시술 존" },
  { src: "/clinic/care-room.jpg", label: "CARE ROOM", desc: "케어 룸" },
  { src: "/clinic/powder-room.jpg", label: "POWDER ROOM", desc: "파우더 룸" },
];

export default function AboutPage() {
  return (
    <>
      {/* ══════ HERO — reception photo bg ══════ */}
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
            ABOUT SUNSHINE
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05]">
            결을 다듬고,
            <br />
            <em className="italic text-brand-soft">일상을 밝히다.</em>
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-cream/75 lg:text-lg">
            선샤인의원은 대학병원에서 오랜 임상 경험을 쌓은 피부과 전문의가 직접 진료하는 로컬 클리닉입니다.
            유행보다는 오래가는 아름다움을, 화려함보다는 건강한 회복을 지향합니다.
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
                alt="김병현 대표원장"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                DIRECTOR
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
                김병현 <span className="text-ink-soft/70">대표원장</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">
                가톨릭대학교 서울성모병원 피부과 전문의로서 15년 이상 다양한 피부 케이스를 진료해 왔습니다.
                유행을 좇지 않고, 각자의 톤과 결을 존중한 진료 계획을 세워 드립니다.
              </p>

              <div className="mt-10 border-t border-line pt-8">
                <p className="text-[10px] font-bold tracking-[0.24em] text-ink-soft">
                  HISTORY
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {HISTORY.map((h) => (
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

      {/* ══════ CONSULT ROOM — big statement image ══════ */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-2 lg:gap-24 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink/5">
              <Image
                src="/clinic/consult-room.jpg"
                alt="원장 진료실"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              CONSULT ROOM
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-5xl">
              대화가 시작되는 자리
            </h2>
            <p className="mt-8 text-base leading-relaxed text-ink-soft lg:text-lg">
              대리석 벽면과 브라운 우드로 마감한 원장실은
              차분한 톤으로 편안한 상담 분위기를 만듭니다.
              충분한 시간을 두고 피부 상태와 라이프 사이클을 함께 나눕니다.
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
                THE SPACE
              </p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight lg:text-6xl">
                편안한 회복을 위한
                <br />
                <em className="italic text-brand-dark">모든 순간.</em>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              대기실부터 파우더룸까지, 방문하시는 모든 공간을 호텔의 결로 다듬어
              편안하고 프라이빗하게 설계했습니다.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {SPACES.map((s, i) => (
              <Reveal
                key={s.src}
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
                    src={s.src}
                    alt={s.desc}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
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

      {/* ══════ PHILOSOPHY — dark, corridor bg ══════ */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
        <div className="absolute inset-0 opacity-25">
          <Image src="/clinic/corridor.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">
            PHILOSOPHY
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight lg:text-6xl">
            서두르지 않고,
            <br />
            <em className="italic text-brand-soft">오래가는 결과.</em>
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {VALUES.map((v) => (
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

      {/* ══════ DEVICES — text only for now, photos coming later ══════ */}
      <section className="bg-white py-28 lg:py-36">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
              EQUIPMENT
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight lg:text-6xl">
              하이엔드 장비,
              <br />
              <em className="italic text-brand-dark">한 자리에.</em>
            </h2>
            <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-ink-soft lg:text-lg">
              울쎄라 프라임 · 써마지 FLX · 슈링크 유니버스 · 클라리티 II · 스타워커 ·
              브이빔 · 인모드 · 카프리 CO2 등 국내 상위권 하이엔드 장비를 한 공간에 갖추었습니다.
            </p>
            <Link
              href="/v2/treatments/lifting"
              className="group mt-12 inline-flex items-center gap-3 border-b border-ink/30 pb-2 text-sm font-semibold text-ink transition hover:border-brand-dark hover:text-brand-dark"
            >
              장비 리스트 보기
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
              첫 상담,
              <br />
              가장 가까운 <em className="italic text-brand-dark">시작</em>입니다.
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/v2/treatments/lifting"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition hover:bg-brand-dark"
              >
                시술 알아보기
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
    </>
  );
}
