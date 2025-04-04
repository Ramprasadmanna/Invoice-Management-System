-- AlterTable
ALTER TABLE `gstsales` MODIFY `invoiceDate` DATE NOT NULL,
    MODIFY `dueDate` DATE NOT NULL,
    MODIFY `customerNote` VARCHAR(1000) NOT NULL,
    MODIFY `termsAndCondition` VARCHAR(1000) NOT NULL;
