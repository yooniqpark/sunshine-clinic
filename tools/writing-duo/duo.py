"""
글쓰기 듀오 엔진: 작가 AI와 편집자 AI가 서로 피드백을 주고받으며 글을 완성합니다.
화면은 app.py(웹페이지)가 담당하고, 이 파일은 두 AI의 대화 흐름만 담당합니다.
"""

import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv

HERE = Path(__file__).resolve().parent


def settings() -> dict:
    """.env 파일의 설정을 읽습니다. (웹페이지에서 키를 바꿔도 다시 읽도록 매번 호출)"""
    load_dotenv(HERE / ".env", override=True)
    return {
        "writer": os.getenv("WRITER", "claude").lower(),
        "claude_model": os.getenv("CLAUDE_MODEL", "claude-opus-5-5"),
        "gpt_model": os.getenv("GPT_MODEL", "gpt-5"),
        "max_revisions": int(os.getenv("MAX_REVISIONS", "3")),
        "target_score": float(os.getenv("TARGET_SCORE", "8.5")),
        "has_claude_key": bool(os.getenv("ANTHROPIC_API_KEY", "").startswith("sk-")),
        "has_gpt_key": bool(os.getenv("OPENAI_API_KEY", "").startswith("sk-")),
    }


# ─────────────────────────────────────────────
# 채점 기준표
# ─────────────────────────────────────────────
RUBRICS = {
    "youtube": {
        "도입부": "첫 15초 안에 시청자를 붙잡는가",
        "구성": "흐름이 자연스럽고 이탈 구간이 없는가",
        "정확성": "사실 오류나 과장이 없는가",
        "말하기 편함": "소리 내어 읽었을 때 자연스러운가",
        "마무리": "구독·댓글 등 행동 유도가 자연스러운가",
    },
    "blog": {
        "도입부": "제목과 첫 문단이 클릭하고 계속 읽게 만드는가",
        "구성": "소제목 구조가 명확하고 훑어보기 쉬운가",
        "정확성": "사실 오류나 과장이 없는가",
        "읽기 편함": "문장이 짧고 쉬운가",
        "마무리": "검색 키워드 반영과 행동 유도가 있는가",
    },
}
KIND_LABEL = {"youtube": "유튜브 대본", "blog": "블로그"}
NAME = {"claude": "Claude", "gpt": "GPT"}

WRITER_SYSTEM = """너는 유튜브 대본과 블로그 글을 전문으로 쓰는 작가다.
- 의뢰서의 조건(대상, 분량, 말투, 꼭 넣을 내용)을 반드시 지킨다.
- [참고 예시 글]이 있으면 그 글의 말투, 문장 길이, 구성 방식을 따라 쓴다. 단, 내용이나 문장을 그대로 베끼지 않는다.
- 편집자 피드백을 받으면 반영해 수정하되, 동의하지 않는 지적은 이유를 한 줄로 밝히고 원래대로 둬도 된다.
- 편집자가 '잘된 점'으로 꼽은 부분은 함부로 바꾸지 않는다.
- 사용자가 직접 쓴 원고를 다듬을 때는 글쓴이의 목소리와 핵심 내용을 최대한 살린다.
- 확실하지 않은 사실은 지어내지 말고 [확인 필요] 표시를 남긴다.
- 원고의 제목과 소제목은 마크다운(#, ##)으로 표시한다.

반드시 아래 형식으로만 답한다:
===원고===
(완성된 원고 전체)
===수정메모===
(이번에 무엇을 반영했고, 무엇을 왜 반영하지 않았는지. 첫 초안이면 '첫 초안')"""

EDITOR_SYSTEM = """너는 깐깐하지만 공정한 편집자다.
- 글을 직접 다시 쓰지 않는다. 점수와 수정 지시만 한다.
- 채점 기준표의 항목마다 10점 만점으로 점수를 매긴다 (소수점 한 자리 가능).
- 가장 중요한 수정 사항을 최대 3개, '위치 / 이유 / 고치는 방법'으로 구체적으로 제시한다.
- [참고 예시 글]이 있으면 그 말투와 구성을 잘 따랐는지도 함께 본다.
- 칭찬만 하지 말고, 수정할 게 정말 거의 없을 때만 no_major_changes를 true로 한다.
- 잘된 점 1~2개를 꼭 적는다 (다음 수정 때 유지되도록).
- 사실 확인이 필요한 문장이 있으면 fact_check에 적는다.

반드시 아래 JSON 형식으로만 답한다:
{
  "scores": {"항목이름": 점수, ...},
  "strengths": ["잘된 점", ...],
  "fixes": [{"where": "위치", "why": "이유", "how": "고치는 방법"}, ...],
  "fact_check": ["확인이 필요한 문장", ...],
  "no_major_changes": false
}"""

REFERENCE_LIMIT = 15000  # 참고 글이 너무 길면 앞부분만 사용 (비용 절약)


# ─────────────────────────────────────────────
# AI 호출
# ─────────────────────────────────────────────
class AI:
    def __init__(self, demo: bool, cfg: dict):
        self.demo = demo
        self.cfg = cfg
        self.demo_round = 0
        self.tokens = {"claude": 0, "gpt": 0}
        if demo:
            return
        missing = [k for k in ("ANTHROPIC_API_KEY", "OPENAI_API_KEY") if not os.getenv(k)]
        if missing:
            raise RuntimeError(
                f".env 파일에 {', '.join(missing)} 가 없습니다. "
                "README.md의 'API 키 받기'를 확인하거나, 연습 모드로 실행해 주세요."
            )
        import anthropic
        import openai

        self.claude = anthropic.Anthropic()
        self.gpt = openai.OpenAI()

    def ask(self, who: str, system: str, user: str, want_json: bool = False) -> str:
        if self.demo:
            return self._fake(want_json)
        if who == "claude":
            resp = self.claude.messages.create(
                model=self.cfg["claude_model"],
                max_tokens=16000,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
            self.tokens["claude"] += resp.usage.input_tokens + resp.usage.output_tokens
            return "".join(b.text for b in resp.content if b.type == "text")
        else:
            kwargs = {"text": {"format": {"type": "json_object"}}} if want_json else {}
            resp = self.gpt.responses.create(
                model=self.cfg["gpt_model"], instructions=system, input=user, **kwargs
            )
            if resp.usage:
                self.tokens["gpt"] += resp.usage.total_tokens
            return resp.output_text

    def _fake(self, want_json: bool) -> str:
        """연습 모드용 가짜 응답. 점수가 회차마다 오르는 모습을 보여줍니다."""
        import time

        time.sleep(0.8)
        if not want_json:
            return (
                f"===원고===\n# 연습 모드 원고 ({self.demo_round + 1}번째 버전)\n\n"
                "안녕하세요! 오늘은 **아침 피로**에 대해 이야기해 볼게요.\n\n"
                "## 첫 번째 이유\n\n- 수면 중 호흡이 끊기는 경우\n- 늦은 시간 스마트폰 사용\n\n"
                "## 마무리\n\n오늘 밤 하나만 실천해 보세요. 구독과 좋아요도 부탁드려요!\n"
                "===수정메모===\n"
                + ("첫 초안" if self.demo_round == 0 else "도입부를 질문형으로 바꿨습니다.")
            )
        self.demo_round += 1
        base = [6.5, 7.6, 8.7][min(self.demo_round - 1, 2)]
        return json.dumps(
            {
                "scores": {"도입부": base, "구성": round(base + 0.2, 1), "정확성": base,
                           "읽기 편함": round(base - 0.1, 1), "마무리": base},
                "strengths": ["말투가 친근함"],
                "fixes": [{"where": "첫 문단", "why": "궁금증이 약함",
                           "how": "질문으로 시작하기"}],
                "fact_check": ["(연습 모드 예시) 수면 무호흡 관련 통계 수치"],
                "no_major_changes": base >= 8.5,
            },
            ensure_ascii=False,
        )


def friendly_error(e: Exception) -> str:
    """API 오류를 일반인이 이해할 수 있는 말로 바꿉니다."""
    msg = str(e)
    low = msg.lower()
    who = "Claude" if "anthropic" in type(e).__module__ else "GPT" if "openai" in type(e).__module__ else ""
    if "credit balance" in low or "insufficient_quota" in low or "quota" in low:
        hint = f"{who} API 크레딧이 부족합니다. 결제 페이지에서 충전 상태를 확인해 주세요."
    elif "401" in low or "authentication" in low or "api key" in low or "api_key" in low:
        hint = f"{who} API 키가 올바르지 않습니다. .env 파일의 키를 다시 복사해 넣어 주세요."
    elif "model" in low and ("not found" in low or "does not exist" in low or "404" in low):
        hint = f"{who} 모델 이름을 쓸 수 없습니다. .env 의 모델 이름을 확인해 주세요."
    elif "rate" in low and "limit" in low:
        hint = f"{who} 요청이 너무 잦습니다. 1~2분 뒤 다시 시도해 주세요."
    elif "connection" in low or "timeout" in low:
        hint = "인터넷 연결이 불안정합니다. 잠시 뒤 다시 시도해 주세요."
    else:
        hint = "예상하지 못한 오류입니다. 아래 원문을 복사해서 Claude에게 보여주세요."
    return f"{hint}\n\n[원문] {msg[:600]}"


# ─────────────────────────────────────────────
# 도우미 함수
# ─────────────────────────────────────────────
def detect_type(brief: str) -> str:
    m = re.search(r"글\s*종류\s*[:：]\s*(.+)", brief)
    kind = m.group(1) if m else brief[:200]
    return "youtube" if re.search(r"유튜브|영상|대본|youtube", kind, re.I) else "blog"


def parse_writer(text: str) -> tuple[str, str]:
    m = re.search(r"===\s*원고\s*===\s*(.*?)\s*===\s*수정메모\s*===\s*(.*)", text, re.S)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return text.strip(), "(수정메모 없음)"


def parse_editor(text: str) -> dict:
    m = re.search(r"\{.*\}", text, re.S)
    try:
        fb = json.loads(m.group(0) if m else text)
    except json.JSONDecodeError:
        fb = {"scores": {}, "strengths": [], "fixes": [{"where": "전체", "why": "편집자 응답 형식 오류",
                                                        "how": text[:1000]}],
              "fact_check": [], "no_major_changes": False}
    scores = [float(v) for v in fb.get("scores", {}).values() if isinstance(v, (int, float))]
    fb["average"] = round(sum(scores) / len(scores), 2) if scores else 0.0
    return fb


def format_feedback(fb: dict) -> str:
    lines = ["[점수]"]
    lines += [f"- {k}: {v}" for k, v in fb.get("scores", {}).items()]
    lines.append(f"- 평균: {fb['average']}")
    lines.append("\n[잘된 점 - 유지할 것]")
    lines += [f"- {s}" for s in fb.get("strengths", [])]
    lines.append("\n[수정 지시]")
    for i, f in enumerate(fb.get("fixes", []), 1):
        lines.append(f"{i}. 위치: {f.get('where')} / 이유: {f.get('why')} / 방법: {f.get('how')}")
    if fb.get("fact_check"):
        lines.append("\n[사실 확인 필요]")
        lines += [f"- {s}" for s in fb["fact_check"]]
    return "\n".join(lines)


def rubric_text(rubric: dict) -> str:
    return "\n".join(f"- {k}: {v}" for k, v in rubric.items())


def safe_name(text: str) -> str:
    return re.sub(r"[^\w가-힣-]+", "_", text).strip("_")[:30] or "글"


# ─────────────────────────────────────────────
# 메인 흐름
# ─────────────────────────────────────────────
def run_session(job: dict, say, typing=lambda who, text: None) -> dict:
    """
    job 항목:
      brief        의뢰서(사용자 요청) 텍스트
      kind         "youtube" / "blog"
      original     시작 원고 (있으면 초안을 새로 쓰지 않고 이 글에서 출발)
      instruction  original 에 적용할 사용자 추가 요청 (있으면 작가가 먼저 반영)
      reference    참고 예시 글 (말투·구성 참고용)
      writer, target_score, max_revisions, demo

    say(role, type, content, meta)  채팅에 메시지 한 개를 남깁니다.
    typing(who, text)               "~하는 중" 표시를 바꿉니다.
    """
    cfg = settings()
    for k in ("writer", "target_score", "max_revisions"):
        if job.get(k) not in (None, ""):
            cfg[k] = job[k]
    writer = cfg["writer"] if cfg["writer"] in NAME else "claude"
    editor = "gpt" if writer == "claude" else "claude"
    target, max_rev = float(cfg["target_score"]), int(cfg["max_revisions"])

    brief = job["brief"].strip()
    kind = job.get("kind") if job.get("kind") in RUBRICS else detect_type(brief)
    rubric = RUBRICS[kind]
    original = (job.get("original") or "").strip()
    instruction = (job.get("instruction") or "").strip()
    reference = (job.get("reference") or "").strip()[:REFERENCE_LIMIT]
    ai = AI(bool(job.get("demo")), cfg)
    ref_block = f"[참고 예시 글 - 말투와 구성을 참고할 것, 베끼지 말 것]\n{reference}\n\n" if reference else ""

    say("system", "status",
        f"{KIND_LABEL[kind]} · 작가 {NAME[writer]} · 편집자 {NAME[editor]} · 목표 {target}점 · 최대 수정 {max_rev}회"
        + (" · 연습 모드" if ai.demo else ""))

    def write(prompt: str, label: str, version: int) -> tuple[str, str]:
        typing(writer, label)
        draft, memo = parse_writer(ai.ask(writer, WRITER_SYSTEM, prompt))
        say(writer, "draft", draft, {"version": version, "memo": memo, "role": "writer"})
        return draft, memo

    # ① 시작 원고
    if original and instruction:
        draft, memo = write(
            f"[의뢰서]\n{brief}\n\n{ref_block}[현재 원고]\n{original}\n\n"
            f"[사용자 추가 요청]\n{instruction}\n\n추가 요청을 반영해서 원고를 수정해줘.",
            "요청하신 내용을 반영하는 중", 1)
    elif original:
        draft, memo = original, "사용자가 직접 쓴 원본"
        say("user", "draft", draft, {"version": 1, "memo": memo, "role": "original"})
    else:
        draft, memo = write(f"[의뢰서]\n{brief}\n\n{ref_block}위 조건으로 첫 초안을 써줘.", "초안을 쓰는 중", 1)

    version, revision, prev_fixes, scores = 1, 0, "", []
    while True:
        # ② 편집자 채점 (매번 원래 의뢰서를 함께 보냄)
        typing(editor, f"{version}번째 원고를 채점하는 중")
        editor_input = (
            f"[의뢰서]\n{brief}\n\n[채점 기준표]\n{rubric_text(rubric)}\n\n{ref_block}"
            + (f"[지난번 수정 지시 - 반영됐는지 확인할 것]\n{prev_fixes}\n\n" if prev_fixes else "")
            + f"[작가의 수정메모]\n{memo}\n\n[원고]\n{draft}"
        )
        fb = parse_editor(ai.ask(editor, EDITOR_SYSTEM, editor_input, want_json=True))
        scores.append(fb["average"])
        say(editor, "feedback", format_feedback(fb), {**fb, "version": version, "role": "editor"})

        # ③ 멈출지 판단
        if fb["average"] >= target:
            stop_reason = f"목표 점수({target}) 달성"
            break
        if fb.get("no_major_changes"):
            stop_reason = "편집자가 '큰 수정 없음' 판단"
            break
        if revision >= max_rev:
            stop_reason = f"최대 수정 횟수({max_rev}회) 도달"
            break

        # ④ 작가 수정
        revision += 1
        version += 1
        prev_fixes = format_feedback(fb)
        draft, memo = write(
            f"[의뢰서]\n{brief}\n\n{ref_block}[현재 원고]\n{draft}\n\n[편집자 피드백]\n{prev_fixes}\n\n"
            "피드백을 검토해서 원고를 수정해줘.",
            f"{revision}번째 수정을 하는 중", version)

    typing(None, "")
    summary = {
        "kind": kind, "writer": writer, "editor": editor, "scores": scores,
        "stop_reason": stop_reason, "tokens": ai.tokens, "demo": ai.demo,
        "final_feedback": fb,
    }
    say("system", "done", stop_reason, summary)
    return summary
