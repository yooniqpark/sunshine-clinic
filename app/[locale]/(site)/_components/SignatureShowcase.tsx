import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Item = {
  slug: string;
  name: string;
  tagline: string;
  img: string;
  category: string;
  categoryLabel: string;
  english?: string;
  statement?: [string, string];
  description?: string;
  meta?: string;
};

/**
 * SIGNATURE SELECTION — 카드 일렬 리스트 (가로 스크롤 스트립)
 * · 모든 제품 카드가 일렬로 나열, 좌우 스크롤로 탐색
 * · 각 카드: 정사각 이미지 + 카테고리 · 이름 · 영문
 */
export function SignatureShowcase({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Heading row */}
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark lg:text-[11px]">
          SIGNATURE SELECTION
        </p>
        <p className="hidden items-center gap-3 text-[10px] font-medium tracking-[0.32em] text-ink/50 md:flex">
          SCROLL →
          <span aria-hidden className="block h-px w-16 bg-ink/30" />
        </p>
      </div>

      {/* Horizontal card strip */}
      <div className="-mx-5 overflow-x-auto pb-4 lg:-mx-8">
        <ul className="flex gap-4 px-5 lg:gap-6 lg:px-8">
          {items.map((d, i) => (
            <li key={d.slug} className="shrink-0">
              <Link
                href={`/treatments/${d.category}/${d.slug}`}
                className="group block w-[220px] lg:w-[260px]"
              >
                {/* Image tile */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-ink/10 bg-[#f5eee1] transition-all duration-500 group-hover:border-brand-dark group-hover:shadow-lg group-hover:shadow-ink/10">
                  {d.img && (
                    <Image
                      src={d.img}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 220px, 260px"
                      className="object-contain object-center p-6 transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute left-4 top-4 font-serif text-[11px] italic text-ink/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Caption */}
                <div className="mt-4">
                  <p className="text-[9px] font-medium tracking-[0.28em] text-brand-dark lg:text-[10px]">
                    {d.categoryLabel}
                  </p>
                  <h3 className="mt-1.5 font-serif text-lg font-normal tracking-tight text-ink transition-colors group-hover:text-brand-dark lg:text-xl">
                    {d.name}
                  </h3>
                  {d.english && (
                    <p className="mt-1 font-serif text-[10px] tracking-[0.16em] text-ink/45 lg:text-[11px]">
                      {d.english}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
