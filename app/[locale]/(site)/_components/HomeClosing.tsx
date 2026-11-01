import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ClinicContact } from "@/components/ClinicContact";
import { ArrowUpRightIcon, CalendarIcon, KakaoIcon, NaverIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { clinicConfig } from "@/clinic.config";
import { HomeClosingScene } from "./HomeClosingScene";
import styles from "./HomeClosing.module.css";

const treatments = [
  { key: "lifting", slug: "lifting" },
  { key: "antiAging", slug: "anti-aging" },
  { key: "whitening", slug: "whitening" },
  { key: "acne", slug: "acne" },
  { key: "skinDisease", slug: "skin-disease" },
] as const;

export async function HomeClosing({ contact }: { contact: ClinicContact }) {
  const [t, home, footer, nav] = await Promise.all([
    getTranslations("homeClosing"),
    getTranslations("v2.home"),
    getTranslations("v2.footer"),
    getTranslations("v2.header"),
  ]);
  const mapHref = `https://map.naver.com/p/search/${encodeURIComponent(clinicConfig.location.mapQuery)}`;

  return (
    <HomeClosingScene>
      <section id="care" className={styles.care} aria-labelledby="closing-care-title">
        <div className={styles.careFrame}>
          <p className={styles.eyebrow}>THE SUNSHINE WAY</p>
          <h2 id="closing-care-title" className={styles.display}>
            <span>FIND YOUR</span>
            <span>SUNSHINE</span>
          </h2>
          <div className={styles.careContent}>
            <div className={styles.careNote}>
              <span className={styles.eyebrow}>CARE, JUST FOR YOU</span>
              <p>{t("careNote")}</p>
            </div>
            <nav className={styles.treatments} aria-label={t("treatmentNavigation")}>
              {treatments.map(({ key, slug }, index) => (
                <Link key={slug} href={`/treatments/${slug}`}>
                  <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                  <span>{nav(`cols.${key}`)}</span>
                  <ArrowUpRightIcon />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <footer id="book" className={styles.contact} aria-labelledby="closing-contact-title">
        <div className={styles.contactFrame} data-home-contact-frame>
          <div className={styles.contactIntro}>
            <div className={styles.contactCopy}>
              <p className={styles.eyebrow}>A LITTLE CLOSER TO YOU</p>
              <h2 id="closing-contact-title">{t("contactTitle")}</h2>
              <p className={styles.contactDescription}>{home("ctaDesc")}</p>
            </div>
            <div className={styles.contactLinks}>
              <div className={styles.actions}>
                <a href={contact.naverBookingHref} target="_blank" rel="noopener noreferrer">
                  <span className={styles.icon}><NaverIcon /></span>
                  <span>{home("ctaNaver")}</span>
                  <ArrowUpRightIcon />
                </a>
                <a href={contact.phoneHref}>
                  <span className={styles.icon}><PhoneIcon /></span>
                  <span>{contact.phone}</span>
                  <ArrowUpRightIcon />
                </a>
              </div>
              <div className={styles.hours}>
                <p>{footer("hoursWeekday")}</p>
                <p>{footer("hoursSat")} · {footer("hoursClosed")}</p>
              </div>
            </div>
          </div>
          <p className={styles.contactDisplay} aria-hidden="true">BEGIN WITH CARE</p>
          <div className={styles.bottom}>
            <Link href="/home" className={styles.wordmark}>SUNSHINE <small>SKIN CLINIC</small></Link>
            <nav aria-label={t("footerNavigation")}>
              <Link href="/about">{footer("menu.about")}</Link>
              <Link href="/community/prices">{footer("menu.prices")}</Link>
              <a href={contact.kakaoHref} target="_blank" rel="noopener noreferrer">Kakao</a>
              <a href={contact.naverBookingHref} target="_blank" rel="noopener noreferrer">Naver</a>
            </nav>
          </div>
          <p className={styles.business}>{footer("business")}</p>
        </div>
      </footer>

      <aside className={styles.rail} data-home-rail aria-label={t("clinicInformation")}>
        <div className={styles.railInner} data-home-rail-inner>
          <Link className={styles.railLink} href="/about">
            <span className={styles.icon}><ArrowUpRightIcon /></span>
            <span><strong>{nav("nav.about")}</strong><small>THE SUNSHINE WAY</small></span>
          </Link>
          <div className={styles.railCard}>
            <span className={styles.eyebrow}>MORE FROM SUNSHINE</span>
            <h3>{t("newsTitle")}</h3>
            <Link href="/community/events" className={styles.railAction}>
              <span>{nav("items.events")}</span><ArrowUpRightIcon />
            </Link>
            <Link href="/community/notices" className={styles.railAction}>
              <span>{footer("menu.notices")}</span><ArrowUpRightIcon />
            </Link>
          </div>
          <div className={`${styles.railCard} ${styles.railAddress}`}>
            <span className={styles.eyebrow}>COME SAY HELLO</span>
            <h3>{t("visitTitle")}</h3>
            <p className={styles.address}>{footer("address1")} {footer("address2")}</p>
            <a href={mapHref} target="_blank" rel="noopener noreferrer" className={styles.railAction}>
              <span>{t("mapLabel")}</span><PinIcon />
            </a>
          </div>
          <div className={styles.railChannels}>
            <a href={contact.kakaoHref} target="_blank" rel="noopener noreferrer" aria-label={t("kakaoLabel")}><KakaoIcon /></a>
            <a href={contact.naverBookingHref} target="_blank" rel="noopener noreferrer" aria-label={home("ctaNaver")}><CalendarIcon /></a>
            <a href={contact.phoneHref} aria-label={contact.phone}><PhoneIcon /></a>
          </div>
        </div>
      </aside>
    </HomeClosingScene>
  );
}
