-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "purchasable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "purchasable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION;
