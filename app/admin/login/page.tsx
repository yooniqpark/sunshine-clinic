import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "관리자 로그인 — Sunshine" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-xl shadow-ink/5">
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight">SunShine</span>
          <span className="mt-1 text-[10px] font-medium tracking-[0.22em] text-ink-soft">
            ADMIN LOGIN
          </span>
        </div>
        <h1 className="mt-8 text-2xl font-bold">관리자 로그인</h1>
        <p className="mt-2 text-sm text-ink-soft">사이트 콘텐츠를 관리하려면 로그인하세요.</p>
        <LoginForm />
        <p className="mt-6 rounded-xl bg-sand/60 px-4 py-3 text-[11px] leading-relaxed text-ink-soft">
          개발 시드 계정: <strong>admin@sunshine.local</strong> /{" "}
          <strong>sunshine123</strong> · 운영 전 반드시 변경하세요.
        </p>
      </div>
    </main>
  );
}
