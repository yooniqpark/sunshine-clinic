import { setRequestLocale } from "next-intl/server";
import { IdentityA } from "../../_components/identity-variants/IdentityA";
import { IdentityB } from "../../_components/identity-variants/IdentityB";
import { IdentityC } from "../../_components/identity-variants/IdentityC";
import { IdentityD } from "../../_components/identity-variants/IdentityD";
import { IdentityE } from "../../_components/identity-variants/IdentityE";
import { IdentityF } from "../../_components/identity-variants/IdentityF";
import { IdentityG } from "../../_components/identity-variants/IdentityG";
import { IdentityH } from "../../_components/identity-variants/IdentityH";
import { IdentityI } from "../../_components/identity-variants/IdentityI";
import { IdentityJ } from "../../_components/identity-variants/IdentityJ";
import { IdentityK } from "../../_components/identity-variants/IdentityK";
import { IdentityL } from "../../_components/identity-variants/IdentityL";

export const metadata = {
  title: "IDENTITY variants preview",
  robots: { index: false, follow: false },
};

function Header({ code, name, desc }: { code: string; name: string; desc: string }) {
  return (
    <div id={`variant-${code.toLowerCase()}`} className="border-y border-ink/15 bg-[#e5dccc] px-6 py-5 lg:px-10">
      <p className="text-[10px] font-bold tracking-[0.3em] text-ink/50">
        VARIANT {code}
      </p>
      <p className="mt-1 font-serif text-xl text-ink">{name}</p>
      <p className="mt-1 text-xs text-ink/60">{desc}</p>
    </div>
  );
}

export default async function IdentityPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20 lg:pt-28">
      <Header code="A" name="Aura Field" desc="유기적 그라디언트 오라 4색 유영 + 필름 그레인 — 빛과 색만" />
      <IdentityA />
      <Header code="B" name="Contour Science v2" desc="다크 지형도 — 물결치는 등고선 + 스캔 빔 + 마우스 스포트라이트 + 깊이 셀렉터" />
      <IdentityB />
      <Header code="C" name="Glass Pearls" desc="다크 럭셔리 — 유리질 3D 펄 4개 부유, 챕터 컬러 코어" />
      <IdentityC />
      <Header code="D" name="Architectural Panels" desc="클리닉 공간 아코디언 — 인테리어 4컷, 호버 확장 + 컬러 라인" />
      <IdentityD />
      <Header code="E" name="Ribbon & Rotor" desc="4색 그라디언트 리본 웨이브 + 회전 원형 텍스트 씰" />
      <IdentityE />
      <Header code="F" name="Sunlight & Shadow" desc="오후 햇살 아치 창 + 흔들리는 나뭇잎 그림자 — 브랜드를 공간으로" />
      <IdentityF />
      <Header code="G" name="Stacked Plates" desc="스크롤 스택 — 카테고리 풀컬러 플레이트 4장이 차곡차곡 쌓임" />
      <IdentityG />
      <Header code="H" name="Dawn Stage" desc="국내 어워드 스타일 — 초현실 새벽 씬 + 브랜드 진주 + 스토리" />
      <IdentityH />
      <Header code="I" name="Dawn, Full Bleed" desc="새벽 씬 풀블리드 — 카피 한 줄 + 진주만, 탭·리스트 없음" />
      <IdentityI />
      <Header code="J" name="Pearl in the Dark" desc="다크 무대 — 신광이 진주를 비춤, 먼지 입자 + 카피 한 줄" />
      <IdentityJ />
      <Header code="K" name="Evidence Wall" desc="팩트형 — 카운트업 스탯 + 실보유 장비 제품컷 세로 마퀴 2열" />
      <IdentityK />
      <Header code="L" name="Golden Hour" desc="F 증폭판 — 아치 광창 3개 + 신광 + 패럴랙스 잎 그림자 + 금빛 입자 + 텍스트 빛 스윕" />
      <IdentityL />
    </div>
  );
}
