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
