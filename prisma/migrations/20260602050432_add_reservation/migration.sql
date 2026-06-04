-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "contactType" TEXT NOT NULL DEFAULT 'OTHER',
    "preferredAt" DATETIME,
    "interest" TEXT,
    "message" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'ko',
    "source" TEXT NOT NULL DEFAULT 'chatbot',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "internalNote" TEXT,
    "handlerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reservation_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Reservation_status_createdAt_idx" ON "Reservation"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Reservation_createdAt_idx" ON "Reservation"("createdAt");
