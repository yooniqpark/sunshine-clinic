import "server-only";
import { prisma } from "@yooniqpark/clinic-core/lib/prisma";
import { getSettings } from "@yooniqpark/clinic-core/lib/settings";
import { normalizeEventTemplateData } from "@yooniqpark/clinic-core/lib/event-template";
import sanitizeHtml from "sanitize-html";
import { getAllDeviceParams, getDevice } from "./devices";
import { getEditableDeviceContent } from "./device-content";
import { formatPrice } from "./event-popup-i18n";
import { activePublished, retrieveKnowledge, type ChatHistory, type ChatLocale, type KnowledgeDocument } from "./clinic-knowledge";
import ko from "@/messages/ko.json";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import zh from "@/messages/zh.json";

const messages = { ko, en, ja, zh };
function plain(value: unknown): string {
  if (typeof value === "string") return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
  if (Array.isArray(value)) return value.map(plain).filter(Boolean).join("\n");
  if (value && typeof value === "object") return Object.entries(value).filter(([key]) => !/image|photo|src|sourceName|cover|hero|updatedBy/i.test(key)).map(([key, item]) => `${key}: ${plain(item)}`).join("\n");
  return "";
}
function localized(value: Record<string, string>, locale: ChatLocale) { return value[locale] || value.ko || ""; }
function price(value: string, locale: ChatLocale) { const p = formatPrice(value, locale); return `${p.num}${p.unit}`; }
const categories = ["lifting", "anti-aging", "whitening", "acne", "skin-disease"];

/** These are the same authoritative records used by public detail pages, not a crawl of client HTML. */
export async function loadClinicChatKnowledge(locale: ChatLocale, message: string, pagePath: string | null, history: ChatHistory) {
  const settings = await getSettings();
  const docs: KnowledgeDocument[] = [{ id: "site:clinic", kind: "site", priority: 100, title: "Sunshine Clinic · Contact / Hours / Location / Booking", path: "/about", text: plain({ name: settings.clinicName, englishName: settings.clinicNameEn, phone: settings.phone, address: settings.address, directions: settings.addressSub, hours: settings.hoursJson, booking: settings.naverBookingHref, kakao: settings.kakaoHref }) }];
  const query = `${message} ${history.filter(item => item.role === "user").slice(-2).map(item => item.text).join(" ")} ${pagePath || ""}`;
  const [manuals, events] = await Promise.all([
    prisma.manualSection.findMany({ where: { published: true }, include: { translations: { where: { locale } } }, orderBy: [{ sortIndex: "asc" }, { createdAt: "asc" }], take: 100 }),
    prisma.event.findMany({ where: { published: true, AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] }] }, include: { translations: { where: { locale } } }, orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }], take: 30 }),
  ]);
  for (const manual of manuals) {
    const translation = manual.translations[0];
    const title = translation?.title || manual.title;
    const text = plain(translation?.body || manual.body).slice(0, 16000);
    // Internal Korean evidence may support translated replies; it is never returned as a public fallback page.
    for (let offset = 0; offset < text.length; offset += 1100) docs.push({ id: `manual:${manual.id}:${offset}`, kind: "manual", title, text: text.slice(offset, offset + 1300), priority: 40, sourceLocale: translation ? locale : "ko" });
  }
  const now = new Date();
  for (const event of events.filter(event => activePublished(event, now))) {
    const tr = event.translations[0];
    const title = locale === "ko" ? event.title : tr?.title || event.title;
    if (event.templateData) {
      const data = normalizeEventTemplateData(event.templateData, { background: event.bgColor, body: event.body });
      const terms = plain({ period: event.period, vat: localized(data.vatNote, locale), conditions: localized(data.closingCopy, locale) || (locale === "ko" ? event.body : tr?.body || event.body), description: locale === "ko" ? event.desc : tr?.desc || event.desc });
      for (const section of data.sections) for (const row of section.rows) docs.push({ id: `site:event:${event.slug}:${section.id}:${row.id}`, kind: "site", priority: 90, path: "/community/events", title: `${title} · ${localized(row.name, locale)}`, text: `${terms}\n${localized(section.description, locale)}\n${localized(row.name, locale)}: ${localized(row.description, locale)}\nOriginal: ${row.originalPrice ? price(row.originalPrice, locale) : "not specified"}\nOffer: ${row.eventPrice ? price(row.eventPrice, locale) : "not specified"}\n${section.columns.map((column, i) => `${localized(column, locale)}: ${row.prices?.[i] ? price(row.prices[i], locale) : "not specified"}`).join("\n")}` });
    } else docs.push({ id: `site:event:${event.slug}`, kind: "site", priority: 90, path: "/community/events", title, text: plain({ period: event.period, description: tr?.desc || event.desc, body: tr?.body || event.body }) });
  }
  const allDevices = getAllDeviceParams().flatMap(({ category, device }) => {
    const item = getDevice(locale, device);
    return item ? [{ id: `device:${device}`, kind: "site" as const, priority: 80, path: `/treatments/${category}/${device}`, title: `${item.name} ${device}`, text: plain({ name: item.name, intro: item.intro }) }] : [];
  });
  const candidates = retrieveKnowledge(allDevices, query, pagePath).slice(0, 3);
  for (const candidate of candidates) {
    const slug = candidate.id.slice(7);
    const detail = await getEditableDeviceContent(locale, slug);
    if (detail) docs.push({ ...candidate, id: `site:${candidate.id}`, text: plain({ name: detail.name, tagline: detail.tagline, introduction: detail.intro, principle: detail.howItWorks, description: detail.introBody, features: detail.features, procedure: detail.procedure, precautions: detail.precautions, faq: detail.faq }) });
  }
  if (pagePath?.startsWith("/treatments/") && pagePath.split("/").length === 4 && !allDevices.some(doc => doc.path === pagePath) && pagePath !== "/treatments/anti-aging/filler") pagePath = null;
  const content = messages[locale].v2;
  docs.push({ id: "site:prices", kind: "site", priority: 85, title: "Public fee schedule / 비급여 수가 / 料金 / 费用", path: "/community/prices", text: plain(content.prices) });
  for (const category of categories) docs.push({ id: `site:category:${category}`, kind: "site", priority: 70, title: `Clinic treatments ${category}`, path: `/treatments/${category}`, text: plain({ category, devices: allDevices.filter(doc => doc.path?.startsWith(`/treatments/${category}/`)).map(doc => doc.title) }) });
  for (const [i, notice] of content.notices.items.entries()) docs.push({ id: `site:notice:${i}`, kind: "site", priority: 50, title: plain(notice.title), path: "/community/notices", text: plain(notice) });
  // Journal is currently Korean-only. Explicitly select public JSON fields; never import original DOCX or writing/private data.
  if (locale === "ko" && (pagePath?.startsWith("/journal") || /블로그|원장.*글|journal|blog/i.test(message))) {
    const detailId = pagePath?.startsWith("/journal/") ? pagePath.slice("/journal/".length) : null;
    const posts = await prisma.siteContent.findMany({ where: { group: "clinic-blog", field: "post", locale: "ko", ...(detailId ? { slug: detailId } : {}) }, select: { value: true }, orderBy: { updatedAt: "desc" }, take: detailId ? 1 : 8 });
    let publicPage = pagePath === "/journal";
    for (const row of posts) try {
      if (row.value.length > 2_000_000) continue;
      const post = JSON.parse(row.value);
      if (post.published !== true || typeof post.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(post.id)) continue;
      const path = `/journal/${post.id}`;
      if (path === pagePath) publicPage = true;
      docs.push({ id: `site:journal:${post.id}`, kind: "site", priority: 60, title: plain(post.title), path, text: plain({ title: post.title, date: post.updatedAt, excerpt: post.excerpt, body: post.html }).slice(0, 5000) });
    } catch { /* Malformed drafts are not public knowledge. */ }
    if (!publicPage && pagePath?.startsWith("/journal")) pagePath = null;
  } else if (pagePath?.startsWith("/journal")) pagePath = null;
  return { documents: retrieveKnowledge(docs, query, pagePath), phone: settings.phone, pagePath };
}
