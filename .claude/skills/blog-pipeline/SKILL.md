---
name: blog-pipeline
description: 사용자가 올린 블로그 초안(.docx)을 의학 레퍼런스·이미지·SEO·가독성을 갖춘 2000자 이내 글로 다시 쓰고, 사용자 PC에 로그인된 ChatGPT에 자동으로 넘겨 피드백 → 수정 → 사용자 컨펌 → 재수정 → ChatGPT 2차 피드백 → 최종 .docx 완성까지 백그라운드로 진행한다. 사용자가 블로그 글 docx를 주거나 "블로그 글 작업", "블로그 파이프라인", "/blog-pipeline" 을 말하면 사용한다.
argument-hint: <초안.docx 경로> [추가 요청]
allowed-tools: Bash(node .claude/skills/blog-pipeline/scripts/blog.mjs *), Read, Write, Edit, Glob, WebSearch, WebFetch, Agent
---

# 블로그 글 자동화 파이프라인

전체 6단계 중 **사용자 컨펌(4단계 직전) 한 번만** 사용자에게 묻는다. 나머지는 묻지 않고 진행한다.
작업은 모두 **백그라운드 서브에이전트(`blog-pipeline-worker`)** 가 하고, ChatGPT는 **창이 뜨지 않는 브라우저**로 조작하므로
사용자가 다른 일을 하는 동안 방해하지 않는다.

```
[A 단계 · 백그라운드]  1. 초안 → 새 글 작성(레퍼런스·이미지·SEO·2000자)  →  2. ChatGPT 1차 피드백  →  3. 피드백 반영 수정
[사용자 컨펌]          03_수정본1.docx 확인 → "그대로 진행" 또는 수정사항
[B 단계 · 백그라운드]  4. 수정사항 반영  →  5. ChatGPT 2차 피드백  →  6. 최종 .docx 완성
```

모든 명령은 **저장소 루트에서** 아래 형태 그대로 실행한다 (권한 허용 규칙이 이 형태에 맞춰져 있음):

```
node .claude/skills/blog-pipeline/scripts/blog.mjs <명령> ...
```

## 메인 대화에서 할 일 (이 스킬을 불러온 쪽)

### 0. 준비 확인
1. 사용자가 준 .docx 경로를 확인한다. 경로가 없으면 그때만 물어본다.
2. `node .claude/skills/blog-pipeline/scripts/blog.mjs check` 실행.
   - `ok: true` → 진행.
   - 종료코드 3(`NOT_LOGGED_IN`) → **처음 한 번만** 필요한 로그인이다. 사용자에게 아래 명령을 터미널에서 직접 실행해 달라고 안내하고 멈춘다.
     ```
     node .claude/skills/blog-pipeline/scripts/blog.mjs login
     ```
     (크롬 창이 뜨고 ChatGPT에 로그인하면 자동으로 닫힘. 이후로는 창 없이 동작)
   - 그 밖의 오류(봇 확인 화면 등) → 사용자에게 원인을 알리고, 대안으로 `.env.local` 에 `BLOG_GPT_MODE=api` + `OPENAI_API_KEY` 를 쓰면 브라우저 없이 OpenAI API로 같은 피드백을 받을 수 있다고 안내한다.
3. `node .claude/skills/blog-pipeline/scripts/blog.mjs init "<초안.docx>"` → 출력의 `dir` 이 작업 폴더다.

### 1. A 단계를 백그라운드로 시작
Agent 도구로 `subagent_type: "blog-pipeline-worker"`, **`run_in_background: true`** 로 실행한다. 프롬프트:

```
PHASE A. 작업 폴더: <dir>
.claude/skills/blog-pipeline/references/workflow.md 의 "PHASE A" 를 끝까지 수행하라.
사용자 추가 요청: <있으면 그대로, 없으면 "없음">
```

시작 직후 사용자에게 한두 줄로 알리고 턴을 끝낸다: "백그라운드에서 작성 중입니다(약 10~20분). 다른 일 하셔도 됩니다."
결과를 기다리며 폴링하지 않는다 — 완료되면 알림이 온다.

### 2. 사용자 컨펌 (유일하게 묻는 단계)
A 단계 결과(`<dir>/A_summary.md`)를 읽고 사용자에게 보여준다:
- `03_수정본1.docx` 의 전체 경로, 제목, 본문 글자 수
- ChatGPT 1차 피드백 요약과 반영/미반영 내역 (각 3~5줄)
- 넣은 이미지 목록, 사용자가 꼭 확인해야 할 사실관계(`[확인 필요]`)

그리고 AskUserQuestion 으로 묻는다: 옵션 "그대로 진행(Recommended)" / "수정사항 있음"(직접 입력은 Other).
사용자가 대화로 수정사항을 길게 적어도 그대로 받는다.

### 3. B 단계를 백그라운드로 시작
같은 방식(`blog-pipeline-worker`, `run_in_background: true`)으로:

```
PHASE B. 작업 폴더: <dir>
.claude/skills/blog-pipeline/references/workflow.md 의 "PHASE B" 를 끝까지 수행하라.
사용자 수정사항(원문 그대로):
<사용자 답변 원문. "그대로 진행"이면 "없음">
```

### 4. 완료 보고
`<dir>/B_summary.md` 를 읽고: 최종 파일 `06_최종.docx` 전체 경로, 글자 수, 2차 피드백 반영 요약, 게시 전 직접 확인할 항목을 알린다.

## 실패했을 때
- 워커가 `ChatGPT 단계 실패` 로 끝나면 이유를 사용자에게 그대로 전하고, `check`/`login` 또는 `BLOG_GPT_MODE=api` 대안을 안내한다. 글 작성 결과물(01, 03 파일)은 그대로 남아 있다.
- 이미지 생성 실패는 파이프라인을 멈추지 않는다(워커가 HTML 인포그래픽으로 대체하거나 생략).

## 설정 (선택, `.env.local`)
| 변수 | 기본값 | 설명 |
|---|---|---|
| `BLOG_CHAR_LIMIT` | `2000` | 본문 글자 수 상한(공백 포함, 참고자료·이미지 제외) |
| `BLOG_GPT_MODE` | (브라우저) | `api` 면 ChatGPT 웹 대신 OpenAI API 사용 (`OPENAI_API_KEY` 필요) |
| `BLOG_GPT_MODEL` | `gpt-5` | API 모드에서 쓸 모델 |
| `BLOG_CHATGPT_MODE` | `headless` | `headless`(창 없음) → 막히면 자동으로 `offscreen`(화면 밖 창). `visible` 은 디버깅용 |
| `BLOG_CHATGPT_TEMPORARY` | `1` | `0` 이면 임시 채팅 대신 일반 채팅(기록이 ChatGPT에 남음) |
| `BLOG_CHATGPT_PROFILE` | `~/.blog-pipeline/chatgpt-profile` | 로그인 상태를 저장하는 전용 크롬 프로필 |
