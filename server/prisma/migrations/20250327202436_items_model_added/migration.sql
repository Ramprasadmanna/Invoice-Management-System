-- AlterTable
ALTER TABLE `gstsaleitems` ADD COLUMN `itemsId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Items` (
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
ALTER TABLE `GstSaleItems` ADD CONSTRAINT `GstSaleItems_itemsId_fkey` FOREIGN KEY (`itemsId`) REFERENCES `Items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
