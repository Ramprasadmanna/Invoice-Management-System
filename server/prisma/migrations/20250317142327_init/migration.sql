/*
  Warnings:

  - You are about to drop the `billing_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipping_addresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `customers_billingId_fkey`;

-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `customers_shippingId_fkey`;

-- DropTable
DROP TABLE `billing_addresses`;

-- DropTable
DROP TABLE `customers`;

-- DropTable
DROP TABLE `shipping_addresses`;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
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
