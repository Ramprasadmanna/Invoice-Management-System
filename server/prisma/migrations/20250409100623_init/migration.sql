-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `customerType` VARCHAR(191) NOT NULL,
    `salutation` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `workPhone` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `businessLegalName` VARCHAR(191) NULL,
    `gstNumber` VARCHAR(191) NULL,
    `placeOfSupply` VARCHAR(191) NOT NULL,
    `billingCountry` VARCHAR(191) NOT NULL,
    `billingState` VARCHAR(191) NOT NULL,
    `billingCity` VARCHAR(191) NOT NULL,
    `billingAddress` VARCHAR(191) NOT NULL,
    `billingZipcode` VARCHAR(191) NOT NULL,
    `shippingCountry` VARCHAR(191) NOT NULL,
    `shippingState` VARCHAR(191) NOT NULL,
    `shippingCity` VARCHAR(191) NOT NULL,
    `shippingAddress` VARCHAR(191) NOT NULL,
    `shippingZipcode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GstItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `validity` INTEGER NULL,
    `hsnsacCode` VARCHAR(191) NOT NULL,
    `gstSlab` DOUBLE NOT NULL,
    `rate` DOUBLE NOT NULL,
    `cgst` DOUBLE NOT NULL,
    `sgst` DOUBLE NOT NULL,
    `igst` DOUBLE NOT NULL,
    `gstAmount` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GstSales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `invoiceType` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NULL,
    `invoiceDate` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `taxableAmount` DOUBLE NOT NULL,
    `gstAmount` DOUBLE NOT NULL,
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
    `customerNote` VARCHAR(1000) NOT NULL,
    `termsAndCondition` VARCHAR(1000) NOT NULL,
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
    `gstAmount` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cashItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `validity` INTEGER NULL,
    `price` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cashSales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE `webHookOrders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `shippingCharges` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `otherAdjustments` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webHookOrdersItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `validity` INTEGER NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gstPurchaseItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `gstNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `gstPurchaseItems_companyName_key`(`companyName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `paymentMethod` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenseItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `expenseItems_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `expenseDate` DATE NOT NULL,
    `itemId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(1000) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gstPaid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `dateOfPayment` DATE NOT NULL,
    `monthOfGstPaid` DATE NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GstItems` ADD CONSTRAINT `GstItems_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GstSales` ADD CONSTRAINT `GstSales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GstSales` ADD CONSTRAINT `GstSales_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GstSaleItems` ADD CONSTRAINT `GstSaleItems_gstSaleId_fkey` FOREIGN KEY (`gstSaleId`) REFERENCES `GstSales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GstSaleItems` ADD CONSTRAINT `GstSaleItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `GstItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashItems` ADD CONSTRAINT `cashItems_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashSales` ADD CONSTRAINT `cashSales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashSales` ADD CONSTRAINT `cashSales_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashSaleItems` ADD CONSTRAINT `cashSaleItems_cashSaleId_fkey` FOREIGN KEY (`cashSaleId`) REFERENCES `cashSales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashSaleItems` ADD CONSTRAINT `cashSaleItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `cashItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookGstOrders` ADD CONSTRAINT `webHookGstOrders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookGstOrdersItems` ADD CONSTRAINT `webHookGstOrdersItems_gstOrderId_fkey` FOREIGN KEY (`gstOrderId`) REFERENCES `webHookGstOrders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookGstOrdersItems` ADD CONSTRAINT `webHookGstOrdersItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `GstItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookOrders` ADD CONSTRAINT `webHookOrders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookOrdersItems` ADD CONSTRAINT `webHookOrdersItems_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `webHookOrders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookOrdersItems` ADD CONSTRAINT `webHookOrdersItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `cashItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gstPurchaseItems` ADD CONSTRAINT `gstPurchaseItems_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gstPurchases` ADD CONSTRAINT `gstPurchases_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gstPurchases` ADD CONSTRAINT `gstPurchases_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `gstPurchaseItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenseItems` ADD CONSTRAINT `expenseItems_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `expenseItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gstPaid` ADD CONSTRAINT `gstPaid_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
