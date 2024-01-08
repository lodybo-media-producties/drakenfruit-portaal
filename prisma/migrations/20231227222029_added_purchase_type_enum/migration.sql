/*
  Warnings:

  - Changed the type of `itemType` on the `Purchase` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PurchaseItemType" AS ENUM ('ARTICLE', 'TOOL', 'WEBINAR');

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "itemType",
ADD COLUMN     "itemType" "PurchaseItemType" NOT NULL;
