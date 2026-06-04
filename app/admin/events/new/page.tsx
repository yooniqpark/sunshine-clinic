import Link from "next/link";
import { EventForm } from "../EventForm";
import { createEvent } from "../actions";

export default function NewEventPage() {
  return (
    <>
      <header className="border-b border-line pb-6">
        <nav className="flex items-center gap-2 text-xs text-ink-soft">
          <Link href="/admin/events" className="hover:text-brand">
            이벤트
          </Link>
          <span>/</span>
          <span className="text-ink">새 이벤트</span>
        </nav>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">새 이벤트</h1>
      </header>

      <div className="mt-8">
        <EventForm action={createEvent} defaults={{}} submitLabel="만들기" />
      </div>
    </>
  );
}
