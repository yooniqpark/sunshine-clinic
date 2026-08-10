// Grand Open Event pricing (2026.07.13 – 2026.08.30) · VAT 별도
// 4 categories with different table shapes.

export const GRAND_OPEN_META = {
  eyebrow: "선샤인의원 오픈 이벤트",
  title: "GRAND OPEN Event",
  period: "2026.07.13 – 2026.08.30",
  vatNote: "*VAT 별도",
  soldOutNote: "*소진 시 조기 마감 될 수 있습니다.",
};

// LIFTING — grouped by package header, each row = name + price
export type LiftingGroup = {
  heading: string;
  rows: { name: string; price: string }[];
};

// WHITENING & ACNE — subgroup label + rows with regular / event price
export type PkgRow = { name: string; desc?: string; original?: string; event: string };
export type PkgGroup = { label: string; rows: PkgRow[] };

// SKINBOOSTER — simple 2-price rows
export type SimpleDiscountRow = { name: string; original: string; event: string };

// BOTOX — matrix (3 columns × N rows)
export type BotoxRow = { name: string; prices: [string, string, string] };

export type GrandOpenCategory =
  | { slug: "lifting"; name: string; groups: LiftingGroup[]; note?: string }
  | { slug: "whitening-acne"; name: string; groups: PkgGroup[] }
  | { slug: "skinbooster"; name: string; headers: [string, string]; rows: SimpleDiscountRow[] }
  | {
      slug: "botox";
      name: string;
      columns: [string, string, string];
      rows: BotoxRow[];
    };

export const GRAND_OPEN_CATEGORIES: GrandOpenCategory[] = [
  {
    slug: "lifting",
    name: "리프팅",
    note: GRAND_OPEN_META.soldOutNote,
    groups: [
      {
        heading: "울쎄라피프라임 + 커스텀 스킨보톡스 (얼굴 전체) 포함",
        rows: [
          { name: "울쎄라피프라임 300샷", price: "100만원" },
          { name: "울쎄라피프라임 400샷", price: "140만원" },
        ],
      },
      {
        heading: "써마지 + 커스텀 스킨보톡스 (얼굴 전체) 포함",
        rows: [
          { name: "써마지FLX 300샷", price: "110만원" },
          { name: "써마지FLX 600샷", price: "190만원" },
        ],
      },
      {
        heading: "울써마지 + 리쥬란HB 2cc + 아이리쥬란 1cc 서비스",
        rows: [
          { name: "울쎄라 300샷 + 써마지 600샷", price: "290만원" },
          { name: "울쎄라 600샷 + 써마지 300샷", price: "310만원" },
          { name: "울쎄라 600샷 + 써마지 600샷", price: "390만원" },
        ],
      },
    ],
  },
  {
    slug: "whitening-acne",
    name: "화이트닝 & 여드름",
    groups: [
      {
        label: "화이트닝",
        rows: [
          {
            name: "토닝레이저 10회",
            desc: "토닝레이저 + 비타민 미백 및 수분 케어 10회",
            original: "150만원",
            event: "130만원",
          },
          {
            name: "트리플 패키지 10회",
            desc: "레이저 3가지 + 맞춤 케어 10회",
            original: "250만원",
            event: "200만원",
          },
        ],
      },
      {
        label: "여드름",
        rows: [
          {
            name: "여드름 올인원 패키지",
            desc: "레이저 3가지 + 여드름 스케일링 케어 10회 포함",
            original: "220만원",
            event: "180만원",
          },
        ],
      },
    ],
  },
  {
    slug: "skinbooster",
    name: "스킨부스터",
    headers: ["정가", "이벤트가"],
    rows: [
      { name: "리쥬란 HB 2cc", original: "40만원", event: "20만원" },
      { name: "리쥬란힐러 2cc", original: "25만원", event: "13만원" },
      { name: "아이리쥬란 1cc", original: "20만원", event: "10만원" },
      { name: "엘라비에리투오 1병", original: "70만원", event: "50만원" },
      { name: "셀르디엠 1병", original: "60만원", event: "45만원" },
    ],
  },
  {
    slug: "botox",
    name: "보톡스",
    columns: ["국산 프리미엄", "외산 제오민", "오리지널 앨러간"],
    rows: [
      { name: "주름 1부위", prices: ["2만원", "6만원", "20만원"] },
      { name: "주름 3부위", prices: ["4만원", "15만원", "55만원"] },
      { name: "턱 / 측두근 / 침샘", prices: ["5만원", "13만원", "50만원"] },
      { name: "승모근 / 종아리", prices: ["20만원", "30만원", "60만원"] },
      { name: "커스텀 스킨보톡스\n(얼굴 전체)", prices: ["20만원", "30만원", "60만원"] },
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   로케일 대응 — 한국어 외 로케일은 영문 데이터로 표시.
   가격은 "n만원" → "₩n0,000" 형식으로 변환.
   ──────────────────────────────────────────────────────────── */

const GRAND_OPEN_META_EN = {
  eyebrow: "Sunshine Clinic Grand Open Event",
  title: "GRAND OPEN Event",
  period: GRAND_OPEN_META.period,
  vatNote: "*VAT excluded",
  soldOutNote: "*May close early once sold out.",
};

function priceEn(p: string): string {
  const n = parseFloat(p.replace("만원", ""));
  if (Number.isNaN(n)) return p;
  return "₩" + (n * 10000).toLocaleString("en-US");
}

const GRAND_OPEN_CATEGORIES_EN: GrandOpenCategory[] = [
  {
    slug: "lifting",
    name: "Lifting",
    note: GRAND_OPEN_META_EN.soldOutNote,
    groups: [
      {
        heading: "Ulthera Prime + Custom skin botox (full face) included",
        rows: [
          { name: "Ulthera Prime 300 shots", price: priceEn("100만원") },
          { name: "Ulthera Prime 400 shots", price: priceEn("140만원") },
        ],
      },
      {
        heading: "Thermage + Custom skin botox (full face) included",
        rows: [
          { name: "Thermage FLX 300 shots", price: priceEn("110만원") },
          { name: "Thermage FLX 600 shots", price: priceEn("190만원") },
        ],
      },
      {
        heading: "Ul-Thermage + Rejuran HB 2cc + Eye Rejuran 1cc free",
        rows: [
          { name: "Ulthera 300 + Thermage 600 shots", price: priceEn("290만원") },
          { name: "Ulthera 600 + Thermage 300 shots", price: priceEn("310만원") },
          { name: "Ulthera 600 + Thermage 600 shots", price: priceEn("390만원") },
        ],
      },
    ],
  },
  {
    slug: "whitening-acne",
    name: "Whitening & Acne",
    groups: [
      {
        label: "Whitening",
        rows: [
          {
            name: "Toning laser ×10",
            desc: "Toning laser + vitamin brightening & hydration care ×10",
            original: priceEn("150만원"),
            event: priceEn("130만원"),
          },
          {
            name: "Triple package ×10",
            desc: "3 lasers + personalized care ×10",
            original: priceEn("250만원"),
            event: priceEn("200만원"),
          },
        ],
      },
      {
        label: "Acne",
        rows: [
          {
            name: "Acne all-in-one package",
            desc: "3 lasers + acne scaling care ×10 included",
            original: priceEn("220만원"),
            event: priceEn("180만원"),
          },
        ],
      },
    ],
  },
  {
    slug: "skinbooster",
    name: "Skin Booster",
    headers: ["Regular", "Event"],
    rows: [
      { name: "Rejuran HB 2cc", original: priceEn("40만원"), event: priceEn("20만원") },
      { name: "Rejuran Healer 2cc", original: priceEn("25만원"), event: priceEn("13만원") },
      { name: "Eye Rejuran 1cc", original: priceEn("20만원"), event: priceEn("10만원") },
      { name: "Elravie Re:tuo 1 vial", original: priceEn("70만원"), event: priceEn("50만원") },
      { name: "CellReDM 1 vial", original: priceEn("60만원"), event: priceEn("45만원") },
    ],
  },
  {
    slug: "botox",
    name: "Botox",
    columns: ["Korean premium", "Imported Xeomin", "Original Allergan"],
    rows: [
      { name: "Wrinkles · 1 area", prices: [priceEn("2만원"), priceEn("6만원"), priceEn("20만원")] as [string, string, string] },
      { name: "Wrinkles · 3 areas", prices: [priceEn("4만원"), priceEn("15만원"), priceEn("55만원")] as [string, string, string] },
      { name: "Jaw / Temporalis / Salivary", prices: [priceEn("5만원"), priceEn("13만원"), priceEn("50만원")] as [string, string, string] },
      { name: "Trapezius / Calves", prices: [priceEn("20만원"), priceEn("30만원"), priceEn("60만원")] as [string, string, string] },
      { name: "Custom skin botox\n(full face)", prices: [priceEn("20만원"), priceEn("30만원"), priceEn("60만원")] as [string, string, string] },
    ],
  },
];

export function getGrandOpenMeta(locale: string) {
  return locale === "ko" ? GRAND_OPEN_META : GRAND_OPEN_META_EN;
}

export function getGrandOpenCategories(locale: string): GrandOpenCategory[] {
  return locale === "ko" ? GRAND_OPEN_CATEGORIES : GRAND_OPEN_CATEGORIES_EN;
}
