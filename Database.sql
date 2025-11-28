-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Nov 28, 2025 at 01:49 PM
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
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `max_score` decimal(5,2) NOT NULL DEFAULT 10.00,
  `due_at` datetime DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `course_id`, `lesson_id`, `title`, `description`, `max_score`, `due_at`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Bài tập 1 - Cấu trúc điều khiển', 'Viết chương trình Python sử dụng if/else và vòng lặp.', 10.00, '2025-12-01 23:59:59', 1, '2025-11-24 09:18:02', '2025-11-24 09:18:02'),
(2, 1, NULL, 'Bài tập 2 - Ôn tập Python cơ bản', 'Ôn tập các khái niệm cơ bản của Python.', 10.00, '2025-12-05 23:59:59', 0, '2025-11-24 09:18:02', '2025-11-24 09:18:02'),
(3, 2, 5, 'Bài tập JS - Biến và kiểu dữ liệu', 'Tạo trang web đơn giản minh hoạ các kiểu dữ liệu JS.', 10.00, '2025-12-03 23:59:59', 1, '2025-11-24 09:18:02', '2025-11-24 09:18:02'),
(4, 1, NULL, 'BÀI 3', NULL, 10.00, '2025-11-28 18:14:00', 1, '2025-11-27 11:19:44', '2025-11-27 11:19:44'),
(5, 1, NULL, 'Bài tập 4- Cấu trúc dữ liệu và giải thuật', NULL, 10.00, '2025-11-28 18:42:00', 1, '2025-11-27 11:42:50', '2025-11-27 11:42:50'),
(6, 6, NULL, 'Bài 1 - Kiểu dữ liệu', NULL, 10.00, '2025-11-28 20:08:00', 1, '2025-11-27 13:08:44', '2025-11-27 13:08:44'),
(7, 1, NULL, 'Bài 10 - Ôn tập kiểm tra cuối kì', NULL, 10.00, '2025-11-29 01:19:00', 1, '2025-11-27 17:17:47', '2025-11-27 17:17:47'),
(8, 1, NULL, 'Bài 9 - test', NULL, 10.00, '2025-11-29 00:36:00', 1, '2025-11-27 17:36:37', '2025-11-27 17:36:37');

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `assignment_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `enrollment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `content_text` longtext DEFAULT NULL,
  `content_url` varchar(255) DEFAULT NULL,
  `status` enum('draft','submitted','graded') NOT NULL DEFAULT 'submitted',
  `score` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `graded_at` datetime DEFAULT NULL,
  `graded_by` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assignment_submissions`
--

INSERT INTO `assignment_submissions` (`id`, `assignment_id`, `student_id`, `enrollment_id`, `submitted_at`, `content_text`, `content_url`, `status`, `score`, `feedback`, `graded_at`, `graded_by`) VALUES
(1, 1, 3, 1, '2025-11-20 20:15:00', 'Bài làm sử dụng if, for và while.', NULL, 'graded', 10.00, 'BÀI LÀM RẤT TỐT', '2025-11-27 17:37:27', 1),
(2, 3, 3, 2, '2025-11-22 21:00:00', 'Link GitHub: https://github.com/example/js-assignment', NULL, 'submitted', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_conversations`
--

CREATE TABLE `chat_conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `instructor_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Khóa học liên quan (nếu có)',
  `last_message_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_conversations`
--

INSERT INTO `chat_conversations` (`id`, `student_id`, `instructor_id`, `course_id`, `last_message_at`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 1, '2025-11-18 18:08:13', '2025-11-18 18:08:13', '2025-11-18 18:08:13'),
(2, 3, 1, 3, '2025-11-18 18:09:09', '2025-11-18 18:09:09', '2025-11-18 18:09:09'),
(3, 3, 2, 5, '2025-11-18 18:17:10', '2025-11-18 18:17:10', '2025-11-18 18:17:10');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `instructor_id` bigint(20) UNSIGNED NOT NULL,
  `programming_language_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(180) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `short_description` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `level` enum('Beginner','Intermediate','Advanced') NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `price_cents` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `instructor_id`, `programming_language_id`, `title`, `slug`, `short_description`, `description`, `level`, `thumbnail_url`, `price_cents`, `is_published`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Python Foundations', 'python-foundations', 'Bắt đầu với Python qua các ví dụ thực tế.', 'Khóa học giúp bạn nắm vững các khái niệm nền tảng của Python, từ cú pháp cơ bản đến cấu trúc dữ liệu phổ biến.', 'Beginner', 'https://cdn.example.com/thumbnails/python-foundations.png', 0, 1, '2024-05-20 09:00:00', '2024-01-10 00:00:00', '2024-05-20 09:00:00'),
(2, 2, 3, 'JavaScript Web Development', 'javascript-web-development', 'Xây dựng trang web tương tác bằng JavaScript.', 'Khóa học tập trung vào ES6+, DOM và các pattern phổ biến khi phát triển web hiện đại.', 'Intermediate', 'https://cdn.example.com/thumbnails/js-web-dev.png', 49000000, 1, '2024-05-25 14:00:00', '2024-01-12 00:00:00', '2025-11-22 15:27:42'),
(3, 1, 1, 'Python Data Science từ cơ bản đến thực chiến', 'python-data-science', 'Làm việc với dữ liệu, NumPy, Pandas và trực quan hoá.', 'Khoá học giúp bạn làm quen với tư duy phân tích dữ liệu, làm sạch dữ liệu, xử lý với NumPy/Pandas và trực quan hoá bằng các thư viện phổ biến.', 'Intermediate', 'https://cdn.example.com/thumbnails/python-data-science.png', 69000000, 1, '2024-06-10 09:00:00', '2024-02-01 00:00:00', '2025-11-22 15:27:46'),
(4, 2, 2, 'Java OOP Mastery', 'java-oop-mastery', 'Nắm vững lập trình hướng đối tượng với Java.', 'Khoá học tập trung vào class, object, kế thừa, interface, abstraction và các pattern OOP hay dùng trong dự án thực tế.', 'Intermediate', 'https://cdn.example.com/thumbnails/java-oop.png', 59000000, 1, '2024-06-15 10:00:00', '2024-02-05 00:00:00', '2025-11-22 15:27:48'),
(5, 2, 3, 'Modern React & TypeScript', 'modern-react-typescript', 'Xây dựng SPA hiện đại với React + TS.', 'Bạn sẽ học cách sử dụng React hooks, quản lý state, routing và typing với TypeScript để xây dựng ứng dụng web frontend hiện đại.', 'Advanced', 'https://cdn.example.com/thumbnails/react-ts.png', 9900000, 1, '2024-06-20 14:00:00', '2024-02-10 00:00:00', '2025-11-22 15:28:11'),
(6, 1, 4, 'Lập trình C++ từ cơ bản đến nâng cao', 'cpp-fundamentals-to-advanced', 'Nắm chắc C++ từ cú pháp cơ bản đến OOP và STL.', 'Khóa học giúp bạn đi từ C++ cơ bản (biến, điều khiển, hàm) đến lập trình hướng đối tượng, STL, xử lý file và tối ưu hiệu năng.', 'Intermediate', 'https://cdn.example.com/thumbnails/cpp-fundamentals.png', 690000, 1, '2025-11-22 16:14:02', '2025-11-22 16:14:02', '2025-11-22 16:14:02'),
(7, 2, 5, 'Thiết kế giao diện web với HTML & CSS', 'html-css-web-design', 'Học cách dựng giao diện web hiện đại, chuẩn responsive.', 'Khóa học tập trung vào HTML sematic, CSS hiện đại (Flexbox, Grid), responsive design và best practice khi cắt giao diện.', 'Beginner', 'https://cdn.example.com/thumbnails/html-css-web.png', 390000, 1, '2025-11-22 16:14:02', '2025-11-22 16:14:02', '2025-11-22 16:14:02'),
(8, 2, 6, 'Lập trình C# và .NET cho người mới', 'csharp-dotnet-beginner', 'Bắt đầu với C# và xây dựng ứng dụng đơn giản trên .NET.', 'Khóa học giới thiệu cú pháp C#, OOP trong C#, và cách xây dựng ứng dụng console / winform / web cơ bản trên nền tảng .NET.', 'Beginner', 'https://cdn.example.com/thumbnails/csharp-dotnet.png', 590000, 1, '2025-11-22 16:14:02', '2025-11-22 16:14:02', '2025-11-22 16:14:02'),
(9, 1, 6, 'Lập trình Game với C#', 'lập-trình-game-với-c', 'Hướng dẫn lập trình game cơ bản với C#', 'Làm quen với  C#', 'Beginner', NULL, 10000000, 1, NULL, '2025-11-28 12:17:38', '2025-11-28 12:17:38'),
(10, 1, 6, 'Lập trình C# nâng cao', 'lập-trình-c-nâng-cao', 'Lập trình C# nâng cao', 'Cải thiện kỹ năng lập trình C#', 'Intermediate', NULL, 50000000, 1, NULL, '2025-11-28 12:20:15', '2025-11-28 12:20:15'),
(11, 1, 2, 'Lập trình Java cơ bản', 'lập-trình-java-cơ-bản', 'Học lập trình Java cơ bản', 'Hướng dẫn lập trình Java cơ bản', 'Beginner', NULL, 0, 1, NULL, '2025-11-28 12:23:08', '2025-11-28 12:23:08'),
(12, 1, 1, 'Lập trình Nhúng với Python', 'lập-trình-nhúng-với-python', 'Lập trình phần cứng với ngôn ngữ Python', 'Giúp học viên làm quen với lập trình nhúng', 'Beginner', NULL, 0, 1, NULL, '2025-11-28 12:31:36', '2025-11-28 12:31:36'),
(13, 1, 1, 'Lập trình game với Python', 'lập-trình-game-với-python', 'Lập trình game với Python', 'Làm quen với Python trong lập trình Game', 'Beginner', NULL, 0, 1, NULL, '2025-11-28 12:37:21', '2025-11-28 12:37:21'),
(14, 1, 1, 'Xử lý ảnh với Python', 'xử-lý-ảnh-với-python', 'Xử lý hình ảnh với Python', 'Làm quen với các thư viện hình ảnh của Python', 'Beginner', NULL, 0, 1, NULL, '2025-11-28 12:41:54', '2025-11-28 12:41:54'),
(15, 1, 1, 'Lập trình nhúng với Python nâng cao', 'lập-trình-nhúng-với-python-nâng-cao', 'Lập trình nhúng nâng cao', 'Lập trình nhúng nâng cao với Python', 'Intermediate', NULL, 50000000, 1, NULL, '2025-11-28 12:45:14', '2025-11-28 12:45:14'),
(16, 1, 4, 'Cấu trúc dữ liệu và giải thuật C++', 'cấu-trúc-dữ-liệu-và-giải-thuật-c', 'CTDL và Giải thuật với C++', 'Học lập trình chuyên sâu với CTDL và Giải thuật', 'Intermediate', NULL, 10000000, 1, NULL, '2025-11-28 12:52:17', '2025-11-28 12:52:17');

-- --------------------------------------------------------

--
-- Table structure for table `course_grades`
--

CREATE TABLE `course_grades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `enrollment_id` bigint(20) UNSIGNED NOT NULL,
  `final_score` decimal(5,2) DEFAULT NULL,
  `letter_grade` varchar(5) DEFAULT NULL,
  `status` enum('in_progress','passed','failed') NOT NULL DEFAULT 'in_progress',
  `last_calculated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_grades`
--

INSERT INTO `course_grades` (`id`, `enrollment_id`, `final_score`, `letter_grade`, `status`, `last_calculated_at`) VALUES
(1, 1, 8.50, 'B+', 'passed', '2025-11-28 18:00:00'),
(2, 2, 6.00, 'C', 'in_progress', '2025-11-28 18:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `course_sections`
--

CREATE TABLE `course_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(180) NOT NULL,
  `position` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_sections`
--

INSERT INTO `course_sections` (`id`, `course_id`, `title`, `position`, `created_at`, `updated_at`) VALUES
(1, 1, 'Giới thiệu Python', 1, '2024-01-11 00:00:00', '2024-01-11 00:00:00'),
(2, 1, 'Các khái niệm cơ bản', 2, '2024-01-11 00:05:00', '2024-01-11 00:05:00'),
(3, 2, 'Frontend cơ bản', 1, '2024-01-13 00:00:00', '2024-01-13 00:00:00'),
(4, 3, 'Nhập môn Khoa học dữ liệu', 1, '2024-02-01 00:00:00', '2024-02-01 00:00:00'),
(5, 3, 'Xử lý dữ liệu với Pandas', 2, '2024-02-01 00:05:00', '2024-02-01 00:05:00'),
(6, 4, 'Ôn tập Java cơ bản', 1, '2024-02-05 00:00:00', '2024-02-05 00:00:00'),
(7, 4, 'Lập trình hướng đối tượng nâng cao', 2, '2024-02-05 00:05:00', '2024-02-05 00:05:00'),
(8, 5, 'React Hooks cơ bản', 1, '2024-02-10 00:00:00', '2024-02-10 00:00:00'),
(9, 5, 'Quản lý state và kiến trúc dự án', 2, '2024-02-10 00:05:00', '2024-02-10 00:05:00'),
(10, 16, 'Chương 1 - Mảng', 1, '2025-11-28 13:38:16', '2025-11-28 13:38:16');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `progress_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `last_access_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `course_id`, `user_id`, `enrolled_at`, `progress_percent`, `last_access_at`) VALUES
(1, 1, 3, '2024-05-21 10:00:00', 75.00, '2025-11-14 16:12:44'),
(2, 2, 3, '2024-05-26 16:30:00', 15.00, '2025-11-18 18:22:48'),
(9, 3, 3, '2025-11-18 16:35:07', 0.00, '2025-11-18 18:22:37'),
(15, 5, 3, '2025-11-18 18:22:58', 0.00, '2025-11-27 17:19:49'),
(17, 6, 3, '2025-11-27 13:11:09', 0.00, NULL),
(19, 7, 3, '2025-11-27 17:38:35', 0.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `max_score` decimal(6,2) NOT NULL DEFAULT 10.00,
  `duration_minutes` int(10) UNSIGNED DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `attempt_limit` int(10) UNSIGNED DEFAULT 1,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `course_id`, `title`, `description`, `max_score`, `duration_minutes`, `start_at`, `end_at`, `attempt_limit`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 1, 'Quiz 1 - Python cơ bản', 'Kiểm tra nhanh kiến thức Python chương 1–2.', 10.00, 20, '2025-11-25 08:00:00', '2025-11-30 23:59:59', 3, 1, '2025-11-24 09:18:02', '2025-11-24 09:18:02'),
(2, 2, 'Quiz 1 - JavaScript cơ bản', 'Câu hỏi trắc nghiệm về biến và kiểu dữ liệu.', 10.00, 20, '2025-11-25 08:00:00', '2025-11-30 23:59:59', 3, 1, '2025-11-24 09:18:02', '2025-11-24 09:18:02');

-- --------------------------------------------------------

--
-- Table structure for table `exam_answers`
--

CREATE TABLE `exam_answers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `submission_id` bigint(20) UNSIGNED NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `selected_option_ids` text DEFAULT NULL COMMENT 'Lưu danh sách id phương án (vd: 1,3,5) cho multiple_choice',
  `answer_text` text DEFAULT NULL COMMENT 'Dùng cho câu trả lời ngắn/tự luận',
  `score` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_answers`
--

INSERT INTO `exam_answers` (`id`, `submission_id`, `question_id`, `selected_option_ids`, `answer_text`, `score`) VALUES
(1, 1, 1, '2', NULL, 2.00),
(2, 1, 2, '1,3', NULL, 3.00),
(3, 2, 3, '2,3', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `exam_options`
--

CREATE TABLE `exam_options` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `option_text` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `position` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_options`
--

INSERT INTO `exam_options` (`id`, `question_id`, `option_text`, `is_correct`, `position`) VALUES
(1, 1, 'int', 0, 1),
(2, 1, 'float', 1, 2),
(3, 1, 'string', 0, 3),
(4, 2, 'for', 1, 1),
(5, 2, 'foreach', 0, 2),
(6, 2, 'while', 1, 3),
(7, 3, 'var', 0, 1),
(8, 3, 'let', 1, 2),
(9, 3, 'const', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions`
--

CREATE TABLE `exam_questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `exam_id` bigint(20) UNSIGNED NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('single_choice','multiple_choice','true_false','short_answer') NOT NULL DEFAULT 'single_choice',
  `points` decimal(5,2) NOT NULL DEFAULT 1.00,
  `position` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_questions`
--

INSERT INTO `exam_questions` (`id`, `exam_id`, `question_text`, `question_type`, `points`, `position`) VALUES
(1, 1, 'Trong Python, kiểu dữ liệu của 3.14 là gì?', 'single_choice', 2.00, 1),
(2, 1, 'Chọn các câu lệnh lặp hợp lệ trong Python.', 'multiple_choice', 3.00, 2),
(3, 2, 'Từ khoá nào để khai báo biến trong JavaScript (ES6+)?', 'single_choice', 2.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `exam_submissions`
--

CREATE TABLE `exam_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `exam_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `enrollment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `status` enum('in_progress','submitted','graded') NOT NULL DEFAULT 'in_progress',
  `total_score` decimal(6,2) DEFAULT NULL,
  `graded_at` datetime DEFAULT NULL,
  `graded_by` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_submissions`
--

INSERT INTO `exam_submissions` (`id`, `exam_id`, `student_id`, `enrollment_id`, `started_at`, `submitted_at`, `status`, `total_score`, `graded_at`, `graded_by`) VALUES
(1, 1, 3, 1, '2025-11-26 09:00:00', '2025-11-26 09:15:00', 'graded', 8.00, '2025-11-26 10:00:00', 1),
(2, 2, 3, 2, '2025-11-27 19:00:00', '2025-11-27 19:18:00', 'submitted', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `forum_comments`
--

CREATE TABLE `forum_comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'ID của comment cha (để reply)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `forum_comments`
--

INSERT INTO `forum_comments` (`id`, `post_id`, `user_id`, `content`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'Em liên hệ cho thầy nhé', NULL, '2025-11-18 15:09:08', '2025-11-18 15:09:08'),
(2, 3, 1, 'Em liên hệ cho thầy nhé!', NULL, '2025-11-27 11:44:21', '2025-11-27 11:44:21'),
(3, 3, 1, 'EM HÃY LIÊN HỆ CHO THẦY NHÉ', NULL, '2025-11-27 13:10:23', '2025-11-27 13:10:23'),
(4, 4, 1, 'Em liên hệ cho thầy nhé', NULL, '2025-11-27 17:19:09', '2025-11-27 17:19:09'),
(5, 4, 3, 'Dạ vâng ạ!', 4, '2025-11-27 17:21:58', '2025-11-27 17:21:58'),
(6, 5, 3, 'Em cần hỗ trợ dạy lập trình ạ!', NULL, '2025-11-27 17:40:10', '2025-11-27 17:40:10'),
(7, 2, 3, 'Dạ vâng ạ', 1, '2025-11-27 17:40:33', '2025-11-27 17:40:33');

-- --------------------------------------------------------

--
-- Table structure for table `forum_posts`
--

CREATE TABLE `forum_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `view_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `forum_posts`
--

INSERT INTO `forum_posts` (`id`, `user_id`, `title`, `content`, `view_count`, `created_at`, `updated_at`) VALUES
(1, 3, 'Lập trình Python', 'Bài này khó quá, cần hỗ trợ', 2, '2025-11-18 14:05:16', '2025-11-27 17:40:22'),
(2, 3, 'Lập trình Py', 'Bài này rất khó, cần hỗ trợ', 11, '2025-11-18 14:10:31', '2025-11-27 17:40:33'),
(3, 3, 'LẬP TRÌNH C++', 'BÀI NÀY KHÓ QUÁ, MÌNH CẦN HƯỚNG DẪN', 8, '2025-11-27 11:41:09', '2025-11-27 13:13:33'),
(4, 3, 'Cần hướng dẫn học lập trình C++', 'Mình cần người hướng dẫn môn này', 4, '2025-11-27 13:13:19', '2025-11-27 17:21:58'),
(5, 1, 'Nhận hỗ trợ dạy lập trình', 'Ai cần thì liên hệ email', 2, '2025-11-27 17:38:04', '2025-11-27 17:40:10');

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(180) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `content_type` enum('video','article','quiz','project') NOT NULL DEFAULT 'video',
  `content_url` varchar(255) DEFAULT NULL,
  `content_body` longtext DEFAULT NULL,
  `duration_sec` int(10) UNSIGNED DEFAULT NULL,
  `position` int(10) UNSIGNED NOT NULL,
  `is_previewable` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `section_id`, `title`, `slug`, `content_type`, `content_url`, `content_body`, `duration_sec`, `position`, `is_previewable`, `created_at`, `updated_at`) VALUES
(1, 1, 'Tổng quan về Python', 'tong-quan-python', 'video', 'https://cdn.example.com/videos/python-intro.mp4', NULL, 420, 1, 1, '2024-01-11 00:10:00', '2024-01-11 00:10:00'),
(2, 1, 'Cài đặt môi trường', 'cai-dat-moi-truong', 'article', NULL, 'Hướng dẫn cài đặt Python, VSCode và các công cụ hỗ trợ.', NULL, 2, 1, '2024-01-11 00:12:00', '2024-01-11 00:12:00'),
(3, 2, 'Cấu trúc điều khiển', 'cau-truc-dieu-khien', 'video', 'https://cdn.example.com/videos/python-control-flow.mp4', NULL, 600, 1, 0, '2024-01-11 00:15:00', '2024-01-11 00:15:00'),
(4, 2, 'Mini Quiz #1', 'mini-quiz-1', 'quiz', NULL, NULL, NULL, 2, 0, '2024-01-11 00:20:00', '2024-01-11 00:20:00'),
(5, 3, 'Biến và kiểu dữ liệu', 'bien-va-kieu-du-lieu', 'video', 'https://cdn.example.com/videos/js-variables.mp4', NULL, 540, 1, 1, '2024-01-13 00:10:00', '2024-01-13 00:10:00'),
(6, 4, 'Giới thiệu Data Science', 'intro-data-science', 'video', 'https://cdn.example.com/videos/intro-data-science.mp4', NULL, 480, 1, 1, '2024-02-01 00:10:00', '2024-02-01 00:10:00'),
(7, 4, 'Các dạng dữ liệu và exploratory analysis', 'eda-data-science', 'article', NULL, 'Tổng quan về các dạng dữ liệu thường gặp, kỹ thuật EDA cơ bản và cách đặt câu hỏi cho dữ liệu.', NULL, 2, 1, '2024-02-01 00:15:00', '2024-02-01 00:15:00'),
(8, 5, 'Làm quen với Pandas DataFrame', 'pandas-dataframe', 'video', 'https://cdn.example.com/videos/pandas-dataframe.mp4', NULL, 600, 1, 0, '2024-02-01 00:20:00', '2024-02-01 00:20:00'),
(9, 5, 'Lọc, nhóm và tổng hợp dữ liệu', 'pandas-groupby-agg', 'video', 'https://cdn.example.com/videos/pandas-groupby-agg.mp4', NULL, 720, 2, 0, '2024-02-01 00:25:00', '2024-02-01 00:25:00'),
(10, 6, 'Ôn lại cú pháp Java', 'java-syntax-review', 'video', 'https://cdn.example.com/videos/java-syntax-review.mp4', NULL, 540, 1, 1, '2024-02-05 00:10:00', '2024-02-05 00:10:00'),
(11, 6, 'Làm việc với Collections', 'java-collections', 'article', NULL, 'Giới thiệu List, Set, Map và các cách duyệt, sắp xếp dữ liệu trong Java Collections Framework.', NULL, 2, 1, '2024-02-05 00:15:00', '2024-02-05 00:15:00'),
(12, 7, 'Kế thừa, abstract class và interface', 'java-oop-advanced', 'video', 'https://cdn.example.com/videos/java-oop-advanced.mp4', NULL, 780, 1, 0, '2024-02-05 00:20:00', '2024-02-05 00:20:00'),
(13, 7, 'Thiết kế class trong dự án thực tế', 'java-oop-design', 'project', NULL, 'Bài tập thiết kế hệ thống quản lý khoá học với các thực thể: User, Course, Enrollment...', NULL, 2, 0, '2024-02-05 00:25:00', '2024-02-05 00:25:00'),
(14, 8, 'useState và useEffect cơ bản', 'react-hooks-basic', 'video', 'https://cdn.example.com/videos/react-hooks-basic.mp4', NULL, 480, 1, 1, '2024-02-10 00:10:00', '2024-02-10 00:10:00'),
(15, 8, 'Custom hooks và tách logic', 'react-custom-hooks', 'article', NULL, 'Hướng dẫn tạo custom hooks để chia nhỏ logic, tái sử dụng trong nhiều component.', NULL, 2, 1, '2024-02-10 00:15:00', '2024-02-10 00:15:00'),
(16, 9, 'Quản lý state với Context', 'react-context-state', 'video', 'https://cdn.example.com/videos/react-context-state.mp4', NULL, 720, 1, 0, '2024-02-10 00:20:00', '2024-02-10 00:20:00'),
(17, 9, 'Tổ chức folder, module hoá component', 'react-project-architecture', 'article', NULL, 'Gợi ý cách tổ chức folder, module hoá component/container, chia nhỏ business logic trong dự án React lớn.', NULL, 2, 0, '2024-02-10 00:25:00', '2024-02-10 00:25:00'),
(18, 10, 'Mảng trong CTDL', 'mảng-trong-ctdl-miiwrvbt', 'article', NULL, NULL, NULL, 1, 0, '2025-11-28 13:38:51', '2025-11-28 13:38:51');

-- --------------------------------------------------------

--
-- Table structure for table `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `enrollment_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  `completed_at` datetime DEFAULT NULL,
  `last_viewed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lesson_progress`
--

INSERT INTO `lesson_progress` (`id`, `enrollment_id`, `lesson_id`, `status`, `completed_at`, `last_viewed_at`) VALUES
(1, 1, 1, 'completed', '2024-05-21 12:00:00', '2024-05-21 12:00:00'),
(2, 1, 2, 'completed', '2024-05-22 09:00:00', '2024-05-22 09:00:00'),
(3, 1, 3, 'in_progress', NULL, '2024-05-28 19:45:00'),
(4, 1, 4, 'not_started', NULL, NULL),
(5, 2, 5, 'in_progress', NULL, '2024-05-30 21:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `programming_languages`
--

CREATE TABLE `programming_languages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `difficulty` enum('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `programming_languages`
--

INSERT INTO `programming_languages` (`id`, `name`, `slug`, `difficulty`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Python', 'python', 'Beginner', 'Ngôn ngữ lập trình đa dụng, dễ học, phổ biến trong khoa học dữ liệu.', '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(2, 'Java', 'java', 'Intermediate', 'Ngôn ngữ hướng đối tượng mạnh mẽ, phổ biến trong doanh nghiệp.', '2024-01-05 00:05:00', '2024-01-05 00:05:00'),
(3, 'JavaScript', 'javascript', 'Intermediate', 'Ngôn ngữ chính cho phát triển web front-end.', '2024-01-05 00:10:00', '2024-01-05 00:10:00'),
(4, 'C++', 'cpp', 'Intermediate', 'Ngôn ngữ lập trình hiệu năng cao, dùng nhiều trong hệ thống, game và thi lập trình.', '2025-11-22 16:05:58', '2025-11-22 16:05:58'),
(5, 'HTML & CSS', 'html-css', 'Beginner', 'Bộ đôi nền tảng để xây dựng giao diện web tĩnh và thiết kế bố cục trang.', '2025-11-22 16:06:06', '2025-11-22 16:06:06'),
(6, 'C#', 'csharp', 'Intermediate', 'Ngôn ngữ hiện đại của Microsoft, phổ biến trong phát triển ứng dụng desktop, web và game với .NET.', '2025-11-22 16:06:11', '2025-11-22 16:06:11');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'instructor', 'Giảng viên tạo và quản lý khóa học', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 'student', 'Học viên tham gia khóa học', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

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

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`) VALUES
(1, 1, '2024-01-02 00:00:00'),
(2, 1, '2024-01-03 00:00:00'),
(3, 2, '2024-01-04 00:00:00'),
(5, 2, '2025-11-08 16:59:09'),
(6, 2, '2025-11-27 10:39:44'),
(7, 2, '2025-11-27 11:38:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_assignments_course` (`course_id`),
  ADD KEY `idx_assignments_lesson` (`lesson_id`);

--
-- Indexes for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_assignment_student` (`assignment_id`,`student_id`),
  ADD KEY `idx_submissions_student` (`student_id`),
  ADD KEY `idx_submissions_enrollment` (`enrollment_id`),
  ADD KEY `idx_submissions_status` (`status`),
  ADD KEY `idx_submissions_graded_by` (`graded_by`);

--
-- Indexes for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chat_conversations_student` (`student_id`),
  ADD KEY `idx_chat_conversations_instructor` (`instructor_id`),
  ADD KEY `idx_chat_conversations_course` (`course_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chat_messages_conversation` (`conversation_id`),
  ADD KEY `idx_chat_messages_sender` (`sender_id`),
  ADD KEY `idx_chat_messages_created` (`created_at`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_courses_instructor` (`instructor_id`),
  ADD KEY `fk_courses_language` (`programming_language_id`);

--
-- Indexes for table `course_grades`
--
ALTER TABLE `course_grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_course_grade_enrollment` (`enrollment_id`),
  ADD KEY `idx_course_grades_status` (`status`);

--
-- Indexes for table `course_sections`
--
ALTER TABLE `course_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_course_section_position` (`course_id`,`position`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_enrollment` (`course_id`,`user_id`),
  ADD KEY `fk_enrollments_user` (`user_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_exams_course` (`course_id`);

--
-- Indexes for table `exam_answers`
--
ALTER TABLE `exam_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_answers_submission` (`submission_id`),
  ADD KEY `idx_answers_question` (`question_id`);

--
-- Indexes for table `exam_options`
--
ALTER TABLE `exam_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_options_question` (`question_id`);

--
-- Indexes for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_questions_exam` (`exam_id`),
  ADD KEY `idx_questions_position` (`position`);

--
-- Indexes for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_exam_submissions_exam` (`exam_id`),
  ADD KEY `idx_exam_submissions_student` (`student_id`),
  ADD KEY `idx_exam_submissions_enrollment` (`enrollment_id`),
  ADD KEY `idx_exam_submissions_status` (`status`),
  ADD KEY `idx_exam_submissions_graded_by` (`graded_by`);

--
-- Indexes for table `forum_comments`
--
ALTER TABLE `forum_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_forum_comments_user` (`user_id`),
  ADD KEY `idx_forum_comments_post` (`post_id`),
  ADD KEY `idx_forum_comments_created` (`created_at` DESC),
  ADD KEY `idx_forum_comments_parent` (`parent_id`);

--
-- Indexes for table `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_forum_posts_created` (`created_at` DESC),
  ADD KEY `idx_forum_posts_user` (`user_id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_section_lesson_position` (`section_id`,`position`),
  ADD UNIQUE KEY `uniq_section_lesson_slug` (`section_id`,`slug`);

--
-- Indexes for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_enrollment_lesson` (`enrollment_id`,`lesson_id`),
  ADD KEY `fk_progress_lesson` (`lesson_id`);

--
-- Indexes for table `programming_languages`
--
ALTER TABLE `programming_languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `uniq_users_email` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `fk_user_roles_role` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `course_grades`
--
ALTER TABLE `course_grades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `course_sections`
--
ALTER TABLE `course_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `exam_answers`
--
ALTER TABLE `exam_answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exam_options`
--
ALTER TABLE `exam_options`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `forum_comments`
--
ALTER TABLE `forum_comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `forum_posts`
--
ALTER TABLE `forum_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `programming_languages`
--
ALTER TABLE `programming_languages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `fk_assignments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignments_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD CONSTRAINT `fk_submissions_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_submissions_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_submissions_graded_by` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_submissions_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD CONSTRAINT `fk_chat_conv_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chat_conv_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chat_conv_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `fk_chat_msg_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chat_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `fk_courses_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_courses_language` FOREIGN KEY (`programming_language_id`) REFERENCES `programming_languages` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `course_grades`
--
ALTER TABLE `course_grades`
  ADD CONSTRAINT `fk_course_grades_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course_sections`
--
ALTER TABLE `course_sections`
  ADD CONSTRAINT `fk_sections_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_enrollments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `fk_exams_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exam_answers`
--
ALTER TABLE `exam_answers`
  ADD CONSTRAINT `fk_answers_question` FOREIGN KEY (`question_id`) REFERENCES `exam_questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_answers_submission` FOREIGN KEY (`submission_id`) REFERENCES `exam_submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exam_options`
--
ALTER TABLE `exam_options`
  ADD CONSTRAINT `fk_options_question` FOREIGN KEY (`question_id`) REFERENCES `exam_questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD CONSTRAINT `fk_questions_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  ADD CONSTRAINT `fk_exam_submissions_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_exam_submissions_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_exam_submissions_graded_by` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_exam_submissions_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `forum_comments`
--
ALTER TABLE `forum_comments`
  ADD CONSTRAINT `fk_forum_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `forum_comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_forum_comments_post` FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_forum_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD CONSTRAINT `fk_forum_posts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `fk_lessons_section` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `fk_progress_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_progress_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
