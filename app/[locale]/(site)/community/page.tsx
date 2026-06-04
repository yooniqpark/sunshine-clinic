import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "커뮤니티" };

export default function CommunityIndexPage() {
  return (
    <PagePlaceholder
      eyebrow="COMMUNITY"
      title="커뮤니티"
      description="이벤트와 공지사항, 비급여 진료비용을 확인하실 수 있습니다."
    />
  );
}
