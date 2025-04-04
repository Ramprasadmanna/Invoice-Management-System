/*
  Warnings:

  - You are about to drop the column `user_id` on the `gstitems` table. All the data in the column will be lost.
  - Added the required column `userId` to the `GstItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `gstitems` DROP FOREIGN KEY `GstItems_user_id_fkey`;

-- DropIndex
DROP INDEX `GstItems_user_id_fkey` ON `gstitems`;

-- AlterTable
ALTER TABLE `gstitems` DROP COLUMN `user_id`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `GstItems` ADD CONSTRAINT `GstItems_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
