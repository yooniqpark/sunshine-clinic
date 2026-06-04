// One-off: translate content/concerns-ko.json → en/ja/zh
import OpenAI from "openai";
import fs from "node:fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const LANG = {
  en: "English (US)",
  ja: "Japanese (日本語, です/ます体)",
  zh: "Simplified Chinese (简体中文, 您 tone)",
};

const RULES = `
RULES:
- Translate every string value. Keys stay identical.
- DO NOT translate or alter these field values (keep verbatim):
  * "slug", "category", "deviceSlugs" array entries.
- DO NOT translate device/drug brand names: Ulthera, Thermage FLX, Shurink, InMode, Fotona StarWalker, Clarity II, Clarity, VBeam, Secret RF, Carpri CO2, Gold PTT, CUREJET, Curajet, P. acnes, Q-Switched, Nd:YAG, PIE, PIH, KOH, DCD, SMAS, RF, PDL, PDT.
- "Sunshine 피부과" → "Sunshine Dermatology Clinic" / "Sunshine 皮膚科" / "Sunshine 皮肤科".
- Preserve numbers, percentages, units (회, nm, mm), and SPF notation.
- Output JSON only with the EXACT same shape (object with q/a, arrays preserved as arrays).`;

async function translate(client, ko, locale) {
  const system = `You are a professional medical translator for Sunshine Dermatology Clinic. Translate Korean → ${LANG[locale]}.\n${RULES}`;
  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(ko) },
    ],
  });
  return JSON.parse(r.choices[0]?.message?.content ?? "{}");
}

const ko = JSON.parse(fs.readFileSync("content/concerns-ko.json", "utf-8"));
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

for (const locale of ["en", "ja", "zh"]) {
  console.log(`\n=== ${locale} ===`);
  const out = {};
  for (const [key, concern] of Object.entries(ko)) {
    process.stdout.write(`  ${key} ... `);
    try {
      const t = await translate(client, concern, locale);
      // force-preserve slug/category/deviceSlugs from KO
      t.slug = concern.slug;
      t.category = concern.category;
      t.deviceSlugs = concern.deviceSlugs;
      out[key] = t;
      console.log("ok");
    } catch (e) {
      console.log("FAIL", e.message);
    }
  }
  fs.writeFileSync(
    `content/concerns-${locale}.json`,
    JSON.stringify(out, null, 2) + "\n"
  );
  console.log(`→ content/concerns-${locale}.json written`);
}
