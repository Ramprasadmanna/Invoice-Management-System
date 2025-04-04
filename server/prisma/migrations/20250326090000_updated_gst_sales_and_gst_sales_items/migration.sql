-- DropForeignKey
ALTER TABLE `gstsaleitems` DROP FOREIGN KEY `GstSaleItems_gstSaleId_fkey`;

-- DropIndex
DROP INDEX `GstSaleItems_gstSaleId_fkey` ON `gstsaleitems`;

-- AddForeignKey
ALTER TABLE `GstSaleItems` ADD CONSTRAINT `GstSaleItems_gstSaleId_fkey` FOREIGN KEY (`gstSaleId`) REFERENCES `GstSales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
