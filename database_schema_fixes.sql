-- Database Schema Update Script
-- Run this script to add missing columns to your existing database

USE tourconnectdb;

-- Check if certificate_img column exists in guides table, if not add it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = DATABASE() 
       AND table_name = 'guides' 
       AND column_name = 'certificate_img') > 0,
    'SELECT ''certificate_img column already exists in guides table'' as message;',
    'ALTER TABLE guides ADD COLUMN certificate_img TEXT;'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if tour_date column exists in tours table, if not add it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = DATABASE() 
       AND table_name = 'tours' 
       AND column_name = 'tour_date') > 0,
    'SELECT ''tour_date column already exists in tours table'' as message;',
    'ALTER TABLE tours ADD COLUMN tour_date DATE DEFAULT NULL;'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if tour_time column exists in tours table, if not add it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = DATABASE() 
       AND table_name = 'tours' 
       AND column_name = 'tour_time') > 0,
    'SELECT ''tour_time column already exists in tours table'' as message;',
    'ALTER TABLE tours ADD COLUMN tour_time TIME DEFAULT NULL;'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Display final table structures
DESCRIBE guides;
DESCRIBE tours;
