import { getDevicesByCategory, getDeviceImage, getDeviceMarketing } from "@/lib/devices";
import type { AppLocale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { SlideA } from "../../_components/slide-variants/SlideA";
import { SlideB } from "../../_components/slide-variants/SlideB";
import { SlideC } from "../../_components/slide-variants/SlideC";
import { SlideD } from "../../_components/slide-variants/SlideD";
import { SlideE } from "../../_components/slide-variants/SlideE";
import type { SlideItem } from "../../_components/slide-variants/SlideShared";

export const metadata = {
  title: "슬라이드 디자인 프리뷰",
  robots: { index: false, follow: false },
};

async function loadItems(locale: string): Promise<SlideItem[]> {
  const lifting = getDevicesByCategory(locale as AppLocale, "lifting");
  const anti = getDevicesByCategory(locale as AppLocale, "anti-aging");
  const acne = getDevicesByCategory(locale as AppLocale, "acne").filter(
    (d) => d.slug === "markview-co2",
  );
  return [...lifting, ...anti, ...acne].map((d) => ({
    slug: d.slug,
    name: d.name,
    english: getDeviceMarketing(d.slug)?.englishName,
    category: d.category,
    categoryLabel:
      d.category === "anti-aging"
        ? "ANTI-AGING"
        : d.category === "acne"
          ? "ACNE · SCAR"
          : "LIFTING",
    img: getDeviceImage(d.slug) ?? "",
    tagline: d.tagline,
  }));
}

function SectionHeader({
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
            SLIDE VARIANT {code}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-normal">{name}</h2>
        </div>
        <p className="hidden max-w-md text-sm leading-relaxed text-cream/70 md:block">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default async function SlidesPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const items = await loadItems(locale);
  return (
    <main className="pt-24">
      <SectionHeader
        code="A"
        name="Split Screen · 좌 이미지 + 우 인덱스 리스트"
        desc="한 번에 큰 이미지 하나 + 우측에 모든 제품 세로 인덱스. 마우스 올리면 즉시 전환."
      />
      <SlideA items={items} />

      <SectionHeader
        code="B"
        name="Coverflow · 3D 회전 캐러셀"
        desc="Apple Music 톤. 중앙 활성 카드가 앞으로, 좌우 카드는 회전 각도로 뒤로."
      />
      <SlideB items={items} />

      <SectionHeader
        code="C"
        name="Full-Bleed Hero · 대형 이미지 + 세리프 오버레이"
        desc="화면 꽉 채우는 제품 이미지 + 상단 대형 세리프 이름. 하단 원형 썸네일."
      />
      <SlideC items={items} />

      <SectionHeader
        code="D"
        name="Grid Mosaic · 2행 4열 그리드"
        desc="한 화면에 모든 제품이 그리드로. hover/클릭 시 그 카드가 강조되며 살짝 확대."
      />
      <SlideD items={items} />

      <SectionHeader
        code="E"
        name="Spotlight + Stack · 좌 큰 카드 + 우 다음 미리보기"
        desc="큰 활성 카드 옆에 다음 3개 세로 스택. 각 스택 카드 클릭 시 그 카드로 이동."
      />
      <SlideE items={items} />

      <div className="bg-cream px-6 py-16 text-center text-sm text-ink/60 lg:px-16">
        위 5가지 슬라이드 형식 중 원하시는 방향 알려주시면 홈 SIGNATURE 섹션에 적용합니다.
      </div>
    </main>
  );
}
