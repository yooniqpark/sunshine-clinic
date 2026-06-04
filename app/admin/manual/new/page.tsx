import Link from "next/link";
import { ManualForm } from "../ManualForm";
import { createSection } from "../actions";

export default function NewManualSectionPage() {
  return (
    <>
      <header className="border-b border-line pb-6">
        <nav className="flex items-center gap-2 text-xs text-ink-soft">
          <Link href="/admin/manual" className="hover:text-brand">
            매뉴얼
          </Link>
          <span>/</span>
          <span className="text-ink">새 섹션</span>
        </nav>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">새 섹션</h1>
      </header>

      <div className="mt-8">
        <ManualForm action={createSection} defaults={{ published: true }} submitLabel="만들기" />
      </div>
    </>
  );
}
