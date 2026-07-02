export const clinic = {
  name: "Sunshine 피부과",
  nameEn: "SUNSHINE DERMATOLOGY",
  tagline: "당신의 피부에 빛을 더하다",
  description:
    "리프팅·안티에이징부터 색소·여드름·피부질환까지, 근거 중심 진료와 프리미엄 장비로 건강한 피부를 디자인합니다.",
  phone: "02-421-7588",
  phoneHref: "tel:024217588",
  kakaoHref: "https://pf.kakao.com/",
  naverBookingHref: "https://booking.naver.com/",
  bookingHref: "#booking",
  hours: [
    { day: "평일", time: "10:00 – 20:00" },
    { day: "토요일", time: "10:00 – 16:00 (점심시간 없음)" },
    { day: "점심시간", time: "13:00 – 14:00" },
    { day: "일요일·공휴일", time: "휴진" },
  ],
  address: "서울특별시 송파구 올림픽로 102, 서일빌딩 10층",
  addressSub: "2호선 잠실새내역 4번 출구 도보 3분 · 건물 내 주차 가능",
  social: {
    blog: "https://blog.naver.com/",
    instagram: "https://instagram.com/",
    naver: "https://map.naver.com/",
    kakao: "https://pf.kakao.com/",
  },
  business: {
    owner: "대표원장 김병현",
    bizNo: "123-45-67890",
    license: "송파구보건소 신고 제0000호",
  },
};

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const nav: NavItem[] = [
  {
    label: "병원소개",
    href: "/about",
    children: [
      { label: "병원소개 · 비전", href: "/about#vision" },
      { label: "의료진 소개", href: "/about#doctors" },
      { label: "병원 둘러보기", href: "/about#tour" },
      { label: "진료안내 · 오시는 길", href: "/about#location" },
    ],
  },
  {
    label: "리프팅",
    href: "/treatments/lifting",
    children: [
      { label: "울쎄라 · 써마지 · 슈링크", href: "/treatments/lifting" },
      { label: "인모드 · 스킨부스터", href: "/treatments/lifting" },
      { label: "리쥬란 · 엘란쎄 · 쥬베룩", href: "/treatments/lifting" },
      { label: "보톡스 · 필러", href: "/treatments/lifting" },
    ],
  },
  {
    label: "화이트닝 · 홍조",
    href: "/treatments/whitening",
    children: [
      { label: "기미 · 색소", href: "/treatments/whitening" },
      { label: "주근깨 · 검버섯", href: "/treatments/whitening" },
      { label: "홍조 · 난치성 색소", href: "/treatments/whitening" },
    ],
  },
  {
    label: "여드름 · 흉터 · 모공",
    href: "/treatments/acne",
    children: [
      { label: "청소년 · 성인 여드름", href: "/treatments/acne" },
      { label: "여드름 흉터", href: "/treatments/acne" },
      { label: "모공 · 색소침착", href: "/treatments/acne" },
    ],
  },
  {
    label: "피부질환",
    href: "/treatments/skin-disease",
    children: [
      { label: "무좀 · 건선 · 백선", href: "/treatments/skin-disease" },
      { label: "아토피 · 화상", href: "/treatments/skin-disease" },
      { label: "탈모", href: "/treatments/skin-disease" },
    ],
  },
  {
    label: "커뮤니티",
    href: "/community/events",
    children: [
      { label: "이벤트", href: "/community/events" },
      { label: "공지사항", href: "/community/notices" },
      { label: "비급여 수가표", href: "/community/prices" },
    ],
  },
];

export type Treatment = {
  name: string;
  summary: string;
  devices?: string[];
  tags?: string[];
};

export type Category = {
  slug: string;
  label: string;
  eyebrow: string;
  headline: string;
  description: string;
  image: string;
  treatments: Treatment[];
  devices?: { name: string; desc: string; image?: string }[];
};

export const categories: Record<string, Category> = {
  lifting: {
    slug: "lifting",
    label: "리프팅",
    eyebrow: "LIFTING",
    headline: "시간을 거스르는\n탄력 솔루션",
    description:
      "처짐과 주름의 원인을 진단하고, 피부층에 맞는 장비를 조합해 자연스러운 탄력을 디자인합니다.",
    image: "/models/lifting.png",
    treatments: [
      { name: "울쎄라 프라임", summary: "초음파(HIFU)로 SMAS층까지 자극해 근본적인 리프팅 효과.", tags: ["HIFU", "리프팅"] },
      { name: "써마지 FLX", summary: "고주파(RF)로 콜라겐을 재배열, 탄탄한 피부결을 완성.", tags: ["고주파", "탄력"] },
      { name: "인모드", summary: "RF + 진공 흡입으로 얼굴 윤곽과 탄력을 동시에 케어.", tags: ["윤곽", "탄력"] },
      { name: "슈링크 유니버스", summary: "부위별 깊이 조절이 가능한 차세대 초음파 리프팅.", tags: ["HIFU"] },
    ],
    devices: [
      {
        name: "울쎄라",
        desc: "미국 FDA 승인 HIFU 장비. 초음파 영상으로 피부층을 확인하며 진피와 SMAS층을 정밀 타겟팅합니다.",
        image: "/devices/ulthera.png",
      },
      {
        name: "써마지 FLX",
        desc: "4세대 모노폴라 고주파. 넓은 팁으로 시술 시간을 단축하고 진동 기능으로 통증을 완화합니다.",
        image: "/devices/thermage-flx.png",
      },
      {
        name: "슈링크 유니버스",
        desc: "깊이별 카트리지로 부위 맞춤 리프팅이 가능한 차세대 초음파 장비입니다.",
        image: "/devices/shurink.png",
      },
    ],
  },
  "anti-aging": {
    slug: "anti-aging",
    label: "안티에이징",
    eyebrow: "ANTI-AGING",
    headline: "채우고 되살리는\n안티에이징 솔루션",
    description:
      "리쥬란·쥬베룩·리투오·엑소좀 등 재생·볼륨 부스터와 보톡스·필러로, 꺼진 볼륨과 무너진 탄력을 속에서부터 되살립니다.",
    image: "/models/anti-aging.jpg",
    treatments: [
      { name: "리쥬란", summary: "연어 PN 성분으로 피부 장벽과 진피 재생을 유도.", tags: ["재생"] },
      { name: "쥬베룩 · 리투오", summary: "콜라겐 생성을 유도하는 재생·볼륨 부스터.", tags: ["재생", "볼륨"] },
      { name: "엑소좀 · 샤넬주사", summary: "재생 신호·영양 성분으로 피부 결과 광채를 케어.", tags: ["재생", "광채"] },
      { name: "보톡스 · 필러", summary: "주름·볼륨·윤곽을 섬세하게 보정하는 쁘띠 시술.", tags: ["주름", "윤곽"] },
    ],
  },
  whitening: {
    slug: "whitening",
    label: "화이트닝 · 홍조",
    eyebrow: "WHITENING & REDNESS",
    headline: "맑고 균일한\n톤을 되찾다",
    description:
      "기미·색소의 깊이와 종류를 정밀 분석하고, 레이저 조합으로 재발을 줄이는 맞춤 색소 치료를 제공합니다.",
    image: "/models/whitening.png",
    treatments: [
      { name: "기미 · 잡티", summary: "표피·진피 색소를 단계별로 분해하는 맞춤 토닝.", tags: ["색소"] },
      { name: "주근깨 · 흑자 · 검버섯", summary: "병변 깊이에 맞춘 레이저로 깔끔하게 제거.", tags: ["색소"] },
      { name: "난치성 색소", summary: "오타·밀크커피반점 등 까다로운 색소의 단계적 치료.", tags: ["난치성"] },
      { name: "홍조 · 모세혈관", summary: "혈관 레이저로 붉은기와 안면홍조를 진정.", tags: ["홍조", "혈관"] },
    ],
    devices: [
      { name: "포토나 스타워커", desc: "고출력 피코·나노 복합 레이저로 색소를 정밀 분해합니다." },
      { name: "클라리티", desc: "긴 파장으로 깊은 색소와 혈관 병변까지 안전하게 케어." },
      { name: "브이빔", desc: "홍조·혈관 전용 레이저(PDL)로 붉은기를 선택적으로 치료." },
    ],
  },
  acne: {
    slug: "acne",
    label: "여드름 · 흉터 · 모공",
    eyebrow: "ACNE & SCAR & PORE",
    headline: "트러블의\n악순환을 끊다",
    description:
      "원인 진단부터 흉터·모공 재건까지, 청소년과 성인 각각의 피부 상태에 맞춘 단계별 프로그램.",
    image: "/models/acne.png",
    treatments: [
      { name: "청소년 · 성인 여드름", summary: "피지·염증·호르몬 요인을 함께 관리하는 복합 프로그램.", tags: ["여드름"] },
      { name: "여드름 색소침착", summary: "염증 후 남은 붉은기·갈색 색소를 단계적으로 개선.", tags: ["색소"] },
      { name: "여드름 흉터", summary: "패인 흉터를 재건하는 레이저·재생 시술 조합.", tags: ["흉터"] },
      { name: "모공", summary: "늘어진 모공을 조여 매끈한 피부결로.", tags: ["모공"] },
    ],
    devices: [
      { name: "카프리(CO2)", desc: "프락셔널 레이저로 흉터와 모공을 재건합니다." },
      { name: "골드 PDT", desc: "광역학 치료로 피지선과 염증을 동시에 진정." },
    ],
  },
  "skin-disease": {
    slug: "skin-disease",
    label: "피부질환",
    eyebrow: "SKIN DISEASE",
    headline: "전문의가 진료하는\n피부 건강",
    description:
      "미용 시술에 앞서, 피부과 전문의가 질환의 원인을 진단하고 근거 중심으로 치료합니다.",
    image: "",
    treatments: [
      { name: "무좀", summary: "곰팡이 감염을 정확히 진단하고 재발을 줄이는 치료." },
      { name: "건선 · 백선", summary: "만성 염증성 질환의 장기 관리 플랜." },
      { name: "아토피", summary: "피부 장벽 회복 중심의 단계적 치료와 생활 관리." },
      { name: "화상", summary: "흉터 최소화를 목표로 한 화상 후 관리." },
      { name: "탈모", summary: "원인별 진단과 두피·모발 강화 치료." },
    ],
  },
};

export const doctors = [
  {
    name: "김병현",
    role: "대표원장",
    focus: "리프팅 · 안티에이징",
    initials: "K",
    photo: "/team/kim.png",
  },
];

export type EventItem = {
  slug: string;
  tag: string;
  title: string;
  period: string;
  desc: string;
  image: string;
  photo: string;
  /** optional landscape banner used in hero slider (null → split layout falls back to portrait photo) */
  banner?: string | null;
  /** vertical focal point for the banner: "top" | "center" | "bottom" */
  bannerFocus?: "top" | "center" | "bottom";
  bgColor: string;
  body: string[];
};

export const events: EventItem[] = [
  {
    slug: "may-lifting-package",
    tag: "SIGNATURE PACKAGE",
    title: "5월 리프팅 패키지",
    period: "~ 2026.05.31",
    desc: "울쎄라 + 써마지를 함께, 탄력의 깊이를 더하는 한정 프로그램",
    image: "/events/event-1.svg",
    photo: "/models/lifting.png",
    bgColor: "#dfe4ed",
    body: [
      "처짐과 주름이 신경 쓰이는 분들을 위해, 대표 리프팅 장비인 울쎄라와 써마지를 함께 받는 5월 한정 패키지를 준비했습니다.",
      "초음파(울쎄라)로 깊은 층을, 고주파(써마지)로 표층 탄력을 동시에 케어해 더 자연스럽고 탄탄한 결과를 기대할 수 있습니다.",
      "시술 전 피부과 전문의의 상담을 통해 부위와 샷 수를 맞춤 설계해 드립니다.",
    ],
  },
  {
    slug: "first-visit-diagnosis",
    tag: "FIRST VISIT",
    title: "첫 방문 피부 진단",
    period: "상시 진행",
    desc: "피부과 전문의가 1:1로 분석하고 맞춤 플랜을 제안해 드립니다",
    image: "/events/event-2.svg",
    photo: "/models/concept.png",
    bgColor: "#ede7e2",
    body: [
      "처음 방문하시는 분들을 위한 1:1 피부 진단 프로그램입니다.",
      "피부 상태와 생활 습관을 함께 살펴보고, 지금 꼭 필요한 시술과 홈케어 방향을 우선순위로 정리해 드립니다.",
      "유행하는 시술이 아니라, 내 피부에 맞는 시술부터 시작하세요.",
    ],
  },
  {
    slug: "brightening-care",
    tag: "BRIGHTENING CARE",
    title: "색소 집중 케어",
    period: "~ 2026.06.15",
    desc: "포토나 스타워커 토닝으로 맑고 균일한 톤을 되찾는 시간",
    image: "/events/event-3.svg",
    photo: "/models/whitening.png",
    bgColor: "#a9bed2",
    body: [
      "기미·잡티로 칙칙해진 피부톤을 위한 색소 집중 케어 프로그램입니다.",
      "포토나 스타워커 토닝으로 색소를 단계적으로 분해하고, 피부 장벽을 함께 관리해 재발을 줄이는 데 초점을 둡니다.",
      "색소의 종류와 깊이에 따라 회차와 강도를 조절하는 맞춤 프로그램으로 진행됩니다.",
    ],
  },
];

export type FaqItem = { q: string; a: string; keywords: string[] };

export const chatbot = {
  greeting:
    "안녕하세요! Sunshine 피부과 안내 도우미예요 ☀️ 궁금하신 점을 골라주시거나 직접 입력해 주세요.",
  fallback:
    "정확한 답변이 어려운 질문이네요. 자세한 내용은 전화(02-421-7588)나 카카오톡 상담으로 친절하게 도와드릴게요!",
  disclaimer: "일반 안내용 챗봇입니다. 정확한 진단·상담은 내원을 권장드립니다.",
};

export const faq: FaqItem[] = [
  {
    q: "진료 시간이 어떻게 되나요?",
    a: "평일 10:00–19:00, 토요일 10:00–15:00(점심시간 없음)에 진료합니다. 평일 점심시간은 13:00–14:00이며, 일요일·공휴일은 휴진입니다.",
    keywords: ["시간", "진료", "운영", "영업", "휴진", "휴무", "토요일", "일요일", "몇시"],
  },
  {
    q: "주차할 수 있나요?",
    a: "건물 내 주차가 가능합니다. 2호선 잠실새내역 4번 출구에서 도보 3분 거리이며, 주차 등록은 진료 후 데스크에서 도와드립니다.",
    keywords: ["주차", "차", "parking", "발렛"],
  },
  {
    q: "예약 없이 방문해도 되나요?",
    a: "예약 없이 방문하셔도 진료 가능하지만, 대기 시간을 줄이시려면 예약을 권장드립니다. 전화(02-421-7588) 또는 카카오톡 채널로 예약하실 수 있어요.",
    keywords: ["예약", "당일", "방문", "워크인", "대기"],
  },
  {
    q: "상담 비용이 있나요?",
    a: "방문 상담은 무료입니다. 피부과 전문의가 1:1로 피부 상태를 진단하고 맞춤 플랜을 제안해 드립니다.",
    keywords: ["상담", "무료", "진단", "첫상담"],
  },
  {
    q: "시술 후 바로 일상생활이 가능한가요?",
    a: "시술 종류에 따라 다르지만, 울쎄라·써마지 같은 리프팅 시술은 시술 직후 일상생활이 대부분 가능합니다. 다만 사우나·음주·강한 자외선은 며칠간 피해주세요.",
    keywords: ["시술후", "일상", "회복", "다운타임", "바로", "붓기"],
  },
  {
    q: "울쎄라와 써마지는 어떻게 다른가요?",
    a: "울쎄라는 초음파(HIFU)로 깊은 층(SMAS)을, 써마지는 고주파(RF)로 표층 탄력을 잡습니다. 두 가지를 함께 받으면 시너지가 좋아 패키지로도 진행합니다.",
    keywords: ["울쎄라", "써마지", "차이", "다른", "리프팅", "추천"],
  },
  {
    q: "시술 가격이 궁금해요",
    a: "시술별 비급여 가격은 피부 상태와 부위에 따라 달라져 상담 시 정확히 안내드립니다. 비급여 진료비용은 커뮤니티 > 비급여 수가표에서도 확인하실 수 있어요.",
    keywords: ["가격", "비용", "얼마", "비급여", "수가", "할인", "이벤트가"],
  },
  {
    q: "첫 방문 시 준비물이 있나요?",
    a: "신분증만 있으면 됩니다. 복용 중인 약이나 과거 시술 이력이 있다면 알려주시면 진단에 도움이 됩니다.",
    keywords: ["첫방문", "준비물", "처음", "신분증", "지참"],
  },
];
