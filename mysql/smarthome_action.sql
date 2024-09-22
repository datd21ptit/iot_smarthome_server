-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: smarthome
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device` varchar(20) NOT NULL,
  `state` varchar(10) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61471 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action`
--

LOCK TABLES `action` WRITE;
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
INSERT INTO `action` VALUES (61346,'led','on','2024-09-20 18:57:44'),(61347,'fan','on','2024-09-20 18:57:48'),(61348,'relay','on','2024-09-20 18:57:52'),(61349,'relay','off','2024-09-20 18:57:56'),(61350,'relay','off','2024-09-20 18:58:31'),(61351,'fan','off','2024-09-20 18:58:34'),(61352,'led','off','2024-09-20 18:58:37'),(61354,'led','off','2024-09-20 18:59:01'),(61355,'led','on','2024-09-20 18:59:04'),(61357,'fan','on','2024-09-20 19:20:59'),(61359,'fan','on','2024-09-20 19:21:24'),(61360,'led','on','2024-09-20 19:24:19'),(61361,'led','off','2024-09-20 19:24:23'),(61362,'led','on','2024-09-20 19:24:26'),(61363,'led','off','2024-09-20 22:40:55'),(61366,'led','on','2024-09-20 23:26:50'),(61367,'led','off','2024-09-20 23:26:55'),(61368,'fan','off','2024-09-20 23:26:59'),(61403,'fan','on','2024-09-20 23:57:37'),(61404,'fan','off','2024-09-20 23:57:47'),(61405,'relay','on','2024-09-20 23:57:48'),(61406,'relay','off','2024-09-20 23:58:22'),(61407,'led','on','2024-09-20 23:58:55'),(61408,'led','off','2024-09-20 23:59:00'),(61409,'fan','on','2024-09-20 23:59:07'),(61410,'relay','on','2024-09-20 23:59:09'),(61411,'fan','off','2024-09-21 09:46:52'),(61412,'relay','off','2024-09-21 09:46:53'),(61413,'led','on','2024-09-21 09:46:54'),(61414,'led','off','2024-09-21 09:46:56'),(61415,'fan','on','2024-09-21 09:46:57'),(61416,'relay','on','2024-09-21 09:47:04'),(61417,'relay','off','2024-09-21 09:47:15'),(61418,'fan','off','2024-09-21 09:47:15'),(61419,'fan','on','2024-09-21 10:06:42'),(61420,'fan','off','2024-09-22 21:36:45'),(61421,'fan','on','2024-09-22 21:36:47'),(61422,'relay','on','2024-09-22 21:37:13'),(61423,'fan','off','2024-09-22 21:37:16'),(61424,'fan','on','2024-09-22 21:45:02'),(61425,'relay','off','2024-09-22 21:56:39'),(61426,'relay','off','2024-09-22 21:56:50'),(61427,'relay','on','2024-09-22 21:56:57'),(61428,'fan','off','2024-09-22 21:57:00'),(61429,'fan','on','2024-09-22 21:58:09'),(61430,'led','on','2024-09-22 21:58:15'),(61431,'fan','off','2024-09-22 21:58:45'),(61432,'relay','off','2024-09-22 21:58:47'),(61433,'led','off','2024-09-22 21:58:50'),(61434,'relay','on','2024-09-22 21:58:53'),(61435,'fan','on','2024-09-22 22:18:24'),(61436,'relay','off','2024-09-22 22:18:31'),(61437,'fan','off','2024-09-22 22:22:10'),(61438,'relay','on','2024-09-22 22:22:12'),(61439,'led','on','2024-09-22 22:22:15'),(61440,'fan','on','2024-09-22 22:22:19'),(61441,'fan','off','2024-09-22 22:22:20'),(61442,'relay','off','2024-09-22 22:22:22'),(61443,'led','off','2024-09-22 22:22:23'),(61444,'led','on','2024-09-22 22:22:25'),(61445,'relay','on','2024-09-22 22:22:26'),(61446,'fan','on','2024-09-22 22:22:30'),(61447,'fan','off','2024-09-22 22:22:32'),(61448,'relay','off','2024-09-22 22:22:34'),(61449,'led','off','2024-09-22 22:22:36'),(61450,'relay','on','2024-09-22 22:22:37'),(61451,'fan','on','2024-09-22 22:22:40'),(61452,'led','on','2024-09-22 22:22:41'),(61453,'relay','off','2024-09-22 22:23:48'),(61454,'relay','on','2024-09-22 22:23:53'),(61455,'led','off','2024-09-22 22:23:55'),(61456,'relay','off','2024-09-22 22:24:08'),(61457,'fan','off','2024-09-22 22:24:24'),(61458,'relay','on','2024-09-22 22:24:25'),(61459,'fan','on','2024-09-22 22:24:26'),(61460,'led','on','2024-09-22 22:24:28'),(61461,'fan','off','2024-09-22 22:26:01'),(61462,'relay','off','2024-09-22 22:26:03'),(61463,'relay','on','2024-09-22 22:26:06'),(61464,'fan','on','2024-09-22 22:26:25'),(61465,'relay','off','2024-09-22 22:26:29'),(61466,'relay','on','2024-09-22 22:26:33'),(61467,'relay','off','2024-09-22 22:26:35'),(61468,'led','off','2024-09-22 22:26:40'),(61469,'fan','off','2024-09-22 22:26:43'),(61470,'led','on','2024-09-22 22:26:47');
/*!40000 ALTER TABLE `action` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-22 22:50:01
