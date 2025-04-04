/*
  Warnings:

  - You are about to drop the column `taxAmount` on the `gstsales` table. All the data in the column will be lost.
  - Added the required column `gstAmount` to the `GstSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gstsales` DROP COLUMN `taxAmount`,
    ADD COLUMN `gstAmount` DOUBLE NOT NULL;
