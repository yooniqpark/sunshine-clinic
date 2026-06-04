import Link from "next/link";
import { ArrowIcon, SparkleIcon } from "./icons";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center lg:py-32">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-brand-dark">
        <SparkleIcon className="h-3.5 w-3.5" />
        {eyebrow}
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{description}</p>
      <p className="mt-2 text-sm text-ink-soft/70">
        프로토타입 단계로, 이 페이지는 콘텐츠 확정 후 제작 예정입니다.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition hover:bg-brand-dark"
      >
        홈으로 돌아가기 <ArrowIcon className="h-4 w-4" />
      </Link>
    </section>
  );
}
