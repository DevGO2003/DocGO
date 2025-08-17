/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `docgo_contract_service`;
USE `docgo_contract_service`;

CREATE TABLE IF NOT EXISTS `contracts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contract_number` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `parties_json` longtext DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `system_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `version` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_number` (`contract_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `contracts`;
INSERT INTO `contracts` (`id`, `contract_number`, `title`, `status`, `parties_json`, `start_date`, `end_date`, `system_id`, `created_at`, `created_by`, `deleted_at`, `deleted_by`, `is_deleted`, `version`) VALUES
	(1, 'CONT-2025-001', 'Hợp đồng dịch vụ tư vấn CNTT', 'ACTIVE', '{"partyA": "Công ty TNHH Giải pháp số ABC", "partyB": "Công ty CP Công nghệ XYZ"}', '2025-08-01', '2026-07-31', 'SYS-12345', '2025-08-17 02:54:23', 'admin', NULL, NULL, 0, 1),
	(2, 'CONT-2025-002', 'Hợp đồng thuê văn phòng', 'ACTIVE', '{"landlord": "Công ty Bất động sản", "tenant": "Công ty TNHH Dịch vụ"}', '2025-09-01', '2027-08-31', 'SYS-12346', '2025-08-17 02:54:23', 'john.doe', NULL, NULL, 0, 1),
	(3, 'CONT-2025-003', 'Hợp đồng bảo trì phần mềm', 'DRAFT', '{"vendor": "Công ty Phát triển Phần mềm", "client": "Tập đoàn ABC"}', '2025-10-15', '2026-10-14', 'SYS-12347', '2025-08-17 02:54:23', 'jane.smith', NULL, NULL, 0, 1);

CREATE TABLE IF NOT EXISTS `contract_attachments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contract_id` bigint(20) NOT NULL,
  `file_id` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `version` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_contract_attachment_contract` (`contract_id`),
  CONSTRAINT `fk_contract_attachment_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `contract_attachments`;
INSERT INTO `contract_attachments` (`id`, `contract_id`, `file_id`, `file_name`, `created_at`, `created_by`, `deleted_at`, `deleted_by`, `is_deleted`, `version`) VALUES
	(1, 1, 'FILE-001A', 'Hop_dong_dich_vu_tu_van.pdf', '2025-08-17 02:54:23', 'admin', NULL, NULL, 0, 1),
	(2, 1, 'FILE-001B', 'Phu_luc_hop_dong_01.docx', '2025-08-17 02:54:23', 'admin', NULL, NULL, 0, 1),
	(3, 2, 'FILE-002A', 'Hop_dong_thue_van_phong_signed.pdf', '2025-08-17 02:54:23', 'john.doe', NULL, NULL, 0, 1),
	(4, 3, 'FILE-003A', 'Hop_dong_bao_tri_phan_mem.pdf', '2025-08-17 02:54:23', 'jane.smith', NULL, NULL, 0, 1);

CREATE TABLE IF NOT EXISTS `contract_events` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contract_id` bigint(20) DEFAULT NULL,
  `event_type` varchar(255) NOT NULL,
  `event_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`event_data`)),
  `actor` varchar(255) DEFAULT NULL,
  `event_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_contract_events_contract_id` (`contract_id`),
  CONSTRAINT `fk_event_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `contract_events`;
INSERT INTO `contract_events` (`id`, `contract_id`, `event_type`, `event_data`, `actor`, `event_time`, `note`) VALUES
	(1, 1, 'CONTRACT_CREATED', '{"status": "DRAFT", "title": "Hợp đồng dịch vụ tư vấn CNTT"}', 'admin', '2025-08-17 02:54:23', 'Hợp đồng được tạo bởi người dùng admin'),
	(2, 1, 'CONTRACT_UPDATED', '{"status": "ACTIVE", "end_date": "2026-07-31"}', 'admin', '2025-08-17 02:54:23', 'Cập nhật trạng thái và ngày kết thúc'),
	(3, 2, 'CONTRACT_CREATED', '{"status": "DRAFT", "title": "Hợp đồng thuê văn phòng"}', 'john.doe', '2025-08-17 02:54:23', 'Khởi tạo hợp đồng thuê'),
	(4, 2, 'CONTRACT_SIGNED', '{"signature_date": "2025-09-01"}', 'john.doe', '2025-08-17 02:54:23', 'Hợp đồng đã được ký kết'),
	(5, 3, 'CONTRACT_CREATED', '{"status": "DRAFT", "title": "Hợp đồng bảo trì phần mềm"}', 'jane.smith', '2025-08-17 02:54:23', 'Tạo hợp đồng bảo trì mới');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
