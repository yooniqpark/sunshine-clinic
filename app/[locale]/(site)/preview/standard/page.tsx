import { VariantA } from "../../_components/standard-variants/VariantA";
import { VariantB } from "../../_components/standard-variants/VariantB";
import { VariantC } from "../../_components/standard-variants/VariantC";
import { VariantD } from "../../_components/standard-variants/VariantD";
import { VariantE } from "../../_components/standard-variants/VariantE";
import { VariantF } from "../../_components/standard-variants/VariantF";
import { VariantG } from "../../_components/standard-variants/VariantG";
import { VariantH } from "../../_components/standard-variants/VariantH";
import { VariantI } from "../../_components/standard-variants/VariantI";
import { VariantJ } from "../../_components/standard-variants/VariantJ";
import { VariantK } from "../../_components/standard-variants/VariantK";
import { VariantL } from "../../_components/standard-variants/VariantL";
import { VariantM } from "../../_components/standard-variants/VariantM";
import { VariantN } from "../../_components/standard-variants/VariantN";
import { VariantO } from "../../_components/standard-variants/VariantO";
import { VariantP } from "../../_components/standard-variants/VariantP";
import { VariantQ } from "../../_components/standard-variants/VariantQ";
import { VariantR } from "../../_components/standard-variants/VariantR";
import { VariantS } from "../../_components/standard-variants/VariantS";
import { VariantT } from "../../_components/standard-variants/VariantT";
import { VariantU } from "../../_components/standard-variants/VariantU";
import { VariantV } from "../../_components/standard-variants/VariantV";
import { VariantW } from "../../_components/standard-variants/VariantW";
import { VariantX } from "../../_components/standard-variants/VariantX";
import { VariantY } from "../../_components/standard-variants/VariantY";

export const metadata = {
  title: "STANDARD variants preview",
  robots: { index: false, follow: false },
};

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

      <Header
        code="I"
        name="Ripple · 원형 파문"
        desc="어두운 배경 중앙에서 4겹의 원형 파문이 밖으로 퍼짐. 활성 파문이 브랜드 컬러로 발광. 수분·스킨 케어 톤."
      />
      <VariantI />

      <Header
        code="J"
        name="Bloom · 꽃잎 개화"
        desc="세리프 얇은 라인으로 그린 4개의 꽃잎이 중앙에서 방사형으로 펼쳐짐. 활성 꽃잎이 골드 아웃라인. 오르가닉 럭셔리 톤."
      />
      <VariantJ />

      <Header
        code="K"
        name="Sunshine Ray · 브랜드 광선"
        desc="하단에서 태양처럼 빛나는 서클 + 18갈래 광선이 위로 뻗어감. 챕터마다 광선 컬러 페이드. 브랜드명 SUNSHINE 정체성 매핑."
      />
      <VariantK />

      <Header
        code="L"
        name="Contour · 얼굴 등고선"
        desc="얼굴 실루엣을 등고선처럼 8겹 안쪽으로 축소. 활성 챕터의 강조 등고선이 브랜드 컬러로 발광. 임상 다이어그램 + 편집 톤."
      />
      <VariantL />

      <Header
        code="M"
        name="Ink Wash · 먹 번짐"
        desc="세로 붓 스트로크 4개 + Gaussian blur로 먹 번짐 효과. 활성 스트로크가 브랜드 컬러로 채색. 우측 하단 낙관(印) 오너먼트."
      />
      <VariantM />

      <Header
        code="N"
        name="Crystal Facet · 크리스털 격자"
        desc="삼각형 facet 11개로 구성된 크리스털. 챕터에 매핑된 facet이 컬러 채워지며 반사. 스킨의 결·표면 물성 은유."
      />
      <VariantN />

      <Header
        code="O"
        name="Reclining · 누운 얼굴"
        desc="얼굴을 90° 왼쪽으로 회전 (뒤로 누워 하늘을 보는 자세). 층 밴드는 세로 방향으로 흐름. 감은 눈 · 스파/명상 톤."
      />
      <VariantO />

      <Header
        code="P"
        name="Cascade · 얼굴 잔상"
        desc="얼굴 실루엣 4겹이 살짝씩 어긋나게 반복 (모션 잔상). 활성 챕터의 겹이 브랜드 컬러로 발광."
      />
      <VariantP />

      <Header
        code="Q"
        name="Fragmented Portrait · 편집 프레임"
        desc="눈/광대/입술/턱선 4개 프레임에 얼굴 부위 클로즈업이 분리 배치. 활성 챕터 프레임이 컬러 발광. 잡지 편집 톤."
      />
      <VariantQ />

      <Header
        code="R"
        name="Editorial Statement · Alchemy 43 톤"
        desc="'The best work goes unnoticed.' 대형 세리프 스테이트먼트 + 좌측 웜톤 텍스처 · 넘버링 원칙 리스트."
      />
      <VariantR />

      <Header
        code="S"
        name="Ornament System · Ever/Body 톤"
        desc="원 안의 세리프 S 시그니처 마크. 챕터마다 외곽 획 각도/두께 미세 변주 + 코너 브라켓."
      />
      <VariantS />

      <Header
        code="T"
        name="Typographic Wall · Heyday 톤"
        desc="카피 자체가 히어로. 'Skin, first. / Only what’s needed.' 초대형 세리프 + 인라인 챕터 리스트."
      />
      <VariantT />

      <Header
        code="U"
        name="Kinetic Marquee · 흐르는 타이포 밴드"
        desc="국내 트렌디 클리닉 레퍼런스 1탄 — 톡스앤필·브랜뉴클리닉 톤. 초대형 세리프 아웃라인 타이포 4밴드가 좌우로 흐르고, 활성 챕터 밴드만 브랜드 컬러로 채워지며 빨라짐."
      />
      <VariantU />

      <Header
        code="V"
        name="Editorial Magazine · 화보 편집 그리드"
        desc="바노바기 매거진·포레브 톤. 매거진 마스트헤드 + 세로쓰기 국문 헤드라인 + 목차(CONTENTS)형 챕터 리스트. 중앙 화보가 활성 챕터 컬러로 물듦."
      />
      <VariantV />

      <Header
        code="W"
        name="Cheongdam Noir · 블랙 & 골드"
        desc="뮤즈클리닉·글로우클리닉 톤. 딥 블랙 배경 + 골드 헤어라인 링과 세리프 모노그램 S. 챕터 전환 시 골드 아크가 90°씩 회전하고 챕터 컬러 글로우가 스밈."
      />
      <VariantW />

      <Header
        code="X"
        name="Aurora Glow · 글로우 스킨 그라디언트"
        desc="오라클피부과·피어나 톤. 아이보리 위 챕터 컬러 블러 오브가 숨쉬듯 번지는 클린 무드. 센터 세리프 카피 + 글래스 pill 챕터 내비게이션."
      />
      <VariantX />

      <Header
        code="Y"
        name="Archive Index · 진료 기준 아카이브"
        desc="닥터디자이너·디에이 포트폴리오 톤. NO/챕터/타깃층/깊이 인덱스 테이블 — hover 시 행이 펼쳐지며 노트 노출, 우측 다크 패널이 깊이 눈금과 컬러 워시로 응답."
      />
      <VariantY />

      <div className="bg-cream px-6 py-16 text-center text-sm text-ink/60 lg:px-16">
        위 25가지 중 원하시는 방향 알려주시면 홈에 적용합니다.
      </div>
    </main>
  );
}
