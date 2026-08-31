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
  /** 포스터 위 CTA 버튼 테두리 — 없으면 포인트 색 */
  ctaBorder?: string;
  /** 포스터를 꽉 채울지(cover) 전체를 보여줄지(contain). 기본 cover */
  posterFit?: "cover" | "contain";
  /** posterFit이 contain일 때 여백 색 — 포스터 배경과 맞춰 이어 보이게 한다 */
  posterBg?: string;
  /** 모바일 탭에 쓰는 짧은 라벨 — 탭이 3개 이상이면 가로가 모자란다 */
  tabShort?: string;
  /**
   * 홈 팝업 탭에 띄울지 여부. 기본 true.
   * 종료된 이벤트는 false로 두면 팝업에서만 빠지고, 커뮤니티 게시판의
   * 가격표는 계속 이 데이터로 렌더된다.
   */
  showInPopup?: boolean;
  /**
   * 글자가 들어 있지 않은 사진을 커버로 쓸 때 화면에서 얹는 타이틀.
   * 이미지에 굽지 않으므로 폰트가 깨지지 않고 번역도 그대로 따라간다.
   */
  posterOverlay?: {
    kicker: string;
    titleLines: string[];
    sub: string;
  };
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
    copy: "처진 자리를 끌어올리고, 탄력은 안에서부터",
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

/** 9월 베스트 — 모델 사진 커버 · 코코아 & 카라멜 */
const SEPTEMBER_THEME: PopupTheme = {
  tab: "#7b5138",
  tabText: "#faf4ec",
  panel: "#faf4ec",
  line: "rgba(70,45,28,0.15)",
  accent: "#b07a52",
  ink: "#33241a",
  sub: "#6f5c4c",
  meta: "#a89583",
  pill: "#7b5138",
  pillText: "#faf4ec",
  tableBg: "#fffdf7",
  tableLine: "rgba(70,45,28,0.1)",
  headBg: "#efe2d2",
  headText: "#7a5f45",
  price: "#7b5138",
  unit: "#b8a086",
  noteBg: "#f2e7d9",
  noteText: "#6f5c4c",
  catBg: "#f0e8dd",
  catText: "#8a7867",
  catOnBg: "#7b5138",
  catOnText: "#faf4ec",
  footBg: "#2a1c12",
  footText: "rgba(245,238,228,0.75)",
  footStrong: "#f5eee4",
};

const SEPTEMBER_CATEGORIES: CampaignCategory[] = [
  {
    slug: "lifting-encore",
    name: "리프팅 앵콜",
    kicker: "01 / LIFTING ENCORE",
    copy: "많이 찾아주셨던 리프팅 조합을 9월 한 달 다시 만나보세요",
    rows: [
      { name: "울쎄라 피프라임 300샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "100만원" },
      { name: "울쎄라 피프라임 400샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "150만원" },
      { name: "써마지 FLX 300샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "110만원" },
      { name: "써마지 FLX 600샷", desc: "커스텀 스킨보톡스 얼굴 전체 포함", event: "190만원" },
      { name: "울쎄라 300샷 + 써마지 600샷", desc: "리쥬란 HB 2cc + 아이리쥬란 1cc 서비스", event: "290만원" },
      { name: "울쎄라 600샷 + 써마지 300샷", desc: "리쥬란 HB 2cc + 아이리쥬란 1cc 서비스", event: "310만원" },
      { name: "울쎄라 600샷 + 써마지 600샷", desc: "리쥬란 HB 2cc + 아이리쥬란 1cc 서비스", event: "390만원" },
    ],
  },
  {
    slug: "eye-lifting",
    name: "눈가 리프팅",
    kicker: "02 / EYE LIFTING",
    copy: "얼굴에서 가장 먼저 눈에 띄는 눈가 탄력, 아이써마지로 집중 관리",
    rows: [
      { name: "아이써마지 225샷", event: "110만원" },
      { name: "아이써마지 450샷", event: "180만원" },
    ],
  },
  {
    slug: "eraser",
    name: "얼굴전체 지우개",
    kicker: "03 / ERASER",
    copy: "점 · 쥐젖 · 편평사마귀 · 비립종까지, 얼굴 전체를 한 번에",
    rows: [
      { name: "얼굴전체 100개 기준", desc: "부위는 목으로 변경 가능", original: "110만원", event: "50만원" },
      { name: "얼굴전체 50개 기준", desc: "부위는 목으로 변경 가능", original: "55만원", event: "30만원" },
    ],
  },
  {
    slug: "gold-ptt",
    name: "골드PTT",
    kicker: "04 / GOLD PTT",
    copy: "반복되는 트러블 피부를 위한 새로운 선택, 도입 기념 3회 집중 프로그램",
    rows: [
      { name: "골드PTT 3회", desc: "아쿠아필 포함", original: "77만원", event: "60만원" },
    ],
  },
  {
    slug: "booster-volume",
    name: "스킨부스터 & 볼륨",
    kicker: "05 / BOOSTER & VOLUME",
    copy: "수분감부터 피부결 · 탄력 · 자연스러운 볼륨까지, 지금 고민에 맞춰",
    rows: [
      { name: "스킨바이브 1cc", original: "25만원", event: "20만원" },
      { name: "엘란쎄 1cc", original: "80만원", event: "70만원" },
      { name: "리쥬란 힐러 2cc", original: "25만원", event: "15만원" },
      { name: "리쥬란 HB 2cc", original: "40만원", event: "20만원" },
    ],
  },
];

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

/** 팝업·게시판이 함께 참조하는 전체 이벤트 (종료분 포함) */
export const POPUP_EVENTS: PopupEvent[] = [
  {
    id: "september-best",
    tabLabel: "SEPT BEST",
    tabShort: "SEPT",
    poster: "/events/september-model-2026.jpg",
    posterAlt: "선샤인의원 9월 베스트 이벤트",
    posterBg: "#7b5138",
    posterOverlay: {
      kicker: "SUNSHINE SKIN CLINIC",
      titleLines: ["9월, 다시 만나는", "선샤인 베스트 이벤트"],
      sub: "SEPTEMBER, YOUR SKIN MOMENT",
    },
    ctaFill: "rgba(250,244,236,0.92)",
    ctaBorder: "transparent",
    ctaLabel: "9월 베스트 혜택 · 가격 보기",
    eyebrow: "SEPTEMBER, YOUR SKIN MOMENT",
    title: "9월, 다시 만나는 선샤인 베스트 이벤트",
    subtitle: "많이 찾아주셨던 시술부터 새롭게 준비한 프로그램까지.",
    period: "2026.09.01 – 09.30",
    vatNote: "부가세(VAT) 별도",
    pillLabel: "9월 한정",
    closingCopy:
      "무조건 많은 시술보다, 지금 내 피부에 필요한 시술을. 원장님과 충분한 진료 후 피부 상태와 원하는 방향에 맞춰 결정합니다.",
    categories: SEPTEMBER_CATEGORIES,
    theme: SEPTEMBER_THEME,
  },
  {
    id: "grand-open",
    tabLabel: "OPEN EVENT",
    tabShort: "OPEN",
    // 2026.08.30 종료 — 팝업에서는 내리고 커뮤니티 게시판 기록으로만 남긴다
    showInPopup: false,
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
    tabShort: "FIRST",
    poster: "/events/first-visit-welcome-2026-v2.jpg",
    posterAlt: "선샤인의원 첫 방문 이벤트",
    // 모델 사진 위라 배경이 비치면 잘 안 보여 흰색 반투명을 깐다 (테두리는 없이)
    ctaFill: "rgba(255,255,255,0.85)",
    ctaBorder: "transparent",
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

/** 홈 팝업 탭에 실제로 노출되는 이벤트 */
export const ACTIVE_POPUP_EVENTS: PopupEvent[] = POPUP_EVENTS.filter(
  (e) => e.showInPopup !== false,
);
