/*
  Warnings:

  - You are about to alter the column `submission_date` on the `ChargeSubmission` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - Added the required column `country` to the `ChargeSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `ChargeSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChargeSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "author" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "declared_value" REAL NOT NULL,
    "declared_value_usd" REAL NOT NULL,
    "paid_customs" REAL NOT NULL,
    "paid_customs_usd" REAL NOT NULL,
    "submission_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "additional_information" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_ChargeSubmission" ("additional_information", "author", "country_code", "created_at", "declared_value", "declared_value_usd", "id", "item", "paid_customs", "paid_customs_usd", "submission_date", "updated_at") SELECT "additional_information", "author", "country_code", "created_at", "declared_value", "declared_value_usd", "id", "item", "paid_customs", "paid_customs_usd", "submission_date", "updated_at" FROM "ChargeSubmission";
DROP TABLE "ChargeSubmission";
ALTER TABLE "new_ChargeSubmission" RENAME TO "ChargeSubmission";
CREATE INDEX "ChargeSubmission_author_idx" ON "ChargeSubmission"("author");
CREATE INDEX "ChargeSubmission_submission_date_idx" ON "ChargeSubmission"("submission_date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
