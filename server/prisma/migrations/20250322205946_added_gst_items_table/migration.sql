-- CreateTable
CREATE TABLE `GstItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `validity` INTEGER NULL,
    `hsnsacCode` VARCHAR(191) NOT NULL,
    `gstSlab` DOUBLE NOT NULL,
    `rate` DOUBLE NOT NULL,
    `cgst` DOUBLE NOT NULL,
    `sgst` DOUBLE NOT NULL,
    `igst` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GstItems` ADD CONSTRAINT `GstItems_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
