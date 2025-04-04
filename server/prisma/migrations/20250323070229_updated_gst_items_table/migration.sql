/*
  Warnings:

  - Added the required column `gstAmount` to the `GstItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gstitems` ADD COLUMN `gstAmount` DOUBLE NOT NULL;
