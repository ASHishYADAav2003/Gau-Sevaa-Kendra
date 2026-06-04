ALTER TABLE "Campaign" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Campaign_isFeatured_status_idx" ON "Campaign"("isFeatured", "status");
