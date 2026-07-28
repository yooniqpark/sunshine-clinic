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
 * SIGNATURE SELECTION — 에디토리얼 인덱스 리스트
 * · 카드/캐러셀 없음. 일렬 리스트로 전체 장비 노출
 * · 좌측 넘버·카테고리 · 중앙 한글명·영문명·설명 · 우측 썸네일
 */
export function SignatureShowcase({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Heading row */}
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <div>
          <p className="text-[10px] font-medium tracking-[0.32em] text-brand-dark lg:text-[11px]">
            SIGNATURE SELECTION
          </p>
        </div>
        <p className="hidden items-center gap-3 text-[10px] font-medium tracking-[0.32em] text-ink/50 md:flex">
          TOTAL {String(items.length).padStart(2, "0")}
          <span aria-hidden className="block h-px w-16 bg-ink/30" />
        </p>
      </div>

      {/* List */}
      <ul className="border-t border-ink/15">
        {items.map((d, i) => (
          <li
            key={d.slug}
            className="group border-b border-ink/15"
          >
            <Link
              href={`/treatments/${d.category}/${d.slug}`}
              className="grid grid-cols-[36px_1fr_72px] items-center gap-4 py-5 transition-colors hover:bg-ink/[0.03] lg:grid-cols-[60px_1fr_1fr_88px] lg:gap-8 lg:py-7"
            >
              {/* Index */}
              <span className="font-serif text-sm italic text-ink/45 lg:text-base">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Name + english */}
              <div className="min-w-0">
                <p className="text-[9px] font-medium tracking-[0.28em] text-brand-dark lg:text-[10px]">
                  {d.categoryLabel}
                </p>
                <h3 className="mt-1.5 truncate font-serif text-xl font-normal tracking-tight text-ink lg:text-2xl">
                  {d.name}
                </h3>
                {d.english && (
                  <p className="mt-1 font-serif text-[11px] tracking-[0.16em] text-ink/45 lg:text-xs">
                    {d.english}
                  </p>
                )}
              </div>

              {/* Description (desktop only) */}
              <p className="hidden text-[13px] leading-[1.7] text-ink/60 lg:block">
                {d.description ?? d.tagline}
              </p>

              {/* Thumbnail */}
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#f5eee1]">
                {d.img && (
                  <Image
                    src={d.img}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 72px, 88px"
                    className="object-contain object-center p-1.5 transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
