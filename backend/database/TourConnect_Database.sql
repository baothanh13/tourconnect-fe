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
  `payment_status` enum('none','pending','paid','fail','refunded') DEFAULT 'none',
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
INSERT INTO `bookings` VALUES ('B25090811149','G25082101805','U25082003795','2025-09-10','09:00:00',2,4,100.00,'confirmed','pending','','2025-09-08 11:13:45'),('B25090911730','G25090911781','U25082003795','2025-09-18','11:00:00',2,4,20.00,'pending','fail','None','2025-09-09 11:38:02'),('B25091020001','G25082101805','U25082003795','2025-09-20','14:00:00',3,2,150.00,'confirmed','pending','Vegetarian food request','2025-09-10 13:00:00'),('B25091020002','G25090911781','U25082003795','2025-09-22','10:00:00',4,3,200.00,'completed','paid','Need English-speaking guide','2025-09-10 13:10:00'),('B25091020003','G25082101805','U25082003795','2025-09-25','15:00:00',2,1,60.00,'completed','paid','Wheelchair accessibility required','2025-09-10 13:15:00'),('B25091020004','G25090911781','U25082003795','2025-09-28','08:00:00',5,5,300.00,'completed','paid','Photography spots requested','2025-09-10 13:20:00');
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
  `certificate_img` text,
  PRIMARY KEY (`id`),
  KEY `fk_guides_user` (`user_id`),
  CONSTRAINT `fk_guides_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guides`
--

LOCK TABLES `guides` WRITE;
/*!40000 ALTER TABLE `guides` DISABLE KEYS */;
INSERT INTO `guides` VALUES ('G25082101805','U25082016650','Ho Chi Minh','[\"English\", \"French\"]','[\"Cultural Tours\", \"Art Tours\"]',20.00,5,'Experienced tour guide with deep knowledge of Hanoi history.','[\"Language Certificate B\"]',4.38,4,1,NULL,'verified','[\"https://www.tiaa.co.uk/wp-content/uploads/2023/09/AdobeStock_402880022_Editorial_Use_Only.jpg\",\"https://www.ibm-institute.com/wp-content/uploads/2020/02/cert-pic-french-business.png\"]'),('G25090910244','U25090910333','Hue','[\"English\", \"Vietnamese\"]','[\"Historical Tours\", \"Nature Tours\", \"Night Tours\"]',15.00,2,'Hello everyone, my name is Thanh. I’m your tour guide today. I’ll be showing you around and making sure you have a fun and safe journey. If you have any questions, feel free to ask me anytime.','[\"Ielts 6.5\"]',0.00,0,1,NULL,'verified','[\"https://trangtuyensinh24h.com/wp-content/uploads/2022/12/quy-doi-diem-toeic-3-791x1024.jpg\"]'),('G25090911283','U25090910976','Ha Noi','[\"English\", \"Japanese\"]','[\"Night Tours\", \"Religious Tours\"]',15.00,2,'Hello friends, I’m Quang. I grew up in this city, so I know many interesting stories and local secrets to share with you. I hope by the end of the tour, you will love this place as much as I do, I can speak both English and Japanese','[\"Ielts 7.0\", \"JLPT N3\"]',0.00,0,1,NULL,'verified',NULL),('G25090911321','U25090910848','Ha Noi','[\"English\", \"Japanese\"]','[\"Adventure Tours\"]',20.00,2,'Hello everyone. My name is Hung, nickname is Aleph. I’ve been a tour guide for 2, guiding visitors from many different countries. My goal today is to make sure you enjoy every moment, learn something new, and feel at home here.','[\"JLPT N5\"]',0.00,0,1,NULL,'verified',NULL),('G25090911781','U25090910491','Quang Tri','[\"English\", \"Vietnamese\"]','[\"Adventure Tours\", \"Food Tours\"]',10.00,2,'Hi everyone, welcome on board! I’m Lam Thong, your guide for today’s tour. I love meeting new people and I promise to keep the trip both enjoyable and informative. Let’s make some great memories together','[\"TOEIC 600\"]',0.00,0,1,NULL,'verified',NULL),('G25090911878','U25090910340','Ho Chi Minh','[\"English\", \"Japanese\"]','[\"City Tours\", \"Night Tours\"]',10.00,1,'Hi there, I’m Bach, your guide for today. Please don’t hesitate to talk to me if you need help or have any special requests. I’m here to make your trip easy, comfortable, and full of discoveries.','[\"JPLT N4\"]',0.00,0,1,NULL,'verified',NULL),('G25090911979','U25090910121','Da Nang','[\"English\"]','[\"Shopping Tours\"]',10.00,1,'Hi everyone, welcome on board!','[\"Ielts 6.0\"]',0.00,0,1,NULL,'verified','[\"https://trangtuyensinh24h.com/wp-content/uploads/2022/12/quy-doi-diem-toeic-3-791x1024.jpg\"]');
/*!40000 ALTER TABLE `guides` ENABLE KEYS */;
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
  `tour_title` varchar(255) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `tourist_id` (`tourist_id`),
  KEY `guide_id` (`guide_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`tourist_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES ('R25090916659','B25090811149','U25082003795','G25082101805','Dinh Doc Lap Walking Tour',5.0,'Peak','2025-09-09 16:05:04'),('R25091020001','B25091020001','U25082003795','G25082101805','Saigon Hidden Gems Tour',4.5,'Great experience! The guide showed us amazing places off the beaten path.','2025-09-10 13:30:00'),('R25091020002','B25091020002','U25082003795','G25090911781','Cu Chi Tunnel Adventure',5.0,'Absolutely fantastic! The guide explained history in detail and was very engaging.','2025-09-22 09:30:00'),('R25091020003','B25091020003','U25082003795','G25082101805','Saigon Food Street Tour',3.5,'Food was delicious but the tour felt a bit rushed.','2025-09-25 11:00:00'),('R25091020004','B25091020004','U25082003795','G25090911781','Mekong Delta Day Trip',4.8,'Wonderful scenery and the guide was very patient. Great for photos!','2025-09-28 12:45:00');
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
  `user_id` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `support_type` enum('tourist','guide') NOT NULL,
  `status` enum('open','pending','closed','resolved') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_support_tickets_user` (`user_id`),
  CONSTRAINT `fk_support_tickets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_tickets`
--

LOCK TABLES `support_tickets` WRITE;
/*!40000 ALTER TABLE `support_tickets` DISABLE KEYS */;
INSERT INTO `support_tickets` VALUES ('ST25083112112',NULL,'tienbi63543@gmail.com','0886485440','Issue with create tour','I cannot create my tour.','guide','open','2025-08-31 12:07:19','2025-08-31 12:07:19'),('ST25083112905','U25082003795','kiritanitaiyo@gmail.com','0888312227','Issue with booking','I cannot transfer money after my booking is confirmed.','tourist','open','2025-08-31 12:14:48','2025-09-01 15:12:33');
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
  `tour_date` date DEFAULT NULL,
  `tour_time` time DEFAULT NULL,
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
INSERT INTO `tours` VALUES ('T25082705698','G25082101805','Dong Hoi Walking Tour','Explore Nhat Le River, Bao Ninh beach, Quang Binh Quan',3,5,10.00,'https://api.sovaba.travel/uploads/sm_Toan_canh_thanh_pho_dong_hoi_nhin_tu_tren_cao_8d1107278a.jpg','Cultural Tours','2025-08-27 05:57:15','2025-09-07 01:41:17','2025-09-09','07:00:00'),('T25082713747','G25082101805','The Imperial City of Hue Walking Tour','In this tour, you will enjoy the beautiful scenes of the imperial',2,10,15.00,'https://st.ielts-fighter.com/src/ielts-fighter-image/2023/03/23/3c1a0be3-c26b-4d72-bbd1-6dae9a216784.jpg','historical','2025-08-27 13:21:44','2025-09-07 01:42:00','2025-09-11','09:00:00'),('T25090201191','G25082101805','Hồ Chí Minh Mausoleum Walking Tour In Vietnam Independence Day','One of the most visited attractions in Hanoi, the Ho Chi Minh Mausoleum is the final resting place of “Uncle Ho,” the beloved founder of the Democratic Republic of Vietnam',2,10,25.00,'https://dynamic-media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/6c/28.jpg','historical','2025-09-02 01:50:12','2025-09-07 01:41:53','2025-09-10','09:00:00'),('T25090413138','G25082101805','Hanoi Old Quarter Walking Tour','Explore Hanoi Old Quarter with me, I\'m sure you will like it',2,10,25.00,'https://ik.imagekit.io/tvlk/blog/2023/09/pho-co-ha-noi-1.jpg','adventure','2025-09-04 13:07:04','2025-09-07 01:38:15','2025-09-08','09:00:00');
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
INSERT INTO `users` VALUES ('U25080800121','admintourconnect@gmail.com','$2b$10$d/OAwpKgmprvD9ywKu9Qxez2J/fBscPJxN8MhAlVqNhRnlh9i7Md.','admin','Admin','0123456789',NULL,'2025-08-14 06:42:06','2025-09-16 03:37:26'),('U25082003795','dangminhtien@gmail.com','$2b$10$gObHi1zkrmpTa9gomxnWm.Dhfle5gwSSr/GipEdTm0mMaO/idMM4i','tourist','Dang Minh Tien','0123456789','https://example.com/avatar.jpg','2025-08-20 03:35:04','2025-09-10 03:04:43'),('U25082003796','2251120118@ut.edu.vn','$2b$10$k5yZhBfu4lKhwwBng0lK1.H4iAIdF.5VY2RygAV3WgA/AaICUJa5i','support','support1','0123456789',NULL,'2025-08-14 06:47:13','2025-09-10 04:08:28'),('U25082016650','tienbi63543@gmail.com','$2b$10$9ge7ueij1DaU/E1ZE1QwK.2hnXgkzULtLZR7YVi3HJSxuzpaMcFmS','guide','Dang Anh Tien','0886485440','http://localhost:5000/uploads/1757431758700-76031324.png','2025-08-20 16:49:54','2025-09-09 15:29:18'),('U25090910121','congtru@gmail.com','$2b$10$skbOcNwg3Y5cqb8azeELyefwoubwEJIoKCI4Oo6Y2rXR3J8jZX/gG','guide','Pham Cong Tru ','0987654321','','2025-09-09 10:52:33','2025-09-09 10:52:33'),('U25090910333','baothanh@gmail.com','$2b$10$S4KdpCYDYD5qCZDD6cj7Uu1vAKUB1RX1y2VwTn3z8g454vuhh8Uai','guide','Phan Quy Bao Thanh','0987654321','http://localhost:5000/uploads/1757432488620-644658414.jpg','2025-09-09 10:52:07','2025-09-09 15:41:28'),('U25090910340','hoangbach@gmail.com','$2b$10$5uPOm.G/taP0QwfEYBE.EuKZh9ychppbyiWozF8Sx9EGF7T3BmCE2','guide','Hoang Bach','0921442171','http://localhost:5000/uploads/1757431856853-365241223.jpg','2025-09-09 10:54:04','2025-09-09 15:30:56'),('U25090910491','lamthong@gmail.com','$2b$10$NprwGWxavdW8V49ZvxOWe.P72FsaYJ/neMC/q/4ych1dmb4pLNzU.','guide','Lam Thong','0123456789','http://localhost:5000/uploads/1757432390755-402124313.jpg','2025-09-09 10:54:41','2025-09-09 15:39:50'),('U25090910848','hung@gmail.com','$2b$10$1CsJ4QedBYqD3lj14UOAY.LqlQtCIxQMEed16AiVzLXOrrcM7PVWu','guide','Hung Nguyen','0987654321','','2025-09-09 10:53:34','2025-09-09 10:53:34'),('U25090910976','minhquang@gmail.com','$2b$10$sTPXIkEO75J28E2h52La..WRRol5b32jjqJMZAX840rkwUwQzGtvu','guide','Minh Quang','0987654321','http://localhost:5000/uploads/1757431919195-10467813.jpg','2025-09-09 10:55:29','2025-09-09 15:31:59');
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

-- Dump completed on 2025-09-16 10:38:09
