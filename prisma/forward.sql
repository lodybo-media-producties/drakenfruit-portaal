-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organisationId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "downloadUrl",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

