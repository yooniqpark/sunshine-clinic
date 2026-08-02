import Image from "next/image";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "INTRO variants preview",
  robots: { index: false, follow: false },
};

const IMG = "/devices/ulthera-prime.png?v=4";
const HEADLINE = ["실시간 초음파로 피부층을 확인하며", "진행하는 정교한 1:1 프리미엄 맞춤 리프팅."];
const BODY =
  "울쎄라란 고강도 집속초음파(High Intensity Focused Ultrasound)를 이용해 피부 표면에는 손상을 주지 않고, 처짐의 원인이 되는 SMAS층까지 초음파로 정밀하게 자극해 조직을 응고 및 수축시키는 원리입니다. 사용하는 팁의 종류에 따라 콜라겐 재생을 유도하는 경우도 있습니다. HIFU를 이용해 피부 깊은 층까지 에너지를 정확히 전달하여 피부 처짐을 자연스럽게 끌어올려 줍니다.";

function Label({ code, name, desc }: { code: string; name: string; desc: string }) {
  return (
    <div id={`intro-${code.toLowerCase()}`} className="border-y border-ink/15 bg-[#e5dccc] px-6 py-4 lg:px-10">
      <p className="text-[10px] font-bold tracking-[0.3em] text-ink/50">INTRO {code}</p>
      <p className="mt-1 font-serif text-lg text-ink">{name} <span className="ml-3 font-sans text-xs text-ink/55">{desc}</span></p>
    </div>
  );
}

export default async function IntroPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20 lg:pt-28">
      {/* A — 클래식 2컬럼 */}
      <Label code="A" name="Classic Split" desc="좌측 헤드라인+본문, 우측 이미지 — 현재 구조의 완성형" />
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20 lg:px-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.35em] text-brand-dark">INTRODUCTION</p>
            <h2 className="mt-8 font-serif text-3xl leading-[1.35] text-ink lg:text-4xl">
              {HEADLINE[0]}
              <br />
              {HEADLINE[1]}
            </h2>
            <span aria-hidden className="mt-8 block h-px w-16 bg-brand-dark/50" />
            <p className="mt-8 max-w-lg text-[15px] leading-[1.95] text-ink/60">{BODY}</p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-[3/4]">
            <Image src={IMG} alt="" fill sizes="480px" className="object-cover" />
          </div>
        </div>
      </section>

      {/* B — 풀폭 헤드라인 + 하단 2컬럼 */}
      <Label code="B" name="Editorial Stack" desc="풀폭 대형 헤드라인 → 아래 본문·이미지 2컬럼" />
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-dark">INTRODUCTION</p>
          <h2 className="mt-8 max-w-4xl font-serif text-4xl leading-[1.25] text-ink lg:text-[3.2rem]">
            {HEADLINE[0]}
            <br />
            진행하는 <span className="italic text-brand-dark">정교한 1:1 프리미엄</span> 맞춤 리프팅.
          </h2>
          <div className="mt-16 grid gap-12 border-t border-ink/12 pt-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <p className="max-w-xl text-[15px] leading-[1.95] text-ink/60">{BODY}</p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={IMG} alt="" fill sizes="560px" className="object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* C — 이미지 좌측 + 골드 인용 스타일 */}
      <Label code="C" name="Quote Reverse" desc="이미지 좌측, 우측 골드 인용부호 헤드라인 + 본문" />
      <section className="bg-[#efe7da] py-24 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20 lg:px-8">
          <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-[24px] shadow-[0_30px_70px_-35px_rgba(120,90,50,0.6)] lg:order-1 lg:aspect-[3/4]">
            <Image src={IMG} alt="" fill sizes="480px" className="object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <span aria-hidden className="block font-serif text-7xl leading-none text-brand-dark/30">&ldquo;</span>
            <p className="mt-2 text-[10px] font-bold tracking-[0.35em] text-brand-dark">INTRODUCTION</p>
            <h2 className="mt-6 font-serif text-3xl leading-[1.4] text-ink lg:text-[2.4rem]">
              {HEADLINE[0]}
              <br />
              {HEADLINE[1]}
            </h2>
            <p className="mt-10 border-l-2 border-brand-dark/30 pl-6 text-[15px] leading-[1.95] text-ink/60">
              {BODY}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
