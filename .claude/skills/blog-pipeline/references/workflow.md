# blog-pipeline 워커 작업 절차

너는 백그라운드에서 혼자 일한다. **사용자에게 질문하지 않는다.** 판단이 필요하면 아래 기준으로 스스로 정하고
결정 이유를 summary 파일에 남긴다. 모든 명령은 저장소 루트에서 `node .claude/skills/blog-pipeline/scripts/blog.mjs <명령>` 형태로 실행한다.

먼저 `.claude/skills/blog-pipeline/references/writing-guide.md` 를 읽는다 (글쓰기 기준 · 원고 형식 · 의료광고 주의).

## 작업 폴더 파일
| 파일 | 만든 단계 |
|---|---|
| `00_원본.docx`, `00_원본.md`, `images/orig-*.png` | init (이미 있음) |
| `01_초안.md` / `01_초안.docx` | A-1 |
| `references.md` | A-1 (찾은 근거 자료와 URL, 확인 여부) |
| `02_GPT요청1.md` / `02_GPT피드백1.md` | A-2 |
| `03_수정본1.md` / `03_수정본1.docx`, `A_summary.md` | A-3 |
| `04_반영본.md` / `04_반영본.docx` | B-4 |
| `05_GPT요청2.md` / `05_GPT피드백2.md` | B-5 |
| `06_최종.md` / `06_최종.docx`, `B_summary.md` | B-6 |

---

## PHASE A

### A-1. 새 글 작성
1. `00_원본.md` 를 읽고 핵심 주제, 글쓴이(원장)의 주장·경험·말투, 원본 이미지를 파악한다.
2. **의학적 근거 찾기** — WebSearch/WebFetch 로 신뢰할 수 있는 출처를 2~5개 찾는다.
   우선순위: 국내외 학회 가이드라인 · PubMed 등재 논문(리뷰/메타분석 우선) · 질병관리청/국가건강정보포털 · 식약처 · 대학병원 자료.
   블로그·광고성 글·위키는 근거로 쓰지 않는다. 각 출처는 실제로 열어 본문 내용이 글의 주장과 맞는지 확인한다.
   `references.md` 에 `번호 / 서지 / URL / 어떤 문장의 근거인지 / 확인함` 형식으로 적는다.
   확인 못 한 수치·주장은 글에서 빼거나 `[확인 필요]` 를 붙인다. **출처를 지어내지 않는다.**
3. **이미지** (필요할 때만, 최대 3장):
   - 원본 이미지 중 쓸 만한 것은 그대로 쓴다 (`images/orig-01.png`).
   - 수치·단계·비교 등 **글자가 들어가는 그림**은 HTML 카드로 만든다: `images/card-01.html` 작성(1080px 폭, 인라인 CSS, 웹폰트 없이 시스템 한글 폰트) →
     `node .claude/skills/blog-pipeline/scripts/blog.mjs card <dir>/images/card-01.html <dir>/images/card-01.png`
   - 분위기·개념 일러스트는 ChatGPT 이미지 생성: 프롬프트를 `images/gen-01.txt` 에 쓰고 →
     `node .claude/skills/blog-pipeline/scripts/blog.mjs image <dir>/images/gen-01.txt <dir>/images/gen-01.png`
     프롬프트 규칙: 이미지 안에 글자 넣지 말 것, 실제 환자/시술 전후 사진처럼 보이지 않게(의료광고 위반 소지), 16:9, 깔끔한 의료 일러스트 톤.
     실패하면 재시도하지 말고 카드 이미지로 대체하거나 생략한다.
   - 이미지마다 SEO용 alt 텍스트(메인 키워드 자연스럽게 포함)와 캡션을 단다.
4. writing-guide.md 의 형식으로 `01_초안.md` 를 쓴다.
5. `node .claude/skills/blog-pipeline/scripts/blog.mjs count <dir>/01_초안.md` — 종료코드 2(2000자 초과)면 줄여서 다시 센다. 통과할 때까지 반복.
6. `node .claude/skills/blog-pipeline/scripts/blog.mjs build <dir>/01_초안.md <dir>/01_초안.docx`

### A-2. ChatGPT 1차 피드백
1. `.claude/skills/blog-pipeline/references/gpt-review-prompt.md` 의 템플릿에 원고 전문(`01_초안.md` 내용 그대로, 이미지 줄 포함)과
   `references.md` 의 출처 목록을 채워 `02_GPT요청1.md` 로 저장한다.
2. `node .claude/skills/blog-pipeline/scripts/blog.mjs gpt <dir>/02_GPT요청1.md <dir>/02_GPT피드백1.md` (최대 10분 걸릴 수 있음. timeout 은 600000ms 로 준다)
3. 실패하면 1번만 재시도한다. 그래도 실패하면 `A_summary.md` 에 `ChatGPT 단계 실패: <오류>` 를 적고 종료한다.

### A-3. 피드백 반영 수정
1. `02_GPT피드백1.md` 를 읽고 항목마다 **반영 / 부분 반영 / 미반영(이유)** 을 정한다.
   - 의학적 사실 지적은 직접 근거를 다시 확인한 뒤 판단한다. GPT 주장이라고 그대로 믿지 않는다.
   - 2000자 제한, 의료광고 기준, 원장의 핵심 주장·말투와 충돌하는 제안은 미반영할 수 있다.
2. `03_수정본1.md` 작성 → `count` 통과 → `build` 로 `03_수정본1.docx`.
3. `A_summary.md` 작성 (메인 대화가 사용자에게 그대로 보여줄 내용, 간결하게):
   ```
   # A 단계 결과
   - 파일: <절대경로>/03_수정본1.docx
   - 제목: ...
   - 본문 글자 수: 공백 포함 N자 / 제외 M자
   - 메인 키워드: ...
   ## ChatGPT 1차 피드백 요약 (점수 포함)
   ## 반영한 것 / 반영하지 않은 것(이유)
   ## 이미지
   ## 직접 확인이 필요한 내용
   ```
4. `state.json` 의 `stage` 를 `"awaiting_confirm"` 으로 바꾼다.

---

## PHASE B

### B-4. 사용자 수정사항 반영
1. `03_수정본1.md` 와 메인 대화가 넘겨준 **사용자 수정사항 원문**을 읽는다.
   사용자 지시는 GPT 피드백·writing-guide 보다 우선한다. 단, 의료광고 위반이나 사실 오류가 생기면 가장 가까운 안전한 표현으로 반영하고 summary 에 적는다.
2. 새 주장이 생기면 A-1 처럼 근거를 찾아 `references.md` 를 갱신한다. 이미지 변경 요청도 A-1 방식으로 처리한다.
3. `04_반영본.md` → `count` 통과 → `build` 로 `04_반영본.docx`.

### B-5. ChatGPT 2차 피드백
A-2 와 같은 템플릿·절차로 `05_GPT요청2.md` → `05_GPT피드백2.md`.
템플릿의 `{{이전 라운드}}` 자리에 "1차 피드백에서 반영한 것 요약 + 사용자 확정 수정사항(이건 되돌리지 말 것)" 을 넣는다.

### B-6. 최종본
1. 2차 피드백을 A-3 기준으로 반영하되, **사용자 확정 수정사항은 되돌리지 않는다.**
2. `06_최종.md` → `count` 통과 → `build` 로 `06_최종.docx`.
3. 최종 점검: 모든 이미지 파일 존재, 참고 자료 URL 이 references.md 의 확인된 것만인지, `[확인 필요]` 남은 곳 목록.
4. `B_summary.md` 작성 (A_summary 와 같은 형식, 제목은 `# 최종 결과`, 파일은 06_최종.docx), `state.json` 의 `stage` 를 `"done"` 으로.

## 마지막 응답
메인 대화에게 3~6줄로: 성공/실패, summary 파일 절대경로, docx 절대경로, 글자 수.
