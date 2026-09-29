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
  // 10월 가을 이벤트
  "10월 가을 이벤트 · 가격 보기": "See October autumn offers & prices",
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
  "구분": "区分",
  "부가세(VAT) 별도": "VAT別途",
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
  "구분": "项目",
  "부가세(VAT) 별도": "不含增值税",
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
