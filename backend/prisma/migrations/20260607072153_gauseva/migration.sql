/*
  Warnings:

  - You are about to drop the column `attachmentUrl` on the `ExpenseLedger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExpenseLedger" DROP COLUMN "attachmentUrl",
ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[];
