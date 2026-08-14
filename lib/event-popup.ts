import type { CampaignCategory } from "@/lib/campaign-events";
import { CAMPAIGNS } from "@/lib/campaign-events";

/** 팝업 테마 색상 — 이벤트별 아이덴티티 */
export type PopupTheme = {
  tab: string;
  tabText: string;
  panel: string;
  line: string;
  accent: string;
  ink: string;
  sub: string;
  meta: string;
  pill: string;
  pillText: string;
  tableBg: string;
  tableLine: string;
  headBg: string;
  headText: string;
  price: string;
  unit: string;
  noteBg: string;
  noteText: string;
  catBg: string;
  catText: string;
  catOnBg: string;
  catOnText: string;
  footBg: string;
  footText: string;
  footStrong: string;
};

export type PopupEvent = {
  id: string;
  tabLabel: string;
  poster: string;
  posterAlt: string;
  /** 포스터 위 CTA 버튼의 세로 위치(%) — 없으면 하단 고정 */
  ctaTopPct?: number;
  /** 포스터 위 CTA 버튼 배경 — 배경이 복잡한 포스터에서 가독성 확보용 */
  ctaFill?: string;
  ctaLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  period: string;
  vatNote: string;
  pillLabel: string;
  closingCopy: string;
  categories: CampaignCategory[];
  theme: PopupTheme;
};

const GRAND_OPEN_CATEGORIES: CampaignCategory[] = [
  {
    slug: "lifting",
    name: "리프팅",
    kicker: "01 / LIFTING",
    copy: "울쎄라 · 써마지, 커스텀 스킨보톡스(얼굴 전체) 포함",
    rows: [
      { name: "울쎄라피프라임 300샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "100만원" },
      { name: "울쎄라피프라임 400샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "140만원" },
      { name: "써마지FLX 300샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "110만원" },
      { name: "써마지FLX 600샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "190만원" },
      { name: "울쎄라 300샷 + 써마지 600샷", desc: "리쥬란HB 2cc + 아이리쥬란 1cc 서비스", event: "290만원" },
      { name: "울쎄라 600샷 + 써마지 300샷", desc: "리쥬란HB 2cc + 아이리쥬란 1cc 서비스", event: "310만원" },
      { name: "울쎄라 600샷 + 써마지 600샷", desc: "리쥬란HB 2cc + 아이리쥬란 1cc 서비스", event: "390만원" },
    ],
  },
  {
    slug: "skinbooster",
    name: "스킨부스터",
    kicker: "02 / SKIN BOOSTER",
    copy: "속부터 채우는 물광, 오픈 기념 특별가",
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
    kicker: "03 / BOTOX",
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
  {
    slug: "whitening",
    name: "화이트닝 & 여드름",
    kicker: "04 / CLEAR & CALM",
    copy: "색소와 트러블 흔적까지 맑게",
    rows: [
      { name: "토닝레이저 10회", desc: "비타민 미백 및 수분 케어 10회", original: "150만원", event: "130만원" },
      { name: "트리플 패키지 10회", desc: "레이저 3가지 + 맞춤 케어 10회", original: "250만원", event: "200만원" },
      { name: "여드름 올인원 패키지", desc: "레이저 3가지 + 여드름 스케일링 10회", original: "220만원", event: "180만원" },
    ],
  },
];

/** 그랜드 오픈 — 페이퍼 포스터 · 잉크 블랙 & 더스티 로즈 */
const GRAND_OPEN_THEME: PopupTheme = {
  tab: "#282422",
  tabText: "#f0ece5",
  panel: "#f6f3ed",
  line: "rgba(45,35,33,0.15)",
  accent: "#c98a8a",
  ink: "#1f1c1a",
  sub: "#6b625c",
  meta: "#a3968f",
  pill: "#1f1c1a",
  pillText: "#f5f1ea",
  tableBg: "#fffdf9",
  tableLine: "rgba(45,35,33,0.1)",
  headBg: "#f0e4e2",
  headText: "#7a5f5f",
  price: "#1f1c1a",
  unit: "#c98a8a",
  noteBg: "#f2e9e6",
  noteText: "#6b5c58",
  catBg: "#eee7e4",
  catText: "#877773",
  catOnBg: "#c98a8a",
  catOnText: "#fff7f5",
  footBg: "#1c1917",
  footText: "rgba(240,235,228,0.75)",
  footStrong: "#efe9e1",
};

/** 첫 방문 — 모델 포스터 · 브라운 & 테라코타 */
const FIRST_VISIT_THEME: PopupTheme = {
  tab: "#c4652f",
  tabText: "#fff2e6",
  panel: "#faf6ee",
  line: "rgba(120,80,50,0.18)",
  accent: "#c4652f",
  ink: "#33261d",
  sub: "#6f6055",
  meta: "#a3907d",
  pill: "#c4652f",
  pillText: "#fff2e6",
  tableBg: "#fffdf8",
  tableLine: "rgba(120,80,50,0.1)",
  headBg: "#f2e7d7",
  headText: "#6d5943",
  price: "#c4652f",
  unit: "#b3a08c",
  noteBg: "#f4ebde",
  noteText: "#6f6055",
  catBg: "#f2ebe0",
  catText: "#8a7a68",
  catOnBg: "#c4652f",
  catOnText: "#fff2e6",
  footBg: "#2e241d",
  footText: "rgba(240,230,216,0.75)",
  footStrong: "#f0e6d8",
};

const FIRST_VISIT = CAMPAIGNS["first-visit-2026"];

export const POPUP_EVENTS: PopupEvent[] = [
  {
    id: "grand-open",
    tabLabel: "OPEN EVENT",
    poster: "/events/grand-open-welcome-2026-v4.jpg",
    posterAlt: "선샤인의원 그랜드 오픈 이벤트",
    // 포스터 텍스트 블록(~67.8%) 바로 아래에 버튼을 둔다
    ctaTopPct: 72,
    ctaLabel: "오픈 기념 혜택 · 가격 보기",
    eyebrow: "SUNSHINE GRAND OPEN",
    title: "GRAND OPEN EVENT",
    subtitle: "오랜 준비 끝에, 선샤인의원이 문을 열었습니다.",
    period: "2026.07.13 – 08.30",
    vatNote: "부가세(VAT) 별도",
    pillLabel: "오픈 특별가",
    closingCopy: "*소진 시 조기 마감될 수 있습니다. 당신의 빛나는 순간을, 선샤인의원이 함께합니다.",
    categories: GRAND_OPEN_CATEGORIES,
    theme: GRAND_OPEN_THEME,
  },
  {
    id: "first-visit",
    tabLabel: "FIRST VISIT",
    poster: "/events/first-visit-welcome-2026-v2.jpg",
    posterAlt: "선샤인의원 첫 방문 이벤트",
    // 모델 사진 위라 배경이 비치면 잘 안 보여 아이보리 반투명을 깐다
    ctaFill: "rgba(250,246,238,0.8)",
    ctaLabel: "첫 방문 혜택 · 가격 보기",
    eyebrow: "SUNSHINE FIRST VISIT",
    title: "FIRST VISIT WELCOME EVENT",
    subtitle: FIRST_VISIT.subtitle,
    period: FIRST_VISIT.period,
    vatNote: FIRST_VISIT.vatNote,
    pillLabel: "첫 방문 혜택",
    closingCopy: FIRST_VISIT.closingCopy,
    categories: FIRST_VISIT.categories,
    theme: FIRST_VISIT_THEME,
  },
];
