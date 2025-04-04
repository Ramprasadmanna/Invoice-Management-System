-- CreateTable
CREATE TABLE `customers` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
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
    `billingId` INTEGER NOT NULL,
    `shippingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_email_key`(`email`),
    UNIQUE INDEX `customers_billingId_key`(`billingId`),
    UNIQUE INDEX `customers_shippingId_key`(`shippingId`),
    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `billing_addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `zipcode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipping_addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `zipcode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_billingId_fkey` FOREIGN KEY (`billingId`) REFERENCES `billing_addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_shippingId_fkey` FOREIGN KEY (`shippingId`) REFERENCES `shipping_addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
