import type { CampaignCategory } from "@/lib/campaign-events";
import type { PopupEvent } from "@/lib/event-popup";

export type PopupLocale = "ko" | "en" | "ja" | "zh";

/**
 * 이벤트 팝업·커뮤니티 가격표의 한국어 원문 → 각 언어 대역표.
 *
 * 가격 숫자와 표 구조는 lib/event-popup.ts 한 곳에만 두고, 여기서는 문구만 갈아끼운다.
 * 대역이 없는 문구는 한국어 원문 그대로 노출된다(번역 누락이 화면 공백으로 이어지지 않게).
 */
const EN: Record<string, string> = {
  // 공통 UI
  "오늘 하루 보지 않기": "Don't show today",
  "닫기": "Close",
  "구분": "Type",
  "부가세(VAT) 별도": "VAT not included",
  // 그랜드 오픈
  "오픈 기념 혜택 · 가격 보기": "See opening offers & prices",
  "선샤인의원 그랜드 오픈 이벤트": "Sunshine Clinic Grand Opening Event",
  "*소진 시 조기 마감될 수 있습니다. 당신의 빛나는 순간을, 선샤인의원이 함께합니다.":
    "*May close early once fully booked. Sunshine Clinic is with you in your brightest moments.",
  "리프팅": "Lifting",
  "처진 자리를 끌어올리고, 탄력은 안에서부터": "Lift what has dropped, firm from within",
  "울쎄라피프라임 300샷": "Ulthera Prime 300 shots",
  "울쎄라피프라임 400샷": "Ulthera Prime 400 shots",
  "써마지FLX 300샷": "Thermage FLX 300 shots",
  "써마지FLX 600샷": "Thermage FLX 600 shots",
  "울쎄라 300샷 + 써마지 600샷": "Ulthera 300 + Thermage 600 shots",
  "울쎄라 600샷 + 써마지 300샷": "Ulthera 600 + Thermage 300 shots",
  "울쎄라 600샷 + 써마지 600샷": "Ulthera 600 + Thermage 600 shots",
  "커스텀 스킨보톡스 얼굴 전체 포함": "Includes custom skin botox for the full face",
  "리쥬란HB 2cc + 아이리쥬란 1cc 서비스": "Rejuran HB 2cc + Eye Rejuran 1cc included",
  "스킨부스터": "Skin Booster",
  "속부터 채우는 물광, 오픈 기념 특별가": "Deep-set glow, at opening prices",
  "리쥬란 HB 2cc": "Rejuran HB 2cc",
  "리쥬란힐러 2cc": "Rejuran Healer 2cc",
  "아이리쥬란 1cc": "Eye Rejuran 1cc",
  "엘라비에리투오 1병": "L'Avie Rituo 1 vial",
  "셀르디엠 1병": "Cell DM 1 vial",
  "보톡스": "Botox",
  "표정은 자연스럽게, 라인은 매끄럽게": "Natural expressions, smoother lines",
  "국산 프리미엄": "Domestic premium",
  "외산 제오민": "Imported Xeomin",
  "오리지널 앨러간": "Original Allergan",
  "주름 1부위": "Wrinkles, 1 area",
  "주름 3부위": "Wrinkles, 3 areas",
  "턱 · 측두근 · 침샘": "Jaw · Temporalis · Salivary gland",
  "승모근 · 종아리": "Trapezius · Calf",
  "커스텀 스킨보톡스": "Custom skin botox",
  "화이트닝 & 여드름": "Whitening & Acne",
  "색소와 트러블 흔적까지 맑게": "Clearing pigment and blemish marks alike",
  "토닝레이저 10회": "Toning laser, 10 sessions",
  "비타민 미백 및 수분 케어 10회": "Includes 10 vitamin brightening & hydration sessions",
  "트리플 패키지 10회": "Triple package, 10 sessions",
  "레이저 3가지 + 맞춤 케어 10회": "3 lasers + 10 tailored care sessions",
  "여드름 올인원 패키지": "Acne all-in-one package",
  "레이저 3가지 + 여드름 스케일링 10회": "3 lasers + 10 acne scaling sessions",
  // 첫 방문
  "첫 방문 혜택 · 가격 보기": "See first-visit offers & prices",
  "선샤인의원 첫 방문 이벤트": "Sunshine Clinic First Visit Event",
  "처음이기에 더 세심하게. 현재 피부와 얼굴에 필요한 시술부터 제안합니다.":
    "Extra care for a first visit — we start from what your skin actually needs.",
  "필요한 부위만 섬세하게, 자연스러운 인상의 변화":
    "Only where it's needed, for a naturally softened impression",
  "국산 하이톡스": "Domestic Hutox",
  "프리미엄 코어톡스": "Premium Coretox",
  "다한증": "Hyperhidrosis",
  "목주름": "Neck lines",
  "당기고 다듬어, 한층 또렷해지는 페이스 라인": "Tightened and refined, for a clearer face line",
  "STEP 2 · 슈링크 300샷": "STEP 2 · Shurink 300 shots",
  "STEP 2 · 인모드 miniFX": "STEP 2 · INMODE miniFX",
  "STEP 3 · 인모드 miniFX + 슈링크 300샷": "STEP 3 · INMODE miniFX + Shurink 300 shots",
  "슬림윤곽주사 10cc 포함": "Includes slimming contour injection 10cc",
  "필러": "Filler",
  "과하지 않게 채우고, 본연의 균형은 더 아름답게":
    "Filled with restraint, keeping your own balance",
  "뉴라미스 · 입술 1cc": "Neuramis · Lips 1cc",
  "뉴라미스 · 애교 1cc": "Neuramis · Under-eye 1cc",
  "뉴라미스 · 턱 1cc": "Neuramis · Chin 1cc",
  "쥬비덤 · 입술 1cc": "Juvéderm · Lips 1cc",
  "쥬비덤 · 애교 1cc": "Juvéderm · Under-eye 1cc",
  "쥬비덤 · 턱 1cc": "Juvéderm · Chin 1cc",
  "그 외 필요한 부위 필러 1cc": "Filler for other areas, 1cc",
  "콜라겐 볼륨": "Collagen Volume",
  "단순히 채우는 볼륨이 아닌, 피부 스스로 차오르는 자연스러운 변화":
    "Not volume simply added — volume your skin builds on its own",
  "쥬베룩 볼륨 · 1병": "Juvelook Volume · 1 vial",
};

const JA: Record<string, string> = {
  "오늘 하루 보지 않기": "今日は表示しない",
  "닫기": "閉じる",
  "구분": "区分",
  "부가세(VAT) 별도": "VAT別途",
  "오픈 기념 혜택 · 가격 보기": "オープン記念特典・価格を見る",
  "선샤인의원 그랜드 오픈 이벤트": "サンシャインクリニック グランドオープンイベント",
  "*소진 시 조기 마감될 수 있습니다. 당신의 빛나는 순간을, 선샤인의원이 함께합니다.":
    "※定員に達し次第、早期終了する場合があります。あなたの輝く瞬間をサンシャインクリニックがご一緒します。",
  "리프팅": "リフティング",
  "처진 자리를 끌어올리고, 탄력은 안에서부터": "たるみを引き上げ、ハリは内側から",
  "울쎄라피프라임 300샷": "ウルセラプライム 300ショット",
  "울쎄라피프라임 400샷": "ウルセラプライム 400ショット",
  "써마지FLX 300샷": "サーマジFLX 300ショット",
  "써마지FLX 600샷": "サーマジFLX 600ショット",
  "울쎄라 300샷 + 써마지 600샷": "ウルセラ300 + サーマジ600ショット",
  "울쎄라 600샷 + 써마지 300샷": "ウルセラ600 + サーマジ300ショット",
  "울쎄라 600샷 + 써마지 600샷": "ウルセラ600 + サーマジ600ショット",
  "커스텀 스킨보톡스 얼굴 전체 포함": "カスタムスキンボトックス（顔全体）を含む",
  "리쥬란HB 2cc + 아이리쥬란 1cc 서비스": "リジュランHB 2cc + アイリジュラン 1cc サービス",
  "스킨부스터": "スキンブースター",
  "속부터 채우는 물광, 오픈 기념 특별가": "内側から満たす水光、オープン記念特別価格",
  "리쥬란 HB 2cc": "リジュランHB 2cc",
  "리쥬란힐러 2cc": "リジュランヒーラー 2cc",
  "아이리쥬란 1cc": "アイリジュラン 1cc",
  "엘라비에리투오 1병": "エラビエリトゥオ 1本",
  "셀르디엠 1병": "セルディエム 1本",
  "보톡스": "ボトックス",
  "표정은 자연스럽게, 라인은 매끄럽게": "表情は自然に、ラインはなめらかに",
  "국산 프리미엄": "国産プレミアム",
  "외산 제오민": "輸入ゼオミン",
  "오리지널 앨러간": "オリジナル アラガン",
  "주름 1부위": "しわ 1部位",
  "주름 3부위": "しわ 3部位",
  "턱 · 측두근 · 침샘": "あご・側頭筋・唾液腺",
  "승모근 · 종아리": "僧帽筋・ふくらはぎ",
  "커스텀 스킨보톡스": "カスタムスキンボトックス",
  "화이트닝 & 여드름": "ホワイトニング＆ニキビ",
  "색소와 트러블 흔적까지 맑게": "色素もトラブル跡も澄んだ肌へ",
  "토닝레이저 10회": "トーニングレーザー 10回",
  "비타민 미백 및 수분 케어 10회": "ビタミン美白・保湿ケア 10回を含む",
  "트리플 패키지 10회": "トリプルパッケージ 10回",
  "레이저 3가지 + 맞춤 케어 10회": "レーザー3種＋オーダーメイドケア 10回",
  "여드름 올인원 패키지": "ニキビ オールインワンパッケージ",
  "레이저 3가지 + 여드름 스케일링 10회": "レーザー3種＋ニキビスケーリング 10回",
  "첫 방문 혜택 · 가격 보기": "初回来院特典・価格を見る",
  "선샤인의원 첫 방문 이벤트": "サンシャインクリニック 初回来院イベント",
  "처음이기에 더 세심하게. 현재 피부와 얼굴에 필요한 시술부터 제안합니다.":
    "初めてだからこそ、より丁寧に。今の肌と顔に必要な施術からご提案します。",
  "필요한 부위만 섬세하게, 자연스러운 인상의 변화": "必要な部位だけ繊細に、自然な印象の変化",
  "국산 하이톡스": "国産ハイトックス",
  "프리미엄 코어톡스": "プレミアム コアトックス",
  "다한증": "多汗症",
  "목주름": "首のしわ",
  "당기고 다듬어, 한층 또렷해지는 페이스 라인": "引き上げて整える、くっきりとしたフェイスライン",
  "STEP 2 · 슈링크 300샷": "STEP 2 ・シュリンク 300ショット",
  "STEP 2 · 인모드 miniFX": "STEP 2 ・インモード miniFX",
  "STEP 3 · 인모드 miniFX + 슈링크 300샷": "STEP 3 ・インモード miniFX + シュリンク 300ショット",
  "슬림윤곽주사 10cc 포함": "スリム輪郭注射 10cc を含む",
  "필러": "フィラー",
  "과하지 않게 채우고, 본연의 균형은 더 아름답게": "入れすぎず満たし、本来のバランスをより美しく",
  "뉴라미스 · 입술 1cc": "ニューラミス・唇 1cc",
  "뉴라미스 · 애교 1cc": "ニューラミス・涙袋 1cc",
  "뉴라미스 · 턱 1cc": "ニューラミス・あご 1cc",
  "쥬비덤 · 입술 1cc": "ジュビダーム・唇 1cc",
  "쥬비덤 · 애교 1cc": "ジュビダーム・涙袋 1cc",
  "쥬비덤 · 턱 1cc": "ジュビダーム・あご 1cc",
  "그 외 필요한 부위 필러 1cc": "その他必要な部位のフィラー 1cc",
  "콜라겐 볼륨": "コラーゲンボリューム",
  "단순히 채우는 볼륨이 아닌, 피부 스스로 차오르는 자연스러운 변화":
    "ただ満たすボリュームではなく、肌自らが満ちる自然な変化",
  "쥬베룩 볼륨 · 1병": "ジュベルック ボリューム・1本",
};

const ZH: Record<string, string> = {
  "오늘 하루 보지 않기": "今天不再显示",
  "닫기": "关闭",
  "구분": "项目",
  "부가세(VAT) 별도": "不含增值税",
  "오픈 기념 혜택 · 가격 보기": "查看开业优惠及价格",
  "선샤인의원 그랜드 오픈 이벤트": "Sunshine 医院 盛大开业活动",
  "*소진 시 조기 마감될 수 있습니다. 당신의 빛나는 순간을, 선샤인의원이 함께합니다.":
    "*名额有限，售完即止。Sunshine 医院陪伴您每一个闪耀时刻。",
  "리프팅": "提拉",
  "처진 자리를 끌어올리고, 탄력은 안에서부터": "提拉松弛部位，弹力由内而生",
  "울쎄라피프라임 300샷": "超声刀 Prime 300 发",
  "울쎄라피프라임 400샷": "超声刀 Prime 400 发",
  "써마지FLX 300샷": "热玛吉 FLX 300 发",
  "써마지FLX 600샷": "热玛吉 FLX 600 发",
  "울쎄라 300샷 + 써마지 600샷": "超声刀 300 发 + 热玛吉 600 发",
  "울쎄라 600샷 + 써마지 300샷": "超声刀 600 发 + 热玛吉 300 发",
  "울쎄라 600샷 + 써마지 600샷": "超声刀 600 发 + 热玛吉 600 发",
  "커스텀 스킨보톡스 얼굴 전체 포함": "含定制水光肉毒（全脸）",
  "리쥬란HB 2cc + 아이리쥬란 1cc 서비스": "赠丽珠兰 HB 2cc + 眼部丽珠兰 1cc",
  "스킨부스터": "水光针",
  "속부터 채우는 물광, 오픈 기념 특별가": "由内而外的水光，开业特惠价",
  "리쥬란 HB 2cc": "丽珠兰 HB 2cc",
  "리쥬란힐러 2cc": "丽珠兰 Healer 2cc",
  "아이리쥬란 1cc": "眼部丽珠兰 1cc",
  "엘라비에리투오 1병": "Elravie Rituo 1 瓶",
  "셀르디엠 1병": "Cell DM 1 瓶",
  "보톡스": "肉毒素",
  "표정은 자연스럽게, 라인은 매끄럽게": "表情自然，线条流畅",
  "국산 프리미엄": "国产高端",
  "외산 제오민": "进口 Xeomin",
  "오리지널 앨러간": "原装 Allergan",
  "주름 1부위": "皱纹 1 个部位",
  "주름 3부위": "皱纹 3 个部位",
  "턱 · 측두근 · 침샘": "下颌 · 颞肌 · 唾液腺",
  "승모근 · 종아리": "斜方肌 · 小腿",
  "커스텀 스킨보톡스": "定制水光肉毒",
  "화이트닝 & 여드름": "美白 & 痘痘",
  "색소와 트러블 흔적까지 맑게": "色素与痘印一并净透",
  "토닝레이저 10회": "调 Q 激光 10 次",
  "비타민 미백 및 수분 케어 10회": "含维生素美白及补水护理 10 次",
  "트리플 패키지 10회": "三重套餐 10 次",
  "레이저 3가지 + 맞춤 케어 10회": "3 种激光 + 定制护理 10 次",
  "여드름 올인원 패키지": "痘痘全能套餐",
  "레이저 3가지 + 여드름 스케일링 10회": "3 种激光 + 清痘护理 10 次",
  "첫 방문 혜택 · 가격 보기": "查看首次到院优惠及价格",
  "선샤인의원 첫 방문 이벤트": "Sunshine 医院 首次到院活动",
  "처음이기에 더 세심하게. 현재 피부와 얼굴에 필요한 시술부터 제안합니다.":
    "正因为是第一次，更加用心。我们会从您当下肌肤与面部真正需要的项目开始建议。",
  "필요한 부위만 섬세하게, 자연스러운 인상의 변화": "只在需要的部位精细处理，自然改变印象",
  "국산 하이톡스": "国产 Hutox",
  "프리미엄 코어톡스": "高端 Coretox",
  "다한증": "多汗症",
  "목주름": "颈纹",
  "당기고 다듬어, 한층 또렷해지는 페이스 라인": "收紧修饰，脸部线条更清晰",
  "STEP 2 · 슈링크 300샷": "STEP 2 · 热提拉 300 发",
  "STEP 2 · 인모드 miniFX": "STEP 2 · INMODE miniFX",
  "STEP 3 · 인모드 miniFX + 슈링크 300샷": "STEP 3 · INMODE miniFX + 热提拉 300 发",
  "슬림윤곽주사 10cc 포함": "含瘦脸轮廓针 10cc",
  "필러": "填充",
  "과하지 않게 채우고, 본연의 균형은 더 아름답게": "适度填充，让原有的平衡更美",
  "뉴라미스 · 입술 1cc": "Neuramis · 唇部 1cc",
  "뉴라미스 · 애교 1cc": "Neuramis · 卧蚕 1cc",
  "뉴라미스 · 턱 1cc": "Neuramis · 下巴 1cc",
  "쥬비덤 · 입술 1cc": "乔雅登 · 唇部 1cc",
  "쥬비덤 · 애교 1cc": "乔雅登 · 卧蚕 1cc",
  "쥬비덤 · 턱 1cc": "乔雅登 · 下巴 1cc",
  "그 외 필요한 부위 필러 1cc": "其他需要部位填充 1cc",
  "콜라겐 볼륨": "胶原蛋白填充",
  "단순히 채우는 볼륨이 아닌, 피부 스스로 차오르는 자연스러운 변화":
    "不是单纯填充，而是肌肤自我生成的自然变化",
  "쥬베룩 볼륨 · 1병": "Juvelook Volume · 1 瓶",
};

const DICTS: Record<string, Record<string, string>> = { en: EN, ja: JA, zh: ZH };

/** 대역이 없으면 한국어 원문을 그대로 돌려준다 */
export function tr(text: string, locale: string): string {
  const dict = DICTS[locale];
  if (!dict) return text;
  return dict[text] ?? text;
}

/**
 * "100만원" 같은 금액을 로케일에 맞춰 숫자·단위로 나눈다.
 * ko/ja/zh는 만 단위를 그대로 쓰고, en만 실제 금액으로 환산한다.
 */
export function formatPrice(value: string, locale: string) {
  const m = value.match(/^([\d.]+)만원(.*)$/);
  if (!m) return { num: value, unit: "" };
  const [, digits, tail] = m;

  if (locale === "en") {
    const won = Math.round(parseFloat(digits) * 10000);
    return { num: won.toLocaleString("en-US"), unit: ` KRW${tail}` };
  }
  if (locale === "ja") return { num: digits, unit: `万ウォン${tail}` };
  if (locale === "zh") return { num: digits, unit: `万韩元${tail}` };
  return { num: digits, unit: `만원${tail}` };
}

function localizeCategory(c: CampaignCategory, locale: string): CampaignCategory {
  return {
    ...c,
    name: tr(c.name, locale),
    copy: tr(c.copy, locale),
    columns: c.columns?.map((col) => tr(col, locale)),
    rows: c.rows.map((r) => ({
      ...r,
      name: tr(r.name, locale),
      desc: r.desc ? tr(r.desc, locale) : r.desc,
    })),
  };
}

/** 팝업 이벤트 하나를 해당 언어로 바꾼 사본을 만든다 */
export function localizeEvent(ev: PopupEvent, locale: string): PopupEvent {
  if (locale === "ko") return ev;
  return {
    ...ev,
    ctaLabel: tr(ev.ctaLabel, locale),
    posterAlt: tr(ev.posterAlt, locale),
    vatNote: tr(ev.vatNote, locale),
    closingCopy: tr(ev.closingCopy, locale),
    categories: ev.categories.map((c) => localizeCategory(c, locale)),
  };
}
