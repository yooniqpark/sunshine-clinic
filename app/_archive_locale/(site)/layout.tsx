import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { NoticePopup } from "@/components/NoticePopup";
import { Analytics } from "@yooniqpark/clinic-core/components/Analytics";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
      <NoticePopup />
      <Analytics />
    </>
  );
}
