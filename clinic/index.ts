/* core(@yooniqpark/clinic-core)가 "@clinic/app" 으로 읽는 선샤인의원 값 */
import { defineClinic, CORE_ADMIN_NAV } from "@yooniqpark/clinic-core/clinic";
import { createVegasReservationAdapter } from "@yooniqpark/clinic-core/adapters/vegas";
import type { ContentCollection } from "@yooniqpark/clinic-core/content-types";
import { clinicConfig } from "@/clinic.config";
import { routing } from "@/i18n/routing";
import { getDevicesByCategory } from "@/lib/devices";
import { getSiteContent, type Locale } from "@/lib/site-content";
import { contentImageAdapter } from "@/lib/content-image-storage";

const contentCollections: ContentCollection[] = [
  {
    key: "device",
    label: "시술·장비",
    description: "시술 상세 페이지의 문구·정보·이미지 경로를 언어별로 관리합니다.",
    displayFields: ["name", "label"],
    fields: [
      { key: "name", label: "장비명" },
      { key: "tagline", label: "한 줄 소개", shape: "longString" },
      { key: "intro", label: "소개", shape: "longString" },
      { key: "introBody", label: "상세 소개", shape: "longString" },
      { key: "manufacturer", label: "제조사" },
      { key: "model", label: "모델명", description: "확실한 모델 정보가 있을 때만 입력합니다." },
      { key: "tech", label: "기술 태그", shape: "stringArray" },
      { key: "highlightStat", label: "강조 정보", shape: "object", properties: [{ key: "value", label: "값" }, { key: "label", label: "설명" }] },
      { key: "features", label: "특징", shape: "objectArray", properties: [{ key: "title", label: "제목" }, { key: "body", label: "설명", long: true }] },
      { key: "howItWorks", label: "원리와 접근", shape: "longString" },
      { key: "recommendedFor", label: "추천 대상", shape: "stringArray" },
      { key: "procedure", label: "시술 정보", shape: "object", properties: [
        { key: "duration", label: "소요 시간" },
        { key: "anesthesia", label: "마취 방식" },
        { key: "downtime", label: "회복 기간" },
        { key: "recommendedSessions", label: "권장 횟수" },
      ] },
      { key: "process", label: "진행 과정", shape: "objectArray", properties: [
        { key: "step", label: "단계" },
        { key: "title", label: "제목" },
        { key: "body", label: "설명", long: true },
      ] },
      { key: "precautions", label: "주의사항", shape: "stringArray" },
      { key: "faq", label: "FAQ", shape: "objectArray", properties: [{ key: "q", label: "질문" }, { key: "a", label: "답변", long: true }] },
      { key: "relatedDeviceSlugs", label: "연관 시술 slug", description: "예: thermage-flx. 비워두면 같은 카테고리에서 자동 선택합니다.", shape: "stringArray" },
      { key: "certifications", label: "인증 정보", description: "출처가 확인된 내용만 입력합니다.", shape: "objectArray", properties: [
        { key: "name", label: "인증명" },
        { key: "issuer", label: "발급 기관" },
        { key: "reference", label: "참조 번호·URL" },
      ] },
      { key: "heroImage", label: "히어로 이미지", description: "기존 화면의 데스크톱 히어로 이미지입니다.", shape: "image", image: { recommendedWidth: 1872, recommendedHeight: 691 } },
      { key: "heroImageMobile", label: "모바일 히어로 이미지", description: "비우면 데스크톱 이미지를 사용합니다.", shape: "image", image: { recommendedWidth: 1080, recommendedHeight: 1620 } },
      { key: "detailImage", label: "상세 이미지", shape: "image", image: { recommendedWidth: 1600, recommendedHeight: 1000 } },
      { key: "detailImageMobile", label: "모바일 상세 이미지", description: "비우면 데스크톱 이미지를 사용합니다.", shape: "image", image: { recommendedWidth: 1080, recommendedHeight: 1350 } },
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
  adapters: {
    ...(clinicConfig.integrations.vegas
      ? { reservation: createVegasReservationAdapter(clinicConfig.integrations.vegas) }
      : {}),
    contentImage: contentImageAdapter,
  },
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
  adminNav: CORE_ADMIN_NAV,
});
