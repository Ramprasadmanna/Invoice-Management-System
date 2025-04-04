/*
  Warnings:

  - Added the required column `paymentMethod` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expenses` ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL;
