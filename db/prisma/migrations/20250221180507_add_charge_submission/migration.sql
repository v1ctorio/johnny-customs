-- CreateTable
CREATE TABLE "ChargeSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "author" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "declared_value" TEXT NOT NULL,
    "declared_value_usd" TEXT NOT NULL,
    "paid_customs" TEXT NOT NULL,
    "paid_customs_usd" TEXT NOT NULL,
    "submission_date" BIGINT NOT NULL,
    "additional_information" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "ChargeSubmission_author_idx" ON "ChargeSubmission"("author");

-- CreateIndex
CREATE INDEX "ChargeSubmission_submission_date_idx" ON "ChargeSubmission"("submission_date");
