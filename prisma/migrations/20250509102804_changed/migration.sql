/*
  Warnings:

  - You are about to drop the column `userId` on the `Withdraw` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Withdraw" DROP CONSTRAINT "Withdraw_userId_fkey";

-- AlterTable
ALTER TABLE "Withdraw" DROP COLUMN "userId";
