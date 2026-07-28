import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function PreviewFooter() {
  const t = await getTranslations("v2.footer");
  const tBrand = await getTranslations("brand");

  return (
    <footer className="border-t border-cream/10 bg-ink text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 lg:px-8 lg:py-20">
        {/* Brand col */}
        <div className="md:col-span-2">
          <Link href="/home" className="flex items-center gap-3">
            <Image
              src="/logo-mark.svg"
              alt=""
              width={48}
              height={48}
              className="h-11 w-11 object-contain brightness-125"
            />
            <div className="leading-none">
              <p className="font-serif text-lg text-cream">{tBrand("name")}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-cream/50">
                Sunshine Clinic
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/60">
            {t("tagline")}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.24em] text-brand-soft">{t("menuHeading")}</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-cream">{t("menu.about")}</Link></li>
            <li><Link href="/treatments/lifting" className="hover:text-cream">{t("menu.treatments")}</Link></li>
            <li><Link href="/community/notices" className="hover:text-cream">{t("menu.notices")}</Link></li>
            <li><Link href="/community/prices" className="hover:text-cream">{t("menu.prices")}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.24em] text-brand-soft">{t("contactHeading")}</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href="tel:024217588" className="block font-serif text-lg text-cream">
                02-421-7588
              </a>
            </li>
            <li className="text-xs leading-relaxed">
              {t("address1")}<br />
              {t("address2")}
            </li>
            <li className="text-xs leading-relaxed">
              {t("hoursWeekday")}<br />
              {t("hoursSat")}<br />
              {t("hoursClosed")}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6">
        <p className="mx-auto max-w-7xl px-5 text-center text-[10px] text-cream/40 lg:px-8">
          {t("business")}
        </p>
      </div>
    </footer>
  );
}
