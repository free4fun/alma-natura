-- CreateTable
CREATE TABLE "Element" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "categoryDescription" TEXT,
    "description" TEXT,
    "details" TEXT,
    "discountPercent" INTEGER,
    "coupons" TEXT,
    "image" TEXT,
    "images" TEXT,
    "price" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Element_slug_key" ON "Element"("slug");
