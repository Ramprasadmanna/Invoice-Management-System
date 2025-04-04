/*
  Warnings:

  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `gstsaleitems` DROP FOREIGN KEY `GstSaleItems_itemsId_fkey`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `Items_userId_fkey`;

-- DropIndex
DROP INDEX `GstSaleItems_itemsId_fkey` ON `gstsaleitems`;

-- DropTable
DROP TABLE `items`;

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

-- AddForeignKey
ALTER TABLE `cashItems` ADD CONSTRAINT `cashItems_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
