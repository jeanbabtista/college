-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`company` (
  `id` BINARY(16) NOT NULL,
  `created` TIMESTAMP NULL,
  `modified` TIMESTAMP NULL,
  `name` VARCHAR(45) NULL,
  `full_name` VARCHAR(45) NULL,
  `is_taxpayer` TINYINT NULL,
  `tax_number` VARCHAR(45) NULL,
  `registration_number` VARCHAR(45) NULL,
  `location` VARCHAR(45) NULL,
  `number_of_employees` INT NULL,
  `description` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`invoice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`invoice` (
  `id` BINARY(16) NOT NULL,
  `created` TIMESTAMP NULL,
  `modified` TIMESTAMP NULL,
  `barcode` VARCHAR(45) NULL,
  `cashier_name` VARCHAR(45) NULL,
  `payment_method` ENUM('cash', 'card') NULL,
  `company_customer_id` BINARY(16) NOT NULL,
  `company_issuer_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`, `company_customer_id`, `company_issuer_id`),
  INDEX `fk_invoice_company_idx` (`company_customer_id` ASC),
  INDEX `fk_invoice_company1_idx` (`company_issuer_id` ASC),
  CONSTRAINT `fk_invoice_company`
    FOREIGN KEY (`company_customer_id`)
    REFERENCES `mydb`.`company` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_invoice_company1`
    FOREIGN KEY (`company_issuer_id`)
    REFERENCES `mydb`.`company` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`item` (
  `id` BINARY(16) NOT NULL,
  `created` TIMESTAMP NULL,
  `modified` TIMESTAMP NULL,
  `name` VARCHAR(45) NULL,
  `price_per_piece` DOUBLE NULL,
  `barcode` VARCHAR(45) NULL,
  `quantity` DOUBLE NULL,
  `discount` DOUBLE NULL,
  `tax` ENUM('general', 'goods') NULL,
  `invoice_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`, `invoice_id`),
  INDEX `fk_item_invoice1_idx` (`invoice_id` ASC),
  CONSTRAINT `fk_item_invoice1`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `mydb`.`invoice` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`internal_item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`internal_item` (
  `id` BINARY(16) NOT NULL,
  `created` TIMESTAMP NULL,
  `modified` TIMESTAMP NULL,
  `name` VARCHAR(45) NULL,
  `price_per_kilo` DOUBLE NULL,
  `barcode` VARCHAR(45) NULL,
  `quantity_in_kilo` DOUBLE NULL,
  `discount` DOUBLE NULL,
  `tax` ENUM('general', 'goods') NULL,
  `department` INT NULL,
  `invoice_id` BINARY(16) NOT NULL,
  `invoice_company_customer_id` BINARY(16) NOT NULL,
  `invoice_company_issuer_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`, `invoice_id`, `invoice_company_customer_id`, `invoice_company_issuer_id`),
  INDEX `fk_internal_item_invoice1_idx` (`invoice_id` ASC, `invoice_company_customer_id` ASC, `invoice_company_issuer_id` ASC),
  CONSTRAINT `fk_internal_item_invoice1`
    FOREIGN KEY (`invoice_id` , `invoice_company_customer_id` , `invoice_company_issuer_id`)
    REFERENCES `mydb`.`invoice` (`id` , `company_customer_id` , `company_issuer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
