/*
  Warnings:

  - You are about to drop the column `filename` on the `Tool` table. All the data in the column will be lost.
  - Made the column `image` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `filename` to the `Tool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "filename",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;
