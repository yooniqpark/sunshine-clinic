export type MagazineEventTemplate = {
  id: string;
  ariaLabel: string;
  modelImageUrl: string;
  modelPosition?: string;
  backgroundImageUrl?: string;
  colors: {
    outerStart: string;
    outerMiddle: string;
    outerEnd: string;
    paper: string;
    ink: string;
    accent: string;
    muted: string;
    soft: string;
    modelShade: string;
  };
  header: {
    brand: string;
    title: string;
    meta: string;
    headline: string;
    caption: string;
  };
  hero: {
    badge: string;
    headline: readonly [string, string];
    caption: string;
  };
  rightColumn: {
    eyebrow: string;
    headline: readonly [string, string];
    intro: readonly [string, string];
    primary: {
      eyebrow: string;
      headline: readonly [string, string];
      body: readonly [string, string];
    };
    secondary: {
      eyebrow: string;
      headline: readonly [string, string];
      body: string;
    };
    contactEyebrow: string;
    phone: string;
    cta: string;
  };
  footer: {
    eyebrow: string;
    headline: string;
    priceCta?: string;
    description: string;
    steps: readonly [string, string, string];
    edition: string;
  };
};

export const FIRST_VISIT_MAGAZINE_TEMPLATE: MagazineEventTemplate = {
  id: "first-visit-editorial",
  ariaLabel: "선샤인의원 첫 방문 웰컴 매거진",
  modelImageUrl: "/events/first-visit-editorial-model-2026.svg",
  modelPosition: "xMidYMid",
  colors: {
    outerStart: "#d7e9f6",
    outerMiddle: "#eef3fb",
    outerEnd: "#d9d8ef",
    paper: "#fbfaf6",
    ink: "#20284f",
    accent: "#3856c6",
    muted: "#707a9b",
    soft: "#f0f3ff",
    modelShade: "#26325b",
  },
  header: {
    brand: "SUNSHINE CLINIC",
    title: "FIRST VISIT",
    meta: "WELCOME NOTE / 2026",
    headline: "YOUR FIRST GLOW",
    caption: "A GOOD START BEGINS WITH LISTENING",
  },
  hero: {
    badge: "WELCOME 01",
    headline: ["처음 만나는 피부,", "서두르지 않게."],
    caption: "YOUR SKIN, AT YOUR PACE",
  },
  rightColumn: {
    eyebrow: "FIRST VISIT / 01",
    headline: ["처음이라 더", "세심하게"],
    intro: ["이야기를 먼저 듣고", "피부의 오늘을 살핍니다."],
    primary: {
      eyebrow: "NO PRESSURE",
      headline: ["처음부터 많이", "권하지 않습니다."],
      body: ["필요한 것부터,", "한 번에 하나씩."],
    },
    secondary: {
      eyebrow: "AT YOUR PACE",
      headline: ["속도도, 방향도", "피부에 맞게."],
      body: "부담은 가볍게, 선택은 충분하게.",
    },
    contactEyebrow: "CONSULTATION / BOOKING",
    phone: "02.421.7588",
    cta: "첫 방문 예약하기",
  },
  footer: {
    eyebrow: "FIRST VISIT PRINCIPLES",
    headline: "듣고 · 이해하고 · 필요한 만큼만",
    priceCta: "상세 가격표",
    description: "좋은 시작은 많이 하는 것이 아니라, 잘 고르는 것에서 시작됩니다.",
    steps: ["01  LISTEN", "02  UNDERSTAND", "03  REFINE"],
    edition: "SUNSHINE FIRST VISIT · WELCOME EDIT",
  },
};

export const MAGAZINE_EVENT_TEMPLATES = {
  [FIRST_VISIT_MAGAZINE_TEMPLATE.id]: FIRST_VISIT_MAGAZINE_TEMPLATE,
} as const;

export type MagazineEventTemplateId = keyof typeof MAGAZINE_EVENT_TEMPLATES;
