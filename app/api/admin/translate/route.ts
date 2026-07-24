import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";

export const runtime = "nodejs";

const LOCALES = ["en", "ja", "zh"] as const;
type L = (typeof LOCALES)[number];

const LANG_LABEL: Record<L, string> = {
  en: "English (US)",
  ja: "Japanese (日本語, です/ます体)",
  zh: "Simplified Chinese (简体中文, 您 tone)",
};

const RULES = `
RULES:
- Translate the values of every string in the JSON. Keys stay identical.
- Preserve newlines, bullet markers (-, 1)), and number/percent formats.
- DO NOT translate device names: Ulthera, Thermage FLX, Shurink, InMode, Fotona StarWalker, Clarity, VBeam, Rejuran, Ellanse, Juvelook, Exosomes, HIFU, RF, PDL, SMAS, PDT.
- "Sunshine 피부과" → "Sunshine Skin Clinic" (en) / "Sunshine 皮膚科" (ja) / "Sunshine 皮肤科" (zh).
- "원장" → "Director" / "院長" / "院长".
- "피부과 의료진" → "our medical staff" / "当院の医療スタッフ" / "本院的医务人员" (NEVER "board-certified dermatologist").
- "상시 진행" → "Year-round" / "常時開催" / "常年进行".
- Output JSON only with the exact same shape.`;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { fields: Record<string, string> } | null = null;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const fields = payload?.fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const entries = Object.entries(fields).filter(
    ([, v]) => typeof v === "string" && v.trim().length > 0
  );
  if (entries.length === 0) {
    return NextResponse.json({ error: "All fields are empty" }, { status: 400 });
  }
  const cleaned = Object.fromEntries(entries) as Record<string, string>;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 }
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const out: Record<L, Record<string, string>> = {} as Record<L, Record<string, string>>;
    for (const locale of LOCALES) {
      const system = `You are a professional medical translator for Sunshine Skin Clinic. Translate Korean → ${LANG_LABEL[locale]}.\n${RULES}`;
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(cleaned) },
        ],
      });
      const raw = completion.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Record<string, string>;
      // Ensure every input key has a string output; fall back to input on missing
      const result: Record<string, string> = {};
      for (const k of Object.keys(cleaned)) {
        result[k] = typeof parsed[k] === "string" ? parsed[k] : cleaned[k];
      }
      out[locale] = result;
      // log usage per locale call
      const usage = completion.usage;
      if (usage) {
        const { logTokenUsage } = await import("@/lib/tokenLog");
        void logTokenUsage({
          source: "translate",
          model: "gpt-4o-mini",
          promptTokens: usage.prompt_tokens ?? 0,
          completionTokens: usage.completion_tokens ?? 0,
          locale,
          meta: `${Object.keys(cleaned).length} fields → ${locale}`,
        });
      }
    }
    return NextResponse.json({ ok: true, translations: out });
  } catch (err) {
    console.error("/api/admin/translate error:", err);
    return NextResponse.json(
      { error: "Translation failed. Please try again." },
      { status: 500 }
    );
  }
}
