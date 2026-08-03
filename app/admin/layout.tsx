import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "관리자 — Sunshine",
  robots: { index: false, follow: false },
};

const nav = [
  { label: "대시보드", href: "/admin" },
  { label: "예약", href: "/admin/reservations" },
  { label: "방문 통계", href: "/admin/analytics" },
  { label: "이벤트", href: "/admin/events" },
  { label: "콘텐츠", href: "/admin/content" },
  { label: "챗봇 매뉴얼", href: "/admin/manual" },
  { label: "챗봇 대화", href: "/admin/chats" },
  { label: "설정", href: "/admin/settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  // login page renders without admin chrome (no session yet)
  if (!session?.user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight">SunShine</span>
              <span className="mt-0.5 text-[10px] font-medium tracking-[0.18em] text-ink-soft">
                ADMIN
              </span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 transition hover:bg-brand/15 hover:text-brand-dark"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-soft sm:inline">
              {session.user.name ?? session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
        {/* mobile nav row */}
        <nav className="flex gap-1 overflow-x-auto border-t border-line/60 px-5 py-2 sm:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">{children}</main>
    </div>
  );
}
