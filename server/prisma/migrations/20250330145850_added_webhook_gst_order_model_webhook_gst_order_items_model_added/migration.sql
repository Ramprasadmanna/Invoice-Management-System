/*
  Warnings:

  - You are about to drop the column `itemsId` on the `gstsaleitems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `gstsaleitems` DROP COLUMN `itemsId`;

-- CreateTable
CREATE TABLE `webHookGstOrders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `taxableAmount` DOUBLE NOT NULL,
    `gstAmount` DOUBLE NOT NULL,
    `cgst` DOUBLE NULL,
    `sgst` DOUBLE NULL,
    `igst` DOUBLE NULL,
    `shippingCharges` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `otherAdjustments` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webHookGstOrdersItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gstOrderId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `validity` INTEGER NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `description` VARCHAR(191) NOT NULL,
    `hsnsacCode` VARCHAR(191) NOT NULL,
    `gstSlab` DOUBLE NOT NULL,
    `rate` DOUBLE NOT NULL,
    `cgst` DOUBLE NOT NULL,
    `sgst` DOUBLE NOT NULL,
    `igst` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `taxableAmount` DOUBLE NOT NULL,
    `gstAmount` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `webHookGstOrders` ADD CONSTRAINT `webHookGstOrders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookGstOrdersItems` ADD CONSTRAINT `webHookGstOrdersItems_gstOrderId_fkey` FOREIGN KEY (`gstOrderId`) REFERENCES `webHookGstOrders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookGstOrdersItems` ADD CONSTRAINT `webHookGstOrdersItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `GstItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
