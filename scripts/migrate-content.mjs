// One-shot: migrate content/{devices,concerns,site}-*.json + messages/*.json into SiteContent DB rows.
// Idempotent: re-runs simply upsert.
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();
const LOCALES = ["ko", "en", "ja", "zh"];

function read(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

async function migrate() {
  let inserted = 0;
  const ops = [];

  function add(group, slug, locale, field, value) {
    if (value === undefined || value === null) return;
    const v = typeof value === "string" ? value : JSON.stringify(value);
    ops.push(
      prisma.siteContent.upsert({
        where: {
          group_slug_locale_field: { group, slug, locale, field },
        },
        update: { value: v },
        create: { group, slug, locale, field, value: v },
      })
    );
    inserted++;
  }

  // ===== Devices =====
  for (const locale of LOCALES) {
    const p = path.join("content", `devices-${locale}.json`);
    if (!fs.existsSync(p)) continue;
    const data = read(p);
    for (const [slug, dev] of Object.entries(data)) {
      add("device", slug, locale, "name", dev.name);
      add("device", slug, locale, "tagline", dev.tagline);
      add("device", slug, locale, "intro", dev.intro);
      add("device", slug, locale, "manufacturer", dev.manufacturer);
      add("device", slug, locale, "tech", dev.tech);
      add("device", slug, locale, "highlightStat", dev.highlightStat);
      add("device", slug, locale, "features", dev.features);
      add("device", slug, locale, "howItWorks", dev.howItWorks);
      add("device", slug, locale, "recommendedFor", dev.recommendedFor);
      add("device", slug, locale, "faq", dev.faq);
    }
  }

  // ===== Concerns =====
  for (const locale of LOCALES) {
    const p = path.join("content", `concerns-${locale}.json`);
    if (!fs.existsSync(p)) continue;
    const data = read(p);
    for (const [slug, c] of Object.entries(data)) {
      add("concern", slug, locale, "name", c.name);
      add("concern", slug, locale, "tagline", c.tagline);
      add("concern", slug, locale, "intro", c.intro);
      add("concern", slug, locale, "approach", c.approach);
      add("concern", slug, locale, "recommendedFor", c.recommendedFor);
      add("concern", slug, locale, "faq", c.faq);
      add("concern", slug, locale, "deviceSlugs", c.deviceSlugs);
    }
  }

  // ===== Categories (from site-*.json categories block) =====
  for (const locale of LOCALES) {
    const p = path.join("content", `site-${locale}.json`);
    if (!fs.existsSync(p)) continue;
    const data = read(p);
    for (const [slug, cat] of Object.entries(data.categories ?? {})) {
      add("category", slug, locale, "label", cat.label);
      add("category", slug, locale, "eyebrow", cat.eyebrow);
      add("category", slug, locale, "headlineL1", cat.headlineL1);
      add("category", slug, locale, "headlineL2", cat.headlineL2);
      add("category", slug, locale, "description", cat.description);
    }
  }

  // ===== Chatbot greeting / FAQ / labels (from messages/*.json) =====
  for (const locale of LOCALES) {
    const p = path.join("messages", `${locale}.json`);
    if (!fs.existsSync(p)) continue;
    const data = read(p);
    const c = data.chatbot;
    if (!c) continue;
    add("chatbot", "default", locale, "greeting", c.greeting);
    add("chatbot", "default", locale, "fallback", c.fallback);
    add("chatbot", "default", locale, "disclaimer", c.disclaimer);
    add("chatbot", "default", locale, "faq", c.faq);
    add("chatbot", "default", locale, "headerTitle", c.headerTitle);
    add("chatbot", "default", locale, "headerSubtitle", c.headerSubtitle);
    add("chatbot", "default", locale, "inputPlaceholder", c.inputPlaceholder);
  }

  console.log(`Preparing ${inserted} upserts...`);
  // chunk into batches of 50 for SQLite safety
  for (let i = 0; i < ops.length; i += 50) {
    await prisma.$transaction(ops.slice(i, i + 50));
    process.stdout.write(`\r  ${Math.min(i + 50, ops.length)}/${ops.length}`);
  }
  console.log("\n✅ Migration complete");
  await prisma.$disconnect();
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
