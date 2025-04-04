-- CreateTable
CREATE TABLE `cashSales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `invoiceType` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NULL,
    `invoiceDate` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `price` DOUBLE NOT NULL,
    `shippingCharges` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `otherAdjustments` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `advanceAmount` DOUBLE NOT NULL,
    `balanceDue` DOUBLE NOT NULL,
    `accountType` VARCHAR(191) NOT NULL,
    `customerNote` VARCHAR(1000) NOT NULL,
    `termsAndCondition` VARCHAR(1000) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cashSales_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cashSaleItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cashSaleId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `validity` INTEGER NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cashSales` ADD CONSTRAINT `cashSales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashSales` ADD CONSTRAINT `cashSales_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashSaleItems` ADD CONSTRAINT `cashSaleItems_cashSaleId_fkey` FOREIGN KEY (`cashSaleId`) REFERENCES `cashSales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashSaleItems` ADD CONSTRAINT `cashSaleItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `cashItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
