import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  CHINESE_AI_CONCIERGE_COPY,
  shouldShowChineseAiConcierge,
} from "../lib/chinese-ai-concierge";
import {
  OPEN_CLINIC_CHAT_EVENT,
  requestClinicChatOpen,
} from "../lib/clinic-chat-events";

test("the introduction is exclusive to the Chinese locale", () => {
  for (const locale of ["ko", "en", "ja", "zh", "", "ZH", "zh-CN"]) {
    assert.equal(shouldShowChineseAiConcierge(locale), locale === "zh", locale);
  }
});

test("Chinese content names the verified model provider without Korean fallback", () => {
  assert.equal(CHINESE_AI_CONCIERGE_COPY.modelProvider, "Alibaba Cloud · Qwen");
  assert.equal(CHINESE_AI_CONCIERGE_COPY.steps.length, 3);
  const text = JSON.stringify(CHINESE_AI_CONCIERGE_COPY);
  assert.doesNotMatch(text, /[가-힣]/);
  assert.doesNotMatch(text, /API_KEY|sk-|诊断结果|100%|24小时|官方合作/);
  assert.match(CHINESE_AI_CONCIERGE_COPY.disclaimer, /不替代医生面诊/);
  assert.match(CHINESE_AI_CONCIERGE_COPY.providerNote, /不代表品牌合作/);
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
  assert.match(page, /<ChineseAiConcierge locale=\{locale\} \/>/);
  assert.doesNotMatch(layout, /ChineseAiConcierge/);
});

test("the section applies the locale guard before rendering its content", () => {
  const source = readFileSync(new URL("../app/[locale]/(site)/_components/ChineseAiConcierge.tsx", import.meta.url), "utf8");
  assert.match(source, /if \(!shouldShowChineseAiConcierge\(locale\)\) return null/);
  assert.match(source, /<OpenClinicChatButton/);
  assert.match(source, /aria-labelledby="chinese-ai-concierge-title"/);
  assert.doesNotMatch(source, /process\.env|QWEN_API_KEY|fetch\(/);
});

test("the selected dark palette and CTA meet AA normal text contrast", () => {
  const css = readFileSync(new URL("../app/[locale]/(site)/_components/ChineseAiConcierge.module.css", import.meta.url), "utf8");
  const colors = Object.fromEntries([...css.matchAll(/--concierge-([\w-]+):\s*(#[0-9a-f]{6})/g)].map((match) => [match[1], match[2]]));
  function luminance(hex: string) {
    const channels = hex.slice(1).match(/.{2}/g)!.map((channel) => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  for (const [foreground, background] of [
    ["foreground", "background"], ["muted", "background"], ["gold", "background"],
    ["button-ink", "button"], ["button-ink", "foreground"],
  ]) {
    const values = [luminance(colors[foreground]), luminance(colors[background])].sort((a, b) => b - a);
    assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, `${foreground}/${background}`);
  }
});
