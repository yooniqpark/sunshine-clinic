export const AI_CONCIERGE_LOCALES = ["ko", "en", "ja", "zh"] as const;
export type AiConciergeLocale = typeof AI_CONCIERGE_LOCALES[number];

export type AiConciergePreviewCopy = {
  label: string;
  assistantLabel: string;
  greeting: string;
  hint: string;
  inputHint: string;
  inputActionLabel: string;
  questions: readonly {
    id: string;
    label: string;
    question: string;
    answer: string;
  }[];
};

type AiConciergeCopy = {
  eyebrow: string;
  title: readonly string[];
  description: readonly string[];
  action: string;
  context: string;
  languageLabel: string;
  orbTitle: string;
  orbSubtitle: string;
  steps: readonly { number: string; text: string }[];
  preview: AiConciergePreviewCopy;
  disclaimer: string;
  provider?: { label: string; name: string; note: string };
};

const identity = {
  context: "SUNSHINE INTELLIGENCE",
  orbTitle: "SUNSHINE",
  orbSubtitle: "AI CONCIERGE",
} as const;

export const AI_CONCIERGE_COPY = {
  ko: {
    ...identity,
    eyebrow: "SUNSHINE AI CONCIERGE",
    title: ["내원 전 궁금함을,", "대화로 가볍게."],
    description: [
      "병원 이용 안내부터 방문 예약까지,",
      "선샤인 AI가 차근차근 도와드립니다.",
    ],
    action: "AI 안내 시작하기",
    languageLabel: "한국어 AI 안내",
    steps: [
      { number: "01", text: "병원 정보 안내" },
      { number: "02", text: "방문 준비" },
      { number: "03", text: "예약 절차" },
    ],
    preview: {
      label: "대화 예시",
      assistantLabel: "첫 방문을 위한 AI 안내",
      greeting: "안녕하세요, 선샤인입니다.\n방문 전 어떤 점이 궁금하신가요?",
      hint: "질문을 눌러 대화 예시를 살펴보세요.",
      inputHint: "나의 질문으로 대화 시작하기",
      inputActionLabel: "실제 AI 채팅 열기",
      questions: [
        {
          id: "first-visit",
          label: "처음 방문해요",
          question: "처음 방문하는데 예약은 어떻게 하나요?",
          answer: "예약 방법과 상담 절차를 안내해 드릴게요. 실제 예약은 병원 채널에서 확인하실 수 있습니다.",
        },
        {
          id: "treatments",
          label: "시술이 궁금해요",
          question: "어떤 시술을 하는지 궁금해요.",
          answer: "병원에서 안내하는 진료 분야를 먼저 살펴보실 수 있습니다. 개인에게 적합한 시술은 의료진과 상담해 주세요.",
        },
        {
          id: "directions",
          label: "어떻게 찾아가나요?",
          question: "병원에 어떻게 찾아가면 되나요?",
          answer: "오시는 길 안내에서 병원 위치와 교통 정보를 확인하실 수 있습니다. 예약 채널 연결 방법도 안내해 드릴게요.",
        },
      ],
    },
    disclaimer: "AI는 정보 안내와 예약 절차를 돕는 도구이며, 의료진의 진료를 대신하지 않습니다.",
  },
  en: {
    ...identity,
    eyebrow: "SUNSHINE AI CONCIERGE",
    title: ["Before your visit,", "let’s talk."],
    description: [
      "Explore clinic information and get help",
      "with the steps to book your visit.",
    ],
    action: "Chat with our AI assistant",
    languageLabel: "English AI assistant",
    steps: [
      { number: "01", text: "Clinic information" },
      { number: "02", text: "Planning your visit" },
      { number: "03", text: "Booking guidance" },
    ],
    preview: {
      label: "Conversation preview",
      assistantLabel: "AI guidance for your first visit",
      greeting: "Hello, welcome to Sunshine.\nWhat would you like to know before your visit?",
      hint: "Choose a question to explore a sample conversation.",
      inputHint: "Start a conversation with your own question",
      inputActionLabel: "Open the live AI chat",
      questions: [
        {
          id: "first-visit",
          label: "My first visit",
          question: "It’s my first visit. How do I book?",
          answer: "I can explain how booking and consultations work. Please check your actual reservation through the clinic’s booking channels.",
        },
        {
          id: "treatments",
          label: "Explore treatments",
          question: "What treatments does the clinic offer?",
          answer: "You can start by exploring the treatment areas listed by the clinic. Please consult our medical team about what is suitable for you.",
        },
        {
          id: "directions",
          label: "Getting here",
          question: "How can I get to the clinic?",
          answer: "You can check the clinic’s location and travel information in our directions guide. I can also explain how to reach our booking channels.",
        },
      ],
    },
    disclaimer: "AI provides information and booking guidance. It does not provide a diagnosis or replace an in-person consultation.",
  },
  ja: {
    ...identity,
    eyebrow: "SUNSHINE AI CONCIERGE",
    title: ["ご来院の前に、", "気になることから。"],
    description: [
      "クリニックのご案内から来院予約まで、",
      "AIアシスタントがサポートします。",
    ],
    action: "AIアシスタントと話す",
    languageLabel: "日本語 AIアシスタント",
    steps: [
      { number: "01", text: "クリニックのご案内" },
      { number: "02", text: "来院の準備" },
      { number: "03", text: "予約の流れ" },
    ],
    preview: {
      label: "会話のサンプル",
      assistantLabel: "初めてのご来院をサポートするAI",
      greeting: "こんにちは、サンシャインです。\nご来院前に気になることはありますか？",
      hint: "質問を選んで、会話のサンプルをご覧ください。",
      inputHint: "ご自身の質問で会話を始める",
      inputActionLabel: "実際のAIチャットを開く",
      questions: [
        {
          id: "first-visit",
          label: "初めての来院",
          question: "初めて伺います。予約はどうすればよいですか？",
          answer: "予約方法とカウンセリングの流れをご案内します。実際のご予約はクリニックの予約窓口でご確認ください。",
        },
        {
          id: "treatments",
          label: "施術について",
          question: "どのような施術がありますか？",
          answer: "クリニックがご案内している診療分野をご覧いただけます。ご自身に適した施術は医療スタッフにご相談ください。",
        },
        {
          id: "directions",
          label: "アクセス",
          question: "クリニックへはどう行けばよいですか？",
          answer: "アクセス案内で所在地と交通情報をご確認いただけます。予約窓口への連絡方法もご案内します。",
        },
      ],
    },
    disclaimer: "AIは情報提供・予約のご案内を目的とし、医師による診察に代わるものではありません。",
  },
  zh: {
    ...identity,
    eyebrow: "POWERED BY QWEN",
    title: ["来院前，", "让沟通先一步。"],
    description: [
      "从初次了解，到预约就诊，",
      "让每一步更清晰。",
    ],
    action: "开启中文对话",
    languageLabel: "中文 AI 助手",
    steps: [
      { number: "01", text: "了解医院" },
      { number: "02", text: "准备来院" },
      { number: "03", text: "预约指引" },
    ],
    preview: {
      label: "对话示例",
      assistantLabel: "为初次来院提供AI指引",
      greeting: "您好，欢迎来到Sunshine。\n来院前有什么想了解的吗？",
      hint: "选择一个问题，看看对话示例。",
      inputHint: "提出您的问题，开始对话",
      inputActionLabel: "打开实际AI聊天",
      questions: [
        {
          id: "first-visit",
          label: "初次来院",
          question: "第一次来院，应该如何预约？",
          answer: "我可以为您介绍预约方法和咨询流程。实际预约情况请通过医院的预约渠道确认。",
        },
        {
          id: "treatments",
          label: "了解项目",
          question: "医院有哪些诊疗项目？",
          answer: "您可以先了解医院介绍的诊疗领域。适合您个人的项目，请与医务人员面诊后确认。",
        },
        {
          id: "directions",
          label: "如何到院",
          question: "应该怎么去医院？",
          answer: "您可以在来院路线中查看医院位置和交通信息。我也可以为您介绍联系预约渠道的方法。",
        },
      ],
    },
    disclaimer: "AI 仅提供信息参考与预约引导，不替代医生面诊。",
    provider: {
      label: "MODEL SUPPORT",
      name: "阿里巴巴 · 阿里云通义千问 Qwen",
      note: "模型支持不代表品牌合作或医疗背书。",
    },
  },
} as const satisfies Record<AiConciergeLocale, AiConciergeCopy>;

/** Unknown locales fail closed instead of leaking a fallback language. */
export function getAiConciergeCopy(locale: string): AiConciergeCopy | null {
  if (!AI_CONCIERGE_LOCALES.includes(locale as AiConciergeLocale)) return null;
  return AI_CONCIERGE_COPY[locale as AiConciergeLocale];
}
