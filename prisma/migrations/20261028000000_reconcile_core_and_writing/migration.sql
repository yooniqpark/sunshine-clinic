-- Reconcile tables that historically entered production through `prisma db push`.
-- IF NOT EXISTS keeps this migration safe for existing Sunshine databases while
-- making a clean migration-only installation produce the same schema.

CREATE TABLE IF NOT EXISTS "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);

CREATE TABLE IF NOT EXISTS "TokenUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "costUsd" REAL NOT NULL DEFAULT 0,
    "locale" TEXT,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ChatLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'ko',
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ok',
    "model" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SiteContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);

CREATE TABLE IF NOT EXISTS "PageView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "locale" TEXT,
    "visitorId" TEXT,
    "referrer" TEXT,
    "deviceType" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WritingConversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "brief" TEXT NOT NULL,
    "reference" TEXT NOT NULL DEFAULT '',
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "WritingMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "meta" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WritingMessage_conversationId_fkey"
      FOREIGN KEY ("conversationId") REFERENCES "WritingConversation" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "TokenUsage_createdAt_idx" ON "TokenUsage"("createdAt");
CREATE INDEX IF NOT EXISTS "TokenUsage_source_createdAt_idx" ON "TokenUsage"("source", "createdAt");
CREATE INDEX IF NOT EXISTS "ChatLog_createdAt_idx" ON "ChatLog"("createdAt");
CREATE INDEX IF NOT EXISTS "ChatLog_status_createdAt_idx" ON "ChatLog"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "ChatLog_sessionId_createdAt_idx" ON "ChatLog"("sessionId", "createdAt");
CREATE INDEX IF NOT EXISTS "SiteContent_group_locale_idx" ON "SiteContent"("group", "locale");
CREATE UNIQUE INDEX IF NOT EXISTS "SiteContent_group_slug_locale_field_key"
  ON "SiteContent"("group", "slug", "locale", "field");
CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt");
CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path");
CREATE INDEX IF NOT EXISTS "PageView_visitorId_createdAt_idx" ON "PageView"("visitorId", "createdAt");
CREATE INDEX IF NOT EXISTS "PageView_country_createdAt_idx" ON "PageView"("country", "createdAt");
CREATE INDEX IF NOT EXISTS "WritingConversation_updatedAt_idx" ON "WritingConversation"("updatedAt");
CREATE INDEX IF NOT EXISTS "WritingMessage_conversationId_id_idx"
  ON "WritingMessage"("conversationId", "id");
