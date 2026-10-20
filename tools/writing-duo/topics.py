"""
주제 중복 확인: 새로 쓸 주제가 예전에 쓴 글(이 프로그램의 대화 기록 + 이미 올린 글 목록)과
겹치는지 토론을 시작하기 전에 확인합니다.
- 로그인돼 있으면 Claude가 뜻으로 비교하고 (예: "모공 치료" ≈ "넓은 모공 시술"), 겹치지 않는 각도를 제안합니다.
- 연습 모드이거나 로그인이 안 돼 있으면 글자 비교로 대신합니다.
"""

import json
import re
from pathlib import Path

import db
import duo

PUBLISHED = Path(__file__).resolve().parent / "data" / "이미_올린_글.txt"
AVOID_HEADER = "[이미 쓴 비슷한 글 - 주제·구성·소제목이 겹치지 않게 다른 각도로 쓸 것]"
MAX_ITEMS = 150  # AI에게 보낼 과거 글 수 (최근 순)

# 요청문에 흔히 들어가지만 주제와는 상관없는 말
STOP = set("""글 블로그 유튜브 대본 영상 써줘 써주세요 작성 작성해줘 대해서 대해 관련 내용 주제 대상 분량 말투 자
친근한 존댓말 신뢰감 있게 차분하고 밝고 정도 우리 병원 병원에서 선샤인 선샤인의원 의원 피부과 검색 키워드
이용해서 이용한 사용하고 같은 같이 하고 해서 그리고 알아야 할 것들 가지 방법 정리 소개
시술 치료 종류 효과 관리 관리법 차이 비교 주의사항 전에 후 처음 꼭""".split())


# ─────────────────────────────────────────────
# 이미 올린 글 목록 (한 줄에 제목 하나)
# ─────────────────────────────────────────────
def load_published() -> str:
    return PUBLISHED.read_text(encoding="utf-8") if PUBLISHED.exists() else ""


def save_published(text: str):
    PUBLISHED.parent.mkdir(parents=True, exist_ok=True)
    PUBLISHED.write_text(text.strip() + "\n", encoding="utf-8")


# ─────────────────────────────────────────────
# 비교할 과거 글 모으기
# ─────────────────────────────────────────────
def outline(draft: str) -> tuple[str, list[str]]:
    """원고에서 제목(#)과 소제목(##)만 뽑습니다."""
    title, heads = "", []
    for line in draft.splitlines():
        m = re.match(r"^(#{1,3})\s+(.*)", line.strip())
        if not m:
            continue
        text = m.group(2).strip().strip("*")
        if len(m.group(1)) == 1 and not title:
            title = text
        elif len(m.group(1)) >= 2:
            heads.append(text)
    return title, heads[:10]


def request_text(brief: str) -> str:
    """의뢰서에서 '글 종류' 줄과 중복 회피 안내를 빼고 사용자가 적은 요청만 남깁니다."""
    brief = brief.split(AVOID_HEADER)[0].split("[이번 글의 각도")[0]
    return "\n".join(l for l in brief.splitlines() if not l.startswith("글 종류:")).strip()


def past_items() -> list[dict]:
    items = []
    for c in db.list_conversations()[:MAX_ITEMS]:
        conv = db.get_conversation(c["id"])
        last = db.last_of_type(c["id"], "draft")
        title, heads = outline(last["content"]) if last else ("", [])
        items.append({
            "key": f"c{c['id']}", "id": c["id"], "source": "이 프로그램에서 쓴 글", "kind": c["kind"],
            "date": (conv["created_at"] or "")[:10], "title": title or c["title"], "heads": heads,
            "request": request_text(conv["brief"])[:200],
        })
    for i, line in enumerate(l.strip() for l in load_published().splitlines()):
        if line:
            items.append({"key": f"p{i}", "id": None, "source": "이미 올린 글", "kind": "", "date": "",
                          "title": line[:120], "heads": [], "request": ""})
    return items


def item_text(it: dict) -> str:
    return " ".join([it["title"], *it["heads"], it["request"]])


# ─────────────────────────────────────────────
# 글자 비교 (연습 모드·로그인 전)
# ─────────────────────────────────────────────
def _grams(text: str) -> set[str]:
    words = [w for w in re.findall(r"[0-9A-Za-z가-힣]+", text.lower()) if w not in STOP]
    grams = set()
    for w in words:
        if len(w) < 2:
            continue
        grams.update(w[i:i + 2] for i in range(len(w) - 1))
    return grams


def local_check(text: str, items: list[dict]) -> dict:
    new = _grams(text)
    scored = []
    for it in items:
        old = _grams(item_text(it))
        if not new or not old:
            continue
        common = new & old
        score = len(common) / min(len(new), len(old))  # 짧은 쪽 기준으로 얼마나 겹치는지
        if score >= 0.3 and len(common) >= 2:
            scored.append((score, it, common))
    scored.sort(key=lambda x: -x[0])
    return {
        "method": "글자 비교",
        "matches": [{**it, "level": "높음" if s >= 0.6 else "보통",
                     "reason": "겹치는 말: " + ", ".join(sorted(common)[:8])} for s, it, common in scored[:5]],
        "suggestion": "",
    }


# ─────────────────────────────────────────────
# AI 비교 (Claude)
# ─────────────────────────────────────────────
CHECK_SYSTEM = """너는 병원 블로그·유튜브 채널의 콘텐츠 편집장이다.
새로 쓰려는 주제가 이미 쓴 글과 겹치는지 판단한다.
- 같은 시술·고민을 같은 관점(대상, 핵심 질문, 구성)으로 다루면 겹친다. 단어가 달라도 뜻이 같으면 겹친다.
- 같은 시술이라도 관점이 분명히 다르면(예: 시술 원리 vs 시술 후 관리, 첫 시술자용 vs 재시술자용) 겹침 정도를 낮게 본다.
- 겹치는 글이 있으면, 이미 쓴 글과 겹치지 않으면서 의뢰 내용은 살리는 새 각도를 한두 문장으로 제안한다.

반드시 아래 JSON 형식으로만 답한다. 겹치는 글이 없으면 matches는 빈 배열, suggestion은 빈 문자열.
{
  "matches": [{"key": "목록의 key", "level": "높음 또는 보통", "reason": "어떤 점이 겹치는지 한 문장"}],
  "suggestion": "겹치지 않는 새 각도 제안"
}"""


def ai_check(text: str, items: list[dict], ai: "duo.AI") -> dict:
    lines = []
    for it in items:
        heads = f" / 소제목: {', '.join(it['heads'])}" if it["heads"] else ""
        req = f" / 요청: {it['request']}" if it["request"] else ""
        lines.append(f"- key={it['key']} [{it['source']}] {it['title']}{heads}{req}")
    raw = ai.ask("claude", CHECK_SYSTEM, f"[새로 쓰려는 주제]\n{text}\n\n[이미 쓴 글 목록]\n" + "\n".join(lines),
                 want_json=True)
    m = re.search(r"\{.*\}", raw, re.S)
    data = json.loads(m.group(0) if m else raw)
    by_key = {it["key"]: it for it in items}
    matches = []
    for x in data.get("matches") or []:
        it = by_key.get(str(x.get("key")))
        if it:
            matches.append({**it, "level": x.get("level") or "보통", "reason": x.get("reason") or ""})
    return {"method": "Claude가 뜻으로 비교", "matches": matches[:5],
            "suggestion": (data.get("suggestion") or "").strip() if matches else ""}


def check(text: str, demo: bool) -> dict:
    items = past_items()
    if not items:
        return {"method": "", "matches": [], "suggestion": ""}
    if demo:
        return local_check(text, items)
    try:
        return ai_check(text, items, duo.AI(False, duo.settings()))
    except Exception as e:  # noqa: BLE001 — AI 확인이 안 되면 글자 비교로 대신
        result = local_check(text, items)
        result["method"] += f" (AI 확인 실패: {str(e).splitlines()[0][:80]})"
        return result


# ─────────────────────────────────────────────
# 토론에 넘길 "겹치지 말 것" 안내
# ─────────────────────────────────────────────
def avoid_block(keys: list[str]) -> str:
    by_key = {it["key"]: it for it in past_items()}
    lines = []
    for k in keys:
        it = by_key.get(k)
        if not it:
            continue
        heads = f" (소제목: {', '.join(it['heads'])})" if it["heads"] else ""
        lines.append(f"- {it['title']}{heads}")
    return f"{AVOID_HEADER}\n" + "\n".join(lines) if lines else ""
