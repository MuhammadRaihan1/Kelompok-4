-- AlterTable
ALTER TABLE `Lapangan` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'Futsal',
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
