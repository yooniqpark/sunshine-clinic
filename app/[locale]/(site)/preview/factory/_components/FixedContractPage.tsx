import { getSettings, phoneVars } from "@yooniqpark/clinic-core/lib/settings";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons";
import type { AppLocale } from "@/i18n/routing";
import type {
  FixedEquipmentDetail,
  FixedTreatmentDetail,
  EditableFact,
} from "@/lib/fixed-detail-contracts";

type Labels = {
  preview: string;
  previewDescription: string;
  feedbackPrompt: string;
  suitable: string;
  principle: string;
  benefits: string;
  facts: string;
  duration: string;
  anesthesia: string;
  downtime: string;
  sessions: string;
  pending: string;
  process: string;
  precautions: string;
  faq: string;
  related: string;
  viewDetail: string;
  treatment: string;
  equipment: string;
  manufacturer: string;
  model: string;
  applications: string;
  certifications: string;
  missing: string;
  consultation: string;
  consultationDescription: string;
  online: string;
  phone: string;
};

const LABELS: Record<AppLocale, Labels> = {
  ko: {
    preview: "FACTORY PREVIEW · 피드백",
    previewDescription: "우리가 먼저 완성한 화면입니다. 병원 피드백을 받으면 바로 반영해 최종본으로 다듬습니다.",
    feedbackPrompt: "디자인 · 문구 · 이미지 피드백 가능",
    suitable: "이런 고민에 적합합니다",
    principle: "원리와 접근",
    benefits: "주요 특징",
    facts: "시술 정보",
    duration: "소요 시간",
    anesthesia: "마취 방식",
    downtime: "회복 기간",
    sessions: "권장 횟수",
    pending: "상담 시 안내",
    process: "진행 과정",
    precautions: "주의사항",
    faq: "자주 묻는 질문",
    related: "연관 시술",
    viewDetail: "자세히 보기",
    treatment: "시술",
    equipment: "장비 정보",
    manufacturer: "제조사",
    model: "모델",
    applications: "적용 시술",
    certifications: "인증 및 검증 정보",
    missing: "정보 준비 중",
    consultation: "상담을 통해 확인하세요",
    consultationDescription: "피부 상태와 진료 계획에 따라 적용 방법이 달라질 수 있습니다.",
    online: "온라인 상담",
    phone: "전화 {phone}",
  },
  en: {
    preview: "FACTORY PREVIEW · FEEDBACK",
    previewDescription: "We built this page first and will refine it immediately from the clinic's feedback.",
    feedbackPrompt: "Feedback welcome on design, copy, and images",
    suitable: "Who it may suit",
    principle: "Principle and approach",
    benefits: "Key features",
    facts: "Treatment facts",
    duration: "Duration",
    anesthesia: "Anesthesia",
    downtime: "Downtime",
    sessions: "Recommended sessions",
    pending: "Provided during consultation",
    process: "Care process",
    precautions: "Precautions",
    faq: "Frequently asked questions",
    related: "Related treatments",
    viewDetail: "View details",
    treatment: "Treatment",
    equipment: "Equipment information",
    manufacturer: "Manufacturer",
    model: "Model",
    applications: "Treatment applications",
    certifications: "Certifications and verification",
    missing: "Information in preparation",
    consultation: "Confirm through consultation",
    consultationDescription: "The treatment method may vary according to your condition and clinical plan.",
    online: "Online consultation",
    phone: "Call {phone}",
  },
  ja: {
    preview: "FACTORY PREVIEW · フィードバック",
    previewDescription: "先に完成させた画面です。クリニックからのフィードバックをすぐに反映して仕上げます。",
    feedbackPrompt: "デザイン・文章・画像へのご意見を反映できます",
    suitable: "このようなお悩みに",
    principle: "原理とアプローチ",
    benefits: "主な特徴",
    facts: "施術情報",
    duration: "所要時間",
    anesthesia: "麻酔方法",
    downtime: "回復期間",
    sessions: "推奨回数",
    pending: "カウンセリング時にご案内",
    process: "施術の流れ",
    precautions: "注意事項",
    faq: "よくある質問",
    related: "関連施術",
    viewDetail: "詳しく見る",
    treatment: "施術",
    equipment: "機器情報",
    manufacturer: "メーカー",
    model: "モデル",
    applications: "適用施術",
    certifications: "認証・検証情報",
    missing: "情報を準備中",
    consultation: "カウンセリングでご確認ください",
    consultationDescription: "肌の状態と診療計画により、適用方法が異なる場合があります。",
    online: "オンライン相談",
    phone: "電話 {phone}",
  },
  zh: {
    preview: "FACTORY PREVIEW · 反馈",
    previewDescription: "这是我们先行完成的页面，将根据诊所反馈立即调整并完成最终版本。",
    feedbackPrompt: "可反馈设计、文案与图片",
    suitable: "适合这些需求",
    principle: "原理与方案",
    benefits: "主要特点",
    facts: "治疗信息",
    duration: "所需时间",
    anesthesia: "麻醉方式",
    downtime: "恢复时间",
    sessions: "建议次数",
    pending: "咨询时说明",
    process: "治疗流程",
    precautions: "注意事项",
    faq: "常见问题",
    related: "相关治疗",
    viewDetail: "查看详情",
    treatment: "治疗",
    equipment: "设备信息",
    manufacturer: "制造商",
    model: "型号",
    applications: "适用治疗",
    certifications: "认证及验证信息",
    missing: "信息准备中",
    consultation: "请通过咨询确认",
    consultationDescription: "具体治疗方式可能会根据皮肤状态和诊疗方案有所不同。",
    online: "在线咨询",
    phone: "电话 {phone}",
  },
};

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-brand-dark">{kicker}</p>
      <h2 className="mt-4 font-serif text-4xl leading-tight text-ink lg:text-5xl">{title}</h2>
    </div>
  );
}

function PendingPanel({ label }: { label: string }) {
  return (
    <div className="rounded-[var(--site-card-radius)] border border-dashed border-brand/45 bg-white/55 px-6 py-8 text-sm text-ink-soft">
      {label}
    </div>
  );
}

function FactCard({ label, fact, pending }: { label: string; fact: EditableFact; pending: string }) {
  return (
    <div className="rounded-[var(--site-card-radius)] border border-line bg-white px-6 py-7">
      <p className="text-[10px] font-bold tracking-[0.18em] text-ink-soft">{label}</p>
      <p className="mt-4 font-serif text-xl text-ink">
        {fact.status === "ready" && fact.value ? fact.value : pending}
      </p>
    </div>
  );
}

function PreviewBanner({ labels }: { labels: Labels }) {
  return (
    <aside className="border-b border-[#d7b56d]/35 bg-[#fff4d8] px-5 py-5 text-[#5a4216]">
      <div className="mx-auto flex max-w-[var(--site-content-max-width)] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.24em]">{labels.preview}</p>
          <p className="mt-1 text-sm leading-relaxed text-[#6e5526]">{labels.previewDescription}</p>
        </div>
        <p className="text-xs text-[#80662f]">{labels.feedbackPrompt}</p>
      </div>
    </aside>
  );
}

function Hero({ data, labels }: { data: FixedTreatmentDetail | FixedEquipmentDetail; labels: Labels }) {
  return (
    <section className="bg-[#3a322d] px-4 pb-12 pt-20 text-cream lg:px-6 lg:pt-28">
      <div className="relative mx-auto h-[64vh] min-h-[480px] max-w-[var(--site-content-max-width)] overflow-hidden rounded-[var(--site-card-radius)] bg-sand shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
        {data.hero.desktop && (
          <Image
            src={data.hero.desktop}
            alt={data.name}
            fill
            priority
            sizes="(min-width: 1400px) 1280px, calc(100vw - 48px)"
            className="hidden object-cover object-[center_30%] lg:block"
          />
        )}
        {(data.hero.mobile ?? data.hero.desktop) && (
          <Image
            src={data.hero.mobile ?? data.hero.desktop ?? ""}
            alt={data.name}
            fill
            priority
            sizes="calc(100vw - 32px)"
            className="object-cover object-[center_30%] lg:hidden"
          />
        )}
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1c1613]/90 via-[#1c1613]/10 to-[#1c1613]/35" />
        <div className="absolute inset-x-0 top-7 text-center">
          <p className="font-serif text-2xl tracking-[0.32em] lg:text-4xl">SUNSHINE</p>
          <p className="mt-2 text-[9px] tracking-[0.4em] text-cream/65">SKIN JOURNAL · SEOUL</p>
        </div>
        <div className="absolute inset-x-0 bottom-10 px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-soft">{data.kind === "treatment" ? labels.treatment : labels.equipment}</p>
          <h1 className="mt-4 font-serif text-[clamp(2.6rem,6vw,5.2rem)] leading-none">{data.name}</h1>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-base leading-relaxed text-cream/80 lg:text-xl">{data.summary}</p>
        </div>
      </div>
    </section>
  );
}

function Principle({ data, labels }: { data: FixedTreatmentDetail | FixedEquipmentDetail; labels: Labels }) {
  return (
    <section className="bg-cream py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20 lg:px-8">
        <Reveal>
          <SectionTitle kicker="02 · PRINCIPLE" title={labels.principle} />
          <p className="mt-10 max-w-[var(--site-reading-max-width)] text-lg leading-[1.9] text-ink-soft">{data.principle}</p>
        </Reveal>
        {data.detail.desktop && (
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--site-card-radius)] lg:aspect-[16/10]">
              <Image src={data.detail.desktop} alt={data.name} fill sizes="(min-width: 1024px) 544px, calc(100vw - 40px)" className="hidden object-cover lg:block" />
              <Image src={data.detail.mobile ?? data.detail.desktop} alt={data.name} fill sizes="calc(100vw - 40px)" className="object-cover lg:hidden" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Features({ data, labels }: { data: FixedTreatmentDetail | FixedEquipmentDetail; labels: Labels }) {
  return (
    <section className="border-y border-line bg-white py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionTitle kicker="03 · FEATURES" title={labels.benefits} />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {data.features.map((feature, index) => (
            <Reveal key={`${feature.title}-${index}`} delay={index * 50}>
              <article className="h-full rounded-[var(--site-card-radius)] border border-line bg-cream p-7 lg:p-9">
                <p className="font-serif text-4xl text-brand-dark">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 font-serif text-2xl text-ink">{feature.title}</h3>
                <p className="mt-5 leading-relaxed text-ink-soft">{feature.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ items, labels }: { items: { q: string; a: string }[]; labels: Labels }) {
  return (
    <section className="bg-cream py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <SectionTitle kicker="FAQ" title={labels.faq} />
        {items.length ? (
          <div className="mt-14 divide-y divide-line border-y border-line">
            {items.map((item, index) => (
              <details key={item.q} className="group py-7" open={index === 0}>
                <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
                  <span className="font-serif text-lg leading-snug text-ink lg:text-xl">Q. {item.q}</span>
                  <span className="font-serif text-2xl text-brand-dark transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-5 leading-relaxed text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        ) : <div className="mt-12"><PendingPanel label={labels.missing} /></div>}
      </div>
    </section>
  );
}

async function Consultation({ labels }: { labels: Labels }) {
  const settings = await getSettings();
  return (
    <section className="bg-ink py-24 text-cream lg:py-32">
      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">CONSULTATION</p>
        <h2 className="mt-5 font-serif text-4xl leading-tight lg:text-6xl">{labels.consultation}</h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-cream/65">{labels.consultationDescription}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/home#book" className="inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-semibold text-ink transition hover:bg-brand-soft">
            {labels.online}<ArrowUpRightIcon className="h-4 w-4" />
          </Link>
          <a href={settings.phoneHref} className="rounded-full border border-cream/30 px-8 py-4 text-sm font-semibold text-cream hover:border-cream">
            {labels.phone.replace("{phone}", phoneVars(settings.phone).phone)}
          </a>
        </div>
      </div>
    </section>
  );
}

function TreatmentSections({ data, labels, mode }: { data: FixedTreatmentDetail; labels: Labels; mode: "public" | "feedback" }) {
  const facts = [
    [labels.duration, data.procedure.duration],
    [labels.anesthesia, data.procedure.anesthesia],
    [labels.downtime, data.procedure.downtime],
    [labels.sessions, data.procedure.recommendedSessions],
  ] as const;
  const visibleFacts = mode === "feedback"
    ? facts
    : facts.filter(([, fact]) => fact.status === "ready" && fact.value);
  const relatedBase = mode === "feedback" ? "/preview/factory/treatments" : "/treatments";
  return (
    <>
      <section className="bg-sand py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionTitle kicker="01 · SUITABLE FOR" title={labels.suitable} />
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {data.suitableFor.map((item, index) => <div key={item} className="flex gap-5 rounded-[var(--site-card-radius)] bg-white px-6 py-6"><span className="font-serif text-brand-dark">{String(index + 1).padStart(2, "0")}</span><p className="leading-relaxed text-ink">{item}</p></div>)}
          </div>
        </div>
      </section>
      <Principle data={data} labels={labels} />
      <Features data={data} labels={labels} />
      {visibleFacts.length > 0 && <section className="bg-sand py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionTitle kicker="04 · FACTS" title={labels.facts} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visibleFacts.map(([label, fact]) => <FactCard key={label} label={label} fact={fact} pending={labels.pending} />)}</div>
        </div>
      </section>}
      <section className="bg-ink py-[var(--site-section-gap-mobile)] text-cream lg:py-[var(--site-section-gap-desktop)]">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-brand-soft">05 · PROCESS</p>
          <h2 className="mt-4 font-serif text-4xl lg:text-5xl">{labels.process}</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">{data.process.map((step) => <article key={step.step} className="border-t border-cream/20 pt-8"><p className="font-serif text-4xl text-brand-soft">{step.step}</p><h3 className="mt-5 font-serif text-2xl">{step.title}</h3><p className="mt-4 text-sm leading-relaxed text-cream/65">{step.body}</p></article>)}</div>
        </div>
      </section>
      {(data.precautions.length > 0 || mode === "feedback") && <section className="bg-white py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]"><div className="mx-auto max-w-4xl px-5 lg:px-8"><SectionTitle kicker="06 · PRECAUTIONS" title={labels.precautions} /><div className="mt-12">{data.precautions.length ? <ul className="space-y-4">{data.precautions.map((item) => <li key={item} className="rounded-2xl bg-cream px-6 py-5">{item}</li>)}</ul> : <PendingPanel label={labels.missing} />}</div></div></section>}
      {(data.faq.length > 0 || mode === "feedback") && <Faq items={data.faq} labels={labels} />}
      {(data.related.length > 0 || mode === "feedback") && <section className="border-t border-line bg-sand py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]"><div className="mx-auto max-w-6xl px-5 lg:px-8"><SectionTitle kicker="08 · RELATED" title={labels.related} />{data.related.length ? <div className="mt-12 grid gap-4 md:grid-cols-3">{data.related.map((item) => <Link key={item.slug} href={`${relatedBase}/${item.category}/${item.slug}`} className="group rounded-[var(--site-card-radius)] border border-line bg-white p-6"><p className="font-serif text-2xl">{item.name}</p><span className="mt-6 inline-flex text-sm text-brand-dark group-hover:underline">{labels.viewDetail} ↗</span></Link>)}</div> : <div className="mt-12"><PendingPanel label={labels.missing} /></div>}</div></section>}
    </>
  );
}

function EquipmentSections({ data, labels, mode }: { data: FixedEquipmentDetail; labels: Labels; mode: "public" | "feedback" }) {
  const treatmentBase = mode === "feedback" ? "/preview/factory/treatments" : "/treatments";
  return (
    <>
      <section className="bg-sand py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]"><div className="mx-auto max-w-6xl px-5 lg:px-8"><SectionTitle kicker="01 · EQUIPMENT" title={labels.equipment} /><dl className="mt-12 grid gap-4 md:grid-cols-2"><div className="rounded-[var(--site-card-radius)] bg-white p-7"><dt className="text-xs text-ink-soft">{labels.manufacturer}</dt><dd className="mt-3 font-serif text-2xl">{data.manufacturer}</dd></div>{(data.model || mode === "feedback") && <div className="rounded-[var(--site-card-radius)] bg-white p-7"><dt className="text-xs text-ink-soft">{labels.model}</dt><dd className="mt-3 font-serif text-2xl">{data.model ?? labels.pending}</dd></div>}</dl></div></section>
      <Principle data={data} labels={labels} />
      <Features data={data} labels={labels} />
      <section className="bg-sand py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]"><div className="mx-auto max-w-6xl px-5 lg:px-8"><SectionTitle kicker="04 · APPLICATIONS" title={labels.applications} /><div className="mt-12 grid gap-4 md:grid-cols-3">{data.treatmentApplications.map((item) => <Link key={item.slug} href={`${treatmentBase}/${item.category}/${item.slug}`} className="rounded-[var(--site-card-radius)] border border-line bg-white p-7 font-serif text-2xl hover:border-brand">{item.name} ↗</Link>)}</div></div></section>
      {(data.certifications.length > 0 || data.precautions.length > 0 || mode === "feedback") && <section className="bg-white py-[var(--site-section-gap-mobile)] lg:py-[var(--site-section-gap-desktop)]"><div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:px-8">{(data.certifications.length > 0 || mode === "feedback") && <div><SectionTitle kicker="05 · VERIFICATION" title={labels.certifications} /><div className="mt-10">{data.certifications.length ? data.certifications.map((item) => <div key={`${item.issuer}-${item.name}`} className="border-b border-line py-5"><p className="font-serif text-xl">{item.name}</p><p className="mt-2 text-sm text-ink-soft">{item.issuer}</p></div>) : <PendingPanel label={labels.missing} />}</div></div>}{(data.precautions.length > 0 || mode === "feedback") && <div><SectionTitle kicker="06 · PRECAUTIONS" title={labels.precautions} /><div className="mt-10">{data.precautions.length ? <ul className="space-y-4">{data.precautions.map((item) => <li key={item} className="rounded-2xl bg-cream px-6 py-5">{item}</li>)}</ul> : <PendingPanel label={labels.missing} />}</div></div>}</div></section>}
      {(data.faq.length > 0 || mode === "feedback") && <Faq items={data.faq} labels={labels} />}
    </>
  );
}

export async function FixedContractPage({ locale, data, mode = "public" }: { locale: AppLocale; data: FixedTreatmentDetail | FixedEquipmentDetail; mode?: "public" | "feedback" }) {
  const labels = LABELS[locale];
  return (
    <div className="no-download">
      {mode === "feedback" && <PreviewBanner labels={labels} />}
      <Hero data={data} labels={labels} />
      {data.kind === "treatment" ? <TreatmentSections data={data} labels={labels} mode={mode} /> : <EquipmentSections data={data} labels={labels} mode={mode} />}
      <Consultation labels={labels} />
    </div>
  );
}
