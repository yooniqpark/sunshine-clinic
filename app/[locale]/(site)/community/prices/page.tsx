import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getSiteContent, type Locale } from "@/lib/site-content";

type Props = { params: Promise<{ locale: Locale }> };

export const metadata: Metadata = {
  title: "제증명수수료 및 비급여 진료비용 안내",
  description: "의료법에 따라 비급여 진료 항목과 제증명수수료의 상한금액을 게시합니다.",
};

type FeeRow = { label: string; sub?: string; amount: string };
type FeeSection = { heading: string; rows: FeeRow[] };

const sections: FeeSection[] = [
  {
    heading: "비급여 진료",
    rows: [
      { label: "비급여 진료비", amount: "20,000원" },
    ],
  },
  {
    heading: "비급여 처방전",
    rows: [
      { label: "비급여 처방전", sub: "14일", amount: "20,000원" },
      { label: "비급여 처방전", sub: "30일", amount: "30,000원" },
      { label: "비급여 처방전", sub: "60일", amount: "40,000원" },
    ],
  },
  {
    heading: "제증명 수수료",
    rows: [
      { label: "진단서 / 소견서", amount: "20,000원" },
      { label: "진료기록 사본", sub: "장당", amount: "무료" },
      { label: "진료확인서 / 세부내역서", amount: "무료" },
    ],
  },
];

export default async function PricesPage({ params }: Props) {
  const { locale } = await params;
  const content = getSiteContent(locale);
  const common = content.common;

  return (
    <>
      <section className="border-b border-line bg-sand/40">
        <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href={`/${locale}`} className="transition hover:text-brand">
              {common.home}
            </Link>
            <span>/</span>
            <span className="text-ink">비급여 수가표</span>
          </nav>
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-brand">PRICE</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            제증명수수료 및 비급여 진료비용
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
            관련 법령(의료법 제45조)에 따라 본원에서 받는 비급여 진료 항목과
            제증명 수수료의 상한금액을 안내드립니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white">
            <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-line bg-sand/40 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft sm:px-8">
              <span>항목</span>
              <span className="text-right">상한금액</span>
            </div>

            <div className="divide-y divide-line">
              {sections.map((section) => (
                <div key={section.heading} className="px-6 py-6 sm:px-8 sm:py-7">
                  <h2 className="text-sm font-semibold tracking-wide text-brand-dark">
                    {section.heading}
                  </h2>
                  <ul className="mt-3 space-y-2.5">
                    {section.rows.map((row, i) => (
                      <li
                        key={`${row.label}-${i}`}
                        className="grid grid-cols-[1fr_auto] items-baseline gap-4"
                      >
                        <span className="text-sm leading-relaxed text-ink sm:text-base">
                          {row.label}
                          {row.sub && (
                            <span className="ml-2 text-xs text-ink-soft">({row.sub})</span>
                          )}
                        </span>
                        <span
                          className={`text-right text-sm font-semibold tabular-nums sm:text-base ${
                            row.amount === "무료" ? "text-brand" : "text-ink"
                          }`}
                        >
                          {row.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 space-y-3 rounded-2xl bg-sand/60 px-6 py-5 text-xs leading-relaxed text-ink-soft">
          <p>
            · 상기 금액은 <strong className="font-semibold text-ink">상한금액</strong>으로,
            진료 내용에 따라 실제 청구 금액이 달라질 수 있습니다.
          </p>
          <p>
            · 비급여 진료비용은 의료법 제45조 및 보건복지부 고시에 따라 게시되며,
            변경 시 사전에 안내해 드립니다.
          </p>
          <p>· 자세한 문의는 병원 데스크 또는 전화로 연락 주세요.</p>
        </div>
      </section>
    </>
  );
}
