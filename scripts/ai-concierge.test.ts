import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  AI_CONCIERGE_COPY,
  AI_CONCIERGE_LOCALES,
  getAiConciergeCopy,
} from "../lib/ai-concierge";
import {
  OPEN_CLINIC_CHAT_EVENT,
  requestClinicChatOpen,
} from "../lib/clinic-chat-events";

test("the landing and floating control share the original chat icon without a new renderer", () => {
  const widget = readFileSync(new URL("../components/ChatWidget.tsx", import.meta.url), "utf8");
  const section = readFileSync(new URL("../app/[locale]/(site)/_components/AiConcierge.tsx", import.meta.url), "utf8");
  const preview = readFileSync(new URL("../app/[locale]/(site)/_components/AiConversationPreview.tsx", import.meta.url), "utf8");
  const orb = readFileSync(new URL("../components/ChatOrb.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../components/ChatOrb.module.css", import.meta.url), "utf8");
  assert.match(widget, /<ChatOrb spinning=\{!chatOpen\} \/>/);
  assert.match(preview, /<ChatOrb className=\{styles\.orbVisual\} spinning=\{false\} \/>/);
  assert.match(orb, /data-chat-orb/);
  assert.match(orb, /conic-gradient\(from 0deg, #e8cdaf, #c49074, #9a6e54, #fff3df, #e8cdaf, #9a6e54, #e8cdaf\)/);
  assert.match(orb, /0 16px 36px rgba\(130,95,70,0\.3\), 0 4px 10px rgba\(80,40,15,0\.18\)/);
  for (const name of ["animate-orb-spin", "animate-wisp-1", "animate-wisp-2", "animate-wisp-3"]) assert.ok(orb.includes(name));
  assert.match(css, /width: 64px/);
  assert.match(css, /scale\(var\(--chat-orb-scale, 1\)\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(section + preview + orb, /ConciergeOrb|<canvas|WebGL|ORB_FRAGMENT_SHADER/);
});

test("the preview keeps the original icon small with a thin rim without changing the floating control", () => {
  const orb = readFileSync(new URL("../components/ChatOrb.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../app/[locale]/(site)/_components/AiConcierge.module.css", import.meta.url), "utf8");
  const widget = readFileSync(new URL("../components/ChatWidget.tsx", import.meta.url), "utf8");
  assert.match(orb, /inset: "var\(--chat-orb-rim-width, 2px\)"/);
  assert.match(orb, /var\(--chat-orb-rim-filter, drop-shadow\(0 0 6px/);
  assert.match(css, /--chat-orb-rim-width: 0\.65px/);
  assert.match(css, /--chat-orb-rim-filter: drop-shadow\(0 0 1\.5px/);
  assert.match(css, /--chat-orb-size: 48px/);
  assert.match(css, /--chat-orb-scale: 0\.75/);
  assert.doesNotMatch(css, /--chat-orb-size: (?:256|320)px/);
  assert.doesNotMatch(widget, /--chat-orb-rim-width|--chat-orb-rim-filter/);
});

test("all supported languages have an introduction without an implicit fallback", () => {
  for (const locale of AI_CONCIERGE_LOCALES) assert.ok(getAiConciergeCopy(locale), locale);
  for (const locale of ["", "ZH", "zh-CN", "fr", "constructor", "__proto__"]) {
    assert.equal(getAiConciergeCopy(locale), null, locale);
  }
});

test("only Chinese introduces Alibaba and Qwen, including its attribution note", () => {
  const chinese = getAiConciergeCopy("zh")!;
  assert.match(chinese.provider!.name, /阿里巴巴/);
  assert.match(chinese.provider!.name, /Qwen/);
  assert.match(chinese.disclaimer, /不替代医生面诊/);
  assert.match(chinese.provider!.note, /不代表品牌合作/);
  for (const locale of ["ko", "en", "ja"]) {
    const copy = getAiConciergeCopy(locale)!;
    assert.equal(copy.provider, undefined);
    assert.doesNotMatch(JSON.stringify(copy), /Alibaba|Qwen|阿里|알리바바|アリババ/i);
  }
});

test("localized copy has complete matching content without Korean leaking abroad", () => {
  let keys: string[] | undefined;
  for (const locale of AI_CONCIERGE_LOCALES) {
    const copy = AI_CONCIERGE_COPY[locale];
    const actual = Object.keys(copy).filter((key) => key !== "provider").sort();
    if (!keys) keys = actual;
    assert.deepEqual(actual, keys, locale);
    assert.equal(copy.title.length, 2);
    assert.equal(copy.description.length, 2);
    assert.equal(copy.steps.length, 3);
    for (const line of [...copy.title, ...copy.description, copy.action, copy.disclaimer]) assert.ok(line.trim());
    const text = JSON.stringify(copy);
    if (locale !== "ko") assert.doesNotMatch(text, /[가-힣]/, locale);
    assert.doesNotMatch(text, /API_KEY|sk-|诊断结果|100%|24小时|官方合作/);
    assert.doesNotMatch(text, /익숙한 언어로 궁금한 점을 물어보세요|Ask your questions in a familiar language|慣れた言葉で、気軽にご質問ください|用中文提问，轻松了解医院信息/);
  }
});

test("all locales have the same complete sample conversation topics and localized UI labels", () => {
  const labels = ["label", "assistantLabel", "greeting", "hint", "inputHint", "inputActionLabel"] as const;
  const ids = ["first-visit", "treatments", "directions"];
  for (const locale of AI_CONCIERGE_LOCALES) {
    const preview = getAiConciergeCopy(locale)!.preview;
    assert.deepEqual(Object.keys(preview).sort(), [...labels, "questions"].sort(), locale);
    for (const label of labels) assert.ok(preview[label].trim(), `${locale}: ${label}`);
    assert.deepEqual(preview.questions.map((question) => question.id), ids, locale);
    for (const question of preview.questions) {
      assert.deepEqual(Object.keys(question).sort(), ["id", "label", "question", "answer"].sort());
      for (const value of Object.values(question)) assert.ok(value.trim(), `${locale}: ${question.id}`);
      assert.notEqual(question.question, question.answer);
    }
  }
});

test("the preview is a small interactive boundary, while the landing stays server-rendered", () => {
  const section = readFileSync(new URL("../app/[locale]/(site)/_components/AiConcierge.tsx", import.meta.url), "utf8");
  const preview = readFileSync(new URL("../app/[locale]/(site)/_components/AiConversationPreview.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(section, /^['"]use client['"]/m);
  assert.match(section, /<AiConversationPreview/);
  assert.match(section, /copy=\{copy\.preview\}/);
  assert.match(preview, /^['"]use client['"]/);
  assert.match(preview, /AiConciergePreviewCopy/);
  assert.match(preview, /data-ai-conversation-preview/);
  assert.match(preview, /data-ai-preview-question/);
  assert.match(preview, /data-ai-preview-answer/);
  assert.match(preview, /aria-live="polite"/);
  assert.match(preview, /aria-pressed=/);
  assert.match(preview, /requestClinicChatOpen\(window\)/);
  assert.match(preview, /data-ai-preview-open-chat/);
  assert.doesNotMatch(preview, /fetch\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|setInterval|setTimeout|<input\b|<textarea\b|contentEditable/);
});

test("the landing CTA requests the existing chat without transmitting a question", () => {
  const target = new EventTarget();
  const received: Event[] = [];
  target.addEventListener(OPEN_CLINIC_CHAT_EVENT, (event) => received.push(event));
  requestClinicChatOpen(target);
  requestClinicChatOpen(target);
  assert.equal(received.length, 2);
  assert.ok(received.every((event) => event.type === OPEN_CLINIC_CHAT_EVENT));
  assert.ok(received.every((event) => !("detail" in event)));
});

test("the existing widget handles the landing CTA and cleans up its listener", () => {
  const widget = readFileSync(new URL("../components/ChatWidget.tsx", import.meta.url), "utf8");
  assert.match(widget, /addEventListener\(OPEN_CLINIC_CHAT_EVENT, openChat\)/);
  assert.match(widget, /removeEventListener\(OPEN_CLINIC_CHAT_EVENT, openChat\)/);
  assert.match(widget, /function openChat\(\)[\s\S]*?setChatOpen\(true\)/);
  assert.match(widget, /clearTimeout\(closeTimerRef\.current\)/);
});

test("the home composes the section without adding it to all shared pages", () => {
  const page = readFileSync(new URL("../app/[locale]/(site)/home/page.tsx", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../app/[locale]/layout.tsx", import.meta.url), "utf8");
  assert.match(page, /<AiConcierge locale=\{locale\} \/>/);
  assert.doesNotMatch(layout, /<AiConcierge/);
});

test("the AI section appears once directly before equipment, ahead of philosophy", () => {
  const page = readFileSync(new URL("../app/[locale]/(site)/home/page.tsx", import.meta.url), "utf8");
  const standard = page.indexOf("<SunshineStandardSplit");
  const concierge = page.indexOf("<AiConcierge");
  const equipment = page.indexOf("<SignatureShowcase");
  const philosophy = page.indexOf("<PhilosophyLines");
  assert.ok(standard >= 0 && standard < concierge);
  assert.ok(concierge < equipment && equipment < philosophy);
  assert.equal((page.match(/<AiConcierge\b/g) ?? []).length, 1);
  assert.match(page, /data-ai-before-equipment className="[^"]*pb-10[^"]*lg:pb-14"/);
});

test("the section uses localized content and Chinese-only model attribution", () => {
  const source = readFileSync(new URL("../app/[locale]/(site)/_components/AiConcierge.tsx", import.meta.url), "utf8");
  assert.match(source, /getAiConciergeCopy\(locale\)/);
  assert.match(source, /if \(!copy\) return null/);
  assert.match(source, /locale === "zh" && copy\.provider/);
  assert.match(source, /<OpenClinicChatButton/);
  assert.match(source, /<AiConversationPreview/);
  assert.match(source, /data-ai-concierge/);
  assert.match(source, /aria-labelledby="ai-concierge-title"/);
  assert.match(source, /id="chinese-ai-concierge"/);
  assert.doesNotMatch(source, /process\.env|QWEN_API_KEY|fetch\(/);
});

test("all four locales use the original light Sunshine palette with AA text contrast", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const sectionCss = readFileSync(new URL("../app/[locale]/(site)/_components/AiConcierge.module.css", import.meta.url), "utf8");
  assert.match(css, /--ai-concierge-surface: var\(--sunshine-cream\)/);
  assert.match(css, /--ai-concierge-foreground: var\(--sunshine-ink\)/);
  for (const name of ["cream", "ink", "ink-soft", "brand", "brand-dark", "brand-soft"]) {
    assert.match(css, new RegExp(`--sunshine-${name}: var\\(--color-${name}\\)`));
  }
  assert.match(sectionCss, /--concierge-background: var\(--ai-concierge-surface\)/);
  assert.match(sectionCss, /--concierge-muted: color-mix\(in srgb, var\(--sunshine-ink\) 78%, var\(--concierge-background\)\)/);
  assert.match(sectionCss, /--concierge-gold: color-mix\(in srgb, var\(--sunshine-brand-dark\) 80%, var\(--sunshine-ink\)\)/);
  assert.match(sectionCss, /--concierge-button-ink: var\(--sunshine-cream\)/);
  assert.doesNotMatch(sectionCss, /var\(--color-(?:brand|cream|ink)/);
  const rgb = (hex: string) => hex.slice(1).match(/.{2}/g)!.map((channel) => parseInt(channel, 16) / 255);
  const mix = (first: number[], second: number[], ratio: number) => first.map((value, i) => value * ratio + second[i] * (1 - ratio));
  function luminance(rgb: number[]) {
    const channels = rgb.map((value) => {
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  for (const locale of AI_CONCIERGE_LOCALES) {
    const block = css.match(new RegExp(`\\[data-theme="${locale}"\\]\\s*\\{([^}]+)\\}`))?.[1] ?? "";
    assert.doesNotMatch(block, /--sunshine-/, `${locale} must not override the clinic palette`);
    const color = (name: string) => {
      const pattern = new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`);
      return rgb(css.match(pattern)![1]);
    };
    const surface = color("cream");
    const foreground = color("ink");
    const accent = mix(color("brand-dark"), foreground, 0.8);
    const muted = mix(foreground, surface, 0.78);
    const assistant = mix(color("brand-soft"), surface, 0.18);
    const paper = mix(surface, [1, 1, 1], 0.5);
    for (const [light, dark] of [[foreground, surface], [muted, surface], [accent, surface], [accent, color("cream")], [color("ink"), color("cream")], [foreground, assistant], [muted, paper], [accent, assistant]]) {
      const values = [luminance(light), luminance(dark)].sort((a, b) => b - a);
      assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, `${locale} text contrast`);
    }
  }
});
