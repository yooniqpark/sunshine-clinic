/**
 * 홈 팝업의 "오늘 하루 보지 않기" 상태 관리.
 *
 * 팝업이 여러 개 순차로 뜨므로, "오늘 하루 보지 않기"는 누른 팝업 하나가 아니라
 * 오늘 뜰 팝업 전체에 적용한다. (하나만 숨기면 바로 다음 팝업이 떠서 눌러도 안 눌린 것처럼 보인다.)
 */

const PREFIX = "sunshine-popup:";

/** 팝업 전체를 오늘 하루 숨기는 공용 키 */
const HIDE_ALL_KEY = PREFIX + "all";

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** 공용 키 또는 개별 키가 오늘 날짜면 숨긴다 (개별 키는 이전 버전 호환) */
export function isHiddenToday(popupId: string) {
  try {
    const today = todayStr();
    return (
      localStorage.getItem(HIDE_ALL_KEY) === today ||
      localStorage.getItem(PREFIX + popupId) === today
    );
  } catch {
    return false;
  }
}

/** 오늘 하루 모든 홈 팝업 숨기기 */
export function hideAllToday() {
  try {
    localStorage.setItem(HIDE_ALL_KEY, todayStr());
  } catch {
    /* localStorage 사용 불가 — 이번 세션에만 닫힌다 */
  }
}
