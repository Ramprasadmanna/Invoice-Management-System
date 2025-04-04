/*
  Warnings:

  - You are about to drop the `gstpurchase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `gstpurchase` DROP FOREIGN KEY `gstPurchase_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `gstpurchase` DROP FOREIGN KEY `gstPurchase_userId_fkey`;

-- DropTable
DROP TABLE `gstpurchase`;

-- CreateTable
CREATE TABLE `gstPurchases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `purchaseDate` DATE NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `taxableAmount` DOUBLE NOT NULL,
    `gstSlab` INTEGER NOT NULL,
    `gstAmount` DOUBLE NOT NULL,
    `cgst` DOUBLE NULL,
    `sgst` DOUBLE NULL,
    `igst` DOUBLE NULL,
    `total` DOUBLE NOT NULL,
    `paymenMethod` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gstPurchases` ADD CONSTRAINT `gstPurchases_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gstPurchases` ADD CONSTRAINT `gstPurchases_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `gstPurchaseItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
