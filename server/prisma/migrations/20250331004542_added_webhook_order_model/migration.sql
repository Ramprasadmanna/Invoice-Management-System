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
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `webHookOrders` ADD CONSTRAINT `webHookOrders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookOrdersItems` ADD CONSTRAINT `webHookOrdersItems_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `webHookOrders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webHookOrdersItems` ADD CONSTRAINT `webHookOrdersItems_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `cashItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
