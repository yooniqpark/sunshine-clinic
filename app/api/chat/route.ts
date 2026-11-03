// App-owned: clinic-specific public knowledge + manual retrieval. Core sync preserves this override.
import OpenAI from "openai";
import clinic from "@/clinic";
import { createClinicChatHandler } from "@/lib/clinic-chat-handler";
import { loadClinicChatKnowledge } from "@/lib/clinic-chat-knowledge.server";
import { logChatMessage } from "@yooniqpark/clinic-core/lib/chatLog";
import { logTokenUsage } from "@yooniqpark/clinic-core/lib/tokenLog";
export const runtime = "nodejs";
export const POST = createClinicChatHandler({
  enabled: () => clinic.features?.chatbot !== false,
  knowledge: loadClinicChatKnowledge,
  complete: async messages => {
    if (!process.env.QWEN_API_KEY) throw new Error("AI unavailable");
    const model = process.env.QWEN_MODEL || "qwen3.6-flash";
    const client = new OpenAI({ apiKey: process.env.QWEN_API_KEY, baseURL: process.env.QWEN_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1", timeout: 30000, maxRetries: 1 });
    // Qwen3.6 Flash supports JSON mode only with thinking disabled. Limit this
    // provider extension to the verified model family; retain validation below.
    const format = /^qwen3\.6-flash(?:-|$)/.test(model)
      ? { enable_thinking: false, response_format: { type: "json_object" as const } }
      : {};
    const result = await client.chat.completions.create({ model, temperature: 0.2, max_tokens: 1000, messages, ...format });
    return { content: result.choices[0]?.message?.content || "", model, promptTokens: result.usage?.prompt_tokens, completionTokens: result.usage?.completion_tokens };
  },
  log: async record => {
    await logChatMessage({ locale: record.locale, question: record.question, answer: record.answer, status: record.status, sessionId: record.sessionId, model: record.completion?.model });
    if (record.completion) await logTokenUsage({ source: "chat", model: record.completion.model, promptTokens: record.completion.promptTokens || 0, completionTokens: record.completion.completionTokens || 0, locale: record.locale, meta: JSON.stringify({ sources: record.sourceIds }).slice(0, 500) });
  },
});
