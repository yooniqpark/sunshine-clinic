import { VariantA } from "../../_components/standard-variants/VariantA";
import { VariantB } from "../../_components/standard-variants/VariantB";
import { VariantC } from "../../_components/standard-variants/VariantC";
import { VariantD } from "../../_components/standard-variants/VariantD";
import { VariantE } from "../../_components/standard-variants/VariantE";
import { VariantF } from "../../_components/standard-variants/VariantF";
import { VariantG } from "../../_components/standard-variants/VariantG";
import { VariantH } from "../../_components/standard-variants/VariantH";

export const metadata = { title: "STANDARD variants preview" };

function Header({
  code,
  name,
  desc,
}: {
  code: string;
  name: string;
  desc: string;
}) {
  return (
    <div className="bg-ink px-6 py-8 text-cream lg:px-16">
      <div className="mx-auto flex max-w-7xl items-baseline justify-between gap-6">
        <div>
          <p className="text-[10px] font-medium tracking-[0.32em] text-brand-soft">
            VARIANT {code}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-normal leading-tight">
            {name}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-cream/70">{desc}</p>
      </div>
    </div>
  );
}

export default function StandardPreviewPage() {
  return (
    <main className="pt-24">
      <Header
        code="A"
        name="Face Scan · 얼굴 실루엣 스캔"
        desc="어두운 배경에 얇은 흰 라인의 얼굴 실루엣 + 앵커 마커. 임상 스캔 앱 톤."
      />
      <VariantA />

      <Header
        code="B"
        name="Skin Cross-Section · 피부 단면도"
        desc="표피/진피/피하지방 3층 단면 다이어그램. 챕터는 해당 층에 매핑."
      />
      <VariantB />

      <Header
        code="C"
        name="Material · 대리석/유리 재질"
        desc="사진 없이 웜톤 그라디언트로 표현한 재질 + 중앙 골드 링에 4개 앵커."
      />
      <VariantC />

      <Header
        code="D"
        name="Geometry · 순수 기하학"
        desc="얇은 원 궤도에 4개 지점. 챕터 hover 시 궤도가 부드럽게 회전."
      />
      <VariantD />

      <Header
        code="E"
        name="Typography · 대형 세리프 넘버"
        desc="점 없이 초대형 세리프 번호(01/02/03/04) + 챕터 이름만. 배경 그라디언트가 챕터 색상으로 부드럽게 전환."
      />
      <VariantE />

      <Header
        code="F"
        name="Wave · 세로 웨이브 라인"
        desc="점 없이 4개의 얇은 세로 웨이브 라인. 활성 챕터 라인이 브랜드 컬러로 발광. 중앙에 챕터 이름."
      />
      <VariantF />

      <Header
        code="G"
        name="Layered Cards · 종이 카드 스택"
        desc="점 없이 4장 카드가 뒤로 겹쳐 있고 활성 카드가 앞으로 나옴. 각 카드 톤이 챕터 색상."
      />
      <VariantG />

      <Header
        code="H"
        name="Face × Layers × Waves · 융합 (A + B + F)"
        desc="어두운 배경에 얇은 얼굴 실루엣 + 뒤쪽에 층 밴드가 흐르고, 각 챕터의 브랜드 컬러 세로 웨이브가 발광. 점 없이 층 라벨과 웨이브만으로 활성 표시."
      />
      <VariantH />

      <div className="bg-cream px-6 py-16 text-center text-sm text-ink/60 lg:px-16">
        위 7가지 중 원하시는 방향 알려주시면 홈에 적용합니다.
      </div>
    </main>
  );
}
