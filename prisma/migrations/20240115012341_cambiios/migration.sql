/*
  Warnings:

  - You are about to drop the column `name` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_ChatToUser` DROP FOREIGN KEY `_ChatToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ChatToUser` DROP FOREIGN KEY `_ChatToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Chat` DROP COLUMN `name`,
    ADD COLUMN `creatorId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_ChatToUser`;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
