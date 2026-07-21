import Link from "next/link";
import Image from "next/image";

export function PreviewFooter() {
  return (
    <footer className="border-t border-cream/10 bg-ink text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 lg:px-8 lg:py-20">
        {/* Brand col */}
        <div className="md:col-span-2">
          <Link href="/preview" className="flex items-center gap-3">
            <Image
              src="/logo-mark.svg"
              alt=""
              width={48}
              height={48}
              className="h-11 w-11 object-contain brightness-125"
            />
            <div className="leading-none">
              <p className="font-serif text-lg text-cream">선샤인의원</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-cream/50">
                Sunshine Dermatology Clinic
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/60">
            환자 한 분 한 분에게 맞춘 섬세하고 정직한 진료.
            풍부한 임상 경험과 프리미엄 하이엔드 장비로 편안하게 수준 높은 의료 서비스를 제공합니다.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.24em] text-brand-soft">MENU</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li><Link href="/preview/about" className="hover:text-cream">병원 소개</Link></li>
            <li><Link href="/preview/treatments/lifting" className="hover:text-cream">시술</Link></li>
            <li><Link href="/preview/community/notices" className="hover:text-cream">공지사항</Link></li>
            <li><Link href="/preview/community/prices" className="hover:text-cream">비급여 수가표</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.24em] text-brand-soft">CONTACT</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href="tel:024217588" className="block font-serif text-lg text-cream">
                02-421-7588
              </a>
            </li>
            <li className="text-xs leading-relaxed">
              서울특별시 송파구 올림픽로 102<br />
              서일빌딩 10층
            </li>
            <li className="text-xs leading-relaxed">
              평일 10:00 – 20:00<br />
              토요일 10:00 – 16:00<br />
              일·공휴일 휴진
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6">
        <p className="mx-auto max-w-7xl px-5 text-center text-[10px] text-cream/40 lg:px-8">
          상호 선샤인의원 · 대표원장 김병현 · 사업자등록번호 878-37-01499 · 송파구보건소 신고 제 2026-3230034-00049 호
        </p>
      </div>
    </footer>
  );
}
