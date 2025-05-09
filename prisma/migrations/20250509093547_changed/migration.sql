/*
  Warnings:

  - Added the required column `restaurantId` to the `Withdraw` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Withdraw" ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Withdraw" ADD CONSTRAINT "Withdraw_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
