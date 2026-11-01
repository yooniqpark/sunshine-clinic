import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { HOME_CLOSING_COLORS, homeClosingPhase, homeClosingRailShift } from "../lib/home-closing";

const phase = (sectionTop: number, contactTop: number, viewportHeight = 800) =>
  homeClosingPhase({ sectionTop, contactTop, viewportHeight });

test("closing palettes follow section entry and contact entry, including boundaries", () => {
  assert.equal(phase(521, 1800), "paper");
  assert.equal(phase(520, 1800), "care");
  assert.equal(phase(-600, 441), "care");
  assert.equal(phase(-600, 440), "contact");
  assert.equal(phase(-1700, -500), "contact");
});

test("reverse scrolling and direct anchor entry resolve without prior scroll state", () => {
  assert.deepEqual([
    phase(-800, 200), phase(-400, 600), phase(650, 1600), phase(100, 1000),
  ], ["contact", "care", "paper", "care"]);
  assert.equal(phase(300, 900, 600), "care");
  assert.equal(phase(-400, 320, 600), "contact");
});

test("the desktop rail pins during approach and aligns with the contact frame at the end", () => {
  const shift = (contactFrameTop: number, phase = "contact" as const) => homeClosingRailShift({
    phase, contactFrameTop, headerHeight: 112, viewportWidth: 1440, viewportHeight: 900,
  });
  assert.equal(800 + shift(800), 136);
  assert.equal(160 + shift(160), 136);
  assert.equal(136 + shift(136), 136);
  assert.equal(70 + shift(70), 70);
  assert.equal(-20 + shift(-20), -20);
});

test("the rail stays in normal flow before entry and on tablet, mobile or short windows", () => {
  const input = { phase: "care" as const, contactFrameTop: 800, headerHeight: 112, viewportWidth: 1440, viewportHeight: 900 };
  assert.equal(homeClosingRailShift({ ...input, phase: "paper" }), 0);
  assert.equal(homeClosingRailShift({ ...input, viewportWidth: 1100 }), 0);
  assert.equal(homeClosingRailShift({ ...input, viewportWidth: 390 }), 0);
  assert.equal(homeClosingRailShift({ ...input, viewportHeight: 639 }), 0);
});

test("the home popup flow keeps promotions and no longer mounts the sedation notice", () => {
  const source = readFileSync(new URL("../components/HomePopups.tsx", import.meta.url), "utf8");
  assert.match(source, /EventTabsPopup/);
  assert.doesNotMatch(source, /NoticeEventPopup|sedation-2026-07|variant="sedation"/);
});

test("all supported locales have matching, nonempty closing content without Korean fallback", () => {
  const locales = ["ko", "en", "ja", "zh"];
  let keys: string[] | undefined;
  for (const locale of locales) {
    const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    const copy = messages.homeClosing as Record<string, string>;
    if (!keys) keys = Object.keys(copy).sort();
    assert.deepEqual(Object.keys(copy).sort(), keys);
    for (const [key, value] of Object.entries(copy)) {
      assert.ok(value.trim(), `${locale}.${key}`);
      if (locale !== "ko") assert.doesNotMatch(value, /[가-힣]/, `${locale}.${key}`);
    }
  }
});

function luminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)!.map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test("both dark closing surfaces support normal-size light text at AA contrast", () => {
  const light = luminance(HOME_CLOSING_COLORS.light);
  for (const color of [HOME_CLOSING_COLORS.care, HOME_CLOSING_COLORS.contact]) {
    assert.ok((light + 0.05) / (luminance(color) + 0.05) >= 4.5);
  }
});
