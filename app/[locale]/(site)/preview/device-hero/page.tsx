import Image from "next/image";

const IMG = "/devices/ulthera-prime.png";
const KICKER = "ULTHERA PRIME";
const NAME = "울쎄라 프라임";
const TAGLINE = "섬세한 실루엣 리프팅, 정직한 결과.";
const BY = "BY MERZ";
const CRUMB = "HOME / LIFTING / 울쎄라 프라임";

export const metadata = { title: "Device Hero Variants", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <div className="bg-cream text-ink">
      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <h1 className="font-serif text-3xl lg:text-4xl">Device Page — Hero Variants</h1>
        <p className="mt-2 text-sm text-ink-soft">5개 시안. 아래 각 히어로 스크롤하며 비교.</p>
      </div>

      {/* A · Editorial split */}
      <Label letter="A" title="Editorial Split (텍스트 왼쪽 / 이미지 오른쪽 · 균형)" />
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-24 pt-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-12 lg:pb-32 lg:pt-32">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-cream/45">{CRUMB}</p>
            <p className="mt-10 text-[11px] font-bold tracking-[0.4em] text-brand-soft">{KICKER}</p>
            <h2 className="mt-4 font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[1.02] tracking-tight">{NAME}</h2>
            <p className="mt-6 font-serif text-lg italic text-cream/75 lg:text-xl">&ldquo;{TAGLINE}&rdquo;</p>
            <p className="mt-10 text-[10px] tracking-[0.28em] text-cream/40">{BY}</p>
          </div>
          <div className="relative h-[420px] lg:h-[560px]">
            <Image src={IMG} alt="" fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-contain object-center" />
          </div>
        </div>
      </section>

      {/* B · Product spotlight (센터 대형) */}
      <Label letter="B" title="Product Spotlight (제품 중앙 대형 · 텍스트 하단)" />
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-24 text-center lg:pb-32 lg:pt-32">
          <p className="text-[11px] font-bold tracking-[0.4em] text-brand-soft">{KICKER}</p>
          <div className="relative mx-auto mt-10 h-[380px] w-full max-w-md lg:h-[520px]">
            <Image src={IMG} alt="" fill sizes="(min-width: 1024px) 480px, 90vw" className="object-contain object-center" />
          </div>
          <h2 className="mt-10 font-serif text-4xl leading-tight lg:text-6xl">{NAME}</h2>
          <p className="mt-6 font-serif italic text-cream/75 lg:text-xl">&ldquo;{TAGLINE}&rdquo;</p>
          <p className="mt-8 text-[10px] tracking-[0.28em] text-cream/40">{BY}</p>
        </div>
      </section>

      {/* C · Cinematic text-only */}
      <Label letter="C" title="Cinematic Text-only (이미지 없음 · 초대형 세리프)" />
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-5 pb-28 pt-28 lg:px-12 lg:pb-40 lg:pt-40">
          <p className="text-[11px] tracking-[0.24em] text-cream/45">{CRUMB}</p>
          <p className="mt-16 text-[11px] font-bold tracking-[0.4em] text-brand-soft">{KICKER}</p>
          <h2 className="mt-6 font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.98] tracking-tight">{NAME}</h2>
          <p className="mt-12 max-w-2xl font-serif text-xl italic leading-relaxed text-cream/75 lg:text-3xl">&ldquo;{TAGLINE}&rdquo;</p>
          <p className="mt-16 text-[10px] tracking-[0.32em] text-cream/40">{BY}</p>
        </div>
      </section>

      {/* D · Marquee outline background */}
      <Label letter="D" title="Marquee Outline (배경에 영문 이름이 초대형 아웃라인)" />
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
          <div className="whitespace-nowrap font-serif text-[24vw] leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(230,222,205,0.18)]">
            {KICKER}&nbsp;{KICKER}&nbsp;{KICKER}
          </div>
        </div>
        <div className="relative mx-auto max-w-4xl px-5 pb-28 pt-28 lg:px-12 lg:pb-36 lg:pt-36">
          <p className="text-[11px] tracking-[0.24em] text-cream/45">{CRUMB}</p>
          <p className="mt-10 text-[11px] font-bold tracking-[0.4em] text-brand-soft">{KICKER}</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight lg:text-7xl">{NAME}</h2>
          <p className="mt-6 font-serif italic text-cream/80 lg:text-2xl">&ldquo;{TAGLINE}&rdquo;</p>
          <p className="mt-10 text-[10px] tracking-[0.28em] text-cream/40">{BY}</p>
        </div>
      </section>

      {/* E · Top image band + text below (light) */}
      <Label letter="E" title="Image Band (상단 사진 밴드 · 하단 크림 배경 텍스트)" />
      <section className="bg-cream text-ink">
        <div className="relative w-full bg-[#f5eee1]">
          <div className="mx-auto flex h-[360px] max-w-5xl items-end justify-center lg:h-[480px]">
            <div className="relative h-full w-full">
              <Image src={IMG} alt="" fill sizes="100vw" className="object-contain object-center p-8 lg:p-14" />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-5 pb-24 pt-16 text-center lg:pb-32 lg:pt-24">
          <p className="text-[11px] font-bold tracking-[0.4em] text-brand-dark">{KICKER}</p>
          <h2 className="mt-6 font-serif text-4xl leading-tight lg:text-6xl">{NAME}</h2>
          <p className="mt-6 font-serif italic text-ink-soft lg:text-xl">&ldquo;{TAGLINE}&rdquo;</p>
          <p className="mt-10 text-[10px] tracking-[0.28em] text-ink-soft/70">{BY}</p>
        </div>
      </section>
    </div>
  );
}

function Label({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-4 pt-16 lg:px-12">
      <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">VARIANT {letter}</p>
      <h3 className="mt-2 font-serif text-2xl lg:text-3xl">{title}</h3>
    </div>
  );
}
