-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tourconnect
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` varchar(50) NOT NULL,
  `guide_id` varchar(50) DEFAULT NULL,
  `tourist_id` varchar(50) DEFAULT NULL,
  `booking_date` date DEFAULT NULL,
  `time_slot` time DEFAULT NULL,
  `duration_hours` int DEFAULT NULL,
  `number_of_tourists` int DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending',
  `special_requests` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES ('44af3e43-53f9-443e-b1f0-54ef0d5bc4b7','71ab5530-a5d3-46b9-9f03-374dc96e0221','a4bcb60a-62da-4da8-a465-174075eb3bfe','2025-08-09','08:00:00',5,20,200.00,'pending','pending','I hope you can singing while guide us','2025-08-09 04:58:56');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guides`
--

DROP TABLE IF EXISTS `guides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guides` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `languages` json DEFAULT NULL,
  `specialties` json DEFAULT NULL,
  `price_per_hour` decimal(10,2) DEFAULT NULL,
  `experience_years` int DEFAULT NULL,
  `description` text,
  `certificates` json DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `total_reviews` int DEFAULT '0',
  `is_available` tinyint(1) DEFAULT '1',
  `current_location` point DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guides`
--

LOCK TABLES `guides` WRITE;
/*!40000 ALTER TABLE `guides` DISABLE KEYS */;
INSERT INTO `guides` VALUES ('49be27bf-2aad-443c-8afd-2fc596a0eaed','71ab5530-a5d3-46b9-9f03-374dc96e0221','Ho Chi Minh City','[\"English\", \"Vietnamese\", \"Japanese\"]','[\"singing\", \"dancing\"]',10.00,2,'I really like to guide people','[\"string\"]',0.00,0,1,NULL,'verified'),('64643690-5b99-4ac9-99d1-ea163230bcdb','string','Da Nang City','[\"string\"]','[\"string\"]',0.00,0,'string','[\"string\"]',0.00,0,1,NULL,'verified'),('6da03ad3-0d81-48a8-b671-1eadc2bc1811','string','string','[\"English\"]','[\"string\"]',100.00,4,'string','[\"string\"]',0.00,0,1,NULL,'rejected'),('c92b7a82-54a9-4243-96ba-846461a1353d','string','string','[\"string\"]','[\"string\"]',0.00,0,'string','[\"string\"]',0.00,0,1,NULL,'pending'),('G25082003635','string','string','[\"string\"]','[\"string\"]',0.00,0,'string','[\"string\"]',0.00,0,1,NULL,'pending');
/*!40000 ALTER TABLE `guides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` varchar(50) NOT NULL,
  `booking_id` varchar(50) NOT NULL,
  `payer_id` varchar(50) NOT NULL,
  `payee_guide_id` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `method` enum('momo','card','cash') NOT NULL,
  `status` enum('pending','requires_action','authorized','captured','failed','refunded','cancelled') NOT NULL DEFAULT 'pending',
  `platform_fee` decimal(10,2) DEFAULT '0.00',
  `net_amount` decimal(10,2) GENERATED ALWAYS AS ((`amount` - ifnull(`platform_fee`,0.00))) STORED,
  `provider_transaction_id` varchar(100) DEFAULT NULL,
  `provider_order_id` varchar(100) DEFAULT NULL,
  `provider_payload` json DEFAULT NULL,
  `receipt_url` text,
  `note` text,
  `paid_at` timestamp NULL DEFAULT NULL,
  `refunded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_provider_tx` (`provider_transaction_id`),
  KEY `idx_booking_id` (`booking_id`),
  KEY `idx_payer_id` (`payer_id`),
  KEY `idx_payee_id` (`payee_guide_id`),
  CONSTRAINT `payments_ibfk_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `payments_ibfk_payee` FOREIGN KEY (`payee_guide_id`) REFERENCES `guides` (`id`),
  CONSTRAINT `payments_ibfk_payer` FOREIGN KEY (`payer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` varchar(50) NOT NULL,
  `booking_id` varchar(50) NOT NULL,
  `tourist_id` varchar(50) NOT NULL,
  `guide_id` varchar(50) NOT NULL,
  `tour_id` varchar(50) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `tourist_id` (`tourist_id`),
  KEY `guide_id` (`guide_id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`tourist_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`),
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_tickets`
--

DROP TABLE IF EXISTS `support_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_tickets` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `support_type` enum('user','guide') NOT NULL,
  `status` enum('open','pending','closed','resolved') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_tickets`
--

LOCK TABLES `support_tickets` WRITE;
/*!40000 ALTER TABLE `support_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tours` (
  `id` varchar(50) NOT NULL,
  `guide_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `duration_hours` int DEFAULT NULL,
  `max_people` int DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` text,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `guide_id` (`guide_id`),
  CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES ('T25082005602','49be27bf-2aad-443c-8afd-2fc596a0eaed','Hanoi Old Quarter Walking Tour','Explore historical streets...',3,10,25.00,'https://example.com/tour.jpg','cultural','2025-08-20 05:22:49','2025-08-20 05:22:49');
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('tourist','guide','admin','support') NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` text,
  `is_verified` tinyint(1) DEFAULT '0',
  `users_status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('082c56d8-005b-44a5-a0bd-bff4e8cb40a0','tienbi63543@gmail.com','$2b$10$0mP3rqHCtynb/EHcQ.9.VuTzI3y26L7KmI3CWWcbf24p89S5fSSy6','tourist','Tien Dang','0123456789',NULL,1,'inactive','2025-08-05 19:22:44','2025-08-20 02:39:06'),('0f3baa94-1610-4e20-820e-5ba3e8a3e12e','2251120118@ut.edu.vn','$2b$10$k5yZhBfu4lKhwwBng0lK1.H4iAIdF.5VY2RygAV3WgA/AaICUJa5i','support','support1','0123456789',NULL,1,'active','2025-08-14 06:47:13','2025-08-16 12:49:08'),('71ab5530-a5d3-46b9-9f03-374dc96e0221','2251120124@ut.edu.vn','$2b$10$OLpwXMNr4IH2soB13OLJ7O8kyYZm7CeEPfgf.01WxJMCrs4hrgUcC','guide','Pham Cong Tru','0123456789',NULL,1,'active','2025-08-06 01:03:38','2025-08-16 12:49:08'),('76a9100a-1aef-457f-bc6e-c595fa06d889','tien632004@gmail.com','$2b$10$ipcyA/aSsIFXVq4nvTvxeuJ3wYTgTz/2oUp/XZJ/Kc73W1e3fGZDe','admin','Admin','0123456789',NULL,1,'active','2025-08-14 06:42:06','2025-08-16 12:49:08'),('U25082003795','kiritanitaiyo@gmail.com','$2b$10$ugDl4xbC9We6S0WOU7Vt8e5.4LLu0UPOYOW.yyMUiwKYJ7lBq1OEC','tourist','Taiyou Dang','0123456789',NULL,1,'active','2025-08-20 03:35:04','2025-08-20 03:35:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-20 12:23:33
