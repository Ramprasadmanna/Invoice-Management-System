/*
  Warnings:

  - You are about to drop the column `paymenMethod` on the `gstpurchases` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `gstPurchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gstpurchases` DROP COLUMN `paymenMethod`,
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL;
