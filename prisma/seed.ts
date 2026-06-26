/**
 * Initial seed:
 *  - one ADMIN user (login: admin@sunshine.local / sunshine123 — change after first login)
 *  - 3 sample events (mirrors the previous lib/data.ts hardcoded list so site looks the same)
 *
 * Run with: npx tsx prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@sunshine.local";
const ADMIN_PASSWORD = "sunshine123";

const sampleEvents = [
  {
    slug: "may-lifting-package",
    tag: "SIGNATURE PACKAGE",
    title: "5월 리프팅 패키지",
    period: "~ 2026.05.31",
    desc: "울쎄라 + 써마지를 함께, 탄력의 깊이를 더하는 한정 프로그램",
    body: [
      "처짐과 주름이 신경 쓰이는 분들을 위해, 대표 리프팅 장비인 울쎄라와 써마지를 함께 받는 5월 한정 패키지를 준비했습니다.",
      "초음파(울쎄라)로 깊은 층을, 고주파(써마지)로 표층 탄력을 동시에 케어해 더 자연스럽고 탄탄한 결과를 기대할 수 있습니다.",
      "시술 전 피부과 의료진의 상담을 통해 부위와 샷 수를 맞춤 설계해 드립니다.",
    ].join("\n\n"),
    bgColor: "#dfe4ed",
    photoUrl: "",
    imageUrl: "/events/event-1.svg",
    published: true,
    sortIndex: 1,
  },
  {
    slug: "first-visit-diagnosis",
    tag: "FIRST VISIT",
    title: "첫 방문 피부 진단",
    period: "상시 진행",
    desc: "1:1로 분석하고 맞춤 플랜을 제안해 드립니다",
    body: [
      "처음 방문하시는 분들을 위한 1:1 피부 진단 프로그램입니다.",
      "피부 상태와 생활 습관을 함께 살펴보고, 지금 꼭 필요한 시술과 홈케어 방향을 우선순위로 정리해 드립니다.",
      "유행하는 시술이 아니라, 내 피부에 맞는 시술부터 시작하세요.",
    ].join("\n\n"),
    bgColor: "#ede7e2",
    photoUrl: "",
    imageUrl: "/events/event-2.svg",
    published: true,
    sortIndex: 2,
  },
  {
    slug: "brightening-care",
    tag: "BRIGHTENING CARE",
    title: "색소 집중 케어",
    period: "~ 2026.06.15",
    desc: "포토나 스타워커 토닝으로 맑고 균일한 톤을 되찾는 시간",
    body: [
      "기미·잡티로 칙칙해진 피부톤을 위한 색소 집중 케어 프로그램입니다.",
      "포토나 스타워커 토닝으로 색소를 단계적으로 분해하고, 피부 장벽을 함께 관리해 재발을 줄이는 데 초점을 둡니다.",
      "색소의 종류와 깊이에 따라 회차와 강도를 조절하는 맞춤 프로그램으로 진행됩니다.",
    ].join("\n\n"),
    bgColor: "#a9bed2",
    photoUrl: "",
    imageUrl: "/events/event-3.svg",
    published: true,
    sortIndex: 3,
  },
];

async function main() {
  // admin
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, role: "ADMIN", name: "관리자" },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: "관리자",
      role: "ADMIN",
    },
  });
  console.log(`✓ admin ready: ${admin.email}`);

  // events
  for (const e of sampleEvents) {
    const saved = await prisma.event.upsert({
      where: { slug: e.slug },
      update: { ...e, authorId: admin.id },
      create: { ...e, authorId: admin.id },
    });
    console.log(`✓ event: ${saved.slug}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
