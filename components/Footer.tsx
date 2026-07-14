import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { clinic } from "@/lib/data";
import { getSiteContent, type Locale } from "@/lib/site-content";
import {
  KakaoIcon,
  NaverIcon,
  InstagramIcon,
  BlogIcon,
  PhoneIcon,
  PinIcon,
} from "./icons";

const socials = [
  { label: "Kakao", href: clinic.social.kakao, Icon: KakaoIcon },
  { label: "Naver", href: clinic.social.naver, Icon: NaverIcon },
  { label: "Instagram", href: clinic.social.instagram, Icon: InstagramIcon },
  { label: "Blog", href: clinic.social.blog, Icon: BlogIcon },
];

const QUICK_LINKS = [
  { key: "about", href: "/about" },
  { key: "lifting", href: "/treatments/lifting" },
  { key: "whitening", href: "/treatments/whitening" },
  { key: "acne", href: "/treatments/acne" },
  { key: "skinDisease", href: "/treatments/skin-disease" },
  { key: "community", href: "/community/events" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const locale = useLocale() as Locale;
  const content = getSiteContent(locale);

  return (
    <footer className="mt-24 border-t border-line bg-sand/60">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_auto]">
          <div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight">{tBrand("name")}</span>
              <span className="mt-1 text-[10px] font-medium tracking-[0.12em] text-ink-soft">
                {tBrand("label")}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              {content.about.brandDescription}
            </p>
            <div className="mt-5 flex gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink-soft transition hover:bg-brand hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">{t("quickLinks")}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-ink-soft">
              {QUICK_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="transition hover:text-brand">
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-ink-soft">
            <h3 className="text-sm font-semibold text-ink">{t("hours")}</h3>
            <ul className="mt-4 space-y-1.5">
              {content.hours.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-20 shrink-0 text-ink">{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5">
              <p className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-brand" /> {clinic.phone}
              </p>
              <p className="flex items-start gap-2">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {content.clinic.addressLine}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-soft lg:flex-row lg:items-center lg:justify-between">
          <p>
            {content.clinic.legalNameLabel}: {content.clinic.legalName} ·{" "}
            {content.clinic.doctorOwnerName} · {content.clinic.bizNoLabel}{" "}
            {clinic.business.bizNo} · {content.clinic.licenseText}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/" className="font-medium text-ink transition hover:text-brand">
              {t("privacy")}
            </Link>
            <Link href="/" className="transition hover:text-brand">
              {t("terms")}
            </Link>
            <Link href="/community/prices" className="transition hover:text-brand">
              {t("prices")}
            </Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-ink-soft/80">{t("disclaimer")}</p>
      </div>
    </footer>
  );
}
