import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

const pages: Record<string, { title: string; desc: string }> = {
  notices: {
    title: "공지사항",
    desc: "휴진 안내 등 병원 소식을 안내해 드립니다.",
  },
  prices: {
    title: "비급여 진료비용 안내",
    desc: "관련 법령에 따라 비급여 진료 항목과 비용을 투명하게 게시합니다.",
  },
};

function resolve(section: string) {
  return pages[section] ?? pages.notices;
}

type Params = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  return { title: resolve(section).title };
}

export default async function CommunitySectionPage({ params }: Params) {
  const { section } = await params;
  const page = resolve(section);
  return <PagePlaceholder eyebrow="COMMUNITY" title={page.title} description={page.desc} />;
}
