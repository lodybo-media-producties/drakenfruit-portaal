/*
  Warnings:

  - You are about to drop the column `temporary` on the `Password` table. All the data in the column will be lost.
  - Added the required column `type` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PasswordType" AS ENUM ('ACTIVE', 'MULTIFACTOR', 'MUSTCHANGE', 'RESET');

-- AlterTable
ALTER TABLE "Password" DROP COLUMN "temporary",
ADD COLUMN     "type" "PasswordType" NOT NULL DEFAULT 'ACTIVE';
