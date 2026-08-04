"use client";

import Image from "next/image";

type Locale = "ko" | "en" | "ja" | "zh";

const COPY = {
  ko: {
    kicker: "AI PRE-CONSULTATION",
    headline: ["처음 만나는 날", "처음부터 설명하지 않도록"],
    description:
      "내원 전에 AI와 피부 고민과 원하는 변화를 편하게 나눠보세요 대화의 핵심은 예약과 함께 정리되어 상담 전 의료진이 미리 확인할 수 있습니다",
    cta: "AI와 사전 대화 시작",
    trust:
      "예약 단계에서 직접 확인하고 동의한 대화 요약만 의료진에게 전달됩니다",
    visualTitle: "대화는 사라지지 않고 상담을 위한 이해가 됩니다",
    steps: ["대화", "기억", "확인", "예약", "상담"],
    cards: [
      "편하게 나눈 대화를 이어서 기억합니다",
      "상담에 필요한 맥락만 차분하게 정리합니다",
      "예약 정보와 함께 의료진에게 전달합니다",
      "환자의 확인과 동의를 거쳐 안전하게 공유합니다",
    ],
    alts: [
      "AI 대화가 맥락 카드로 쌓이는 추상 이미지",
      "대화 흐름을 표현한 추상 이미지",
      "대화가 상담 메모로 정리되는 추상 이미지",
      "예약 일정과 대화가 연결되는 추상 이미지",
      "동의 기반 정보 보호를 표현한 추상 이미지",
    ],
  },
  en: {
    kicker: "AI PRE-CONSULTATION",
    headline: ["On the day we first meet", "you will not need to start over"],
    description:
      "Share your concerns and hopes with our AI before your visit The essential context is organized with your booking so the care team can understand you before the consultation begins",
    cta: "Start a pre-consultation chat",
    trust:
      "Only the conversation summary you review and approve is shared with the care team",
    visualTitle: "A conversation becomes useful context for your consultation",
    steps: ["Talk", "Remember", "Review", "Book", "Consult"],
    cards: [
      "Your conversation continues without losing context",
      "Only the context useful for consultation is organized",
      "The approved summary travels with your booking",
      "Your information is shared only with your consent",
    ],
    alts: [
      "Abstract stacked conversation memory cards",
      "Abstract connected conversation threads",
      "Abstract consultation handoff dossier",
      "Abstract calendar linked to a conversation",
      "Abstract consent and privacy vault",
    ],
  },
  ja: {
    kicker: "AI PRE-CONSULTATION",
    headline: ["初めてお会いする日", "最初から説明しなくてもいいように"],
    description:
      "来院前に肌のお悩みや望む変化をAIにお話しください 大切な背景を予約情報とともに整理し診察前に医療スタッフが確認できます",
    cta: "AIとの事前対話を始める",
    trust: "ご本人が確認し同意した要約のみ医療スタッフに共有されます",
    visualTitle: "対話が診察のための理解につながります",
    steps: ["対話", "記憶", "確認", "予約", "診察"],
    cards: [
      "気軽に話した内容を文脈ごと記憶します",
      "診察に必要な背景だけを整理します",
      "予約情報とともに医療スタッフへ届けます",
      "確認と同意を経て安全に共有します",
    ],
    alts: [
      "対話記憶の抽象画像",
      "会話の流れの抽象画像",
      "診察メモの抽象画像",
      "予約連携の抽象画像",
      "同意と保護の抽象画像",
    ],
  },
  zh: {
    kicker: "AI PRE-CONSULTATION",
    headline: ["初次见面时", "不必再从头说明"],
    description:
      "到院前可先向AI讲述皮肤困扰与期待的变化 重要背景会随预约一并整理让医护人员在咨询前提前了解",
    cta: "开始AI预先沟通",
    trust: "仅向医护人员提供由您确认并同意的对话摘要",
    visualTitle: "对话将成为咨询所需的理解与背景",
    steps: ["对话", "记忆", "确认", "预约", "咨询"],
    cards: [
      "延续并记住对话中的重要背景",
      "只整理咨询所需的相关信息",
      "经确认的摘要将随预约一同传达",
      "在您的确认与同意后安全共享",
    ],
    alts: [
      "对话记忆抽象图",
      "对话流程抽象图",
      "咨询摘要抽象图",
      "预约连接抽象图",
      "同意与隐私抽象图",
    ],
  },
} as const;

const GALLERY = [
  "/ai/ai-chat-conversation.svg",
  "/ai/ai-chat-handoff.svg",
  "/ai/ai-chat-calendar.svg",
  "/ai/ai-chat-privacy.svg",
] as const;

function cardSpan(index: number) {
  if (index < 2) return "lg:col-span-6";
  return index === 2 ? "lg:col-span-7" : "lg:col-span-5";
}

export function AiConsultationIntro({ locale }: { locale: string }) {
  const copy = COPY[(locale in COPY ? locale : "ko") as Locale];

  function openChat() {
    window.dispatchEvent(new CustomEvent("sunshine:open-chat"));
  }

  return (
    <section
      id="ai-consultation"
      className="relative overflow-hidden bg-[#12140f] text-[#f8f2e9]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 78% 12%, rgba(196,144,116,0.22), transparent 34%), radial-gradient(circle at 8% 78%, rgba(232,205,175,0.12), transparent 30%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8cdaf]/40 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-36">
        <div className="grid items-end gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <span className="block h-px w-12 bg-[#e8cdaf]/60" />
              <p className="text-[10px] font-medium tracking-[0.34em] text-[#e8cdaf] lg:text-[11px]">
                {copy.kicker}
              </p>
            </div>
            <h2 className="mt-8 font-serif text-[clamp(2.45rem,5.2vw,5.4rem)] font-normal leading-[1.04] tracking-[-0.035em]">
              <span className="block text-[#f8f2e9]/62">
                {copy.headline[0]}
              </span>
              <span className="mt-2 block text-[#f8f2e9]">
                {copy.headline[1]}
              </span>
            </h2>
            <p className="mt-8 max-w-lg break-keep text-[13px] leading-7 text-[#f8f2e9]/62 lg:text-[15px] lg:leading-8">
              {copy.description}
            </p>
            <button
              type="button"
              onClick={openChat}
              className="group mt-10 inline-flex items-center gap-5 rounded-full border border-[#e8cdaf]/35 bg-[#e8cdaf] px-6 py-3.5 text-xs font-semibold tracking-[0.08em] text-[#211c17] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f4dfc5]"
            >
              {copy.cta}
              <span
                aria-hidden
                className="text-base transition-transform duration-300 group-hover:translate-x-1"
              >
                ↗
              </span>
            </button>
            <p className="mt-6 flex max-w-md items-start gap-3 break-keep text-[10px] leading-5 text-[#f8f2e9]/40 lg:text-[11px]">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c49074] shadow-[0_0_10px_rgba(196,144,116,0.8)]"
              />
              {copy.trust}
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_36px_90px_rgba(0,0,0,0.34)] lg:rounded-[2.75rem]">
            <Image
              src="/ai/ai-chat-memory.svg"
              alt={copy.alts[0]}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#12140f]/95 via-[#12140f]/42 to-transparent px-6 pb-6 pt-24 lg:px-9 lg:pb-9">
              <p className="text-[9px] tracking-[0.3em] text-[#e8cdaf]/70">
                CONTEXT MEMORY
              </p>
              <p className="mt-3 max-w-md break-keep font-serif text-2xl leading-tight text-[#f8f2e9] lg:text-3xl">
                {copy.visualTitle}
              </p>
            </div>
          </div>
        </div>

        <ol className="mt-16 grid grid-cols-5 border-y border-white/10 lg:mt-24">
          {copy.steps.map((step, index) => (
            <li key={step} className="relative py-5 text-center lg:py-6">
              {index > 0 && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-6 w-px -translate-y-1/2 bg-white/10"
                />
              )}
              <span className="block font-serif text-xs tabular-nums text-[#c49074] lg:text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-1.5 block text-[9px] tracking-[0.14em] text-[#f8f2e9]/55 lg:text-[11px]">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-12">
          {GALLERY.map((src, index) => (
            <article
              key={src}
              className={
                "group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] " +
                cardSpan(index)
              }
            >
              <div
                className={
                  "relative overflow-hidden " +
                  (index < 2 ? "aspect-[16/10]" : "aspect-[4/3]")
                }
              >
                <Image
                  src={src}
                  alt={copy.alts[index + 1]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex items-start gap-4 border-t border-white/10 px-5 py-5 lg:px-7 lg:py-6">
                <span className="font-serif text-sm tabular-nums text-[#c49074]">
                  0{index + 1}
                </span>
                <p className="max-w-sm break-keep text-xs leading-6 text-[#f8f2e9]/68 lg:text-[13px]">
                  {copy.cards[index]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
