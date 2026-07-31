import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/seo";

const OPENING_HOURS_SPEC = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:00",
    closes: "20:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "10:00",
    closes: "16:00",
  },
];

const MEDICAL_SPECIALTIES = [
  { name: "리프팅", eng: "Skin Lifting" },
  { name: "안티에이징", eng: "Anti-aging Treatment" },
  { name: "화이트닝 · 홍조", eng: "Whitening & Redness" },
  { name: "여드름 · 흉터 · 모공", eng: "Acne, Scar, Pore" },
  { name: "피부질환", eng: "Skin Disease Treatment" },
];

export async function ClinicJsonLd({ locale }: { locale: string }) {
  const s = await getSettings();
  const url = `${SITE_URL}${locale === "ko" ? "" : `/${locale}`}`;

  const data = {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": `${SITE_URL}/#clinic`,
    name: s.clinicName,
    alternateName: s.clinicNameEn,
    url,
    telephone: s.phone,
    description:
      "선샤인 클리닉 · 리프팅 · 안티에이징 · 화이트닝 · 여드름 · 피부질환을 진료합니다.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "올림픽로 102 서일빌딩 10층",
      addressLocality: "송파구",
      addressRegion: "서울특별시",
      postalCode: "05540",
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.5115,
      longitude: 127.0821,
    },
    openingHoursSpecification: OPENING_HOURS_SPEC,
    availableService: MEDICAL_SPECIALTIES.map((m) => ({
      "@type": "MedicalTherapy",
      name: m.name,
      alternateName: m.eng,
    })),
    sameAs: [s.blogHref, s.instagramHref, s.naverBookingHref].filter(
      (u) => u && !u.endsWith("/")
    ),
    inLanguage: ["ko", "en", "ja", "zh"],
    priceRange: "₩₩",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type Device = {
  slug: string;
  name: string;
  manufacturer: string;
  tagline: string;
  intro: string;
};

type ConcernFaq = { q: string; a: string };
type Concern = { slug: string; name: string; faq: ConcernFaq[] };

export function MedicalProceduresJsonLd({
  category,
  categoryLabel,
  devices,
}: {
  category: string;
  categoryLabel: string;
  devices: Device[];
}) {
  if (devices.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryLabel} 시술 장비`,
    itemListElement: devices.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalProcedure",
        "@id": `${SITE_URL}/treatments/${category}#device-${d.slug}`,
        name: d.name,
        alternateName: d.manufacturer,
        description: d.tagline,
        procedureType: "PercutaneousProcedure",
        howPerformed: d.intro,
        bodyLocation: "Skin",
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqPageJsonLd({
  concerns,
  items,
}: {
  concerns?: Concern[];
  items?: ConcernFaq[];
}) {
  const pairs = (items ?? concerns?.flatMap((c) => c.faq ?? []) ?? []).slice(0, 12);
  if (pairs.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function MedicalProcedureJsonLd({
  url,
  name,
  alternateName,
  description,
  howPerformed,
}: {
  url: string;
  name: string;
  alternateName?: string;
  description: string;
  howPerformed?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": url,
    url,
    name,
    ...(alternateName ? { alternateName } : {}),
    description,
    ...(howPerformed ? { howPerformed } : {}),
    procedureType: "PercutaneousProcedure",
    bodyLocation: "Skin",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "선샤인 클리닉",
    inLanguage: ["ko", "en", "ja", "zh"],
    publisher: { "@id": `${SITE_URL}/#clinic` },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
