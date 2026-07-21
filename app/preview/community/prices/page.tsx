import { Reveal } from "@/components/Reveal";

type Row = { name: string; price: string; note?: string };
type Section = { title: string; kicker: string; rows: Row[] };

const SECTIONS: Section[] = [
  {
    kicker: "LIFTING",
    title: "리프팅",
    rows: [
      { name: "울쎄라 전안 300샷", price: "1,200,000원" },
      { name: "슈링크 유니버스 400샷", price: "800,000원" },
      { name: "덴서티 전안", price: "600,000원" },
      { name: "인모드 FX", price: "300,000원" },
      { name: "실 리프팅 (PDO 10개 기준)", price: "800,000원", note: "실 종류·개수에 따라 상이" },
    ],
  },
  {
    kicker: "ANTI-AGING",
    title: "안티에이징",
    rows: [
      { name: "보톡스 이마 · 미간", price: "60,000원", note: "1부위" },
      { name: "필러 (1cc)", price: "350,000원", note: "제품에 따라 상이" },
      { name: "스킨보톡스 전안", price: "250,000원" },
      { name: "쥬베룩 1병", price: "300,000원" },
      { name: "리쥬란 힐러 1병", price: "300,000원" },
    ],
  },
  {
    kicker: "TONE",
    title: "화이트닝 · 홍조",
    rows: [
      { name: "피코 토닝", price: "150,000원" },
      { name: "브이빔 퍼펙타 국소", price: "200,000원" },
      { name: "IPL 전안", price: "180,000원" },
      { name: "제네시스 전안", price: "150,000원" },
    ],
  },
  {
    kicker: "ACNE & SCAR",
    title: "여드름 · 흉터",
    rows: [
      { name: "여드름 압출 (부위)", price: "50,000원" },
      { name: "PDT 광역동 치료", price: "300,000원" },
      { name: "프락셀 전안", price: "500,000원" },
      { name: "인피니 하이브리드", price: "500,000원" },
    ],
  },
];

export default function PricesPage() {
  return (
    <>
      <section className="bg-ink py-24 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            COMMUNITY
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight lg:text-6xl">
            비급여 수가표
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cream/60">
            개인의 피부 상태와 시술 조합에 따라 실제 비용은 달라질 수 있습니다.
            정확한 견적은 방문 상담 시 안내해 드립니다.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          {SECTIONS.map((sec) => (
            <Reveal key={sec.kicker}>
              <div className="mb-16">
                <p className="text-[10px] font-bold tracking-[0.3em] text-brand-dark">
                  {sec.kicker}
                </p>
                <h2 className="mt-3 font-serif text-3xl lg:text-4xl">{sec.title}</h2>
                <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
                  <table className="w-full">
                    <tbody>
                      {sec.rows.map((r) => (
                        <tr key={r.name} className="border-t border-line first:border-0">
                          <td className="p-5 align-top">
                            <p className="font-medium text-ink">{r.name}</p>
                            {r.note && (
                              <p className="mt-1 text-xs text-ink-soft">{r.note}</p>
                            )}
                          </td>
                          <td className="p-5 text-right align-top font-serif text-lg text-ink">
                            {r.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          ))}

          <p className="mt-8 rounded-2xl bg-ink/5 p-6 text-xs leading-relaxed text-ink-soft">
            * 표시된 금액은 부가세 포함 여부와 관계없이 방문 시 최종 견적으로 확정됩니다.<br />
            * 피부 상태, 시술 범위, 세션 수, 프로모션 적용 여부에 따라 실제 비용이 달라질 수 있습니다.
          </p>
        </div>
      </section>
    </>
  );
}
