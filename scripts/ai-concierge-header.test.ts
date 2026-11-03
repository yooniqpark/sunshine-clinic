import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { conciergeIntersectsHeader, resolveHomeHeaderSurface } from "../lib/ai-concierge-header";

test("the concierge owns the header exactly while crossing its real lower edge", () => {
  const active = (sectionTop: number, sectionBottom: number, headerBottom = 112) =>
    conciergeIntersectsHeader({ sectionTop, sectionBottom, headerBottom });
  assert.equal(active(113, 1000), false);
  assert.equal(active(112, 1000), true);
  assert.equal(active(-300, 113), true);
  assert.equal(active(-300, 112), false);
  assert.equal(active(-300, -10), false);
  assert.equal(active(80, 700, 80), true);
  assert.equal(active(81, 700, 80), false);
});

test("invalid or zero-height measurements never activate the header", () => {
  for (const input of [
    { sectionTop: 0, sectionBottom: 0, headerBottom: 112 },
    { sectionTop: 10, sectionBottom: 5, headerBottom: 112 },
    { sectionTop: 0, sectionBottom: 500, headerBottom: 0 },
    { sectionTop: Number.NaN, sectionBottom: 500, headerBottom: 112 },
    { sectionTop: 0, sectionBottom: Infinity, headerBottom: 112 },
  ]) assert.equal(conciergeIntersectsHeader(input), false);
});

test("direct anchor entry and reverse scrolling do not depend on previous state", () => {
  assert.deepEqual([
    [700, 1500], [80, 880], [-300, 500], [-800, 0], [-300, 500], [700, 1500],
  ].map(([sectionTop, sectionBottom]) => conciergeIntersectsHeader({ sectionTop, sectionBottom, headerBottom: 80 })),
  [false, true, true, false, true, false]);
});

test("the concierge overrides existing closing scenes on all localized home routes", () => {
  for (const pathname of ["/home", "/home/", "/ko/home", "/en/home", "/ja/home", "/zh/home/"]) {
    for (const closingPhase of ["paper", "care", "contact"] as const) {
      assert.equal(resolveHomeHeaderSurface({ pathname, menuOpen: false, conciergeAtHeader: true, closingPhase }), "concierge");
    }
  }
});

test("leaving the section restores closing tones and open mobile menus stay on cream", () => {
  for (const closingPhase of ["paper", "care", "contact"] as const) {
    assert.equal(resolveHomeHeaderSurface({ pathname: "/zh/home", menuOpen: false, conciergeAtHeader: false, closingPhase }),
      closingPhase === "paper" ? "default" : closingPhase);
    assert.equal(resolveHomeHeaderSurface({ pathname: "/zh/home", menuOpen: true, conciergeAtHeader: true, closingPhase }), "default");
  }
});

test("route changes cannot retain a stale concierge or closing color", () => {
  for (const pathname of ["/", "/zh", "/en/journal", "/ja/about", "/journal", "/other/home", "/zh/treatments/home"]) {
    assert.equal(resolveHomeHeaderSurface({ pathname, menuOpen: false, conciergeAtHeader: true, closingPhase: "contact" }), "default");
  }
});

test("the header uses the shared Sunshine surface and cleans up its observers and listeners", () => {
  const source = readFileSync(new URL("../app/[locale]/(site)/_components/PreviewHeader.tsx", import.meta.url), "utf8");
  assert.match(source, /data-concierge-tone=\{concierge \? locale : undefined\}/);
  assert.match(source, /backgroundColor: "var\(--ai-concierge-surface\)"/);
  assert.match(source, /"--color-cream": "var\(--sunshine-cream\)"/);
  assert.match(source, /"--color-ink": "var\(--sunshine-ink\)"/);
  assert.match(source, /const darkSurface = closing;/);
  assert.match(source, /const lightText = !concierge && \(darkSurface \|\| !solid\);/);
  assert.match(source, /header\.getBoundingClientRect\(\)\.bottom/);
  assert.match(source, /observer\.disconnect\(\)/);
  assert.match(source, /cancelAnimationFrame\(frame\)/);
  for (const event of ["scroll", "resize", "pageshow", "hashchange"]) {
    assert.match(source, new RegExp(`removeEventListener\\("${event}", schedule\\)`));
  }
});
