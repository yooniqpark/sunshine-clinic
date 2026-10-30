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
  "팝업 닫기": "Close popup",
  "이벤트 전환": "Switch event",
  "가격표 보기": "View price list",
  "10월 진료 안내": "October clinic schedule",
  "안심 수면마취 안내": "Sedation safety information",
  "구분": "Type",
  "부가세(VAT) 별도": "VAT not included",
  // 수험생 SPECIAL
  "수고한 너를 위한,": "For all your hard work,",
  "수험생 할인 이벤트": "the exam student discount",
  "리프팅 10% · 여드름 색소 홍조 흉터 모공 20%":
    "LIFTING 10% · ACNE · PIGMENT · REDNESS · SCARS · PORES 20%",
  "수험생 할인 자세히 보기": "See the exam-season discount",
  "선샤인의원 수험생 SPECIAL EVENT": "Sunshine Clinic Exam Season Special",
  "수험생 할인": "Exam student discount",
  "수험생 본인과 가족까지, 수험표를 지참하시면 할인해 드립니다":
    "For exam students and their families — show your exam admission ticket",
  "여드름 · 색소 · 홍조 · 흉터 · 모공": "Acne · Pigmentation · Redness · Scars · Pores",
  "울쎄라 · 써마지 · 슈링크 등 리프팅 시술":
    "Lifting treatments such as Ulthera, Thermage and Shurink",
  "레이저 · 필링 · 스킨부스터 등 해당 시술":
    "Related treatments such as lasers, peels and skin boosters",
  "수험표 지참 시": "With your exam admission ticket",
  "염증주사 · 보톡스 · 보험진료는 할인 대상에서 제외되며, 10월 가을 이벤트와 중복 적용은 불가합니다.":
    "Anti-inflammatory injections, botox and insurance-covered care are excluded, and this cannot be combined with the October autumn event.",
  // 10월 가을 이벤트
  "10월 가을 이벤트 · 가격 보기": "See October offers & prices",
  "선샤인의원 10월 가을 이벤트": "Sunshine Clinic October Autumn Event",
  "이중턱부터 얼굴 전체 탄력까지, 원하는 만큼 골라 받는 가을 리프팅":
    "From a double chin to overall firmness — autumn lifting, as much or as little as you want",
  "이중턱 삭제 · V라인 리프팅": "Double-chin removal & V-line lifting",
  "울쎄라 400샷 + 인모드 Mini FX + 인모드 FORMA + 커스텀 스킨보톡스":
    "Ulthera 400 shots + INMODE Mini FX + INMODE FORMA + custom skin botox",
  "탄력 UP · V라인 리프팅": "Firmness up & V-line lifting",
  "써마지 FLX 600샷 + 슈링크 유니버스 500샷 + 커스텀 스킨보톡스":
    "Thermage FLX 600 shots + Shurink Universe 500 shots + custom skin botox",
  "프리미엄 토탈 리프팅": "Premium total lifting",
  "울쎄라 300샷 + 써마지 FLX 600샷 + 리쥬란 HB 2cc + 커스텀 스킨보톡스":
    "Ulthera 300 shots + Thermage FLX 600 shots + Rejuran HB 2cc + custom skin botox",
  "부담 없이 시작하는 부분 집중 리프팅": "An easy first step — targeted lifting",
  "슈링크 유니버스 100샷": "Shurink Universe 100 shots",
  "모공 & 흉터": "Pores & Scars",
  "넓어진 모공과 남아 있는 여드름 흉터를 한 번에 정돈합니다":
    "Enlarged pores and lingering acne scars, smoothed in one session",
  "모공 · 피부결 집중 케어": "Pore & texture intensive care",
  "시크릿 모공레이저 + 미라젯 + 쥬베룩 볼륨 3cc / 1회":
    "Secret pore laser + Mirajet + Juvelook Volume 3cc / 1 session",
  "여드름 흉터 패키지": "Acne scar package",
  "시크릿 + 모피우스 + 미라젯 + 쥬베룩 볼륨 + 서브시전 / 1회":
    "Secret + Morpheus + Mirajet + Juvelook Volume + subcision / 1 session",
  "색소": "Pigmentation",
  "기미 · 잡티 · 색소를 열 번에 걸쳐 차분히 걷어냅니다":
    "Melasma, dark spots and pigmentation lifted gradually over ten sessions",
  "얼굴 전체 색소 트리플 패키지": "Full-face pigmentation triple package",
  "색소레이저 3종 + GA 필링 + LDM 진정관리 / 10회":
    "3 pigment lasers + GA peel + LDM soothing care / 10 sessions",
  "수분 & 광채": "Hydration & Glow",
  "건조해지는 계절, 속부터 채우는 수분과 맑은 광채":
    "As the air turns dry — hydration from within, and a clear glow",
  "가을 수분 · 탄력 충전": "Autumn hydration & firmness refill",
  "스킨바이브 2cc + LDM 12분 진정관리": "SkinVive 2cc + LDM 12-minute soothing care",
  "선샤인 글로우 부스터 3cc": "Sunshine Glow Booster 3cc",
  "선샤인 글로우 부스터 6cc": "Sunshine Glow Booster 6cc",
  "한 번에 차오르는 맑은 광채": "A clear glow that fills in, all at once",
  "선샤인 커스텀 스킨보톡스": "Sunshine custom skin botox",
  "한 번에 매끈하게 정돈하는 피부 컨디션 케어": "Skin-condition care that smooths everything in one go",
  "가을이 오면,": "When autumn comes,",
  "선샤인 10월 이벤트": "Sunshine October Event",
  "9월, 다시 만나는": "September, back again",
  "선샤인 베스트 이벤트": "Sunshine Best Event",
  // 월간 베스트
  "10월 베스트 혜택 · 가격 보기": "See October best offers & prices",
  "선샤인의원 10월 베스트 이벤트": "Sunshine Clinic October Best Event",
  "9월 베스트 혜택 · 가격 보기": "See September best offers & prices",
  "선샤인의원 9월 베스트 이벤트": "Sunshine Clinic September Best Event",
  "많이 찾아주셨던 리프팅 조합을 이번 달 다시 만나보세요":
    "The lifting combinations you asked for most, back again this month",
  "얼굴에서 가장 먼저 눈에 띄는 눈가 탄력, 아이써마지로 집중 관리":
    "The eye area shows age first — focused care with Eye Thermage",
  "점 · 쥐젖 · 편평사마귀 · 비립종까지, 얼굴 전체를 한 번에":
    "Moles, skin tags, flat warts and milia — the whole face in one session",
  "반복되는 트러블 피부를 위한 새로운 선택, 도입 기념 3회 집중 프로그램":
    "A new option for skin that keeps breaking out — a 3-session intensive program",
  "수분감부터 피부결 · 탄력 · 자연스러운 볼륨까지, 지금 고민에 맞춰":
    "Hydration, texture, firmness and natural volume — matched to what concerns you now",
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
  "팝업 닫기": "ポップアップを閉じる",
  "이벤트 전환": "イベントを切り替える",
  "가격표 보기": "価格表を見る",
  "10월 진료 안내": "10月の診療案内",
  "안심 수면마취 안내": "静脈鎮静法の安全案内",
  "구분": "区分",
  "부가세(VAT) 별도": "VAT別途",
  // 受験生 SPECIAL
  "수고한 너를 위한,": "頑張ったあなたへ、",
  "수험생 할인 이벤트": "受験生割引イベント",
  "리프팅 10% · 여드름 색소 홍조 흉터 모공 20%":
    "リフティング 10% · ニキビ · 色素 · 赤ら顔 · 傷跡 · 毛穴 20%",
  "수험생 할인 자세히 보기": "受験生割引を詳しく見る",
  "선샤인의원 수험생 SPECIAL EVENT": "サンシャインクリニック 受験生SPECIAL EVENT",
  "수험생 할인": "受験生割引",
  "수험생 본인과 가족까지, 수험표를 지참하시면 할인해 드립니다":
    "受験生ご本人とご家族まで。受験票のご提示で割引いたします",
  "여드름 · 색소 · 홍조 · 흉터 · 모공": "ニキビ · 色素 · 赤ら顔 · 傷跡 · 毛穴",
  "울쎄라 · 써마지 · 슈링크 등 리프팅 시술":
    "ウルセラ · サーマジ · シュリンクなどのリフティング施術",
  "레이저 · 필링 · 스킨부스터 등 해당 시술":
    "レーザー · ピーリング · スキンブースターなどの該当施術",
  "수험표 지참 시": "受験票ご提示で",
  "염증주사 · 보톡스 · 보험진료는 할인 대상에서 제외되며, 10월 가을 이벤트와 중복 적용은 불가합니다.":
    "炎症注射・ボトックス・保険診療は割引対象外で、10月秋イベントとの併用はできません。",
  // 10月 秋イベント
  "10월 가을 이벤트 · 가격 보기": "10月秋イベント・価格を見る",
  "선샤인의원 10월 가을 이벤트": "サンシャインクリニック 10月秋イベント",
  "이중턱부터 얼굴 전체 탄력까지, 원하는 만큼 골라 받는 가을 리프팅":
    "二重あごから顔全体のハリまで。必要な分だけ選べる秋のリフティング",
  "이중턱 삭제 · V라인 리프팅": "二重あご解消・Vラインリフティング",
  "울쎄라 400샷 + 인모드 Mini FX + 인모드 FORMA + 커스텀 스킨보톡스":
    "ウルセラ400ショット + インモード Mini FX + インモード FORMA + カスタムスキンボトックス",
  "탄력 UP · V라인 리프팅": "ハリUP・Vラインリフティング",
  "써마지 FLX 600샷 + 슈링크 유니버스 500샷 + 커스텀 스킨보톡스":
    "サーマジFLX 600ショット + シュリンクユニバース500ショット + カスタムスキンボトックス",
  "프리미엄 토탈 리프팅": "プレミアム トータルリフティング",
  "울쎄라 300샷 + 써마지 FLX 600샷 + 리쥬란 HB 2cc + 커스텀 스킨보톡스":
    "ウルセラ300ショット + サーマジFLX 600ショット + リジュラン HB 2cc + カスタムスキンボトックス",
  "부담 없이 시작하는 부분 집중 리프팅": "気軽に始める部分集中リフティング",
  "슈링크 유니버스 100샷": "シュリンクユニバース100ショット",
  "모공 & 흉터": "毛穴 & ニキビ跡",
  "넓어진 모공과 남아 있는 여드름 흉터를 한 번에 정돈합니다":
    "広がった毛穴と残ったニキビ跡を一度に整えます",
  "모공 · 피부결 집중 케어": "毛穴・肌質集中ケア",
  "시크릿 모공레이저 + 미라젯 + 쥬베룩 볼륨 3cc / 1회":
    "シークレット毛穴レーザー + ミラジェット + ジュベルック ボリューム 3cc / 1回",
  "여드름 흉터 패키지": "ニキビ跡パッケージ",
  "시크릿 + 모피우스 + 미라젯 + 쥬베룩 볼륨 + 서브시전 / 1회":
    "シークレット + モーフィアス + ミラジェット + ジュベルック ボリューム + サブシジョン / 1回",
  "색소": "色素",
  "기미 · 잡티 · 색소를 열 번에 걸쳐 차분히 걷어냅니다":
    "シミ・くすみ・色素を10回かけてじっくり取り除きます",
  "얼굴 전체 색소 트리플 패키지": "顔全体 色素トリプルパッケージ",
  "색소레이저 3종 + GA 필링 + LDM 진정관리 / 10회":
    "色素レーザー3種 + GAピーリング + LDM鎮静ケア / 10回",
  "수분 & 광채": "保湿 & ツヤ",
  "건조해지는 계절, 속부터 채우는 수분과 맑은 광채":
    "乾燥する季節に、内側から満たす保湿と澄んだツヤ",
  "가을 수분 · 탄력 충전": "秋の保湿・ハリチャージ",
  "스킨바이브 2cc + LDM 12분 진정관리": "スキンバイブ 2cc + LDM 12分鎮静ケア",
  "선샤인 글로우 부스터 3cc": "サンシャイン グロウブースター 3cc",
  "선샤인 글로우 부스터 6cc": "サンシャイン グロウブースター 6cc",
  "한 번에 차오르는 맑은 광채": "一度で満ちる澄んだツヤ",
  "선샤인 커스텀 스킨보톡스": "サンシャイン カスタムスキンボトックス",
  "한 번에 매끈하게 정돈하는 피부 컨디션 케어": "一度でなめらかに整える肌コンディションケア",
  "가을이 오면,": "秋が来たら、",
  "선샤인 10월 이벤트": "サンシャイン10月イベント",
  "9월, 다시 만나는": "9月、また出会う",
  "선샤인 베스트 이벤트": "サンシャイン ベストイベント",
  // 月間ベスト
  "10월 베스트 혜택 · 가격 보기": "10月ベスト特典・価格を見る",
  "선샤인의원 10월 베스트 이벤트": "サンシャインクリニック 10月ベストイベント",
  "9월 베스트 혜택 · 가격 보기": "9月ベスト特典・価格を見る",
  "선샤인의원 9월 베스트 이벤트": "サンシャインクリニック 9月ベストイベント",
  "많이 찾아주셨던 리프팅 조합을 이번 달 다시 만나보세요":
    "ご要望の多かったリフティングの組み合わせを今月も再びご用意しました",
  "얼굴에서 가장 먼저 눈에 띄는 눈가 탄력, 아이써마지로 집중 관리":
    "最初に年齢が出る目元のハリを、アイサーマジで集中ケア",
  "점 · 쥐젖 · 편평사마귀 · 비립종까지, 얼굴 전체를 한 번에":
    "ほくろ・スキンタッグ・扁平疣贅・稗粒腫まで、顔全体を一度に",
  "반복되는 트러블 피부를 위한 새로운 선택, 도입 기념 3회 집중 프로그램":
    "繰り返すトラブル肌への新しい選択。導入記念の3回集中プログラム",
  "수분감부터 피부결 · 탄력 · 자연스러운 볼륨까지, 지금 고민에 맞춰":
    "うるおいから肌質・ハリ・自然なボリュームまで、今のお悩みに合わせて",
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
  "팝업 닫기": "关闭弹窗",
  "이벤트 전환": "切换活动",
  "가격표 보기": "查看价格表",
  "10월 진료 안내": "10月门诊安排",
  "안심 수면마취 안내": "舒适镇静安全说明",
  "구분": "项目",
  "부가세(VAT) 별도": "不含增值税",
  // 考生 SPECIAL
  "수고한 너를 위한,": "致辛苦的你，",
  "수험생 할인 이벤트": "考生折扣活动",
  "리프팅 10% · 여드름 색소 홍조 흉터 모공 20%":
    "提拉 10% · 痘痘 · 色素 · 泛红 · 疤痕 · 毛孔 20%",
  "수험생 할인 자세히 보기": "查看考生折扣详情",
  "선샤인의원 수험생 SPECIAL EVENT": "Sunshine 医院 考生 SPECIAL EVENT",
  "수험생 할인": "考生折扣",
  "수험생 본인과 가족까지, 수험표를 지참하시면 할인해 드립니다":
    "考生本人及家属，凭准考证即可享受折扣",
  "여드름 · 색소 · 홍조 · 흉터 · 모공": "痘痘 · 色素 · 泛红 · 疤痕 · 毛孔",
  "울쎄라 · 써마지 · 슈링크 등 리프팅 시술":
    "超声刀 · 热玛吉 · 超声炮等提拉项目",
  "레이저 · 필링 · 스킨부스터 등 해당 시술":
    "激光 · 换肤 · 水光针等相关项目",
  "수험표 지참 시": "凭准考证",
  "염증주사 · 보톡스 · 보험진료는 할인 대상에서 제외되며, 10월 가을 이벤트와 중복 적용은 불가합니다.":
    "消炎针 · 肉毒 · 医保诊疗不在折扣范围内，且不可与十月秋季活动叠加使用。",
  // 十月秋季活动
  "10월 가을 이벤트 · 가격 보기": "查看十月秋季优惠及价格",
  "선샤인의원 10월 가을 이벤트": "Sunshine 医院 十月秋季活动",
  "이중턱부터 얼굴 전체 탄력까지, 원하는 만큼 골라 받는 가을 리프팅":
    "从双下巴到全脸紧致，按需自选的秋季提拉",
  "이중턱 삭제 · V라인 리프팅": "消除双下巴 · V线条提拉",
  "울쎄라 400샷 + 인모드 Mini FX + 인모드 FORMA + 커스텀 스킨보톡스":
    "超声刀400发 + INMODE Mini FX + INMODE FORMA + 定制水光肉毒",
  "탄력 UP · V라인 리프팅": "紧致UP · V线条提拉",
  "써마지 FLX 600샷 + 슈링크 유니버스 500샷 + 커스텀 스킨보톡스":
    "热玛吉FLX 600发 + 超声炮Universe 500发 + 定制水光肉毒",
  "프리미엄 토탈 리프팅": "高端全面提拉",
  "울쎄라 300샷 + 써마지 FLX 600샷 + 리쥬란 HB 2cc + 커스텀 스킨보톡스":
    "超声刀300发 + 热玛吉FLX 600发 + 丽珠兰 HB 2cc + 定制水光肉毒",
  "부담 없이 시작하는 부분 집중 리프팅": "轻松入门的局部集中提拉",
  "슈링크 유니버스 100샷": "超声炮Universe 100发",
  "모공 & 흉터": "毛孔 & 痘疤",
  "넓어진 모공과 남아 있는 여드름 흉터를 한 번에 정돈합니다":
    "一次处理粗大毛孔与残留痘疤",
  "모공 · 피부결 집중 케어": "毛孔 · 肤质集中护理",
  "시크릿 모공레이저 + 미라젯 + 쥬베룩 볼륨 3cc / 1회":
    "Secret 毛孔激光 + Mirajet + Juvelook Volume 3cc / 1次",
  "여드름 흉터 패키지": "痘疤套餐",
  "시크릿 + 모피우스 + 미라젯 + 쥬베룩 볼륨 + 서브시전 / 1회":
    "Secret + Morpheus + Mirajet + Juvelook Volume + 皮下剥离 / 1次",
  "색소": "色素",
  "기미 · 잡티 · 색소를 열 번에 걸쳐 차분히 걷어냅니다":
    "黄褐斑 · 斑点 · 色素，分十次循序淡化",
  "얼굴 전체 색소 트리플 패키지": "全脸色素三重套餐",
  "색소레이저 3종 + GA 필링 + LDM 진정관리 / 10회":
    "色素激光3种 + GA换肤 + LDM舒缓护理 / 10次",
  "수분 & 광채": "补水 & 光泽",
  "건조해지는 계절, 속부터 채우는 수분과 맑은 광채":
    "在转干的季节，由内补足水分与通透光泽",
  "가을 수분 · 탄력 충전": "秋季补水 · 紧致充能",
  "스킨바이브 2cc + LDM 12분 진정관리": "SkinVive 2cc + LDM 12分钟舒缓护理",
  "선샤인 글로우 부스터 3cc": "Sunshine 光采精华 3cc",
  "선샤인 글로우 부스터 6cc": "Sunshine 光采精华 6cc",
  "한 번에 차오르는 맑은 광채": "一次补足的通透光采",
  "선샤인 커스텀 스킨보톡스": "Sunshine 定制水光肉毒",
  "한 번에 매끈하게 정돈하는 피부 컨디션 케어": "一次抚平、整体调理的肌肤状态护理",
  "가을이 오면,": "秋天来了，",
  "선샤인 10월 이벤트": "Sunshine 十月活动",
  "9월, 다시 만나는": "九月，再次相遇的",
  "선샤인 베스트 이벤트": "Sunshine 精选活动",
  // 每月精选
  "10월 베스트 혜택 · 가격 보기": "查看十月精选优惠及价格",
  "선샤인의원 10월 베스트 이벤트": "Sunshine 医院 十月精选活动",
  "9월 베스트 혜택 · 가격 보기": "查看九月精选优惠及价格",
  "선샤인의원 9월 베스트 이벤트": "Sunshine 医院 九月精选活动",
  "많이 찾아주셨던 리프팅 조합을 이번 달 다시 만나보세요":
    "最多人指名的提拉组合，本月再次回归",
  "얼굴에서 가장 먼저 눈에 띄는 눈가 탄력, 아이써마지로 집중 관리":
    "眼周最先显露年龄，用眼部热玛吉集中护理",
  "점 · 쥐젖 · 편평사마귀 · 비립종까지, 얼굴 전체를 한 번에":
    "痣 · 软纤维瘤 · 扁平疣 · 粟丘疹，全脸一次处理",
  "반복되는 트러블 피부를 위한 새로운 선택, 도입 기념 3회 집중 프로그램":
    "反复长痘肌肤的新选择，引进纪念 3 次集中疗程",
  "수분감부터 피부결 · 탄력 · 자연스러운 볼륨까지, 지금 고민에 맞춰":
    "从水润到肤质 · 弹力 · 自然饱满，按当下的困扰来搭配",
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

/**
 * 캠페인 데이터에서 새로 추가된 문구. 기존 대역표와 분리해 두면 이벤트를
 * 교체할 때 번역 누락 검사를 쉽게 할 수 있다.
 */
const CAMPAIGN_SUPPLEMENT: Record<string, Record<string, string>> = {
  en: {
    "11월 프로모션 · 가격 보기": "See November offers & prices",
    "선샤인의원 11월 프로모션": "Sunshine Clinic November Promotion",
    "11월 프로모션": "November Promotion",
    "리프팅 · 콜라겐 스킨/볼륨 부스터 · 모공/흉터 · 색소 · 제모":
      "Lifting · Collagen skin/volume boosters · Pores/scars · Pigmentation · Hair removal",
    "11월": "November",
    "울쎄라 400샷": "Ulthera 400 shots",
    "써마지 600샷": "Thermage 600 shots",
    "셀르디엠 · 리투오 · 쥬베룩 볼륨 중 1개 선택":
      "Choose one: Cell DM · Rituo · Juvelook Volume",
    "콜라겐 스킨 / 볼륨 부스터": "Collagen Skin / Volume Booster",
    "레디어스 1병": "Radiesse 1 vial",
    "스킨바이브 2cc + LDM 수분관리": "SkinVive 2cc + LDM hydration care",
    "쥬베룩 볼륨 3cc": "Juvelook Volume 3cc",
    "쥬베룩 볼륨 1병": "Juvelook Volume 1 vial",
    "여드름 모공 패키지": "Acne pore package",
    "시크릿 + 모피우스 + 미라젯 + 쥬베룩 볼륨 + 시너지필 + 서브시전":
      "Secret + Morpheus + Mirajet + Juvelook Volume + Synergy Peel + subcision",
    "시크릿 + 미라젯 + 쥬베룩 볼륨": "Secret + Mirajet + Juvelook Volume",
    "색소 트리플 패키지 10회": "Pigmentation triple package, 10 sessions",
    "스타워커 + 클라리티 + 브이빔 + GA 필링 + LDM":
      "StarWalker + Clarity + Vbeam + GA peel + LDM",
    "제모 무제한": "Unlimited Hair Removal",
    "얼굴 전체 제모 · 1년 무제한": "Full-face hair removal · unlimited for 1 year",
    "인중 제모 · 1년 무제한": "Upper-lip hair removal · unlimited for 1 year",
    "인중 / 앞턱 제모 · 1년 무제한":
      "Upper-lip / front-chin hair removal · unlimited for 1 year",
    "겨드랑이 제모 · 1년 무제한": "Underarm hair removal · unlimited for 1 year",
    "염증주사 · 보톡스 · 보험진료는 할인 대상에서 제외되며, 11월 프로모션과 중복 적용은 불가합니다.":
      "Anti-inflammatory injections, botox and insurance-covered care are excluded, and this cannot be combined with the November promotion.",
    "가을이 오면, 선샤인 10월 이벤트": "When autumn comes — Sunshine October Event",
    "리프팅부터 모공 · 흉터 · 색소 · 수분까지, 가을 피부에 필요한 것만.":
      "From lifting to pores, scars, pigmentation and hydration — only what autumn skin needs.",
    "10월 한정": "October only",
    "무조건 많은 시술보다, 지금 내 피부에 필요한 시술을. 원장님과 충분한 진료 후 피부 상태와 원하는 방향에 맞춰 결정합니다.":
      "Not more treatments, but the treatments your skin needs now. Your plan is decided with the doctor after a full consultation.",
    "수고한 너를 위한, 수험생 할인 이벤트": "For all your hard work — Exam Student Discount Event",
    "수험생 본인과 수험생 가족까지, 수험표 지참 시.":
      "For exam students and their families, with an exam admission ticket.",
    "수험생 한정": "Exam students only",
    "9월, 다시 만나는 선샤인 베스트 이벤트": "September — Sunshine Best Event returns",
    "많이 찾아주셨던 시술부터 새롭게 준비한 프로그램까지.":
      "From our most requested treatments to newly prepared programs.",
    "9월 한정": "September only",
    "리프팅 앵콜": "Lifting Encore",
    "많이 찾아주셨던 리프팅 조합을 9월 한 달 다시 만나보세요":
      "Our most requested lifting combinations return throughout September",
    "울쎄라 피프라임 300샷": "Ulthera Prime 300 shots",
    "울쎄라 피프라임 400샷": "Ulthera Prime 400 shots",
    "써마지 FLX 300샷": "Thermage FLX 300 shots",
    "써마지 FLX 600샷": "Thermage FLX 600 shots",
    "리쥬란 HB 2cc + 아이리쥬란 1cc 서비스": "Rejuran HB 2cc + Eye Rejuran 1cc included",
    "눈가 리프팅": "Eye-area lifting",
    "아이써마지 225샷": "Eye Thermage 225 shots",
    "아이써마지 450샷": "Eye Thermage 450 shots",
    "얼굴전체 지우개": "Full-face blemish removal",
    "얼굴전체 100개 기준": "Full face, based on 100 lesions",
    "부위는 목으로 변경 가능": "Treatment area may be changed to the neck",
    "얼굴전체 50개 기준": "Full face, based on 50 lesions",
    "골드PTT": "Gold PTT",
    "골드PTT 3회": "Gold PTT, 3 sessions",
    "아쿠아필 포함": "Includes Aqua Peel",
    "스킨부스터 & 볼륨": "Skin Booster & Volume",
    "스킨바이브 1cc": "SkinVive 1cc",
    "엘란쎄 1cc": "Ellansé 1cc",
    "리쥬란 힐러 2cc": "Rejuran Healer 2cc",
    "오랜 준비 끝에, 선샤인의원이 문을 열었습니다.":
      "After long preparation, Sunshine Clinic has opened its doors.",
    "오픈 특별가": "Special opening price",
    "처음 만나는 선샤인, 나에게 꼭 필요한 시술부터.":
      "Your first visit to Sunshine starts with what you truly need.",
    "첫 방문 혜택": "First-visit benefit",
  },
  ja: {
    "11월 프로모션 · 가격 보기": "11月プロモーション・価格を見る",
    "선샤인의원 11월 프로모션": "サンシャインクリニック 11月プロモーション",
    "11월 프로모션": "11月プロモーション",
    "리프팅 · 콜라겐 스킨/볼륨 부스터 · 모공/흉터 · 색소 · 제모":
      "リフティング · コラーゲンスキン/ボリュームブースター · 毛穴/ニキビ跡 · 色素 · 脱毛",
    "11월": "11月",
    "울쎄라 400샷": "ウルセラ 400ショット",
    "써마지 600샷": "サーマジ 600ショット",
    "셀르디엠 · 리투오 · 쥬베룩 볼륨 중 1개 선택":
      "セルDM · リトゥオ · ジュベルックボリュームから1つ選択",
    "콜라겐 스킨 / 볼륨 부스터": "コラーゲンスキン / ボリュームブースター",
    "레디어스 1병": "レディエッセ 1本",
    "스킨바이브 2cc + LDM 수분관리": "スキンバイブ 2cc + LDM保湿ケア",
    "쥬베룩 볼륨 3cc": "ジュベルックボリューム 3cc",
    "쥬베룩 볼륨 1병": "ジュベルックボリューム 1本",
    "여드름 모공 패키지": "ニキビ毛穴パッケージ",
    "시크릿 + 모피우스 + 미라젯 + 쥬베룩 볼륨 + 시너지필 + 서브시전":
      "シークレット + モーフィアス + ミラジェット + ジュベルックボリューム + シナジーピール + サブシジョン",
    "시크릿 + 미라젯 + 쥬베룩 볼륨":
      "シークレット + ミラジェット + ジュベルックボリューム",
    "색소 트리플 패키지 10회": "色素トリプルパッケージ 10回",
    "스타워커 + 클라리티 + 브이빔 + GA 필링 + LDM":
      "スタ－ウォーカー + クラリティ + Vビーム + GAピーリング + LDM",
    "제모 무제한": "脱毛無制限",
    "얼굴 전체 제모 · 1년 무제한": "顔全体脱毛 · 1年間無制限",
    "인중 제모 · 1년 무제한": "鼻下脱毛 · 1年間無制限",
    "인중 / 앞턱 제모 · 1년 무제한": "鼻下 / あご先脱毛 · 1年間無制限",
    "겨드랑이 제모 · 1년 무제한": "ワキ脱毛 · 1年間無制限",
    "염증주사 · 보톡스 · 보험진료는 할인 대상에서 제외되며, 11월 프로모션과 중복 적용은 불가합니다.":
      "炎症注射・ボトックス・保険診療は割引対象外で、11月プロモーションとの併用はできません。",
    "가을이 오면, 선샤인 10월 이벤트": "秋が来たら、サンシャイン10月イベント",
    "리프팅부터 모공 · 흉터 · 색소 · 수분까지, 가을 피부에 필요한 것만.":
      "リフティングから毛穴・傷跡・色素・保湿まで、秋の肌に必要なものだけ。",
    "10월 한정": "10月限定",
    "무조건 많은 시술보다, 지금 내 피부에 필요한 시술을. 원장님과 충분한 진료 후 피부 상태와 원하는 방향에 맞춰 결정합니다.":
      "施術の多さではなく、今の肌に必要な施術を。院長との十分な診療のうえ、肌状態とご希望に合わせて決定します。",
    "수고한 너를 위한, 수험생 할인 이벤트": "頑張ったあなたへ、受験生割引イベント",
    "수험생 본인과 수험생 가족까지, 수험표 지참 시.": "受験生ご本人とご家族まで、受験票のご提示で。",
    "수험생 한정": "受験生限定",
    "9월, 다시 만나는 선샤인 베스트 이벤트": "9月、再び出会うサンシャインベストイベント",
    "많이 찾아주셨던 시술부터 새롭게 준비한 프로그램까지.":
      "人気の施術から新しくご用意したプログラムまで。",
    "9월 한정": "9月限定",
    "리프팅 앵콜": "リフティング アンコール",
    "많이 찾아주셨던 리프팅 조합을 9월 한 달 다시 만나보세요":
      "ご要望の多かったリフティングの組み合わせを9月限定で再びご用意しました",
    "울쎄라 피프라임 300샷": "ウルセラプライム 300ショット",
    "울쎄라 피프라임 400샷": "ウルセラプライム 400ショット",
    "써마지 FLX 300샷": "サーマジFLX 300ショット",
    "써마지 FLX 600샷": "サーマジFLX 600ショット",
    "리쥬란 HB 2cc + 아이리쥬란 1cc 서비스": "リジュランHB 2cc + アイリジュラン1cc付き",
    "눈가 리프팅": "目元リフティング",
    "아이써마지 225샷": "アイサーマジ 225ショット",
    "아이써마지 450샷": "アイサーマジ 450ショット",
    "얼굴전체 지우개": "顔全体スポットケア",
    "얼굴전체 100개 기준": "顔全体100個基準",
    "부위는 목으로 변경 가능": "施術部位は首へ変更可能",
    "얼굴전체 50개 기준": "顔全体50個基準",
    "골드PTT": "ゴールドPTT",
    "골드PTT 3회": "ゴールドPTT 3回",
    "아쿠아필 포함": "アクアピール付き",
    "스킨부스터 & 볼륨": "スキンブースター & ボリューム",
    "스킨바이브 1cc": "スキンバイブ 1cc",
    "엘란쎄 1cc": "エランセ 1cc",
    "리쥬란 힐러 2cc": "リジュランヒーラー 2cc",
    "오랜 준비 끝에, 선샤인의원이 문을 열었습니다.": "長い準備を経て、サンシャインクリニックが開院しました。",
    "오픈 특별가": "オープン特別価格",
    "처음 만나는 선샤인, 나에게 꼭 필요한 시술부터.":
      "初めてのサンシャインでは、あなたに本当に必要な施術から。",
    "첫 방문 혜택": "初回ご来院特典",
  },
  zh: {
    "11월 프로모션 · 가격 보기": "查看11月优惠与价格",
    "선샤인의원 11월 프로모션": "Sunshine诊所11月优惠活动",
    "11월 프로모션": "11月优惠活动",
    "리프팅 · 콜라겐 스킨/볼륨 부스터 · 모공/흉터 · 색소 · 제모":
      "提拉 · 胶原肌肤/丰盈针 · 毛孔/痘疤 · 色素 · 脱毛",
    "11월": "11月",
    "울쎄라 400샷": "Ulthera 400发",
    "써마지 600샷": "Thermage 600发",
    "셀르디엠 · 리투오 · 쥬베룩 볼륨 중 1개 선택":
      "Cell DM · Rituo · Juvelook Volume 三选一",
    "콜라겐 스킨 / 볼륨 부스터": "胶原肌肤 / 丰盈针",
    "레디어스 1병": "Radiesse 1瓶",
    "스킨바이브 2cc + LDM 수분관리": "SkinVive 2cc + LDM补水护理",
    "쥬베룩 볼륨 3cc": "Juvelook Volume 3cc",
    "쥬베룩 볼륨 1병": "Juvelook Volume 1瓶",
    "여드름 모공 패키지": "痘痘毛孔套餐",
    "시크릿 + 모피우스 + 미라젯 + 쥬베룩 볼륨 + 시너지필 + 서브시전":
      "Secret + Morpheus + Mirajet + Juvelook Volume + Synergy Peel + 皮下松解",
    "시크릿 + 미라젯 + 쥬베룩 볼륨": "Secret + Mirajet + Juvelook Volume",
    "색소 트리플 패키지 10회": "色素三重套餐 10次",
    "스타워커 + 클라리티 + 브이빔 + GA 필링 + LDM":
      "StarWalker + Clarity + Vbeam + GA焕肤 + LDM",
    "제모 무제한": "无限次脱毛",
    "얼굴 전체 제모 · 1년 무제한": "全脸脱毛 · 1年无限次",
    "인중 제모 · 1년 무제한": "上唇脱毛 · 1年无限次",
    "인중 / 앞턱 제모 · 1년 무제한": "上唇 / 下巴前侧脱毛 · 1年无限次",
    "겨드랑이 제모 · 1년 무제한": "腋下脱毛 · 1年无限次",
    "염증주사 · 보톡스 · 보험진료는 할인 대상에서 제외되며, 11월 프로모션과 중복 적용은 불가합니다.":
      "消炎针、肉毒及医保诊疗不在折扣范围内，且不可与11月优惠活动叠加使用。",
    "가을이 오면, 선샤인 10월 이벤트": "秋天来了，Sunshine 十月活动",
    "리프팅부터 모공 · 흉터 · 색소 · 수분까지, 가을 피부에 필요한 것만.":
      "从提拉到毛孔、疤痕、色素与补水，只选择秋季肌肤真正需要的。",
    "10월 한정": "十月限定",
    "무조건 많은 시술보다, 지금 내 피부에 필요한 시술을. 원장님과 충분한 진료 후 피부 상태와 원하는 방향에 맞춰 결정합니다.":
      "不在于项目多，而在于选择肌肤当下真正需要的项目。与院长充分面诊后，根据肌肤状态与期望方向决定方案。",
    "수고한 너를 위한, 수험생 할인 이벤트": "致辛苦的你，考生折扣活动",
    "수험생 본인과 수험생 가족까지, 수험표 지참 시.": "考生本人及家属凭准考证即可参加。",
    "수험생 한정": "考生限定",
    "9월, 다시 만나는 선샤인 베스트 이벤트": "九月，再次相遇的 Sunshine 精选活动",
    "많이 찾아주셨던 시술부터 새롭게 준비한 프로그램까지.":
      "从备受欢迎的项目到全新准备的方案。",
    "9월 한정": "九月限定",
    "리프팅 앵콜": "提拉返场",
    "많이 찾아주셨던 리프팅 조합을 9월 한 달 다시 만나보세요":
      "广受欢迎的提拉组合于九月限时返场",
    "울쎄라 피프라임 300샷": "Ulthera Prime 300发",
    "울쎄라 피프라임 400샷": "Ulthera Prime 400发",
    "써마지 FLX 300샷": "Thermage FLX 300发",
    "써마지 FLX 600샷": "Thermage FLX 600发",
    "리쥬란 HB 2cc + 아이리쥬란 1cc 서비스": "Rejuran HB 2cc + 眼周Rejuran 1cc赠送",
    "눈가 리프팅": "眼周提拉",
    "아이써마지 225샷": "眼周Thermage 225发",
    "아이써마지 450샷": "眼周Thermage 450发",
    "얼굴전체 지우개": "全脸斑点清除",
    "얼굴전체 100개 기준": "全脸按100处计算",
    "부위는 목으로 변경 가능": "治疗部位可更换为颈部",
    "얼굴전체 50개 기준": "全脸按50处计算",
    "골드PTT": "黄金PTT",
    "골드PTT 3회": "黄金PTT 3次",
    "아쿠아필 포함": "含Aqua Peel",
    "스킨부스터 & 볼륨": "水光针 & 填充",
    "스킨바이브 1cc": "SkinVive 1cc",
    "엘란쎄 1cc": "Ellansé 1cc",
    "리쥬란 힐러 2cc": "Rejuran Healer 2cc",
    "오랜 준비 끝에, 선샤인의원이 문을 열었습니다.": "经过长时间准备，Sunshine 诊所正式开业。",
    "오픈 특별가": "开业特价",
    "처음 만나는 선샤인, 나에게 꼭 필요한 시술부터.":
      "初次来到 Sunshine，从真正适合你的项目开始。",
    "첫 방문 혜택": "初次到院优惠",
  },
};

const DICTS: Record<string, Record<string, string>> = {
  en: { ...EN, ...CAMPAIGN_SUPPLEMENT.en },
  ja: { ...JA, ...CAMPAIGN_SUPPLEMENT.ja },
  zh: { ...ZH, ...CAMPAIGN_SUPPLEMENT.zh },
};

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
    kicker: tr(c.kicker, locale),
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
    tabLabel: tr(ev.tabLabel, locale),
    tabShort: ev.tabShort ? tr(ev.tabShort, locale) : ev.tabShort,
    period: tr(ev.period, locale),
    ctaLabel: tr(ev.ctaLabel, locale),
    posterAlt: tr(ev.posterAlt, locale),
    eyebrow: tr(ev.eyebrow, locale),
    title: tr(ev.title, locale),
    subtitle: tr(ev.subtitle, locale),
    pillLabel: tr(ev.pillLabel, locale),
    // 커버 위 타이틀도 화면에서 그리므로 함께 번역한다 (영문 줄은 사전에 없으면 그대로 통과)
    posterOverlay: ev.posterOverlay && {
      kicker: tr(ev.posterOverlay.kicker, locale),
      titleLines: ev.posterOverlay.titleLines.map((line) => tr(line, locale)),
      sub: tr(ev.posterOverlay.sub, locale),
    },
    vatNote: tr(ev.vatNote, locale),
    closingCopy: tr(ev.closingCopy, locale),
    categories: ev.categories.map((c) => localizeCategory(c, locale)),
  };
}
