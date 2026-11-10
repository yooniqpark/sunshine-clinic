import type { AppLocale } from "@/i18n/routing";
import { pageSeo } from "@yooniqpark/clinic-core/lib/seo";

const copy: Record<AppLocale, { title: string; label: string; description: string }> = {
  ko: {
    title: "잠실새내 선샤인의원 | 리프팅·피부 진료",
    label: "잠실새내 선샤인의원",
    description: "서울 송파구 잠실새내역 인근 선샤인의원. 울쎄라·써마지 등 리프팅과 스킨부스터, 색소·여드름 진료, 의료진과 진료시간을 안내합니다.",
  },
  en: {
    title: "Sunshine Clinic | Skin Clinic in Jamsilsaenae, Seoul",
    label: "Sunshine Clinic · Jamsilsaenae, Seoul",
    description: "Sunshine Clinic near Jamsilsaenae Station in Songpa, Seoul. Find information on lifting, skin boosters, pigmentation and acne care, our doctor, and opening hours.",
  },
  ja: {
    title: "サンシャインクリニック | ソウル・蚕室セネの皮膚診療",
    label: "ソウル・蚕室セネ サンシャインクリニック",
    description: "ソウル松坡区、蚕室セネ駅近くのサンシャインクリニック。リフティング、スキンブースター、色素・ニキビの診療、医師や診療時間をご案内します。",
  },
  zh: {
    title: "Sunshine Clinic | 首尔蚕室新川站皮肤诊疗",
    label: "Sunshine Clinic · 首尔蚕室新川站",
    description: "位于首尔松坡区蚕室新川站附近的 Sunshine Clinic。提供提拉、皮肤增效剂、色素及痘痘诊疗、医生和门诊时间信息。",
  },
};

export function homeCopy(locale: string) {
  return copy[locale as AppLocale] ?? copy.ko;
}

export function homeMetadata(locale: string) {
  const { title, description } = homeCopy(locale);
  return { ...pageSeo({ locale, path: "/home", title, description }), title: { absolute: title } };
}
