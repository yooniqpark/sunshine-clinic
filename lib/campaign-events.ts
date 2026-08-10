import type { EventPresetId } from "@/lib/event-presets";

export type CampaignRow = {
  name: string;
  desc?: string;
  original?: string;
  event?: string;
  prices?: string[];
};

export type CampaignCategory = {
  slug: string;
  name: string;
  kicker: string;
  copy: string;
  columns?: string[];
  rows: CampaignRow[];
};

export type Campaign = {
  id: Exclude<EventPresetId, "grand-open-2026">;
  popupId: string;
  posterUrl: string;
  desktopImageUrl?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  period: string;
  vatNote: string;
  closingCopy: string;
  theme: "cool" | "warm";
  categories: CampaignCategory[];
};

const FIRST_VISIT: Campaign = {
  id: "first-visit-2026",
  popupId: "first-visit-2026-v1",
  posterUrl: "/events/first-visit-2026.svg",
  desktopImageUrl: "/events/first-visit-model-2026.svg",
  eyebrow: "SUNSHINE FIRST VISIT",
  title: "첫 방문 웰컴 메뉴",
  subtitle: "처음 만나는 선샤인, 나에게 꼭 필요한 시술부터.",
  period: "FIRST VISIT ONLY",
  vatNote: "부가세(VAT) 별도",
  closingCopy: "처음이기에 더 세심하게. 현재 피부와 얼굴에 필요한 시술부터 제안합니다.",
  theme: "cool",
  categories: [
    {
      slug: "botox",
      name: "보톡스",
      kicker: "01 / BOTOX",
      copy: "필요한 부위만 섬세하게, 자연스러운 인상의 변화",
      columns: ["국산 하이톡스", "프리미엄 코어톡스", "외산 제오민", "오리지널 앨러간"],
      rows: [
        { name: "주름 1부위", prices: ["1.5만원", "2만원", "6만원", "20만원"] },
        { name: "주름 3부위", prices: ["3만원", "4만원", "15만원", "55만원"] },
        { name: "턱 · 측두근 · 침샘", prices: ["4만원", "5만원", "13만원", "50만원"] },
        { name: "승모근 · 종아리", prices: ["18만원", "20만원", "30만원", "80만원"] },
        { name: "다한증", prices: ["18만원", "20만원", "30만원", "60만원"] },
        { name: "목주름", prices: ["15만원", "20만원", "30만원", "60만원"] },
        { name: "커스텀 스킨보톡스", prices: ["15만원", "20만원", "30만원", "60만원"] },
      ],
    },
    {
      slug: "filler",
      name: "필러",
      kicker: "02 / FILLER",
      copy: "과하지 않게 채우고, 본연의 균형은 더 아름답게",
      rows: [
        { name: "뉴라미스 · 입술 1cc", original: "25만원", event: "15만원" },
        { name: "뉴라미스 · 애교 1cc", original: "25만원", event: "15만원" },
        { name: "뉴라미스 · 턱 1cc", original: "25만원", event: "15만원" },
        { name: "쥬비덤 · 입술 1cc", original: "40만원", event: "25만원" },
        { name: "쥬비덤 · 애교 1cc", original: "40만원", event: "25만원" },
        { name: "쥬비덤 · 턱 1cc", original: "40만원", event: "25만원" },
        { name: "그 외 필요한 부위 필러 1cc", event: "13만원~" },
      ],
    },
    {
      slug: "lifting",
      name: "리프팅",
      kicker: "03 / LIFTING",
      copy: "당기고 다듬어, 한층 또렷해지는 페이스 라인",
      rows: [
        { name: "STEP 2 · 슈링크 300샷", desc: "슬림윤곽주사 10cc 포함", original: "33만원", event: "15만원" },
        { name: "STEP 2 · 인모드 miniFX", desc: "슬림윤곽주사 10cc 포함", original: "33만원", event: "25만원" },
        { name: "STEP 3 · 인모드 miniFX + 슈링크 300샷", desc: "슬림윤곽주사 10cc 포함", original: "58만원", event: "35만원" },
      ],
    },
    {
      slug: "collagen",
      name: "콜라겐 볼륨",
      kicker: "04 / COLLAGEN VOLUME",
      copy: "단순히 채우는 볼륨이 아닌, 피부 스스로 차오르는 자연스러운 변화",
      rows: [{ name: "쥬베룩 볼륨 · 1병", original: "50만원", event: "40만원" }],
    },
  ],
};

const AFTER_SUMMER: Campaign = {
  id: "after-summer-2026",
  popupId: "after-summer-2026-v1",
  posterUrl: "/events/after-summer-2026.svg",
  eyebrow: "SUNSHINE CLINIC · 2026 AUTUMN",
  title: "AFTER SUMMER",
  subtitle: "여름의 흔적을 지우는 계절",
  period: "2026 AUTUMN",
  vatNote: "부가세(VAT) 별도",
  closingCopy: "윤곽은 또렷하게, 피부는 맑고 단단하게. 가을 피부 리셋 에디트.",
  theme: "warm",
  categories: [
    {
      slug: "lifting",
      name: "리프팅",
      kicker: "01 / LIFTING BEST",
      copy: "여름 뒤 흐트러진 윤곽을 다시 선명하게",
      rows: [
        { name: "울쎄라피프라임 300샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "100만원" },
        { name: "울쎄라피프라임 400샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "140만원" },
        { name: "써마지FLX 300샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "110만원" },
        { name: "써마지FLX 600샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "190만원" },
        { name: "울쎄라 300샷 + 써마지 600샷", event: "290만원" },
        { name: "울쎄라 600샷 + 써마지 300샷", event: "310만원" },
        { name: "울쎄라 600샷 + 써마지 600샷", event: "390만원" },
      ],
    },
    {
      slug: "whitening",
      name: "화이트닝 & 여드름",
      kicker: "02 / CLEAR & CALM",
      copy: "여름 뒤 남은 색소와 트러블 흔적을 맑게",
      rows: [
        { name: "토닝레이저 10회", desc: "비타민 미백 및 수분 케어 10회", original: "150만원", event: "130만원" },
        { name: "트리플 패키지 10회", desc: "레이저 3가지 + 맞춤 케어 10회", original: "250만원", event: "200만원" },
        { name: "여드름 올인원 패키지", desc: "레이저 3가지 + 여드름 스케일링 10회", original: "220만원", event: "180만원" },
      ],
    },
    {
      slug: "skinbooster",
      name: "스킨부스터",
      kicker: "03 / GLOW RECOVERY",
      copy: "지친 피부 컨디션을 촉촉하고 단단하게",
      rows: [
        { name: "리쥬란 HB 2cc", original: "40만원", event: "20만원" },
        { name: "리쥬란힐러 2cc", original: "25만원", event: "13만원" },
        { name: "아이리쥬란 1cc", original: "20만원", event: "10만원" },
        { name: "엘라비에리투오 1병", original: "70만원", event: "50만원" },
        { name: "셀르디엠 1병", original: "60만원", event: "45만원" },
      ],
    },
    {
      slug: "botox",
      name: "보톡스",
      kicker: "04 / DETAIL BOTOX",
      copy: "표정은 자연스럽게, 라인은 매끄럽게",
      columns: ["국산 프리미엄", "외산 제오민", "오리지널 앨러간"],
      rows: [
        { name: "주름 1부위", prices: ["2만원", "6만원", "20만원"] },
        { name: "주름 3부위", prices: ["4만원", "15만원", "55만원"] },
        { name: "턱 · 측두근 · 침샘", prices: ["5만원", "13만원", "50만원"] },
        { name: "승모근 · 종아리", prices: ["20만원", "30만원", "60만원"] },
        { name: "커스텀 스킨보톡스", prices: ["20만원", "30만원", "60만원"] },
      ],
    },
  ],
};

export const CAMPAIGNS = {
  "first-visit-2026": FIRST_VISIT,
  "after-summer-2026": AFTER_SUMMER,
} satisfies Record<Exclude<EventPresetId, "grand-open-2026">, Campaign>;
