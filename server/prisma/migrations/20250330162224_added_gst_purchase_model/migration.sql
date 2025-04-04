-- CreateTable
CREATE TABLE `gstPurchase` (
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
ALTER TABLE `gstPurchase` ADD CONSTRAINT `gstPurchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gstPurchase` ADD CONSTRAINT `gstPurchase_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `gstPurchaseItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
