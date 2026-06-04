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
