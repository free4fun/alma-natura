-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DownloadAccess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileSlug" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "orderId" INTEGER,
    CONSTRAINT "DownloadAccess_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DownloadAccess" ("email", "fileSlug", "id", "name") SELECT "email", "fileSlug", "id", "name" FROM "DownloadAccess";
DROP TABLE "DownloadAccess";
ALTER TABLE "new_DownloadAccess" RENAME TO "DownloadAccess";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
