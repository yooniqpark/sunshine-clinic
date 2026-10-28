/* ────────────────────────────────────────────────────────────
   병원별 고정 정보. 새 병원은 이 파일만 바꿔서 시작한다.
   - contact/business 는 관리자 "설정"의 기본값이다 (DB 값이 우선).
   - siteUrl 은 SITE_URL 환경변수가 있으면 그 값을 쓴다.
   ──────────────────────────────────────────────────────────── */

// next.config.ts 도 이 파일을 읽으므로 core 는 타입만 가져온다
import type { ClinicConfig } from "@yooniqpark/clinic-core/clinic";

export const clinicConfig = {
  slug: "sunshine",
  siteUrl: "https://mysunshineclinic.com",

  name: "선샤인 클리닉",
  nameEn: "SUNSHINE CLINIC",
  /** 브라우저 탭·OG siteName 등 영문 표기 */
  brand: "Sunshine Clinic",
  adminBrand: "SunShine",

  contact: {
    phone: "02-421-7588",
    kakaoHref: "https://pf.kakao.com/_xoVzwX",
    naverBookingHref: "https://m.booking.naver.com/booking/13/bizes/1698236?theme=place&lang=ko&area=pll",
    address: "서울특별시 송파구 올림픽로 102, 서일빌딩 10층",
    addressSub: "2호선 잠실새내역 4번 출구 도보 3분 · 건물 내 주차 가능",
    hours: [
      { day: "평일", time: "10:00 – 20:00" },
      { day: "토요일", time: "10:00 – 16:00" },
      { day: "일요일·공휴일", time: "휴진" },
    ],
    blogHref: "https://blog.naver.com/",
    instagramHref: "https://instagram.com/",
  },

  business: {
    owner: "대표원장 김병현",
    bizNo: "878-37-01499",
    license: "송파구보건소 신고 제 2026-3230034-00049 호",
  },

  /** 구조화 데이터(JSON-LD) · 지도 */
  location: {
    streetAddress: "올림픽로 102 서일빌딩 10층",
    locality: "송파구",
    region: "서울특별시",
    postalCode: "05540",
    country: "KR",
    lat: 37.5115,
    lng: 127.0821,
    mapQuery: "서울특별시 송파구 올림픽로 102 서일빌딩",
  },
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "20:00" },
    { days: ["Saturday"], opens: "10:00", closes: "16:00" },
  ],
  priceRange: "₩₩",
  jsonLdDescription: "선샤인 클리닉 · 리프팅 · 안티에이징 · 화이트닝 · 여드름 · 피부질환을 진료합니다.",
  specialties: [
    { name: "리프팅", en: "Skin Lifting" },
    { name: "안티에이징", en: "Anti-aging Treatment" },
    { name: "화이트닝 · 홍조", en: "Whitening & Redness" },
    { name: "여드름 · 흉터 · 모공", en: "Acne, Scar, Pore" },
    { name: "피부질환", en: "Skin Disease Treatment" },
  ],

  /** 첫 관리자 계정 (seed). 비밀번호는 ADMIN_PASSWORD 환경변수 */
  adminEmail: "admin@sunshine.local",

  chatbot: {
    /** 챗봇 페르소나 이름 · 병원 소개 한 줄 (영문 프롬프트에 들어감) */
    persona: "선샤인 실장",
    clinicIntro: "Sunshine Clinic, a dermatology clinic in Seoul",
  },

  translateRules: [
    "DO NOT translate device names: Ulthera, Thermage FLX, Shurink, InMode, Fotona StarWalker, Clarity, VBeam, Rejuran, Ellanse, Juvelook, Exosomes, HIFU, RF, PDL, SMAS, PDT.",
    '"Sunshine 피부과" → "Sunshine Clinic" (en) / "Sunshine 皮膚科" (ja) / "Sunshine 皮肤科" (zh).',
  ],

  integrations: {
    /** inblog 블로그 프록시. locale → inblog 서브도메인. 없으면 null */
    inblog: {
      ko: "sunshineclinic",
      en: "sunshineclinic-en",
      ja: "sunshineclinic-jp",
      zh: "sunshineclinic-cn",
    },
    /** Vegas CRM 예약 연동. 없으면 null */
    vegas: {
      endpoint: "https://h02036.vegas-solution.com/WebReservationServer",
      orgNo: "13328301",
    },
  },
} satisfies ClinicConfig;
