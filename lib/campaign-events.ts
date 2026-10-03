import type { EventPresetId } from "@/lib/event-presets";
import {
  FIRST_VISIT_MAGAZINE_TEMPLATE,
  type MagazineEventTemplate,
} from "@/lib/magazine-event-templates";

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
  magazineTemplate?: MagazineEventTemplate;
  desktopImageUrl?: string;
  desktopTitle?: string;
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
  desktopTitle: "FIRST VISIT WELCOME EVENT",
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
  ],
};

const FIRST_VISIT_MAGAZINE: Campaign = {
  ...FIRST_VISIT,
  id: "first-visit-magazine-2026",
  popupId: "first-visit-magazine-2026-v1",
  magazineTemplate: FIRST_VISIT_MAGAZINE_TEMPLATE,
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
  "first-visit-magazine-2026": FIRST_VISIT_MAGAZINE,
  "after-summer-2026": AFTER_SUMMER,
} satisfies Record<Exclude<EventPresetId, "grand-open-2026">, Campaign>;
