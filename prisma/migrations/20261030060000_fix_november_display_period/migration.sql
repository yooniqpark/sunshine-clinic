-- Correct only the printed campaign period. Keep the October 30 visibility
-- start, November 30 expiry, publishing state and administrator edits intact.
UPDATE "Event"
SET "period" = '2026.11.01 – 11.30'
WHERE "slug" = 'managed-november-2026';
