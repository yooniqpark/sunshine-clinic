import Image from "next/image";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "HERO variants preview",
  robots: { index: false, follow: false },
};

const IMG = "/concerns/melasma.jpg";
const NAME = "기미";
const TAG = "색소만 지우는 레이저는 그만, 피부 속 환경을 바꾸는 뿌리 깊은 기미 솔루션";
const CAT = "WHITENING";

function Label({ code, name, desc }: { code: string; name: string; desc: string }) {
  return (
    <div id={`hero-${code.toLowerCase()}`} className="border-y border-ink/15 bg-[#e5dccc] px-6 py-4 lg:px-10">
      <p className="text-[10px] font-bold tracking-[0.3em] text-ink/50">HERO {code}</p>
      <p className="mt-1 font-serif text-lg text-ink">{name} <span className="ml-3 font-sans text-xs text-ink/55">{desc}</span></p>
    </div>
  );
}

function Crumb({ dark = true }: { dark?: boolean }) {
  const c = dark ? "text-cream/50" : "text-ink/45";
  return (
    <nav className={`flex items-center gap-2 text-[11px] tracking-[0.15em] ${c}`}>
      <span>HOME</span><span>/</span><span>화이트닝 · 홍조</span><span>/</span><span>{NAME}</span>
    </nav>
  );
}

export default async function HeroPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20 lg:pt-28">
      {/* ── A: 틸트 카드 (현재안) */}
      <Label code="A" name="Tilted Card" desc="현재안 — 기울어진 카드 + 오프셋 프레임 + 고스트 타이포" />
      <section className="relative overflow-hidden bg-[#3a322d] text-cream">
        <span aria-hidden className="pointer-events-none absolute -bottom-6 left-0 select-none whitespace-nowrap font-serif text-[10rem] leading-none text-cream/[0.045]">{CAT}</span>
        <span aria-hidden className="pointer-events-none absolute right-[-10%] top-[-30%] h-[480px] w-[480px] rounded-full bg-[#c49074]/20 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-24 pt-16 lg:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <Crumb />
            <h1 className="mt-10 font-serif text-6xl leading-[1.05]">{NAME}</h1>
            <p className="mt-7 max-w-xl font-serif text-lg text-cream/75">&ldquo;{TAG}&rdquo;</p>
          </div>
          <div className="relative hidden lg:block">
            <span aria-hidden className="absolute -inset-3 -rotate-2 rounded-[22px] border border-cream/15" />
            <div className="relative h-[330px] w-[264px] rotate-1 overflow-hidden rounded-[18px] shadow-2xl">
              <Image src={IMG} alt="" fill sizes="264px" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── B: 스플릿 50/50 */}
      <Label code="B" name="Split" desc="왼쪽 텍스트 / 오른쪽 풀블리드 이미지 컬럼" />
      <section className="grid overflow-hidden bg-[#3a322d] text-cream lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-24 lg:px-16">
          <Crumb />
          <h1 className="mt-10 font-serif text-6xl leading-[1.05]">{NAME}</h1>
          <p className="mt-7 max-w-md font-serif text-lg text-cream/75">&ldquo;{TAG}&rdquo;</p>
        </div>
        <div className="relative min-h-[320px]">
          <Image src={IMG} alt="" fill sizes="50vw" className="object-cover" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#3a322d]/70 via-transparent to-transparent" />
        </div>
      </section>

      {/* ── C: 아치 프레임 · 라이트 */}
      <Label code="C" name="Arch Light" desc="라이트 베이지 배경 + 아치 이미지 — 밝은 무드" />
      <section className="relative overflow-hidden bg-[#efe7da] text-ink">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-14 lg:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <Crumb dark={false} />
            <p className="mt-10 text-[11px] font-bold tracking-[0.4em] text-brand-dark">{CAT}</p>
            <h1 className="mt-4 font-serif text-6xl leading-[1.05]">{NAME}</h1>
            <p className="mt-7 max-w-xl font-serif text-lg text-ink/65">&ldquo;{TAG}&rdquo;</p>
          </div>
          <div className="relative hidden h-[360px] w-[270px] overflow-hidden rounded-t-[999px] rounded-b-[20px] shadow-[0_30px_60px_-30px_rgba(120,90,50,0.6)] lg:block">
            <Image src={IMG} alt="" fill sizes="270px" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── D: 타이포 오버랩 */}
      <Label code="D" name="Overlap Type" desc="제목이 이미지 카드 위로 겹침" />
      <section className="relative overflow-hidden bg-[#3a322d] text-cream">
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 lg:px-12">
          <Crumb />
          <div className="relative mt-6">
            <div className="relative ml-auto h-[340px] w-[62%] overflow-hidden rounded-[20px] lg:h-[380px]">
              <Image src={IMG} alt="" fill sizes="60vw" className="object-cover object-top" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#3a322d]/55 to-transparent" />
            </div>
            <div className="lg:absolute lg:bottom-10 lg:left-0">
              <h1 className="mt-8 font-serif text-6xl leading-[1.02] lg:mt-0 lg:text-8xl">{NAME}</h1>
              <p className="mt-6 max-w-md font-serif text-lg text-cream/80">&ldquo;{TAG}&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── E: 듀오톤 경계 */}
      <Label code="E" name="Duotone" desc="다크→크림 2톤 배경, 이미지가 경계에 걸침" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[62%] bg-[#3a322d]" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-cream" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-5 pb-16 pt-16 lg:grid-cols-[1fr_auto] lg:px-12">
          <div className="pb-6 text-cream">
            <Crumb />
            <h1 className="mt-10 font-serif text-6xl leading-[1.05]">{NAME}</h1>
            <p className="mt-7 max-w-xl font-serif text-lg text-cream/75">&ldquo;{TAG}&rdquo;</p>
          </div>
          <div className="relative hidden h-[380px] w-[290px] overflow-hidden rounded-[20px] shadow-[0_36px_70px_-30px_rgba(0,0,0,0.55)] lg:block">
            <Image src={IMG} alt="" fill sizes="290px" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── F: 원형 포트홀 */}
      <Label code="F" name="Porthole" desc="원형 마스크 이미지 + 동심원 링" />
      <section className="relative overflow-hidden bg-[#3a322d] text-cream">
        <span aria-hidden className="pointer-events-none absolute right-[7%] top-1/2 hidden h-[430px] w-[430px] -translate-y-1/2 rounded-full border border-cream/10 lg:block" />
        <span aria-hidden className="pointer-events-none absolute right-[4%] top-1/2 hidden h-[500px] w-[500px] -translate-y-1/2 rounded-full border border-cream/[0.06] lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-24 pt-16 lg:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <Crumb />
            <h1 className="mt-10 font-serif text-6xl leading-[1.05]">{NAME}</h1>
            <p className="mt-7 max-w-xl font-serif text-lg text-cream/75">&ldquo;{TAG}&rdquo;</p>
          </div>
          <div className="relative mr-6 hidden h-[340px] w-[340px] overflow-hidden rounded-full border-2 border-cream/15 shadow-[0_0_80px_rgba(196,144,116,0.3)] lg:block">
            <Image src={IMG} alt="" fill sizes="340px" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── G: 필름 슬릿 3분할 */}
      <Label code="G" name="Film Slits" desc="이미지가 세로 3조각으로 — 조형적" />
      <section className="relative overflow-hidden bg-[#3a322d] text-cream">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 lg:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <Crumb />
            <h1 className="mt-10 font-serif text-6xl leading-[1.05]">{NAME}</h1>
            <p className="mt-7 max-w-xl font-serif text-lg text-cream/75">&ldquo;{TAG}&rdquo;</p>
          </div>
          <div className="hidden gap-3 lg:flex">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative h-[340px] w-[104px] overflow-hidden rounded-[14px]"
                style={{ marginTop: i === 1 ? 28 : 0 }}
              >
                <Image
                  src={IMG} alt="" fill sizes="340px"
                  className="object-cover"
                  style={{ objectPosition: `${i * 50}% center` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── H: 매거진 커버 */}
      <Label code="H" name="Magazine Cover" desc="중앙 커버 카드 위 타이틀 오버레이" />
      <section className="relative overflow-hidden bg-[#2b2420] py-14 text-cream">
        <div className="mx-auto max-w-7xl px-5 lg:px-12">
          <div className="relative mx-auto h-[430px] max-w-3xl overflow-hidden rounded-[24px]">
            <Image src={IMG} alt="" fill sizes="768px" className="object-cover object-top" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#211b17]/85 via-transparent to-[#211b17]/30" />
            <div className="absolute inset-x-0 top-6 flex items-center justify-between px-8 text-[10px] tracking-[0.3em] text-cream/80">
              <span>SUNSHINE CLINIC</span><span>{CAT}</span>
            </div>
            <div className="absolute inset-x-0 bottom-8 px-8 text-center">
              <h1 className="font-serif text-6xl">{NAME}</h1>
              <p className="mx-auto mt-4 max-w-md font-serif text-base text-cream/80">&ldquo;{TAG}&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── I: 폴라로이드 스택 · 라이트 */}
      <Label code="I" name="Polaroid Stack" desc="크림 배경 + 폴라로이드 2장 겹침" />
      <section className="relative overflow-hidden bg-cream text-ink">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-14 lg:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <Crumb dark={false} />
            <p className="mt-10 text-[11px] font-bold tracking-[0.4em] text-brand-dark">{CAT}</p>
            <h1 className="mt-4 font-serif text-6xl leading-[1.05]">{NAME}</h1>
            <p className="mt-7 max-w-xl font-serif text-lg text-ink/65">&ldquo;{TAG}&rdquo;</p>
          </div>
          <div className="relative hidden h-[380px] w-[330px] lg:block">
            <div className="absolute left-0 top-6 h-[300px] w-[240px] -rotate-6 rounded-[10px] bg-white p-3 pb-10 shadow-[0_24px_50px_-25px_rgba(28,25,23,0.5)]">
              <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-[#eee]">
                <Image src={IMG} alt="" fill sizes="240px" className="object-cover object-left" />
              </div>
            </div>
            <div className="absolute right-0 top-0 h-[320px] w-[250px] rotate-3 rounded-[10px] bg-white p-3 pb-10 shadow-[0_28px_56px_-25px_rgba(28,25,23,0.55)]">
              <div className="relative h-full w-full overflow-hidden rounded-[6px]">
                <Image src={IMG} alt="" fill sizes="250px" className="object-cover" />
              </div>
              <p className="mt-2 text-center font-serif text-[11px] italic text-ink/55">melasma care</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── J: 컬러 사이드바 */}
      <Label code="J" name="Color Sidebar" desc="카테고리 컬러 세로 바 + 카드 — 카테고리 아이덴티티 강조" />
      <section className="relative overflow-hidden bg-[#3a322d] text-cream">
        <span aria-hidden className="absolute inset-y-0 left-0 w-2.5 bg-[#a3b3cf]" />
        <span aria-hidden className="pointer-events-none absolute left-[-6%] top-[-30%] h-[420px] w-[420px] rounded-full bg-[#a3b3cf]/15 blur-[110px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-24 pt-16 lg:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#a3b3cf]" />
              <span className="text-[10px] font-bold tracking-[0.35em] text-[#a3b3cf]">{CAT}</span>
            </div>
            <h1 className="mt-8 font-serif text-6xl leading-[1.05]">{NAME}</h1>
            <p className="mt-7 max-w-xl font-serif text-lg text-cream/75">&ldquo;{TAG}&rdquo;</p>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative h-[330px] w-[264px] overflow-hidden rounded-[18px] border-t-4 shadow-2xl" style={{ borderColor: "#a3b3cf" }}>
              <Image src={IMG} alt="" fill sizes="264px" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── K: 풀블리드 매거진 커버 */}
      <Label code="K" name="Magazine Full-Bleed" desc="이미지가 상단 전체 — 매거진 커버 문법 (마스트헤드·커버라인·이슈 메타)" />
      <section className="relative h-[78vh] min-h-[560px] overflow-hidden bg-[#211b17] text-cream">
        <Image src={IMG} alt="" fill priority sizes="100vw" className="object-cover object-[center_28%]" />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1c1613]/90 via-[#1c1613]/25 to-[#1c1613]/45" />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#1c1613]/55 via-transparent to-transparent" />

        {/* 마스트헤드 행 */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-cream/20 px-6 py-5 text-[10px] font-semibold tracking-[0.35em] text-cream/85 lg:px-12">
          <span>SUNSHINE CLINIC</span>
          <span className="hidden font-serif normal-case italic tracking-[0.15em] sm:block">
            Skin Journal — {CAT}
          </span>
          <span>N°01</span>
        </div>

        {/* 타이틀 블록 */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 lg:px-12 lg:pb-14">
          <p className="text-[10px] font-bold tracking-[0.4em] text-cream/70">{CAT}</p>
          <h1 className="mt-4 font-serif text-[clamp(3.5rem,9vw,7.5rem)] font-normal leading-[0.98] tracking-tight">
            {NAME}
          </h1>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-6 border-t border-cream/25 pt-6">
            <p className="max-w-xl font-serif text-base leading-relaxed text-cream/85 lg:text-lg">
              &ldquo;{TAG}&rdquo;
            </p>
            <ul className="hidden shrink-0 gap-8 text-[11px] tracking-[0.2em] text-cream/60 lg:flex">
              <li>레이저 토닝</li>
              <li>색소 깊이 진단</li>
              <li>재발 관리</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── L: 프레임드 매거진 커버 */}
      <Label code="L" name="Magazine Framed" desc="크림 여백 위 대형 커버 판형 — 인쇄 잡지 느낌" />
      <section className="bg-cream px-4 pb-14 pt-6 lg:px-8">
        <div className="relative mx-auto h-[72vh] min-h-[540px] max-w-[1400px] overflow-hidden rounded-[6px] shadow-[0_40px_90px_-40px_rgba(28,25,23,0.5)]">
          <Image src={IMG} alt="" fill priority sizes="100vw" className="object-cover object-[center_25%]" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1c1613]/85 via-transparent to-[#1c1613]/35" />
          <div className="absolute inset-x-0 top-6 px-8 text-center">
            <p className="font-serif text-3xl tracking-[0.35em] text-cream lg:text-4xl">SUNSHINE</p>
            <p className="mt-1.5 text-[9px] tracking-[0.45em] text-cream/70">
              SKIN JOURNAL · {CAT} · N°01
            </p>
          </div>
          <p className="absolute left-8 top-1/2 hidden -translate-y-1/2 text-[10px] tracking-[0.3em] text-cream/70 [writing-mode:vertical-rl] lg:block">
            색소 깊이에 맞춘 레이저 관리
          </p>
          <p className="absolute right-8 top-1/2 hidden -translate-y-1/2 text-[10px] tracking-[0.3em] text-cream/70 [writing-mode:vertical-rl] lg:block">
            SUNSHINE STANDARD — SEOUL
          </p>
          <div className="absolute inset-x-0 bottom-9 px-8 text-center">
            <h1 className="font-serif text-[clamp(3.2rem,8vw,6.5rem)] font-normal leading-[0.98]">
              <span className="text-cream">{NAME}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg font-serif text-base text-cream/85">
              &ldquo;{TAG}&rdquo;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
