import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { NoticePopup } from "@/components/NoticePopup";
import { Analytics } from "@/components/Analytics";
import { getClinic } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clinic = await getClinic();
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget
        kakaoHref={clinic.kakaoHref}
        naverBookingHref={clinic.naverBookingHref}
        phoneHref={clinic.phoneHref}
        phone={clinic.phone}
      />
      <NoticePopup />
      <Analytics />
    </>
  );
}
