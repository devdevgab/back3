-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 31, 2024 at 03:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_ticketing`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_categories`
--

CREATE TABLE `tbl_categories` (
  `categoryId` int(11) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `categoryDesc` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_responses`
--

CREATE TABLE `tbl_responses` (
  `responseId` int(11) NOT NULL,
  `ticketId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `responseText` varchar(255) NOT NULL,
  `responseDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ticketcategory`
--

CREATE TABLE `tbl_ticketcategory` (
  `ticketId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tickets`
--

CREATE TABLE `tbl_tickets` (
  `ticketId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `ticketTitle` varchar(255) NOT NULL,
  `ticketDesc` varchar(255) NOT NULL,
  `ticketStatus` varchar(255) NOT NULL,
  `ticketResoDate` varchar(255) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `ticketServiceType` varchar(255) NOT NULL,
  `ticketServiceFor` varchar(255) NOT NULL,
  `ticketDeleteStatus` varchar(255) NOT NULL,
  `ticketNumberOfComp` varchar(255) NOT NULL,
  `ticketNumberOfUsers` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_tickets`
--

INSERT INTO `tbl_tickets` (`ticketId`, `userId`, `ticketTitle`, `ticketDesc`, `ticketStatus`, `ticketResoDate`, `created`, `ticketServiceType`, `ticketServiceFor`, `ticketDeleteStatus`, `ticketNumberOfComp`, `ticketNumberOfUsers`) VALUES
(1, NULL, 'testing Ticket Title', 'testing ticket Description', '1', NULL, '2024-10-25 06:08:26', 'Repair', 'Printer', '0', '', ''),
(2, NULL, 'testing Ticket Title2', 'testing ticket Description2', '1', NULL, '2024-10-25 06:15:32', 'Maintenance', 'Cisco', '0', '', ''),
(3, 4, 'the hehe title', 'the hehe desc', 'On Going', NULL, '2024-10-25 07:00:03', 'Pull Out', 'Switch', '1', '', ''),
(4, 4, 'testing Ticket Title5656', 'testing ticket Description123123', '1', NULL, '2024-10-28 02:57:40', 'Installation', 'Monitor', '', '9', '10'),
(5, 4, 'testing Ticket Title5656asdasd', 'testing ticket Description123123asdasdasd', '1', NULL, '2024-10-28 06:26:33', 'Installationasdasdasd', 'Monitor', '', '', ''),
(6, 4, 'testing Ticket Title5656asdasd', 'testing ticket Description123123asdasdasd', '1', NULL, '2024-10-28 06:27:08', 'Installationasdasdasd', 'Monitor', '', '', ''),
(7, 4, 'qeqweqweqwe', 'qwqqrqrqwrqwr', '2', NULL, '2024-10-28 06:31:08', 'qweqe  qwwqeqwe', 'Monitorwwww', '', '', ''),
(8, 4, 'zzzzzzzzzzzzzzzzz', 'gggggggggg', '2', NULL, '2024-10-28 06:32:46', 'kkkkkkkkk', 'Monitorwwww', '', '0', '0'),
(9, 4, 'jjjjjjjjjj', 'ooooooooo', '2', NULL, '2024-10-28 06:33:28', 'kkkkkkkkk', 'uuuuuuuuuu', '', '1', '0'),
(10, 4, 'oashd;oash;dasdih;as;odahsdha', 'ouiqwyepoiqwyepquwyeqywpeqwy', '2', NULL, '2024-10-28 06:46:28', 'pqpqpqpqpqpqpqpqppq', 'uuuuuuuuuu', '', '1', '0'),
(11, 4, 'ksksksksksksksks', 'rqrqrqrqrqrq', '2', NULL, '2024-10-28 06:48:34', 'pqpqpqpqpqpqpqpqppq', 'uuuuuuuuuu', '0', '1', '0'),
(12, 4, 'fefefefefe', 'rqrqrqrqrqrq', '2', NULL, '2024-10-29 07:13:47', 'pqpqpqpqpqpqpqpqppq', 'uuuuuuuuuu', '0', '1', '0'),
(13, 4, 'The Ui Title', 'The UI Description', 'Active', NULL, '2024-10-29 07:20:30', 'Maintenance', 'Francis', '0', '11', '0'),
(14, 4, 'The Test Title with zero delete value', 'hehehe', 'Active', NULL, '2024-10-29 07:25:18', 'maintenance', 'Gabriel', '0', '0', '0'),
(15, 4, 'The new Title without active status ', '', 'Active', NULL, '2024-10-29 07:32:45', '', '', '0', '0', '0'),
(17, 4, 'HAHAHHAHAHAH', 'HEHEHEHEH', 'Active', NULL, '2024-10-29 07:33:50', 'REPAIR', 'Francis GEGEGE', '0', '1', '0'),
(18, 4, 'THE ACTIVE STATUS 1 NOW', 'GEGEGEG', 'Active', NULL, '2024-10-29 07:34:52', 'PULL OUT', 'FraFraFra', '0', '0', '19'),
(19, 4, 'LAst TESTING FOR ACTIVE = 1', 'GAAAAAAAA', '1', NULL, '2024-10-29 07:35:56', 'INSTALLATION', 'GABGABGAB', '0', '0', '56'),
(20, 4, '', '', '1', NULL, '2024-10-30 04:41:36', '', '', '0', '0', '0'),
(21, 4, 'qeqweqweqweqe', 'qweqweqwe', '1', NULL, '2024-10-30 04:43:57', 'qweqwe', 'qweqw', '0', '1', '1'),
(22, 4, 'Final Test for creating System', 'Final Description', '1', NULL, '2024-10-31 01:17:33', 'Module Installment', 'Gabriel ', '0', '10', '29'),
(23, 4, 'jjjjjjjjjjjjj', 'AAAAAAAAAAA', '1', NULL, '2024-10-31 01:36:09', 'aaaaaaa', 'aaaaa', '0', '1', '1'),
(24, 4, 'ggafgasfasfasdasdasd', 'ggafgasfasfasdasdasd', '1', NULL, '2024-10-31 01:46:25', 'gege', 'gaga', '0', '1', '1');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `userId` int(11) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `userPhone` varchar(15) NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `userFirstName` varchar(255) NOT NULL,
  `userLastName` varchar(255) NOT NULL,
  `departmentName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `passwrd` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`userId`, `userEmail`, `userPhone`, `created`, `userFirstName`, `userLastName`, `departmentName`, `username`, `passwrd`) VALUES
(1, 'Testing@gmail.com', '0912356789', '2024-10-25 03:12:23', 'Francis Gabriel', 'Cabahug', 'Main-Branch', '', ''),
(2, 'Testing@gmail.com', '0912356789', '2024-10-25 03:15:32', 'Francis Gabriel', 'Cabahug', 'Main-Branch', '', ''),
(3, 'Testing2222@gmail.com', '0912356789', '2024-10-25 03:16:14', 'Gabriel Testing', 'Cabahug2', 'Main-Branch', '', ''),
(4, 'Testing2222222@gmail.com', '0912356789', '2024-10-25 03:24:53', 'The One Man', 'Cabahug2', 'Main-Branch', 'francis1', 'gege123'),
(5, 'gegegege@gmail.com', '0912356789', '2024-10-25 03:51:01', 'Paranoid Test', 'GEGEGGE', 'Side-Branch', 'user1', 'unencrypted password');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_categories`
--
ALTER TABLE `tbl_categories`
  ADD PRIMARY KEY (`categoryId`);

--
-- Indexes for table `tbl_responses`
--
ALTER TABLE `tbl_responses`
  ADD PRIMARY KEY (`responseId`),
  ADD KEY `ticketId` (`ticketId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `tbl_ticketcategory`
--
ALTER TABLE `tbl_ticketcategory`
  ADD PRIMARY KEY (`ticketId`,`categoryId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `tbl_tickets`
--
ALTER TABLE `tbl_tickets`
  ADD PRIMARY KEY (`ticketId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_categories`
--
ALTER TABLE `tbl_categories`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_responses`
--
ALTER TABLE `tbl_responses`
  MODIFY `responseId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_tickets`
--
ALTER TABLE `tbl_tickets`
  MODIFY `ticketId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_responses`
--
ALTER TABLE `tbl_responses`
  ADD CONSTRAINT `tbl_responses_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `tbl_tickets` (`ticketId`),
  ADD CONSTRAINT `tbl_responses_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `tbl_users` (`userId`);

--
-- Constraints for table `tbl_ticketcategory`
--
ALTER TABLE `tbl_ticketcategory`
  ADD CONSTRAINT `tbl_ticketcategory_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `tbl_tickets` (`ticketId`),
  ADD CONSTRAINT `tbl_ticketcategory_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `tbl_categories` (`categoryId`);

--
-- Constraints for table `tbl_tickets`
--
ALTER TABLE `tbl_tickets`
  ADD CONSTRAINT `tbl_tickets_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `tbl_users` (`userId`);

--
-- Constraints for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD CONSTRAINT `tbl_users_ibfk_1` FOREIGN KEY (`DepartmentId`) REFERENCES `tbl_departmentbranch` (`departmentId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
