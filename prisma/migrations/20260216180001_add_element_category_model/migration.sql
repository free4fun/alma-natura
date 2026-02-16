-- CreateTable
CREATE TABLE "ElementCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "ElementCategory_title_key" ON "ElementCategory"("title");
