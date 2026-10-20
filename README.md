# Sunshine Dermatology Clinic — Web

Multi-locale (ko/en/ja/zh) marketing site + admin operations panel for a Korean dermatology clinic.

Built with **Next.js 16** (App Router) · **Prisma + SQLite** · **NextAuth** · **next-intl** · **Tailwind v4** · **OpenAI** (chatbot + translations).

---

## Local setup

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env.local
#   • set AUTH_SECRET — `openssl rand -base64 32`
#   • set OPENAI_API_KEY — https://platform.openai.com/api-keys

# 3. Database
npx prisma db push --skip-generate
npx prisma generate

# 4. (Optional) load JSON content into DB so the admin content editor sees it
node scripts/migrate-content.mjs

# 5. (Optional) create an admin user
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  const hash = await bcrypt.hash('admin', 10);
  await p.user.upsert({
    where: { email: 'admin' },
    update: { passwordHash: hash, role: 'ADMIN' },
    create: { email: 'admin', name: 'Admin', passwordHash: hash, role: 'ADMIN' },
  });
  console.log('admin/admin ready');
  await p.\$disconnect();
})();
"

# 6. Run
npm run dev
# → http://localhost:3000
# → /admin (login: admin / admin)
```

---

## Routes

### Public
- `/{locale}` — home (hero slider, device carousel, events, location)
- `/{locale}/treatments/{lifting|whitening|acne|skin-disease}` — concern-based treatment pages
- `/{locale}/about` · `/{locale}/community/events`

### Admin (`/admin/*`)
- Dashboard · Reservations · Events · Manual · Content editor · Token usage · Settings

---

## Project layout

```
app/
  [locale]/(site)/   — public, locale-prefixed routes
  admin/             — admin panel (auth gated)
  api/               — chat · translate · reservations · NextAuth
components/          — UI (Header, Footer, ChatWidget, etc.)
content/             — seed JSON for devices/concerns/site (per-locale)
messages/            — next-intl strings (per-locale)
lib/
  settings.ts        — runtime-editable settings (DB-backed)
  content-db.ts      — DB-backed content reads
  tokenLog.ts        — OpenAI usage logging
  devices.ts · concerns.ts · site-content.ts — content loaders
prisma/
  schema.prisma      — User · Event · ManualSection · Reservation
                       · Setting · TokenUsage · SiteContent
scripts/
  migrate-content.mjs — JSON → SiteContent rows (idempotent)
  translate-concerns.mjs — bulk translate ko → en/ja/zh
```

---

## Production deploy

A push to `main` triggers `.github/workflows/deploy.yml`, which:

1. Builds Next.js (standalone output) on a GitHub-hosted runner
2. Packages `.next/standalone`, `.next/static`, `public`, `prisma/schema.prisma`, `scripts/`
3. rsyncs to the Lightsail server over SSH
4. Runs `prisma db push` for any new schema, restarts pm2

Required GitHub repo secrets:

| Secret | Value |
|---|---|
| `LIGHTSAIL_HOST` | server IP (e.g. `43.203.202.80`) |
| `LIGHTSAIL_USER` | SSH user (e.g. `ubuntu`) |
| `LIGHTSAIL_SSH_KEY` | private SSH key (full PEM contents) |

See `.github/workflows/deploy.yml` for the full pipeline.

---

## Editing content (no redeploy)

Admins can edit text, FAQ, recommendations etc. at `/admin/content` — changes are stored in the DB and reflected on the public site within seconds (cache tag is invalidated on save).

External links (KakaoTalk channel, Naver Booking, phone, etc.) are at `/admin/settings`.

## 글쓰기 도우미 (`/admin/writing`, 관리자 전용)

병원 홍보용 블로그 글·유튜브 대본을 Claude와 GPT가 함께 씁니다. 서버 `.env` 에 `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` 가 필요합니다 (없으면 연습 모드).

- **토론 모드 (기본)**: 두 AI가 각자 초안 → 서로의 원고를 채점·비판 → 각자 지적마다 "수용/반박"하며 수정 (라운드 반복)
  → 더 높게 평가받은 쪽이 두 원고의 장점을 합쳐 최종본 → 상대가 의료광고 기준까지 최종 검토 → 필요하면 마무리 수정
- **작가·편집자 모드**: 한쪽이 쓰고 한쪽이 채점, 목표 점수까지 반복
- 모든 글에 의료법 제56조 기준(효과 보장·최상급·후기 남용 금지 등)과 병원 정보가 들어갑니다. 지시문은 `lib/writing/engine.ts`, 병원 소개는 `WRITING_CLINIC_PROFILE` 로 바꿀 수 있습니다.
