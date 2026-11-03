/** This introduction belongs to the Chinese landing, not the shared locale shell. */
export function shouldShowChineseAiConcierge(locale: string) {
  return locale === "zh";
}

export const CHINESE_AI_CONCIERGE_COPY = {
  eyebrow: "POWERED BY QWEN",
  title: ["来院前，", "让沟通先一步。"],
  description: [
    "用中文提问，轻松了解医院信息。",
    "从初次了解，到预约就诊，",
    "让每一步更清晰。",
  ],
  action: "开启中文对话",
  modelLabel: "MODEL SUPPORT",
  modelProvider: "Alibaba Cloud · Qwen",
  context: "SUNSHINE INTELLIGENCE",
  languageLabel: "中文 AI 助手",
  orbTitle: "SUNSHINE",
  orbSubtitle: "AI CONCIERGE",
  steps: [
    { number: "01", text: "用中文说出您的疑问" },
    { number: "02", text: "了解医院与来院信息" },
    { number: "03", text: "获取预约流程引导" },
  ],
  disclaimer: "AI 仅提供信息参考与预约引导，不替代医生面诊。",
  providerNote: "模型支持不代表品牌合作或医疗背书。",
} as const;
