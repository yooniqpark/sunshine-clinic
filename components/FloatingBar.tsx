import { clinic } from "@/lib/data";
import { PhoneIcon, KakaoIcon, CalendarIcon } from "./icons";

export function FloatingBar() {
  return (
    <>
      {/* mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-line bg-white/95 backdrop-blur lg:hidden">
        <a
          href={clinic.phoneHref}
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink"
        >
          <PhoneIcon className="h-5 w-5 text-brand" />
          전화상담
        </a>
        <a
          href={clinic.kakaoHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 border-x border-line py-2.5 text-[11px] font-medium text-ink"
        >
          <KakaoIcon className="h-5 w-5 text-[#3C1E1E]" />
          카카오상담
        </a>
        <a
          href={clinic.bookingHref}
          className="flex flex-col items-center gap-1 bg-brand py-2.5 text-[11px] font-semibold text-white"
        >
          <CalendarIcon className="h-5 w-5" />
          예약하기
        </a>
      </div>

      {/* desktop side rail (stacked above the chat orb) */}
      <div className="fixed bottom-28 right-6 z-40 hidden flex-col gap-3 lg:flex">
        <a
          href={clinic.kakaoHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오 상담"
          className="grid h-12 w-12 place-items-center rounded-full bg-[#FAE100] text-[#3C1E1E] shadow-lg shadow-ink/10 transition hover:scale-105"
        >
          <KakaoIcon className="h-6 w-6" />
        </a>
        <a
          href={clinic.bookingHref}
          className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition hover:scale-105"
          aria-label="예약하기"
        >
          <CalendarIcon className="h-5 w-5" />
        </a>
      </div>
    </>
  );
}
