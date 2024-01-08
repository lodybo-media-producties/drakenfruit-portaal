/*
  Warnings:

  - You are about to drop the column `itemId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `itemType` on the `Purchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "itemId",
DROP COLUMN "itemType",
ADD COLUMN     "articleId" TEXT,
ADD COLUMN     "toolId" TEXT;

-- DropEnum
DROP TYPE "PurchaseItemType";

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;
