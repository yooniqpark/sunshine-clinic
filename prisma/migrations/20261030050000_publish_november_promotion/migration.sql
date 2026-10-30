-- Launch the November promotion on October 30 (Asia/Seoul). Only scheduling
-- fields change; retain all administrator-edited prices, images and copy.
UPDATE "Event"
SET "published" = true,
    "startsAt" = CAST(strftime('%s', '2026-10-30T00:00:00+09:00') AS INTEGER) * 1000,
    "endsAt" = CAST(strftime('%s', '2026-12-01T00:00:00+09:00') AS INTEGER) * 1000 - 1,
    "period" = '2026.10.30 – 11.30',
    "sortIndex" = -1,
    "updatedAt" = CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE "slug" = 'managed-november-2026';

-- Unpublish October without deleting the event or its administrator edits.
UPDATE "Event"
SET "published" = false,
    "endsAt" = CAST(strftime('%s', '2026-10-30T00:00:00+09:00') AS INTEGER) * 1000 - 1,
    "updatedAt" = CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE "slug" = 'managed-october-best';
