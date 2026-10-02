CREATE DATABASE  IF NOT EXISTS `charityevents_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `charityevents_db`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fun Run','Charity walks, runs and marathons for all fitness levels'),(2,'Gala Dinner','Formal fundraising dinners with auctions and entertainment'),(3,'Silent Auction','Bid on donated items and experiences over a set period'),(4,'Charity Concert','Live music events where ticket sales fund the cause'),(5,'Trivia Night','Community quiz nights with entry fees and raffles');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `purpose` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `venue` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticket_price` decimal(8,2) NOT NULL DEFAULT '0.00',
  `goal_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `raised_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_suspended` tinyint(1) NOT NULL DEFAULT '0',
  `org_id` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `fk_events_org` (`org_id`),
  KEY `idx_events_date` (`event_date`),
  KEY `idx_events_city` (`city`),
  KEY `idx_events_category` (`category_id`),
  CONSTRAINT `fk_events_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `fk_events_org` FOREIGN KEY (`org_id`) REFERENCES `organisations` (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Riverbank Charity Fun Run 5K','A flat 5 km riverside run for all ages','Join hundreds of runners and walkers along the Wilsons River. Every entry fee goes directly to local family support programs. Medals for all finishers and a free barbecue afterwards.','Raise funds for emergency relief for flood-affected families','2026-10-14','07:30:00','11:00:00','Riverside Park','1 Bridge Street','Lismore',25.00,20000.00,8600.00,'/images/funrun-5k.jpg',0,1,1,'2026-09-30 12:22:25'),(2,'Coastal Twilight Gala Dinner','An elegant evening of dining and giving','A black-tie three-course dinner with live entertainment and a major prize draw. Tables of ten are available for corporate supporters.','Fund oncology support nurses on the Gold Coast','2026-10-30','18:30:00','23:00:00','Surfers Paradise Ballroom','88 Esplanade','Gold Coast',150.00,80000.00,31500.00,'/images/twilight-gala.jpg',0,2,2,'2026-09-30 12:22:25'),(3,'Art for a Cause Silent Auction','Bid on original works by local artists','Over 60 original artworks and experiences are open for silent bidding. Entry is free, registration is required to receive a bidding number.','Support art therapy programs for young people','2026-10-21','10:00:00','20:00:00','Byron Community Arts Centre','12 Jonson Street','Byron Bay',0.00,15000.00,4200.00,'/images/art-auction.jpg',0,3,3,'2026-09-30 12:22:25'),(4,'Sounds of Hope Charity Concert','Four bands, one cause','An all-ages live music night featuring four local bands. All profits fund youth mentoring and scholarship places.','Raise funds for youth scholarships','2026-11-14','17:00:00','23:00:00','The Tivoli','52 Costin Street','Brisbane',60.00,50000.00,12500.00,'/images/sounds-of-hope.jpg',0,3,4,'2026-09-30 12:22:25'),(5,'Quiz for a Cure Trivia Night','Eight rounds of trivia with great prizes','Bring a table of eight and test your knowledge. Raffle tickets and a silent auction run throughout the night.','Fund cancer research and patient transport','2026-10-07','18:00:00','22:00:00','Coffs Harbour Community Hall','5 Castle Street','Coffs Harbour',20.00,8000.00,5300.00,'/images/quiz-night.jpg',0,2,5,'2026-09-30 12:22:25'),(6,'Harbour to Headland Fun Run 10K','Sydney\'s most scenic charity run','A 10 km course from Circular Quay to the headland, with a 3 km family walk option. Timing chips included.','Fund mental-health support for teenagers','2026-11-29','06:30:00','12:00:00','Circular Quay Forecourt','Alfred Street','Sydney',35.00,40000.00,9000.00,'/images/harbour-run.jpg',0,3,1,'2026-09-30 12:22:25'),(7,'Backyard Brainiacs Trivia Night','A relaxed midweek quiz for a good cause','Six rounds, food trucks on site, and a prize for the best team name. Entry fee includes one raffle ticket.','Fund school books and uniforms for families in need','2026-10-28','18:30:00','21:30:00','New Farm Community Centre','9 Brunswick Street','Brisbane',15.00,6000.00,1500.00,'/images/brainiacs.jpg',0,1,5,'2026-09-30 12:22:25'),(8,'Winter Warmth Gala','A sold-out evening that reached its target','Our annual winter fundraiser with a live auction and matched giving from corporate partners.','Provide blankets and heating support during winter','2026-08-26','18:30:00','23:00:00','Lismore City Hall','1 Bounty Street','Lismore',120.00,60000.00,58200.00,'/images/winter-warmth.jpg',0,1,2,'2026-09-30 12:22:25'),(9,'Bids for Books Silent Auction','A week of bidding on books and experiences','Rare books, author meet-and-greets and holiday packages were auctioned online and in person.','Fund school libraries in low-income areas','2026-09-10','09:00:00','21:00:00','Broadbeach Library','61 Sunshine Boulevard','Gold Coast',0.00,12000.00,11950.00,'/images/bids-for-books.jpg',0,3,3,'2026-09-30 12:22:25'),(10,'Voices United Charity Concert','A choir and orchestra collaboration','More than 200 performers took part in a single-night charity concert.','Fund music education for regional schools','2026-08-06','19:00:00','22:30:00','Byron Bay Community Theatre','69 Jonson Street','Byron Bay',45.00,30000.00,27400.00,'/images/voices-united.jpg',0,3,4,'2026-09-30 12:22:25'),(11,'Unlicensed Prize Draw Night','Event suspended pending verification','This event has been suspended by the platform because the organiser could not provide a valid fundraising licence.','Suspended event - not displayed to the public','2026-10-10','19:00:00','22:00:00','TBC','TBC','Lismore',30.00,5000.00,0.00,'/images/suspended.jpg',1,1,5,'2026-09-30 12:22:25');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organisations`
--

DROP TABLE IF EXISTS `organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisations` (
  `org_id` int NOT NULL AUTO_INCREMENT,
  `org_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mission` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisations`
--

LOCK TABLES `organisations` WRITE;
/*!40000 ALTER TABLE `organisations` DISABLE KEYS */;
INSERT INTO `organisations` VALUES (1,'Northern Rivers Care Foundation','Supporting families across the Northern Rivers','A community-based charity funding health, education and emergency relief programs in regional NSW.','info@nrcare.org.au','02 6620 1234','https://www.nrcare.org.au',NULL,'2026-09-30 12:22:25'),(2,'Coastline Cancer Support Group','No one faces cancer alone','Provides practical and emotional support to cancer patients and their families along the coast.','hello@coastlinecancer.org.au','07 5531 8899','https://www.coastlinecancer.org.au',NULL,'2026-09-30 12:22:25'),(3,'Bright Futures Youth Trust','Every young person deserves a fair start','Raises funds for scholarships, mentoring and mental-health programs for disadvantaged youth.','contact@brightfutures.org.au','02 6652 4477','https://www.brightfutures.org.au',NULL,'2026-09-30 12:22:25');
/*!40000 ALTER TABLE `organisations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-30 13:04:15
