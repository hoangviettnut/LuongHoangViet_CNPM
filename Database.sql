-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Nov 27, 2025 at 01:19 PM
-- Server version: 10.11.14-MariaDB-ubu2204
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(60) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `full_name`, `email`, `avatar_url`, `bio`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES
(1, 'viet', 'NjY2NjY2', 'Lương Hoàng Việt', 'vietluong@gmail.com', NULL, 'Giảng viên kiêm quản lý nền tảng E-Learning.', 1, '2024-06-02 09:30:00', '2024-01-02 00:00:00', '2025-11-22 15:22:35'),
(2, 'minho', 'cG9vbGh1Yg==', 'Lee Min Ho', 'minho@gmail.com', 'https://cdn.example.com/avatars/bob.png', 'Chuyên gia JavaScript và phát triển web.', 1, '2024-06-03 10:15:00', '2024-01-03 00:00:00', '2025-11-22 15:23:45'),
(3, 'anh', 'MTIzNDU2', 'Phạm Quốc Anh', 'anh@gmail.com', NULL, 'Sinh viên CNTT yêu thích học lập trình.', 1, '2024-06-05 20:45:00', '2024-01-04 00:00:00', '2025-11-22 15:44:20'),
(4, 'hocvien', 'NjY2NjY2', 'Trai đẹp tnut', 'cucai@gmail.com', NULL, NULL, 1, NULL, '2025-11-08 16:54:32', '2025-11-08 16:54:32'),
(5, 'test', 'NjY2NjY2', 'Sinh viên tnut', 'carot@gmail.com', NULL, NULL, 1, NULL, '2025-11-08 16:59:09', '2025-11-22 15:24:39'),
(6, 'tnutedu', 'MTIzNDU2', 'SINH VIÊN TNUT', 'tnutedu@gmail.com', NULL, NULL, 1, NULL, '2025-11-27 10:39:44', '2025-11-27 10:39:44'),
(7, 'tnutedu1', 'MTIzNDU2', 'SINH VIÊN TNUT', 'tnutedu1@gmail.com', NULL, NULL, 1, NULL, '2025-11-27 11:38:45', '2025-11-27 11:38:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `uniq_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
