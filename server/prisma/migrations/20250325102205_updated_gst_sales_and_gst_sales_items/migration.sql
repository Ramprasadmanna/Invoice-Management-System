/*
  Warnings:

  - You are about to drop the column `taxAmount` on the `gstsaleitems` table. All the data in the column will be lost.
  - Added the required column `gstAmount` to the `GstSaleItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gstsaleitems` DROP COLUMN `taxAmount`,
    ADD COLUMN `gstAmount` DOUBLE NOT NULL;
