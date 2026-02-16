-- CreateTable
CREATE TABLE "Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "details" TEXT,
    "discountPercent" INTEGER,
    "coupons" TEXT,
    "intro" TEXT,
    "highlights" TEXT,
    "bullets" TEXT,
    "outcomes" TEXT,
    "images" TEXT,
    "icon" TEXT,
    "price" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "Experience"("slug");
