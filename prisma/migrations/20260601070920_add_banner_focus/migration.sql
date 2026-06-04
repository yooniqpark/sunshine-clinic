-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "bannerFocus" TEXT NOT NULL DEFAULT 'center',
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "sortIndex" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("authorId", "bannerUrl", "bgColor", "body", "createdAt", "desc", "endsAt", "id", "imageUrl", "period", "photoUrl", "published", "slug", "sortIndex", "startsAt", "tag", "title", "updatedAt") SELECT "authorId", "bannerUrl", "bgColor", "body", "createdAt", "desc", "endsAt", "id", "imageUrl", "period", "photoUrl", "published", "slug", "sortIndex", "startsAt", "tag", "title", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_published_sortIndex_idx" ON "Event"("published", "sortIndex");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
