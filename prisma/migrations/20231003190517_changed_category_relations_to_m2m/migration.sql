/*
  Warnings:

  - You are about to drop the column `toolId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `webinarId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_toolId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_webinarId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "toolId",
DROP COLUMN "webinarId";

-- CreateTable
CREATE TABLE "_CategoryToTool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToWebinar" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTool_AB_unique" ON "_CategoryToTool"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTool_B_index" ON "_CategoryToTool"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToWebinar_AB_unique" ON "_CategoryToWebinar"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToWebinar_B_index" ON "_CategoryToWebinar"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToTool" ADD CONSTRAINT "_CategoryToTool_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTool" ADD CONSTRAINT "_CategoryToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToWebinar" ADD CONSTRAINT "_CategoryToWebinar_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToWebinar" ADD CONSTRAINT "_CategoryToWebinar_B_fkey" FOREIGN KEY ("B") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
