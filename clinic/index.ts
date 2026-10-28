/* core(@yooniqpark/clinic-core)가 "@clinic/app" 으로 읽는 선샤인의원 값 */
import { defineClinic, CORE_ADMIN_NAV } from "@yooniqpark/clinic-core/clinic";
import { createVegasReservationAdapter } from "@yooniqpark/clinic-core/adapters/vegas";
import type { ContentCollection } from "@yooniqpark/clinic-core/content-types";
import { clinicConfig } from "@/clinic.config";
import { routing } from "@/i18n/routing";
import { getDevicesByCategory } from "@/lib/devices";
import { getSiteContent, type Locale } from "@/lib/site-content";

// 선샤인 전용 관리자 메뉴: 공통 메뉴에 글쓰기만 추가
const nav = [...CORE_ADMIN_NAV];
nav.splice(nav.findIndex((n) => n.href === "/admin/settings"), 0, { label: "글쓰기", href: "/admin/writing" });

const contentCollections: ContentCollection[] = [
  {
    key: "device",
    label: "장비",
    description: "장비 소개·특징·추천 대상",
    displayFields: ["name", "label"],
    fields: [
      { key: "name", label: "장비명" },
      { key: "tagline", label: "한 줄 소개", shape: "longString" },
      { key: "intro", label: "소개", shape: "longString" },
      { key: "features", label: "특징", shape: "objectArray", properties: [{ key: "title", label: "제목" }, { key: "body", label: "설명", long: true }] },
      { key: "recommendedFor", label: "추천 대상", shape: "stringArray" },
      { key: "faq", label: "FAQ", shape: "objectArray", properties: [{ key: "q", label: "질문" }, { key: "a", label: "답변", long: true }] },
    ],
  },
  {
    key: "concern",
    label: "고민",
    description: "피부 고민별 설명과 추천 정보",
    displayFields: ["name", "label"],
  },
  {
    key: "category",
    label: "카테고리",
    description: "시술 카테고리 소개",
    displayFields: ["name", "label"],
  },
  {
    key: "chatbot",
    label: "챗봇",
    description: "인사말·안내문·입력 문구",
    displayFields: ["greeting", "name"],
  },
];

export default defineClinic({
  config: clinicConfig,
  features: {
    analytics: true,
    content: true,
    reservations: true,
    events: true,
    chatbot: true,
    translation: true,
  },
  analytics: {
    enabled: true,
    endpoint: "/api/pv",
    timeZone: "Asia/Seoul",
    locales: routing.locales,
    pathClassification: { treatmentSegment: "treatments" },
  },
  translation: {
    sourceLocale: "ko",
    targets: [
      { locale: "en", label: "English (US)" },
      { locale: "ja", label: "Japanese (日本語, です/ます体)" },
      { locale: "zh", label: "Simplified Chinese (简体中文, 您 tone)" },
    ],
    model: "gpt-4o-mini",
    fallbackPolicy: "empty",
  },
  adapters: clinicConfig.integrations.vegas
    ? { reservation: createVegasReservationAdapter(clinicConfig.integrations.vegas) }
    : undefined,
  content: { collections: contentCollections },
  routing,
  categories: [
    { slug: "lifting", label: "리프팅" },
    { slug: "whitening", label: "화이트닝" },
    { slug: "acne", label: "여드름·모공" },
    { slug: "anti-aging", label: "안티에이징" },
  ],
  devicesByCategory: (locale, category) => getDevicesByCategory(locale as Locale, category),
  periodAlways: (locale) => getSiteContent(locale as Locale).common.always,
  adminNav: nav,
});
