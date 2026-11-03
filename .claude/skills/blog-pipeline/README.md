# blog-pipeline — 블로그 글 자동화 스킬

초안 .docx 하나를 주면 아래 과정을 자동으로 진행합니다. 사용자에게 묻는 건 **중간 컨펌 한 번**뿐입니다.

1. Claude가 의학 레퍼런스·이미지·SEO·가독성을 갖춘 2000자 이내 글로 새로 작성 (.docx)
2. 내 PC에 로그인된 ChatGPT에 자동으로 넘겨 피드백 받기
3. 피드백 반영 수정
4. **사용자 컨펌** → 수정사항 반영
5. ChatGPT 2차 피드백
6. 최종 .docx 완성 (`blog-work/<날짜-제목>/06_최종.docx`)

작업은 백그라운드 서브에이전트가 하고, ChatGPT는 창이 뜨지 않는(headless) 크롬으로 조작하므로 다른 일을 하는 동안 방해되지 않습니다.

## 처음 한 번만 하는 준비

**반드시 내 컴퓨터의 Claude Code(데스크톱 앱 또는 터미널)에서 이 저장소를 열고 사용하세요.**
클라우드(웹) 세션에서는 내 PC의 ChatGPT에 접근할 수 없습니다.

1. 저장소 폴더에서 패키지 설치 (이미 했다면 생략)
   ```bash
   npm install
   ```
2. ChatGPT 로그인 (전용 크롬 프로필에 로그인 상태가 저장됨 — 평소 쓰는 크롬과는 별개)
   ```bash
   node .claude/skills/blog-pipeline/scripts/blog.mjs login
   ```
   크롬 창이 뜨면 ChatGPT에 로그인하세요. 로그인이 확인되면 창이 자동으로 닫힙니다.
   크롬이 설치돼 있지 않으면 `npx playwright install chromium` 후 다시 실행하세요.
3. 권한 확인 창이 뜨지 않도록 `.claude/settings.json` 에 아래 허용 규칙이 있어야 합니다.
   ```json
   {
     "permissions": {
       "allow": [
         "Bash(node .claude/skills/blog-pipeline/scripts/blog.mjs *)",
         "Edit(/blog-work/**)",
         "Write(/blog-work/**)",
         "WebSearch",
         "WebFetch"
       ]
     }
   }
   ```

## 사용법

Claude Code에서:

```
/blog-pipeline C:\Users\나\Desktop\기미초안.docx
```

또는 docx 파일을 채팅창에 끌어다 놓고 "블로그 글 작업해줘". 추가 요청(예: "키워드는 잠실 기미치료")을 같이 적어도 됩니다.

## 설정 (선택, 저장소의 `.env.local`)
| 변수 | 기본값 | 설명 |
|---|---|---|
| `BLOG_CHAR_LIMIT` | `2000` | 본문 글자 수 상한(공백 포함, 참고자료 제외) |
| `BLOG_GPT_MODE` | (ChatGPT 웹) | `api` 로 바꾸면 브라우저 대신 OpenAI API 사용 (`OPENAI_API_KEY` 필요, 사용량만큼 과금) |
| `BLOG_CHATGPT_MODE` | `headless` | 막히면 자동으로 화면 밖 창(`offscreen`)으로 재시도. `visible` 은 문제 확인용 |
| `BLOG_CHATGPT_TEMPORARY` | `1` | `0` 이면 ChatGPT 대화 기록에 남김 |

## 알아둘 점
- ChatGPT 화면 구조가 바뀌면 자동 조작이 실패할 수 있습니다. 그때는 `BLOG_GPT_MODE=api` 로 바로 대체할 수 있습니다.
- ChatGPT 웹을 프로그램으로 조작하는 것은 OpenAI 이용약관상 허용 범위가 애매합니다. 계정 제재가 걱정되면 API 모드를 쓰세요.
- 결과물은 `blog-work/` 에 쌓이며 git 에는 올라가지 않습니다.

## 파일
| 파일 | 역할 |
|---|---|
| `SKILL.md` | 메인 대화의 진행 순서 (컨펌 단계 포함) |
| `../../agents/blog-pipeline-worker.md` | 백그라운드 작업자 정의 |
| `references/workflow.md` | 작업자의 단계별 절차 |
| `references/writing-guide.md` | 글쓰기·SEO·의료광고 기준 (수정해서 병원 스타일에 맞추세요) |
| `references/gpt-review-prompt.md` | ChatGPT에 보내는 피드백 요청문 |
| `scripts/blog.mjs` | CLI (docx 읽기/쓰기, 글자 수, ChatGPT, 이미지) |
| `scripts/chatgpt.mjs` | ChatGPT 웹 자동 조작 |
| `scripts/docx-io.mjs` | 워드 변환 |
