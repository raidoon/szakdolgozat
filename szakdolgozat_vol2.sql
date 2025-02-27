-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Feb 27. 11:36
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `szakdolgozat_vol2`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `autosiskola_adatok`
--

CREATE TABLE `autosiskola_adatok` (
  `autosiskola_id` int(11) NOT NULL,
  `autosiskola_nev` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `autosiskola_adatok`
--

INSERT INTO `autosiskola_adatok` (`autosiskola_id`, `autosiskola_nev`) VALUES
(1, 'Cívis Autósiskola'),
(2, 'Vida Autósiskola'),
(3, 'Koroknai Autósiskola');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `befizetesek`
--

CREATE TABLE `befizetesek` (
  `befizetesek_id` int(11) NOT NULL,
  `befizetesek_tanuloID` int(11) NOT NULL,
  `befizetesek_oktatoID` int(11) NOT NULL,
  `befizetesek_tipusID` int(11) NOT NULL,
  `befizetesek_osszeg` int(11) NOT NULL,
  `befizetesek_ideje` datetime NOT NULL,
  `befizetesek_jovahagyva` int(1) NOT NULL,
  `befizetesek_kinek` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `befizetesek`
--

INSERT INTO `befizetesek` (`befizetesek_id`, `befizetesek_tanuloID`, `befizetesek_oktatoID`, `befizetesek_tipusID`, `befizetesek_osszeg`, `befizetesek_ideje`, `befizetesek_jovahagyva`, `befizetesek_kinek`) VALUES
(1, 5, 7, 1, 15600, '2025-01-09 10:23:40', 2, 0),
(2, 5, 7, 1, 7800, '2025-01-06 16:13:15', 1, 1),
(3, 5, 7, 2, 20000, '2025-01-09 08:06:05', 2, 1),
(4, 4, 7, 1, 7800, '2025-01-01 08:35:33', 0, 1),
(5, 5, 7, 1, 7800, '2025-01-02 17:17:10', 1, 0),
(6, 5, 7, 2, 20000, '2025-01-21 11:14:28', 2, 0),
(7, 5, 7, 1, 15600, '2025-01-20 21:51:47', 1, 0),
(14, 4, 7, 1, 5000, '2025-01-22 12:51:45', 0, 1),
(15, 4, 7, 1, 7800, '2025-01-22 12:51:58', 0, 1),
(16, 4, 7, 1, 700, '2025-01-22 12:52:30', 0, 0),
(17, 4, 7, 1, 5600, '2025-01-22 12:53:36', 0, 0),
(18, 4, 7, 1, 7800, '2025-01-22 12:54:07', 0, 1),
(19, 4, 7, 1, 7800, '2025-01-22 12:56:51', 0, 0),
(20, 4, 7, 1, 7800, '2025-01-22 12:59:11', 1, 1),
(21, 5, 7, 1, 7800, '2025-01-23 11:32:55', 1, 1),
(22, 5, 7, 1, 7800, '2025-01-30 12:32:58', 1, 1),
(23, 5, 7, 1, 10000, '2025-02-04 08:47:41', 0, 0),
(24, 5, 7, 1, 44, '2025-02-04 08:58:47', 0, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznaloi_adatok`
--

CREATE TABLE `felhasznaloi_adatok` (
  `felhasznalo_id` int(11) NOT NULL,
  `felhasznalo_autosiskola` int(11) NOT NULL,
  `felhasznalo_email` varchar(255) NOT NULL,
  `felhasznalo_jelszo` varchar(500) NOT NULL,
  `felhasznalo_telefonszam` varchar(12) NOT NULL,
  `felhasznalo_tipus` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznaloi_adatok`
--

INSERT INTO `felhasznaloi_adatok` (`felhasznalo_id`, `felhasznalo_autosiskola`, `felhasznalo_email`, `felhasznalo_jelszo`, `felhasznalo_telefonszam`, `felhasznalo_tipus`) VALUES
(8, 1, 'kisjanosoktato@gmail.com', '$2a$10$n8UPuWEiewapcvHsNyXjs./hSYRSvAPFRWMTCmernNSX9ilNP/Jna', '06301122345', 1),
(10, 1, 'tesztoktato@gmail.com', '$2a$10$L3Hvt1NgtAiKhLRy9TACheG3TNkqHnDkbB5H/empxXO0WkadZxdxS', '06309998765', 1),
(11, 1, 'A@gmail.com', '$2a$10$FFGdZRrop2fTDwrGhDj3L.fkpk0kOi0Apx4FXRlC4XBIFiFJ0KmHS', '0', 2),
(12, 1, 'B@gmail.com', '$2a$10$fdi/L0fkwNAYQ01qHIb88ebnATNDTu0v4KiewPTYp9fPFi71y.aoy', '0', 1),
(13, 1, 'c@gmail.com', '$2a$10$cGQt81OyL7HpTYxjBriAMe.cAmWgkTsVBLAYIuzgVNUTDB4CW2S4W', '0', 2),
(14, 2, 'hanna@gmail.com', '$2a$10$t6iEZ5DvfmuKnVh2cZtFv.tKp7IdEHQ/7xiWiBDfQOIXUPfG0qHQe', '06701112233', 2),
(15, 1, 'bodnarf@gmail.com', '$2a$10$yRZYbrXSBbqaRoWsQTGxduQNRRx55KoD/ymGX.OX6/X0RxvS7Skcq', '06709998877', 2),
(16, 2, 'bodnarf2@gmail.com', '$2a$10$fv/IXtuZCpdIZBvcH1FrU.6ICPMEbL6thDT4iH0AEBneaasUvSIni', '060998877', 2),
(17, 1, 'Sajt@gmail.com', '$2a$10$qvSzkhaYXmaMW5vxAUeVBu5CbbpyU2qyp1KpK5PfyQH.8mzN7xoAq', '+369999999', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `oktato_adatok`
--

CREATE TABLE `oktato_adatok` (
  `oktato_id` int(11) NOT NULL,
  `oktato_felhasznaloID` int(11) NOT NULL,
  `oktato_neve` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `oktato_adatok`
--

INSERT INTO `oktato_adatok` (`oktato_id`, `oktato_felhasznaloID`, `oktato_neve`) VALUES
(6, 8, 'Kiss János'),
(7, 10, 'Teszt Oktató '),
(8, 12, 'B'),
(9, 17, 'Sajt');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ora_adatok`
--

CREATE TABLE `ora_adatok` (
  `ora_id` int(11) NOT NULL,
  `ora_tipusID` int(11) NOT NULL,
  `ora_oktatoja` int(11) NOT NULL,
  `ora_diakja` int(11) NOT NULL,
  `ora_datuma` datetime NOT NULL,
  `ora_teljesitve` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ora_adatok`
--

INSERT INTO `ora_adatok` (`ora_id`, `ora_tipusID`, `ora_oktatoja`, `ora_diakja`, `ora_datuma`, `ora_teljesitve`) VALUES
(1, 1, 7, 5, '2025-01-31 08:00:00', 1),
(2, 1, 7, 5, '2025-01-02 10:00:00', 1),
(3, 1, 7, 5, '2025-01-21 16:30:00', 1),
(4, 1, 7, 5, '2025-02-03 10:30:00', 1),
(5, 1, 7, 5, '2025-02-08 08:00:00', 1),
(6, 1, 7, 5, '2025-02-15 08:00:00', 1),
(7, 1, 7, 5, '2025-01-28 09:38:15', 1),
(11, 1, 7, 5, '2025-01-28 17:30:00', 1),
(12, 1, 7, 5, '2025-02-28 14:15:00', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ora_tipusa`
--

CREATE TABLE `ora_tipusa` (
  `oratipus_id` int(11) NOT NULL,
  `oratipus_neve` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ora_tipusa`
--

INSERT INTO `ora_tipusa` (`oratipus_id`, `oratipus_neve`) VALUES
(1, 'tanóra'),
(2, 'vizsga');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tanulo_adatok`
--

CREATE TABLE `tanulo_adatok` (
  `tanulo_id` int(11) NOT NULL,
  `tanulo_felhasznaloID` int(11) NOT NULL,
  `tanulo_oktatoja` int(11) NOT NULL,
  `tanulo_neve` varchar(255) NOT NULL,
  `tanulo_levizsgazott` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `tanulo_adatok`
--

INSERT INTO `tanulo_adatok` (`tanulo_id`, `tanulo_felhasznaloID`, `tanulo_oktatoja`, `tanulo_neve`, `tanulo_levizsgazott`) VALUES
(4, 13, 7, 'Kovács István', 0),
(5, 11, 7, 'Kiss Boglárka', 0),
(6, 14, 7, 'Ecsedi Hanna', 0),
(7, 15, 7, 'Bodnár Fanni', 0),
(8, 16, 7, 'Bodnár Fanni ', 0);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `autosiskola_adatok`
--
ALTER TABLE `autosiskola_adatok`
  ADD PRIMARY KEY (`autosiskola_id`);

--
-- A tábla indexei `befizetesek`
--
ALTER TABLE `befizetesek`
  ADD PRIMARY KEY (`befizetesek_id`),
  ADD KEY `befizetesek_tanuloID` (`befizetesek_tanuloID`,`befizetesek_oktatoID`,`befizetesek_tipusID`),
  ADD KEY `befizetesek_tipusID` (`befizetesek_tipusID`),
  ADD KEY `befizetesek_oktatoID` (`befizetesek_oktatoID`);

--
-- A tábla indexei `felhasznaloi_adatok`
--
ALTER TABLE `felhasznaloi_adatok`
  ADD PRIMARY KEY (`felhasznalo_id`),
  ADD KEY `felhasznalo_autosiskola` (`felhasznalo_autosiskola`);

--
-- A tábla indexei `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  ADD PRIMARY KEY (`oktato_id`),
  ADD KEY `oktato_felhasznaloID` (`oktato_felhasznaloID`);

--
-- A tábla indexei `ora_adatok`
--
ALTER TABLE `ora_adatok`
  ADD PRIMARY KEY (`ora_id`),
  ADD KEY `ora_tipusID` (`ora_tipusID`,`ora_oktatoja`,`ora_diakja`),
  ADD KEY `ora_oktatoja` (`ora_oktatoja`),
  ADD KEY `ora_diakja` (`ora_diakja`);

--
-- A tábla indexei `ora_tipusa`
--
ALTER TABLE `ora_tipusa`
  ADD PRIMARY KEY (`oratipus_id`);

--
-- A tábla indexei `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  ADD PRIMARY KEY (`tanulo_id`),
  ADD KEY `tanulo_felhasznaloID` (`tanulo_felhasznaloID`,`tanulo_oktatoja`),
  ADD KEY `tanulo_oktatoja` (`tanulo_oktatoja`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `autosiskola_adatok`
--
ALTER TABLE `autosiskola_adatok`
  MODIFY `autosiskola_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `befizetesek`
--
ALTER TABLE `befizetesek`
  MODIFY `befizetesek_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT a táblához `felhasznaloi_adatok`
--
ALTER TABLE `felhasznaloi_adatok`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT a táblához `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  MODIFY `oktato_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `ora_adatok`
--
ALTER TABLE `ora_adatok`
  MODIFY `ora_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `ora_tipusa`
--
ALTER TABLE `ora_tipusa`
  MODIFY `oratipus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  MODIFY `tanulo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `befizetesek`
--
ALTER TABLE `befizetesek`
  ADD CONSTRAINT `befizetesek_ibfk_1` FOREIGN KEY (`befizetesek_tipusID`) REFERENCES `ora_tipusa` (`oratipus_id`),
  ADD CONSTRAINT `befizetesek_ibfk_2` FOREIGN KEY (`befizetesek_tanuloID`) REFERENCES `tanulo_adatok` (`tanulo_id`),
  ADD CONSTRAINT `befizetesek_ibfk_3` FOREIGN KEY (`befizetesek_oktatoID`) REFERENCES `oktato_adatok` (`oktato_id`);

--
-- Megkötések a táblához `felhasznaloi_adatok`
--
ALTER TABLE `felhasznaloi_adatok`
  ADD CONSTRAINT `felhasznaloi_adatok_ibfk_1` FOREIGN KEY (`felhasznalo_autosiskola`) REFERENCES `autosiskola_adatok` (`autosiskola_id`);

--
-- Megkötések a táblához `oktato_adatok`
--
ALTER TABLE `oktato_adatok`
  ADD CONSTRAINT `oktato_adatok_ibfk_1` FOREIGN KEY (`oktato_felhasznaloID`) REFERENCES `felhasznaloi_adatok` (`felhasznalo_id`);

--
-- Megkötések a táblához `ora_adatok`
--
ALTER TABLE `ora_adatok`
  ADD CONSTRAINT `ora_adatok_ibfk_1` FOREIGN KEY (`ora_tipusID`) REFERENCES `ora_tipusa` (`oratipus_id`),
  ADD CONSTRAINT `ora_adatok_ibfk_2` FOREIGN KEY (`ora_oktatoja`) REFERENCES `oktato_adatok` (`oktato_id`),
  ADD CONSTRAINT `ora_adatok_ibfk_3` FOREIGN KEY (`ora_diakja`) REFERENCES `tanulo_adatok` (`tanulo_id`);

--
-- Megkötések a táblához `tanulo_adatok`
--
ALTER TABLE `tanulo_adatok`
  ADD CONSTRAINT `tanulo_adatok_ibfk_1` FOREIGN KEY (`tanulo_oktatoja`) REFERENCES `oktato_adatok` (`oktato_id`),
  ADD CONSTRAINT `tanulo_adatok_ibfk_2` FOREIGN KEY (`tanulo_felhasznaloID`) REFERENCES `felhasznaloi_adatok` (`felhasznalo_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
