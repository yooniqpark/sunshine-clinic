"""
글쓰기 듀오: 작가 AI와 편집자 AI가 서로 피드백을 주고받으며 글을 완성합니다.

사용법:
    python duo.py briefs/youtube_example.txt     # 실제 실행 (API 키 필요)
    python duo.py briefs/blog_example.txt --demo # 연습 실행 (API 키 없이 흐름만 확인)
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

HERE = Path(__file__).resolve().parent
load_dotenv(HERE / ".env")

# ─────────────────────────────────────────────
# 설정 (.env 파일에서 바꿀 수 있음)
# ─────────────────────────────────────────────
WRITER = os.getenv("WRITER", "claude").lower()  # 작가 역할: claude 또는 gpt
EDITOR = "gpt" if WRITER == "claude" else "claude"  # 편집자는 자동으로 나머지
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-opus-5-5")
GPT_MODEL = os.getenv("GPT_MODEL", "gpt-5")
MAX_REVISIONS = int(os.getenv("MAX_REVISIONS", "3"))
TARGET_SCORE = float(os.getenv("TARGET_SCORE", "8.5"))

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

WRITER_SYSTEM = """너는 유튜브 대본과 블로그 글을 전문으로 쓰는 작가다.
- 의뢰서의 조건(대상, 분량, 말투, 꼭 넣을 내용)을 반드시 지킨다.
- 편집자 피드백을 받으면 반영해 수정하되, 동의하지 않는 지적은 이유를 한 줄로 밝히고 원래대로 둬도 된다.
- 편집자가 '잘된 점'으로 꼽은 부분은 함부로 바꾸지 않는다.
- 확실하지 않은 사실은 지어내지 말고 [확인 필요] 표시를 남긴다.

반드시 아래 형식으로만 답한다:
===원고===
(완성된 원고 전체)
===수정메모===
(이번에 무엇을 반영했고, 무엇을 왜 반영하지 않았는지. 첫 초안이면 '첫 초안')"""

EDITOR_SYSTEM = """너는 깐깐하지만 공정한 편집자다.
- 글을 직접 다시 쓰지 않는다. 점수와 수정 지시만 한다.
- 채점 기준표의 항목마다 10점 만점으로 점수를 매긴다 (소수점 한 자리 가능).
- 가장 중요한 수정 사항을 최대 3개, '위치 / 이유 / 고치는 방법'으로 구체적으로 제시한다.
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


# ─────────────────────────────────────────────
# AI 호출
# ─────────────────────────────────────────────
class AI:
    def __init__(self, demo: bool):
        self.demo = demo
        self.demo_round = 0
        self.tokens = {"claude": 0, "gpt": 0}
        if demo:
            return
        missing = [k for k in ("ANTHROPIC_API_KEY", "OPENAI_API_KEY") if not os.getenv(k)]
        if missing:
            sys.exit(
                f"❌ .env 파일에 {', '.join(missing)} 가 없습니다.\n"
                "   README.md의 'API 키 받기'를 확인해 주세요.\n"
                "   (키 없이 흐름만 보려면 끝에 --demo 를 붙여 실행하세요)"
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
                model=CLAUDE_MODEL,
                max_tokens=16000,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
            self.tokens["claude"] += resp.usage.input_tokens + resp.usage.output_tokens
            return "".join(b.text for b in resp.content if b.type == "text")
        else:
            kwargs = {"text": {"format": {"type": "json_object"}}} if want_json else {}
            resp = self.gpt.responses.create(
                model=GPT_MODEL, instructions=system, input=user, **kwargs
            )
            if resp.usage:
                self.tokens["gpt"] += resp.usage.total_tokens
            return resp.output_text

    def _fake(self, want_json: bool) -> str:
        """--demo 모드용 가짜 응답. 점수가 회차마다 오르는 모습을 보여줍니다."""
        if not want_json:
            return (
                f"===원고===\n(연습 모드 원고 {self.demo_round + 1}번째 버전입니다.)\n"
                "안녕하세요! 오늘은 ... 이야기를 해볼게요.\n"
                "===수정메모===\n"
                + ("첫 초안" if self.demo_round == 0 else "도입부를 질문형으로 바꿨습니다.")
            )
        self.demo_round += 1
        base = [6.5, 7.6, 8.7][min(self.demo_round - 1, 2)]
        return json.dumps(
            {
                "scores": {"도입부": base, "구성": base + 0.2, "정확성": base,
                           "읽기 편함": base - 0.1, "마무리": base},
                "strengths": ["말투가 친근함"],
                "fixes": [{"where": "첫 문단", "why": "궁금증이 약함",
                           "how": "질문으로 시작하기"}],
                "fact_check": [],
                "no_major_changes": base >= 8.5,
            },
            ensure_ascii=False,
        )


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


# ─────────────────────────────────────────────
# 메인 흐름
# ─────────────────────────────────────────────
def run(brief_path: Path, demo: bool) -> Path:
    brief = brief_path.read_text(encoding="utf-8").strip()
    kind = detect_type(brief)
    rubric = RUBRICS[kind]
    ai = AI(demo)
    name = {"claude": "Claude", "gpt": "GPT"}

    print(f"\n📝 글 종류: {'유튜브 대본' if kind == 'youtube' else '블로그'}")
    print(f"✍️  작가: {name[WRITER]}   🧐 편집자: {name[EDITOR]}")
    print(f"🎯 목표 점수 {TARGET_SCORE} / 최대 수정 {MAX_REVISIONS}회"
          + ("   (연습 모드)" if demo else "") + "\n")

    # ① 초안
    print("✍️  초안 작성 중...")
    draft, memo = parse_writer(ai.ask(WRITER, WRITER_SYSTEM, f"[의뢰서]\n{brief}\n\n위 조건으로 첫 초안을 써줘."))
    history = [{"version": 1, "draft": draft, "memo": memo}]
    prev_fixes = ""

    revision = 0
    while True:
        # ② 편집자 채점 (매번 원래 의뢰서를 함께 보냄)
        print(f"🧐 {len(history)}번째 원고 채점 중...")
        editor_input = (
            f"[의뢰서]\n{brief}\n\n[채점 기준표]\n{rubric_text(rubric)}\n\n"
            + (f"[지난번 수정 지시 - 반영됐는지 확인할 것]\n{prev_fixes}\n\n" if prev_fixes else "")
            + f"[작가의 수정메모]\n{memo}\n\n[원고]\n{draft}"
        )
        fb = parse_editor(ai.ask(EDITOR, EDITOR_SYSTEM, editor_input, want_json=True))
        history[-1]["feedback"] = fb
        print(f"   → 평균 {fb['average']}점")

        # ③ 멈출지 판단
        if fb["average"] >= TARGET_SCORE:
            stop_reason = f"목표 점수({TARGET_SCORE}) 달성"
            break
        if fb.get("no_major_changes"):
            stop_reason = "편집자가 '큰 수정 없음' 판단"
            break
        if revision >= MAX_REVISIONS:
            stop_reason = f"최대 수정 횟수({MAX_REVISIONS}회) 도달"
            break

        # ④ 작가 수정
        revision += 1
        print(f"✍️  {revision}번째 수정 중...")
        prev_fixes = format_feedback(fb)
        writer_input = (
            f"[의뢰서]\n{brief}\n\n[현재 원고]\n{draft}\n\n[편집자 피드백]\n{prev_fixes}\n\n"
            "피드백을 검토해서 원고를 수정해줘."
        )
        draft, memo = parse_writer(ai.ask(WRITER, WRITER_SYSTEM, writer_input))
        history.append({"version": len(history) + 1, "draft": draft, "memo": memo})

    print(f"\n✅ 완료: {stop_reason}")
    return save(brief_path, brief, kind, history, stop_reason, ai)


def save(brief_path, brief, kind, history, stop_reason, ai) -> Path:
    stamp = datetime.now().strftime("%Y%m%d_%H%M")
    out = HERE / "output" / f"{stamp}_{brief_path.stem}"
    out.mkdir(parents=True, exist_ok=True)
    final = history[-1]

    (out / "최종원고.md").write_text(final["draft"] + "\n", encoding="utf-8")

    scores = " → ".join(str(h["feedback"]["average"]) for h in history if "feedback" in h)
    log = [
        f"# 작업 기록 ({stamp})",
        f"- 글 종류: {'유튜브 대본' if kind == 'youtube' else '블로그'}",
        f"- 작가: {WRITER} / 편집자: {EDITOR}",
        f"- 점수 변화: {scores}",
        f"- 종료 이유: {stop_reason}",
    ]
    if not ai.demo:
        log.append(f"- 사용량(토큰): Claude {ai.tokens['claude']:,} / GPT {ai.tokens['gpt']:,}")
    fact = final.get("feedback", {}).get("fact_check")
    if fact:
        log += ["", "## ⚠️ 올리기 전에 직접 확인할 것"] + [f"- {s}" for s in fact]
    log += ["", "## 의뢰서", brief]
    for h in history:
        log += ["", f"## {h['version']}번째 원고", "", "### 작가 수정메모", h["memo"]]
        if "feedback" in h:
            log += ["", "### 편집자 피드백", format_feedback(h["feedback"])]
        log += ["", "<details><summary>원고 보기</summary>", "", h["draft"], "", "</details>"]
    (out / "작업기록.md").write_text("\n".join(log) + "\n", encoding="utf-8")
    (out / "history.json").write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"📊 점수 변화: {scores}")
    print(f"📁 결과 폴더: {out}")
    print("   - 최종원고.md : 완성된 글")
    print("   - 작업기록.md : 회차별 점수·피드백·수정 내역\n")
    return out


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")  # 윈도우에서 한글·이모지 깨짐 방지
    p = argparse.ArgumentParser(description="작가 AI와 편집자 AI가 함께 글을 씁니다.")
    p.add_argument("brief", help="의뢰서 파일 경로 (예: briefs/youtube_example.txt)")
    p.add_argument("--demo", action="store_true", help="API 키 없이 흐름만 연습 실행")
    args = p.parse_args()

    path = Path(args.brief)
    if not path.is_absolute() and not path.exists():
        path = HERE / args.brief
    if not path.exists():
        sys.exit(f"❌ 의뢰서 파일을 찾을 수 없습니다: {args.brief}")
    run(path, args.demo)


if __name__ == "__main__":
    main()
