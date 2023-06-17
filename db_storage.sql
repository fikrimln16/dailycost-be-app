-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 30 Bulan Mei 2023 pada 12.20
-- Versi server: 10.4.27-MariaDB
-- Versi PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bangkit`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `catatan`
--

CREATE TABLE `catatan` (
  `catatan_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `catatan`
--

INSERT INTO `catatan` (`catatan_id`, `title`, `body`, `created_at`, `user_id`, `url`) VALUES
(19, 'Fikri Total THR 2jt400', 'Fikri Total THR 2jt400 untuk lebaran tahun ini', '2023-04-27', 78, 'https://storage.googleapis.com/dailycost-catatan-images/1682606696635-ilustrasi-thr_169.jpeg'),
(20, 'Testing2', 'Testing2', '2023-04-28', 82, 'https://storage.googleapis.com/dailycost-catatan-images/1682641828769-ilustrasi-thr_169.jpeg'),
(21, 'Tes 1', 'Tes 1', '2023-04-28', 73, 'https://storage.googleapis.com/dailycost-catatan-images/1682644511753-ilustrasi-thr_169.jpeg'),
(22, 'Tes 2', 'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasd', '2023-04-28', 73, 'https://storage.googleapis.com/dailycost-catatan-images/1682644539423-ilustrasi-thr_169.jpeg'),
(23, 'Tes 3', 'Tes 3', '2023-04-28', 73, 'https://storage.googleapis.com/dailycost-catatan-images/1682645445954-ilustrasi-thr_169.jpeg'),
(24, 'Tes 4', 'tes 4', '2023-04-28', 73, 'https://storage.googleapis.com/dailycost-catatan-images/1682645483938-ilustrasi-thr_169.jpeg'),
(25, 'Tes 5', 'waktu iitu makan sama ayam goreng sama pak haji, sedangkan kami sedang melakukan kemping', '2023-04-28', 73, 'https://storage.googleapis.com/dailycost-catatan-images/1682649027636-066661300_1521949447-Bakso.jpg'),
(26, 'Tes 5', 'waktu iitu makan sama ayam goreng sama pak haji, sedangkan kami sedang melakukan kemping', '2023-04-28', 73, 'https://storage.googleapis.com/dailycost-catatan-images/1682649027644-066661300_1521949447-Bakso.jpg'),
(27, 'Potrait Foto', 'foto potrait orang lain dengan gaya yang sangat minimalis', '2023-04-30', 73, 'https://storage.googleapis.com/dailycost-catatan-images/1682842286810-4327477107_d2acaefcf1.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengeluaran`
--

CREATE TABLE `pengeluaran` (
  `pengeluaran_id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `tanggal` datetime DEFAULT NULL,
  `jumlah` int(11) DEFAULT NULL,
  `pembayaran` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pengeluaran`
--

INSERT INTO `pengeluaran` (`pengeluaran_id`, `nama`, `tanggal`, `jumlah`, `pembayaran`, `user_id`) VALUES
(16, 'Makanan Bakso', '2023-04-20 15:57:47', 20000, 'GOPAY', 73),
(17, 'Takjil', '2023-04-20 17:22:30', 30000, 'GOPAY', 73),
(18, 'Makanan', '2023-04-19 17:23:00', 40000, 'GOPAY', 73),
(19, 'Sepatu', '2023-04-20 17:38:30', 200000, 'REKENING', 73),
(20, 'Bakso', '2023-04-23 08:23:20', 20000, 'GOPAY', 73),
(21, 'Belanja bulanan', '2023-04-19 00:00:00', 900000, 'GOPAY', 73),
(22, 'Bakwan', '2023-04-26 06:16:24', 20000, 'GOPAY', 73),
(23, 'Belanja bulanan', '2023-04-26 00:00:00', 900000, 'GOPAY', 73),
(24, 'Belanja bulanan', '2023-04-26 00:00:00', 900000, 'GOPAY', 73),
(25, 'Belanja bulanan', '2023-04-26 00:00:00', 900000, 'GOPAY', 73),
(26, 'Belanja bulanan', '2023-04-26 00:00:00', 900000, 'GOPAY', 73),
(27, 'Belanja bulanan', '2023-04-27 00:00:00', 900000, 'GOPAY', 73),
(28, 'Belanja ', '2023-04-27 00:00:00', 900000, 'REKENING', 73),
(29, 'Belanja 1', '2023-04-27 00:00:00', 900000, 'REKENING', 73),
(30, 'Belanja 2', '2023-04-27 00:00:00', 900000, 'REKENING', 73),
(31, 'Belanja 3', '2023-04-27 00:00:00', 900000, 'REKENING', 73),
(36, 'MakananFikri', '2023-04-27 13:51:36', 20000, 'GOPAY', 73),
(37, 'Monitor', '2023-04-27 13:54:57', 760000, 'GOPAY', 73),
(54, 'GOPAY', '2023-04-27 21:43:55', 1000, 'GOPAY', 78),
(55, 'Barang', '2023-04-28 00:14:46', 23000, 'REKENING', 73),
(56, 'GOPAYY', '2023-04-28 00:15:13', 100000, 'GOPAY', 73),
(57, 'Makanan', '2023-04-28 07:28:21', 20000, 'GOPAY', 82),
(58, 'Pengeluaran', '2023-04-28 10:05:14', 30000, 'GOPAY', 73),
(59, 'Makanan', '2023-04-28 10:06:33', 30000, 'CASH', 73),
(60, 'Monitor', '2023-04-28 11:25:58', 10000000, 'CASH', 73),
(61, 'Siang', '2023-04-28 12:25:40', 10000, 'CASH', 78),
(62, 'Indihome', '2023-04-28 16:09:44', 473800, 'REKENING', 78),
(63, 'Mie Aceh', '2023-04-28 19:17:15', 30000, 'REKENING', 78),
(64, 'Belanja', '2023-04-30 06:31:54', 20000, 'GOPAY', 83),
(65, 'Testing', '2023-04-30 10:06:26', 20000, 'REKENING', 86),
(66, 'Makanan', '2023-04-30 10:51:23', 30000, 'GOPAY', 73),
(67, 'Baru', '2023-04-30 14:05:45', 12000, 'GOPAY', 73);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tabungan`
--

CREATE TABLE `tabungan` (
  `id` int(11) NOT NULL,
  `uang_gopay` int(11) DEFAULT NULL,
  `uang_cash` int(11) DEFAULT NULL,
  `uang_rekening` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tabungan`
--

INSERT INTO `tabungan` (`id`, `uang_gopay`, `uang_cash`, `uang_rekening`) VALUES
(73, 2028000, 10270000, 7637000),
(78, 0, 1910000, 9726),
(82, 80000, 100000, 100000),
(83, 0, 20000, 20000),
(84, 30000, 50000, 40000),
(85, 20000, 60000, 40000),
(86, 200000, 400000, 280000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(73, 'admin', 'admin', '$2b$10$ReW/OeGeZsS8.Y.0rujeMOIke5smh4kVoDWLfxDXTQHnW6OIFNCMS'),
(75, 'tes', 'tes', '$2b$10$LE5gu1q4Bu67m7gJXlFa.Oi7KC5z5P343.Z46L0GWenkLmuO64w8e'),
(76, '123', '123', '$2b$10$cb6o7TwZDlFZXPLCcEBGMOsAPv0TVe88mXoyvUEcj5.7mpqnYyF3i'),
(78, 'fikri', 'fikri', '$2b$10$nrlw4/WRq2PJjCazksR2UOHdtsv2ck6KNl2iCCpH7YXqHwtJMyyVW'),
(79, '', '', '$2b$10$uBDW1Ga6DR/ZnTYgNWqr1.nm3TSOfMpk3wfRXQY5acXd6.jzhL8c.'),
(80, 'testing123', 'testing@gmail.com', '$2b$10$BCotkJ3QMDHBYquGPWVceOMwxq0I/yAG17wMY/.WM.eL8MH0zbU0m'),
(82, 'testing', 'testing2@gmail.com', '$2b$10$Owxl/j..d49/LDS6ZYGi3ugz1lm2lCPCKmkEqhjXXnM1g8/Hm9D/e'),
(83, 'testregex', 'testregex@bangkit.academy', '$2b$10$joRlQAEF7sujBiQ3I/BQZed0nnouy88Hc6vAiWOW8f32JC5fv8pri'),
(84, 'fikri', 'fikri@gmail.com', '$2b$10$/iBYg2VtwYMwGjYjOyuDnOeANzutfc5mc0pOfBhPfEzQ.pKy.Kooa'),
(85, 'rita', 'rita@gmail.com', '$2b$10$lpf2ChbAAlwhW1rt5oo9GuRNt9DVtXdZm0p0FlIzWuA/CWUb.JFsC'),
(86, 'fajar', 'fajar@gmail.com', '$2b$10$rHzoTKFi8YvL8liRsvzU7eSAikeewnlkoS/ZdihNPNZGJStKPJFiy'),
(87, '', 'undefined', 'undefined');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `catatan`
--
ALTER TABLE `catatan`
  ADD PRIMARY KEY (`catatan_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `pengeluaran`
--
ALTER TABLE `pengeluaran`
  ADD PRIMARY KEY (`pengeluaran_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `tabungan`
--
ALTER TABLE `tabungan`
  ADD KEY `id` (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `catatan`
--
ALTER TABLE `catatan`
  MODIFY `catatan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `pengeluaran`
--
ALTER TABLE `pengeluaran`
  MODIFY `pengeluaran_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `catatan`
--
ALTER TABLE `catatan`
  ADD CONSTRAINT `catatan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `pengeluaran`
--
ALTER TABLE `pengeluaran`
  ADD CONSTRAINT `pengeluaran_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `tabungan`
--
ALTER TABLE `tabungan`
  ADD CONSTRAINT `tabungan_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
