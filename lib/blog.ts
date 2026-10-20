/**
 * 선샤인 블로그 (커뮤니티 > 블로그)
 *
 * 지금은 디자인 확인용 예시 글이다. 실제 운영 시에는 관리자 글쓰기 도구에서
 * 작성한 글을 이 형태로 넣으면 된다. 의료광고 기준상 효과 보장·과장·전후 비교
 * 표현은 쓰지 않고, 글 끝에는 항상 BLOG_DISCLAIMER를 붙인다.
 */

export type BlogCategory = "skin" | "guide" | "aftercare" | "clinic";

export const BLOG_CATEGORIES: { key: BlogCategory; label: string; en: string }[] = [
  { key: "skin", label: "피부 고민", en: "SKIN CONCERNS" },
  { key: "guide", label: "시술 가이드", en: "TREATMENT GUIDE" },
  { key: "aftercare", label: "시술 후 관리", en: "AFTERCARE" },
  { key: "clinic", label: "병원 이야기", en: "CLINIC STORY" },
];

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "point"; title: string; text: string }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: string;
  excerpt: string;
  date: string;
  readMin: number;
  cover: string;
  coverAlt: string;
  /** 글과 이어지는 시술 상세 페이지 */
  related?: { label: string; href: string };
  body: BlogBlock[];
};

export const BLOG_DISCLAIMER =
  "본 글은 일반적인 정보 제공을 위한 것으로, 개인의 피부 상태에 따라 적합한 시술과 결과는 달라질 수 있습니다. 모든 시술은 부작용(붉어짐, 부기, 멍, 색소 변화 등)이 나타날 수 있으므로 반드시 의료진과 충분히 상담한 뒤 결정하시기 바랍니다.";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "autumn-melasma",
    category: "skin",
    title: "가을이 되면 기미가 더 짙어 보이는 이유",
    excerpt:
      "여름 내내 받은 자외선은 가을이 되어서야 피부 위로 올라옵니다. 지금 시기에 기미를 어떻게 바라보고 관리하면 좋을지 정리했습니다.",
    date: "2026.10.18",
    readMin: 5,
    cover: "/concerns/melasma-hero.jpg",
    coverAlt: "기미 관리 이미지",
    related: { label: "기미 진료 자세히 보기", href: "/treatments/whitening/melasma" },
    body: [
      {
        type: "p",
        text: "선선한 바람이 불기 시작하면 거울 속 얼굴이 유난히 칙칙해 보인다는 분들이 많습니다. 여름 동안 쌓인 자외선 자극이 멜라닌 생성을 늘리고, 그 결과가 시간이 지나 피부 표면에서 보이기 때문입니다.",
      },
      { type: "h2", text: "기미는 왜 계절을 타는 걸까" },
      {
        type: "p",
        text: "기미는 자외선, 호르몬 변화, 피부 장벽 손상 등 여러 요인이 겹쳐 생깁니다. 특히 자외선은 멜라닌 세포를 직접 자극하기 때문에 여름이 지난 직후에 색이 짙어졌다고 느끼기 쉽습니다.",
      },
      {
        type: "list",
        items: [
          "광대·이마·윗입술 주변에 좌우 대칭으로 나타나는 경우가 많습니다.",
          "주근깨·잡티와 섞여 있는 경우가 흔해 정확한 구분이 먼저입니다.",
          "강한 자극을 반복하면 오히려 색이 짙어질 수 있습니다.",
        ],
      },
      {
        type: "point",
        title: "진료실에서 자주 드리는 말씀",
        text: "기미는 한 번에 없애는 대상이 아니라, 자극을 줄이면서 꾸준히 옅게 관리하는 피부 상태에 가깝습니다.",
      },
      { type: "h2", text: "가을에 시작하기 좋은 이유" },
      {
        type: "p",
        text: "자외선이 약해지는 가을·겨울은 레이저 토닝처럼 회차를 나누어 진행하는 관리를 시작하기에 부담이 적은 시기입니다. 다만 시술 종류와 간격은 색소의 깊이와 피부 민감도에 따라 달라지므로 진료 후 결정합니다.",
      },
      { type: "h2", text: "집에서 함께 지켜 주세요" },
      {
        type: "list",
        items: [
          "흐린 날과 실내에서도 자외선 차단제를 바르고, 2~3시간마다 덧발라 주세요.",
          "각질 제거·스크럽 등 물리적 자극은 줄여 주세요.",
          "보습으로 피부 장벽을 지키는 것이 색소 관리의 기본입니다.",
        ],
      },
      {
        type: "quote",
        text: "같은 기미라도 원인과 깊이가 다릅니다. 먼저 정확히 보고, 그다음에 방법을 정합니다.",
      },
    ],
  },
  {
    slug: "ulthera-vs-thermage",
    category: "guide",
    title: "울쎄라와 써마지, 무엇이 다를까요",
    excerpt:
      "대표적인 리프팅 장비 두 가지. 작용하는 깊이와 방식이 달라 어떤 분께 맞는지도 달라집니다.",
    date: "2026.10.12",
    readMin: 6,
    cover: "/devices/ulthera-prime-hero.jpg",
    coverAlt: "울쎄라 프라임 장비",
    related: { label: "울쎄라 프라임 자세히 보기", href: "/treatments/lifting/ulthera-prime" },
    body: [
      {
        type: "p",
        text: "상담에서 가장 많이 받는 질문 중 하나가 \"울쎄라와 써마지 중 무엇을 받아야 하나요?\"입니다. 두 장비는 에너지의 종류와 전달되는 깊이가 다르기 때문에, 얼굴의 고민이 어디에 있는지가 선택의 기준이 됩니다.",
      },
      { type: "h2", text: "울쎄라 — 초음파로 깊은 층을" },
      {
        type: "p",
        text: "울쎄라는 고강도 집속 초음파(HIFU)를 이용해 피부 깊은 층까지 에너지를 전달합니다. 처짐이 고민이신 분, 얼굴 윤곽선이 흐려졌다고 느끼시는 분께 주로 권해 드립니다.",
      },
      { type: "h2", text: "써마지 — 고주파로 피부 전체를" },
      {
        type: "p",
        text: "써마지는 고주파(RF) 에너지로 진피층을 고르게 데워 피부 탄력과 결을 관리합니다. 잔주름이나 피부가 얇아지고 푸석해진 느낌이 고민이신 분께 주로 권해 드립니다.",
      },
      {
        type: "point",
        title: "한눈에 보기",
        text: "처짐·윤곽이 고민이라면 울쎄라, 탄력·잔주름·피부결이 고민이라면 써마지를 먼저 고려합니다. 두 가지를 함께 진행하는 경우도 있습니다.",
      },
      { type: "h2", text: "결국 기준은 내 얼굴입니다" },
      {
        type: "list",
        items: [
          "피부 두께, 지방량, 처짐 정도에 따라 적합한 장비와 샷 수가 달라집니다.",
          "통증 정도와 회복 기간에 대한 부담도 함께 고려합니다.",
          "이전 시술 이력과 간격을 알려 주시면 계획을 세우는 데 도움이 됩니다.",
        ],
      },
    ],
  },
  {
    slug: "botox-aftercare",
    category: "aftercare",
    title: "보톡스 시술 후 꼭 지켜 주세요",
    excerpt:
      "시술은 5분이면 끝나지만, 그 뒤 하루가 중요합니다. 진료실에서 늘 안내드리는 주의사항을 정리했습니다.",
    date: "2026.10.05",
    readMin: 3,
    cover: "/clinic/care-room.jpg",
    coverAlt: "선샤인의원 케어룸",
    related: { label: "보톡스 자세히 보기", href: "/treatments/anti-aging/botox" },
    body: [
      {
        type: "p",
        text: "보톡스는 시술 시간이 짧고 일상 복귀가 빠른 편이지만, 약물이 자리 잡는 동안 몇 가지를 지켜 주시면 더 편안하게 지나갈 수 있습니다.",
      },
      { type: "h2", text: "시술 당일" },
      {
        type: "list",
        items: [
          "시술 부위를 4시간 정도 문지르거나 누르지 마세요.",
          "시술 후 4시간은 눕지 않는 것을 권합니다.",
          "가벼운 세안과 메이크업은 당일부터 가능합니다.",
        ],
      },
      { type: "h2", text: "시술 후 24시간" },
      {
        type: "list",
        items: [
          "사우나, 찜질방, 격한 운동은 피해 주세요.",
          "음주는 멍과 부기를 늘릴 수 있어 자제해 주세요.",
        ],
      },
      {
        type: "point",
        title: "이럴 땐 연락 주세요",
        text: "시술 부위에 심한 통증·붓기가 지속되거나, 눈꺼풀 처짐 등 평소와 다른 증상이 느껴지면 바로 병원으로 연락 주세요.",
      },
    ],
  },
  {
    slug: "pores-autumn",
    category: "skin",
    title: "건조해지는 계절, 모공이 더 넓어 보이는 이유",
    excerpt:
      "모공은 피지만의 문제가 아닙니다. 수분과 탄력이 떨어지면 같은 모공도 더 도드라져 보입니다.",
    date: "2026.09.28",
    readMin: 4,
    cover: "/concerns/pores-hero.jpg",
    coverAlt: "모공 관리 이미지",
    related: { label: "모공 진료 자세히 보기", href: "/treatments/acne/pores" },
    body: [
      {
        type: "p",
        text: "여름에는 피지 때문에, 가을에는 건조함 때문에 모공이 신경 쓰인다는 분들이 많습니다. 모공 주변 피부의 탄력이 떨어지면 입구가 늘어져 보이기 때문입니다.",
      },
      { type: "h2", text: "모공의 유형부터 봅니다" },
      {
        type: "list",
        items: [
          "피지형 — T존 위주로 둥글게 열린 모공",
          "노화형 — 볼 쪽에 물방울처럼 길게 늘어진 모공",
          "흉터형 — 여드름 이후 패인 자국과 섞인 모공",
        ],
      },
      {
        type: "p",
        text: "유형에 따라 접근이 달라집니다. 피지 조절이 필요한 경우도, 탄력과 재생을 함께 봐야 하는 경우도 있습니다.",
      },
      {
        type: "point",
        title: "생활 속 관리",
        text: "세안은 미온수로 짧게, 보습은 충분히. 피부를 자주 만지거나 짜는 습관은 모공을 더 넓힐 수 있습니다.",
      },
    ],
  },
  {
    slug: "first-visit-guide",
    category: "clinic",
    title: "처음 오시는 분들을 위한 진료 안내",
    excerpt:
      "접수부터 피부 진단, 상담, 시술까지. 선샤인의원에서의 첫 방문이 어떻게 진행되는지 미리 알려 드립니다.",
    date: "2026.09.20",
    readMin: 3,
    cover: "/clinic/consult-room.jpg",
    coverAlt: "선샤인의원 상담실",
    body: [
      {
        type: "p",
        text: "처음 병원을 찾으실 때는 무엇을 준비해야 할지, 얼마나 걸릴지 궁금하실 수 있습니다. 첫 방문의 흐름을 순서대로 안내드립니다.",
      },
      { type: "h2", text: "1. 접수 및 문진" },
      {
        type: "p",
        text: "신분증을 지참해 주세요. 복용 중인 약, 알레르기, 이전 시술 이력을 알려 주시면 진료에 도움이 됩니다.",
      },
      { type: "h2", text: "2. 피부 진단과 원장 상담" },
      {
        type: "p",
        text: "원장님이 직접 피부 상태를 확인하고, 고민과 원하시는 방향을 충분히 듣습니다. 필요한 시술만 제안드리고, 바로 결정하지 않으셔도 괜찮습니다.",
      },
      { type: "h2", text: "3. 시술 및 사후 안내" },
      {
        type: "p",
        text: "당일 시술을 원하시면 진행하고, 시술 후 주의사항과 다음 방문 시기를 안내드립니다.",
      },
      {
        type: "point",
        title: "예약을 권해 드려요",
        text: "예약 없이 방문하셔도 진료는 가능하지만 대기가 생길 수 있습니다. 전화·카카오톡·네이버 예약으로 미리 시간을 잡아 주세요.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function categoryOf(key: BlogCategory) {
  return BLOG_CATEGORIES.find((c) => c.key === key)!;
}
