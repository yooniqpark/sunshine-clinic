-- Structured event editor data. Nullable keeps every existing event compatible.
ALTER TABLE "Event" ADD COLUMN "templateData" TEXT;
