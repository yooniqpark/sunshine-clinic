import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getChatbotManual, type Locale } from "@/lib/queries";

export const runtime = "nodejs";

const LOCALES = new Set<Locale>(["ko", "en", "ja", "zh"]);

const LOCALE_LANG: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文(简体)",
};

const FALLBACK_BY_LOCALE: Record<Locale, string> = {
  ko: "정확한 내용은 내원 상담, 전화(02-1234-5678) 또는 카카오톡으로 안내드립니다.",
  en: "For accurate details please visit the clinic, call +82-2-1234-5678, or message us on KakaoTalk.",
  ja: "正確な内容は来院相談、お電話（+82-2-1234-5678）またはKakaoTalkでご案内いたします。",
  zh: "详细信息请到院咨询、致电 +82-2-1234-5678 或通过 KakaoTalk 联系我们。",
};

const ERROR_BY_LOCALE: Record<Locale, string> = {
  ko: "일시적으로 답변이 어렵습니다. 잠시 후 다시 시도하거나 전화·카카오톡으로 문의해 주세요.",
  en: "We can't reply right now. Please try again shortly or contact us by phone/KakaoTalk.",
  ja: "一時的に応答できません。少し時間をおいて再度お試しいただくか、お電話・KakaoTalkまで。",
  zh: "暂时无法回复，请稍后再试或通过电话/KakaoTalk联系我们。",
};

const REQUEST_BAD_BY_LOCALE: Record<Locale, string> = {
  ko: "질문을 입력해 주세요.",
  en: "Please enter your question.",
  ja: "ご質問を入力してください。",
  zh: "请输入您的问题。",
};

const REQUEST_LONG_BY_LOCALE: Record<Locale, string> = {
  ko: "질문은 500자 이내로 입력해 주세요.",
  en: "Please keep questions under 500 characters.",
  ja: "質問は500文字以内で入力してください。",
  zh: "请将问题控制在500字以内。",
};

function pickLocale(input: unknown): Locale {
  return typeof input === "string" && LOCALES.has(input as Locale)
    ? (input as Locale)
    : "ko";
}

async function buildSystemPrompt(locale: Locale): Promise<string> {
  const manual = await getChatbotManual(locale);
  const language = LOCALE_LANG[locale];
  const fallback = FALLBACK_BY_LOCALE[locale];
  return `You are the friendly guide assistant for Sunshine Dermatology Clinic.

Rules:
1. Answer ONLY using facts from the [MANUAL] below. Keep it concise (2–4 sentences).
2. Respond in ${language}. Do not switch languages.
3. If the question can't be answered from the manual (price, medical diagnosis, prescription, etc.), do NOT guess — instead say: "${fallback}"
4. Do NOT claim to be a "board-certified dermatologist" or any such credential.
5. When mentioning treatment effects, gently note that results can vary by individual.
6. Don't tack on disclaimers like "please visit the clinic for an accurate diagnosis" unless it's actually relevant.
7. Politely decline profanity, ads, or off-topic requests.

[MANUAL]
${manual}`;
}

export async function POST(req: Request) {
  let message = "";
  let locale: Locale = "ko";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
    locale = pickLocale(body?.locale);
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: REQUEST_BAD_BY_LOCALE[locale] }, { status: 400 });
  }
  if (message.length > 500) {
    return NextResponse.json({ error: REQUEST_LONG_BY_LOCALE[locale] }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const systemPrompt = await buildSystemPrompt(locale);
    const model = "gpt-4o-mini";
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
      max_tokens: 350,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });
    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      FALLBACK_BY_LOCALE[locale];
    // fire-and-forget logging
    const usage = completion.usage;
    if (usage) {
      const { logTokenUsage } = await import("@/lib/tokenLog");
      void logTokenUsage({
        source: "chat",
        model,
        promptTokens: usage.prompt_tokens ?? 0,
        completionTokens: usage.completion_tokens ?? 0,
        locale,
        meta: message.slice(0, 200),
      });
    }
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("/api/chat error:", err);
    return NextResponse.json({ error: ERROR_BY_LOCALE[locale] }, { status: 500 });
  }
}
