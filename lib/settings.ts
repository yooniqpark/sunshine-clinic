import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

/* ────────────────────────────────────────────────────────────
   Runtime-editable settings. Stored as key/value rows in DB
   (Setting model). All consumers go through getSettings() so
   defaults below act as fallbacks until admin overrides them.
   ──────────────────────────────────────────────────────────── */

export type SiteSettings = {
  // Branding / clinic
  clinicName: string;
  clinicNameEn: string;
  // Contact
  phone: string;
  phoneHref: string;
  kakaoHref: string;
  naverBookingHref: string;
  // Map
  address: string;
  addressSub: string;
  // Business info
  bizOwner: string;
  bizNo: string;
  license: string;
  // Hours (4 weekday/sat/lunch/holiday lines as JSON)
  hoursJson: string;
  // External social
  blogHref: string;
  instagramHref: string;
  // OpenAI budget (USD/month, 0 = unlimited)
  monthlyTokenBudgetUsd: number;
};

export const SETTINGS_DEFAULTS: SiteSettings = {
  clinicName: "Sunshine 피부과",
  clinicNameEn: "SUNSHINE DERMATOLOGY",
  phone: "02-421-7588",
  phoneHref: "tel:024217588",
  kakaoHref: "https://pf.kakao.com/_xoVzwX",
  naverBookingHref: "https://m.booking.naver.com/booking/13/bizes/1698236?theme=place&lang=ko&area=pll",
  address: "서울특별시 송파구 올림픽로 102, 서일빌딩 10층",
  addressSub: "2호선 잠실새내역 4번 출구 도보 3분 · 건물 내 주차 가능",
  bizOwner: "대표원장 김병현",
  bizNo: "878-37-01499",
  license: "송파구보건소 신고 제 2026-3230034-00049 호",
  hoursJson: JSON.stringify([
    { day: "평일", time: "10:00 – 20:00" },
    { day: "토요일", time: "10:00 – 16:00" },
    { day: "일요일·공휴일", time: "휴진" },
  ]),
  blogHref: "https://blog.naver.com/",
  instagramHref: "https://instagram.com/",
  monthlyTokenBudgetUsd: 0,
};

export const SETTINGS_LABELS: Record<keyof SiteSettings, string> = {
  clinicName: "병원명 (한글)",
  clinicNameEn: "병원명 (영문)",
  phone: "전화번호 (표시용)",
  phoneHref: "전화 링크 (tel:)",
  kakaoHref: "카카오톡 채널 URL",
  naverBookingHref: "네이버 예약 URL",
  address: "주소",
  addressSub: "주소 부가설명",
  bizOwner: "대표자",
  bizNo: "사업자등록번호",
  license: "의료기관 개설신고번호",
  hoursJson: "진료시간 (JSON)",
  blogHref: "블로그 URL",
  instagramHref: "인스타그램 URL",
  monthlyTokenBudgetUsd: "OpenAI 월 예산 (USD, 0=무제한)",
};

export const SETTINGS_GROUPS: { label: string; keys: (keyof SiteSettings)[] }[] = [
  {
    label: "병원 정보",
    keys: ["clinicName", "clinicNameEn", "bizOwner", "bizNo", "license"],
  },
  {
    label: "연락 채널",
    keys: ["phone", "phoneHref", "kakaoHref", "naverBookingHref"],
  },
  {
    label: "위치 · 진료시간",
    keys: ["address", "addressSub", "hoursJson"],
  },
  {
    label: "소셜",
    keys: ["blogHref", "instagramHref"],
  },
  {
    label: "비용 · 운영",
    keys: ["monthlyTokenBudgetUsd"],
  },
];

async function loadAll(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  const result = { ...SETTINGS_DEFAULTS } as SiteSettings;
  for (const k of Object.keys(SETTINGS_DEFAULTS) as (keyof SiteSettings)[]) {
    if (map[k] === undefined) continue;
    const v = map[k];
    if (k === "monthlyTokenBudgetUsd") {
      const n = Number(v);
      result[k] = Number.isFinite(n) ? n : SETTINGS_DEFAULTS[k];
    } else {
      // string fields
      (result as Record<string, string | number>)[k] = v;
    }
  }
  return result;
}

// short cache so back-to-back hits within a render share a single DB query
export const getSettings = unstable_cache(
  loadAll,
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);

export async function updateSettings(
  patch: Partial<SiteSettings>,
  userId?: string
) {
  const ops = Object.entries(patch).map(([k, v]) =>
    prisma.setting.upsert({
      where: { key: k },
      update: { value: String(v), updatedBy: userId ?? null },
      create: { key: k, value: String(v), updatedBy: userId ?? null },
    })
  );
  await prisma.$transaction(ops);
}

/** Convenience: derived 'clinic' object similar to old lib/data.ts shape */
export async function getClinic() {
  const s = await getSettings();
  let hours: { day: string; time: string }[] = [];
  try {
    hours = JSON.parse(s.hoursJson);
  } catch {
    hours = JSON.parse(SETTINGS_DEFAULTS.hoursJson);
  }
  return {
    name: s.clinicName,
    nameEn: s.clinicNameEn,
    phone: s.phone,
    phoneHref: s.phoneHref,
    kakaoHref: s.kakaoHref,
    naverBookingHref: s.naverBookingHref,
    address: s.address,
    addressSub: s.addressSub,
    hours,
    business: {
      owner: s.bizOwner,
      bizNo: s.bizNo,
      license: s.license,
    },
    social: {
      blog: s.blogHref,
      instagram: s.instagramHref,
      kakao: s.kakaoHref,
      naver: s.naverBookingHref,
    },
  };
}
