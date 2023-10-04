/*
  Warnings:

  - Changed the type of `slug` on the `Tool` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "slug",
ADD COLUMN     "slug" JSONB NOT NULL;
