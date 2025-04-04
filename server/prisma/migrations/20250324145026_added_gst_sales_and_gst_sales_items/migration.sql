-- CreateTable
CREATE TABLE `GstSales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `invoiceType` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NULL,
    `invoiceDate` DATETIME(3) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `taxableAmount` DOUBLE NOT NULL,
    `taxAmount` DOUBLE NOT NULL,
    `cgst` DOUBLE NULL,
    `sgst` DOUBLE NULL,
    `igst` DOUBLE NULL,
    `shippingCharges` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `otherAdjustments` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `advanceAmount` DOUBLE NOT NULL,
    `balanceDue` DOUBLE NOT NULL,
    `accountType` VARCHAR(191) NOT NULL,
    `customerNote` VARCHAR(191) NOT NULL,
    `termsAndCondition` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GstSales_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GstSaleItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gstSaleId` INTEGER NOT NULL,
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
    `taxAmount` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GstSales` ADD CONSTRAINT `GstSales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GstSales` ADD CONSTRAINT `GstSales_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GstSaleItems` ADD CONSTRAINT `GstSaleItems_gstSaleId_fkey` FOREIGN KEY (`gstSaleId`) REFERENCES `GstSales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GstSaleItems` ADD CONSTRAINT `GstSaleItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `GstItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
